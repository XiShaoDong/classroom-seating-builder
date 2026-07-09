import { useState, useEffect } from 'react';
import type { RoomData } from '../../../seatUtils';
import { styles } from '../../style/styles';

interface RoomSizeInputProps {
  roomData: RoomData;
  onSizeChange: (dimension: 'cols' | 'rows', value: number) => void;
}

const RoomSizeInput = ({ roomData, onSizeChange }: RoomSizeInputProps) => {
  const [colStr, setColStr] = useState(String(roomData.cols));
  const [rowStr, setRowStr] = useState(String(roomData.rows));

  // Sync when roomData changes externally (e.g. template load)
  useEffect(() => { setColStr(String(roomData.cols)); }, [roomData.cols]);
  useEffect(() => { setRowStr(String(roomData.rows)); }, [roomData.rows]);

  const commitCol = (raw: string) => {
    const v = raw.trim();
    if (v === '') { setColStr(String(roomData.cols)); return; }
    const n = parseInt(v);
    if (!isNaN(n) && n >= 1) {
      onSizeChange('cols', Math.min(20, n));
    } else {
      setColStr(String(roomData.cols));
    }
  };

  const commitRow = (raw: string) => {
    const v = raw.trim();
    if (v === '') { setRowStr(String(roomData.rows)); return; }
    const n = parseInt(v);
    if (!isNaN(n) && n >= 1) {
      onSizeChange('rows', Math.min(20, n));
    } else {
      setRowStr(String(roomData.rows));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="input-col" style={{ fontSize: '14px', fontWeight: '500' }}>Columns:</label>
        <input
          id="input-col"
          type="number"
          min={1}
          max={20}
          value={colStr}
          onChange={(e) => { const v = e.target.value; if (v === '' || /^\d{1,2}$/.test(v)) setColStr(v); }}
          onBlur={() => commitCol(colStr)}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          style={styles.input}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="input-row" style={{ fontSize: '14px', fontWeight: '500' }}>Rows:</label>
        <input
          id="input-row"
          type="number"
          min={1}
          max={20}
          value={rowStr}
          onChange={(e) => { const v = e.target.value; if (v === '' || /^\d{1,2}$/.test(v)) setRowStr(v); }}
          onBlur={() => commitRow(rowStr)}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default RoomSizeInput