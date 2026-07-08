import { useRef } from 'react';
import Seat from './Seat';
import TrashBin from './TrashBin';
import type { RoomData, Seat as SeatType } from '../../hooks/useRoomData';
import { styles } from '../../style/styles';

interface Props {
  roomData: RoomData;
  draggedSeat: SeatType | null;
  isTrashActive: boolean;
  onDragStart: (e: React.DragEvent, seat: SeatType) => void;
  onDragEnd: () => void;
  onGridDrop: (e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement | null>) => void;
  onTrashDrop: () => void;
}
const RoomGrid = ({ roomData, draggedSeat, isTrashActive, onDragStart, onDragEnd, onGridDrop, onTrashDrop }: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const renderGrid = () => Array.from({ length: roomData.rows * roomData.cols }, (_, i) => {
    const x = i % roomData.cols, y = Math.floor(i / roomData.cols);
    return <div key={i} style={{ ...styles.gridCell, left: `${x * 40}px`, top: `${y * 40}px` }} />;
  });

  const gridStyle = { ...styles.gridContainer, width: `${roomData.cols * 40}px`, height: `${roomData.rows * 40}px` };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={gridRef} style={gridStyle} onDrop={e => onGridDrop(e, gridRef)} onDragOver={e => e.preventDefault()}>
        {renderGrid()}
        {roomData.seats.map(seat => <Seat key={seat.id} seat={seat} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggedSeat?.id === seat.id} />)}
      </div>
      <TrashBin isActive={isTrashActive} onDrop={onTrashDrop} />
    </div>
  );
};

export default RoomGrid 
