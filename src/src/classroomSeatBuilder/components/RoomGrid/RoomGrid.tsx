import { useRef, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import Seat from './Seat';
import type { RoomData, Seat as SeatType } from '../../hooks/useRoomData';
import { styles } from '../../style/styles';

interface Props {
  roomData: RoomData;
  draggedSeat: SeatType | null;
  onDragStart: (e: React.DragEvent, seat: SeatType) => void;
  onDragEnd: () => void;
  onGridDrop: (e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement | null>) => void;
  onDragOutsideChange?: (isOutside: boolean) => void;
  selectedSeatIds: Set<string>;
  onToggleSelect: (seatId: string) => void;
  onSetSelection: (ids: Set<string>) => void;
}

const RoomGrid = forwardRef<{ startMarquee: (clientX: number, clientY: number) => void }, Props>(({ roomData, draggedSeat, onDragStart, onDragEnd, onGridDrop, onDragOutsideChange, selectedSeatIds, onToggleSelect, onSetSelection }, ref) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isDragOutsideRef = useRef(false);
  const isDragging = draggedSeat !== null;
  const marqueeStart = useRef<{ x: number; y: number } | null>(null);
  const isMarqueeDragged = useRef(false);
  const marqueeRef = useRef<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const roomDataRef = useRef(roomData);
  roomDataRef.current = roomData;
  const docListenersRef = useRef<{ move: ((e: MouseEvent) => void) | null; up: ((e: MouseEvent) => void) | null }>({ move: null, up: null });

  useImperativeHandle(ref, () => ({
    startMarquee(clientX: number, clientY: number) {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      marqueeStart.current = { x, y };
      isMarqueeDragged.current = false;
      const m = { x1: x, y1: y, x2: x, y2: y };
      marqueeRef.current = m;
      setMarquee(m);
      // Reuse same document listener setup as handleMouseDown
      const onDocMove = (ev: MouseEvent) => {
        if (!gridRef.current || !marqueeStart.current) return;
        const r = gridRef.current.getBoundingClientRect();
        const curX = ev.clientX - r.left;
        const curY = ev.clientY - r.top;
        isMarqueeDragged.current = true;
        const m2 = { x1: Math.min(marqueeStart.current.x, curX), y1: Math.min(marqueeStart.current.y, curY), x2: Math.max(marqueeStart.current.x, curX), y2: Math.max(marqueeStart.current.y, curY) };
        marqueeRef.current = m2;
        setMarquee(m2);
      };
      const onDocUp = () => {
        document.removeEventListener('mousemove', onDocMove);
        document.removeEventListener('mouseup', onDocUp);
        if (marqueeStart.current && isMarqueeDragged.current && marqueeRef.current) {
          const mq = marqueeRef.current;
          const newSet = new Set<string>();
          for (const s of roomDataRef.current.seats) {
            const scx = s.x * 40 + 20;
            const scy = s.y * 40 + 20;
            if (scx >= mq.x1 && scx <= mq.x2 && scy >= mq.y1 && scy <= mq.y2) newSet.add(s.id);
          }
          onSetSelection(newSet);
        }
        marqueeStart.current = null;
        marqueeRef.current = null;
        setMarquee(null);
      };
      docListenersRef.current = { move: onDocMove, up: onDocUp };
      document.addEventListener('mousemove', onDocMove);
      document.addEventListener('mouseup', onDocUp);
    }
  }), [onSetSelection]);

  const occupiedPositions = useMemo(() => {
    if (!isDragging) return new Set<string>();
    const set = new Set<string>();
    for (const s of roomData.seats) {
      if (s.id !== draggedSeat!.id) set.add(`${s.x},${s.y}`);
    }
    return set;
  }, [isDragging, roomData.seats, draggedSeat]);

  const renderGrid = () => Array.from({ length: roomData.rows * roomData.cols }, (_, i) => {
    const x = i % roomData.cols, y = Math.floor(i / roomData.cols);
    let cellStyle: React.CSSProperties = { ...styles.gridCell, left: `${x * 40}px`, top: `${y * 40}px` };
    if (isDragging) {
      const occupied = occupiedPositions.has(`${x},${y}`);
      Object.assign(cellStyle, occupied ? styles.gridCellOccupied : styles.gridCellDroppable);
    }
    return <div key={i} style={cellStyle} />;
  });

  const gridStyle = {
    ...(isDragging ? styles.gridContainerDragging : styles.gridContainer),
    width: `${roomData.cols * 40}px`,
    height: `${roomData.rows * 40}px`
  };

  const checkOutsideGrid = (clientX: number, clientY: number): boolean => {
    if (!gridRef.current) return false;
    const rect = gridRef.current.getBoundingClientRect();
    return (
      clientX < rect.left || clientX > rect.right ||
      clientY < rect.top || clientY > rect.bottom
    );
  };

  const handleGridDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) return;
  };

  const handleGridDragLeave = (e: React.DragEvent) => {
    if (!isDragging) return;
    if (gridRef.current && e.relatedTarget && gridRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    if (checkOutsideGrid(e.clientX, e.clientY)) {
      isDragOutsideRef.current = true;
      onDragOutsideChange?.(true);
    }
  };

  const handleGridDragEnter = (e: React.DragEvent) => {
    if (!isDragging) return;
    if (e.relatedTarget && gridRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    if (isDragOutsideRef.current && !checkOutsideGrid(e.clientX, e.clientY)) {
      isDragOutsideRef.current = false;
      onDragOutsideChange?.(false);
    }
  };

  const handleDragEnd = () => {
    onDragOutsideChange?.(false);
    marqueeStart.current = null;
    marqueeRef.current = null;
    setMarquee(null);
    onDragEnd();
  };

  // === Marquee Selection ===
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-seat-id]')) return;
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    marqueeStart.current = { x, y };
    isMarqueeDragged.current = false;
    const m = { x1: x, y1: y, x2: x, y2: y };
    marqueeRef.current = m;
    setMarquee(m);
    // Document-level listeners for when cursor leaves the grid
    const onDocMove = (ev: MouseEvent) => {
      if (!gridRef.current || !marqueeStart.current) return;
      const r = gridRef.current.getBoundingClientRect();
      const curX = ev.clientX - r.left;
      const curY = ev.clientY - r.top;
      isMarqueeDragged.current = true;
      const m2 = { x1: Math.min(marqueeStart.current.x, curX), y1: Math.min(marqueeStart.current.y, curY), x2: Math.max(marqueeStart.current.x, curX), y2: Math.max(marqueeStart.current.y, curY) };
      marqueeRef.current = m2;
      setMarquee(m2);
    };
    const onDocUp = () => {
      document.removeEventListener('mousemove', onDocMove);
      document.removeEventListener('mouseup', onDocUp);
      if (marqueeStart.current && isMarqueeDragged.current && marqueeRef.current) {
        const mq = marqueeRef.current;
        const newSet = new Set<string>();
        for (const s of roomDataRef.current.seats) {
          const scx = s.x * 40 + 20;
          const scy = s.y * 40 + 20;
          if (scx >= mq.x1 && scx <= mq.x2 && scy >= mq.y1 && scy <= mq.y2) newSet.add(s.id);
        }
        onSetSelection(newSet);
      }
      marqueeStart.current = null;
      marqueeRef.current = null;
      setMarquee(null);
    };
    docListenersRef.current = { move: onDocMove, up: onDocUp };
    document.addEventListener('mousemove', onDocMove);
    document.addEventListener('mouseup', onDocUp);
  };





  const renderMarquee = () => {
    if (!marquee) return null;
    const w = marquee.x2 - marquee.x1;
    const h = marquee.y2 - marquee.y1;
    if (w < 2 && h < 2) return null;
    return (
      <div style={{
        position: 'absolute' as const,
        left: marquee.x1, top: marquee.y1,
        width: w, height: h,
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        border: '1.5px solid rgba(37, 99, 235, 0.5)',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 100,
      }} />
    );
  };

  return (
    <div>
      <div
        ref={gridRef}
        style={gridStyle}
        onDrop={e => { e.stopPropagation(); onGridDrop(e, gridRef); }}
        onDragOver={handleGridDragOver}
        onDragLeave={handleGridDragLeave}
        onDragEnter={handleGridDragEnter}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => {}}
      >
        {renderGrid()}
        {roomData.seats.map(seat => (
          <Seat
            key={seat.id}
            seat={seat}
            onDragStart={onDragStart}
            onDragEnd={handleDragEnd}
            isDragging={draggedSeat?.id === seat.id}
            isSelected={selectedSeatIds.has(seat.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
        {renderMarquee()}
      </div>
    </div>
  );
});
export default RoomGrid
