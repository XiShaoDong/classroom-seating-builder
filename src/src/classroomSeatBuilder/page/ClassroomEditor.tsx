import useRoomData from '../hooks/useRoomData';
import useDragDrop from '../hooks/useDrragDrop';
import RoomGrid from '../components/RoomGrid/RoomGrid';
import AddSeatButton from '../components/Controls/AddSeatButton';
import RoomSizeInput from '../components/Controls/RoomSizeInput';
import SaveLoadButtons from '../components/Controls/SaveLoadButtons';
import { styles } from '../style/styles';

const ClassroomEditor = () => {
  const { roomData, setRoomData, addSeats, updateSeat, removeSeat, updateRoomSize } = useRoomData();
  const { draggedSeat, isDragging, isTrashActive, handleDragStart, handleDragEnd, handleGridDrop, handleTrashDrop } = useDragDrop(roomData, updateSeat, removeSeat);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>Classroom Seating Layout Editor</h1>

        <div style={styles.controlPanel}>
          <div style={styles.controlFlex}>
            <AddSeatButton onAddSeats={addSeats} roomData={roomData} />
            <RoomSizeInput roomData={roomData} onSizeChange={updateRoomSize} />
            <SaveLoadButtons roomData={roomData} setRoomData={setRoomData} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '14px', color: '#4b5563' }}>
                Total Seats: <span style={{ fontWeight: '600' }}>{roomData.seats.length}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={styles.mainPanel}>
          <div style={styles.centerContent}>
            <RoomGrid
              roomData={roomData}
              draggedSeat={draggedSeat}
              isDragging={isDragging}
              isTrashActive={isTrashActive}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onGridDrop={handleGridDrop}
              onTrashDrop={handleTrashDrop}
            />
          </div>
        </div>

        <div style={styles.instructionBox}>
          <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Instructions:</h3>
          <ul style={{ fontSize: '14px', color: '#1e40af', margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '4px' }}>Click the "Add Seat" button to choose a template and add seats</li>
            <li style={{ marginBottom: '4px' }}>Drag seats to change their positions</li>
            <li style={{ marginBottom: '4px' }}>Drag seats to the trash icon to delete them</li>
            <li style={{ marginBottom: '4px' }}>Adjust the number of columns and rows to change the room size</li>
            <li>Use the save and load features to manage multiple layouts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassroomEditor