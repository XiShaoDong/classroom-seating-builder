import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import type { Seat as SeatType } from '../../hooks/useRoomData';
import { styles } from '../../style/styles';

interface Props {
  seat: SeatType;
  onDragStart: (e: React.DragEvent, seat: SeatType) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isSelected: boolean;
  onToggleSelect: (seatId: string) => void;
}

const Seat = ({ seat, onDragStart, onDragEnd, isDragging, isSelected, onToggleSelect }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const seatStyle: React.CSSProperties = {
    ...styles.seat,
    left: `${seat.x * 40 + 3}px`,
    top: `${seat.y * 40 + 3}px`,
    ...(isHovered && !isDragging ? styles.seatHover : {}),
    ...(isDragging ? styles.seatDragging : {}),
    ...(isSelected ? {
      backgroundColor: '#2563eb',
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.35), 0 2px 4px rgba(0,0,0,0.1)',
      transform: 'scale(1.05)',
    } : {}),
  };

  return (
    <div
      data-seat-id={seat.id}
      draggable
      onDragStart={(e) => onDragStart(e, seat)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onToggleSelect(seat.id)}
      style={seatStyle}
    >
      <GripVertical size={12} />
    </div>
  );
};

export default Seat
