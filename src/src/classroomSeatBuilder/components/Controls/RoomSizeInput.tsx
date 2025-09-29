import type { RoomData } from '../../../seatUtils';
import { styles } from '../../style/styles';


interface RoomSizeInputProps {
  roomData: RoomData;
  onSizeChange: (dimension: 'cols' | 'rows', value: number) => void;
}

const RoomSizeInput = ({ roomData, onSizeChange }: RoomSizeInputProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="input-col" style={{ fontSize: '14px', fontWeight: '500' }}>Columns:</label>
        <input
          id='input-col'
          type="number"
          min="1"
          max="20"
          value={roomData.cols}
          onChange={(e) => onSizeChange('cols', parseInt(e.target.value) || 1)}
          style={styles.input}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor='input-row' style={{ fontSize: '14px', fontWeight: '500' }}>Rows:</label>
        <input
          id='input-row'
          type="number"
          min="1"
          max="20"
          value={roomData.rows}
          onChange={(e) => onSizeChange('rows', parseInt(e.target.value) || 1)}
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default RoomSizeInput