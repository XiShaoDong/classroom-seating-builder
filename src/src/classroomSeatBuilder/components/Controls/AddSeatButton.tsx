import { useState } from 'react';
import { SEAT_TEMPLATES, generateCustomBlock } from '../../../seatUtils';
import type { Seat, RoomData } from '../../../seatUtils';
import { findAvailablePosition, generateSeatId } from '../../../seatUtils';
import { styles } from '../../style/styles';
import { Plus, Table2 } from 'lucide-react';

interface AddSeatButtonProps {
  onAddSeats: (newSeats: Seat[]) => void;
  roomData: RoomData;
}

type TemplateKey = keyof typeof SEAT_TEMPLATES;

const clampInt = (val: string, min: number, def: number) => {
  const n = parseInt(val);
  return isNaN(n) ? def : Math.max(min, n);
};

const AddSeatButton = ({ onAddSeats, roomData }: AddSeatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('single');

  // Use string states so user can clear the input to type a new value
  const [customRows, setCustomRows] = useState('2');
  const [customCols, setCustomCols] = useState('2');
  const [customRowGap, setCustomRowGap] = useState('0');
  const [customColGap, setCustomColGap] = useState('0');

  // Parse numeric values (safely)
  const rowsNum = clampInt(customRows, 1, 1);
  const colsNum = clampInt(customCols, 1, 1);
  const rowGapNum = clampInt(customRowGap, 0, 0);
  const colGapNum = clampInt(customColGap, 0, 0);

  // Calculate total dimensions needed including gaps
  const totalColsNeeded = (colsNum - 1) * (1 + colGapNum) + 1;
  const totalRowsNeeded = (rowsNum - 1) * (1 + rowGapNum) + 1;

  // Overflow detection — priority: cols/rows first, then gaps
  const isColsOver = colsNum > roomData.cols;
  const isRowsOver = rowsNum > roomData.rows;
  const isColGapOver = !isColsOver && totalColsNeeded > roomData.cols;
  const isRowGapOver = !isRowsOver && totalRowsNeeded > roomData.rows;

  const showCustom = selectedTemplate === 'custom';

  const handleAddSeats = () => {
    const templateSeats = showCustom
      ? generateCustomBlock(rowsNum, colsNum, rowGapNum, colGapNum)
      : SEAT_TEMPLATES[selectedTemplate].seats;

    const template = { seats: templateSeats };
    const { startX, startY } = findAvailablePosition(roomData, template);

    const newSeats = templateSeats.map((ts) => ({
      id: generateSeatId(),
      x: startX + ts.x,
      y: startY + ts.y,
    }));

    onAddSeats(newSeats);
    setIsOpen(false);
  };

  const inputStyle = (over: boolean, gapOver: boolean): React.CSSProperties => ({
    width: '52px',
    padding: '4px 6px',
    border: '1px solid',
    borderColor: over ? '#ef4444' : gapOver ? '#f59e0b' : '#d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: over || gapOver ? '2px solid ' + (over ? '#ef4444' : '#f59e0b') : 'none',
    outlineOffset: '-1px',
    flexShrink: 0,
    textAlign: 'center' as const,
  });

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...styles.button, ...styles.buttonGreen }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
      >
        <Plus size={20} />
        Add Seats
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownContent}>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Select Template:
            </div>
            {Object.entries(SEAT_TEMPLATES).map(([key, template]) => (
              <label
                key={key}
                style={{
                  ...styles.dropdownLabel,
                  backgroundColor: selectedTemplate === key ? '#f0fdf4' : 'transparent',
                }}
                onMouseEnter={(e) => { if (selectedTemplate !== key) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                onMouseLeave={(e) => { if (selectedTemplate !== key) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <input
                  type="radio"
                  name="template"
                  value={key}
                  checked={selectedTemplate === key}
                  onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
                  style={{ accentColor: '#10b981', flexShrink: 0 }}
                />
                <span style={{ fontSize: '14px' }}>{template.name}</span>
              </label>
            ))}

            {showCustom && (
              <div style={{
                margin: '8px 4px 0 4px',
                padding: '10px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                }}>
                  <Table2 size={14} />
                  Custom Block
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Row 1: Rows & Row Gap */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <span style={{ fontSize: '13px', color: '#374151', flexShrink: 0, width: '36px' }}>Rows</span>
                    <input
                      type="number"
                      min={1}
                      value={customRows}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) setCustomRows(v);
                      }}
                      style={inputStyle(isRowsOver, false)}
                    />
                    <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0, marginLeft: '4px' }}>Gap</span>
                    <input
                      type="number"
                      min={0}
                      value={customRowGap}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) setCustomRowGap(v);
                      }}
                      style={inputStyle(false, isRowGapOver)}
                    />
                  </div>

                  {/* Row 2: Cols & Col Gap */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <span style={{ fontSize: '13px', color: '#374151', flexShrink: 0, width: '36px' }}>Cols</span>
                    <input
                      type="number"
                      min={1}
                      value={customCols}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) setCustomCols(v);
                      }}
                      style={inputStyle(isColsOver, false)}
                    />
                    <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0, marginLeft: '4px' }}>Gap</span>
                    <input
                      type="number"
                      min={0}
                      value={customColGap}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) setCustomColGap(v);
                      }}
                      style={inputStyle(false, isColGapOver)}
                    />
                  </div>
                </div>

                <div style={{
                  marginTop: '8px',
                  paddingTop: '6px',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                }}>
                  {(isColsOver || isRowsOver || isColGapOver || isRowGapOver) ? (
                    <span style={{ color: '#ef4444', fontWeight: '500' }}>
                      {isColsOver ? 'Cols exceed grid' : isColGapOver ? 'Col gap too large' : ''}
                      {(isColsOver || isColGapOver) && (isRowsOver || isRowGapOver) ? ', ' : ''}
                      {isRowsOver ? 'Rows exceed grid' : isRowGapOver ? 'Row gap too large' : ''}
                    </span>
                  ) : (
                    <span>
                      Total: <span style={{ fontWeight: '600', color: '#374151' }}>{rowsNum * colsNum}</span> seats
                      {' '}&middot;{' '}
                      <span style={{ color: '#9ca3af' }}>{totalColsNeeded}&times;{totalRowsNeeded} cells</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddSeats}
                style={{
                  flex: 1,
                  padding: '4px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  padding: '4px 12px',
                  backgroundColor: '#d1d5db',
                  color: '#374151',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSeatButton