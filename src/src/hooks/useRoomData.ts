import { useState, useCallback } from 'react';
export interface Seat { id: string; x: number; y: number; }
export interface RoomData { cols: number; rows: number; seats: Seat[]; }

const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    cols: 8, rows: 5, seats: []
  });

  const addSeats = useCallback((newSeats: Seat[]) => {
    setRoomData(prev => ({ ...prev, seats: [...prev.seats, ...newSeats] }));
  }, []);

  const updateSeat = useCallback((seatId: string, x: number, y: number) => {
    setRoomData(prev => ({
      ...prev,
      seats: prev.seats.map(s => s.id === seatId ? { ...s, x, y } : s)
    }));
  }, []);

  const removeSeat = useCallback((seatId: string) => {
    setRoomData(prev => ({ ...prev, seats: prev.seats.filter(s => s.id !== seatId) }));
  }, []);

  const updateRoomSize = useCallback((dimension: 'cols' | 'rows', value: number) => {
    const newValue = Math.max(1, Math.min(20, value));
    setRoomData(prev => {
      const newData = { ...prev, [dimension]: newValue };
      if (dimension === 'cols' && newValue < prev.cols) newData.seats = prev.seats.filter(s => s.x < newValue);
      if (dimension === 'rows' && newValue < prev.rows) newData.seats = prev.seats.filter(s => s.y < newValue);
      return newData;
    });
  }, []);

  return { roomData, setRoomData, addSeats, updateSeat, removeSeat, updateRoomSize };
};

export default useRoomData