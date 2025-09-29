import { useState, useCallback } from 'react';
import type { Seat, RoomData } from './useRoomData';

export const useDragDrop = (roomData: RoomData, updateSeat: Function, removeSeat: Function) => {
  const [draggedSeat, setDraggedSeat] = useState<Seat | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTrashActive, setIsTrashActive] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, seat: Seat) => {
    setDraggedSeat(seat);
    setIsDragging(true);
    setIsTrashActive(true);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSeat(null);
    setIsDragging(false);
    setIsTrashActive(false);
  }, []);

  const handleGridDrop = useCallback((e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement | null>) => {
    e.preventDefault();
    if (!draggedSeat || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 40);
    const y = Math.floor((e.clientY - rect.top) / 40);
    if (x >= 0 && x < roomData.cols && y >= 0 && y < roomData.rows) {
      const occupied = roomData.seats.some(s => s.id !== draggedSeat.id && s.x === x && s.y === y);
      if (!occupied) updateSeat(draggedSeat.id, x, y);
    }
  }, [draggedSeat, roomData, updateSeat]);

  const handleTrashDrop = useCallback(() => { if (draggedSeat) removeSeat(draggedSeat.id); }, [draggedSeat, removeSeat]);

  return { draggedSeat, isDragging, isTrashActive, handleDragStart, handleDragEnd, handleGridDrop, handleTrashDrop };
};

export default useDragDrop