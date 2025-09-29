import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import type { Seat as SeatType } from '../../hooks/useRoomData';
import { styles } from '../../style/styles';

interface Props {
  seat: SeatType;
  onDragStart: (e: React.DragEvent, seat: SeatType) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const Seat = ({ seat, onDragStart, onDragEnd, isDragging }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const seatStyle = {
    ...styles.seat,
    left: `${seat.x * 40 + 3}px`,
    top: `${seat.y * 40 + 3}px`,
    ...(isHovered && !isDragging ? styles.seatHover : {}),
    ...(isDragging ? styles.seatDragging : {})
  };

  return (
    <div draggable onDragStart={(e) => onDragStart(e, seat)} onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={seatStyle}>
      <GripVertical size={12} />
    </div>
  );
};

export default Seat
