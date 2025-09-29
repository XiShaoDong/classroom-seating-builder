import { useState } from "react";
import { SEAT_TEMPLATES } from "../../seatUtils";
import type { Seat, RoomData } from "../../seatUtils";
import { findAvailablePosition, generateSeatId } from "../../seatUtils";
import { styles } from '../../style/styles';
import { Plus } from "lucide-react";


interface AddSeatButtonProps {
  onAddSeats: (newSeats: Seat[]) => void;
  roomData: RoomData;
}

const AddSeatButton = ({ onAddSeats, roomData }: AddSeatButtonProps) => {
  // 相当于 让TemplateKey  = 'single'|'double'|...|...|
  type TemplateKey = keyof typeof SEAT_TEMPLATES;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('single');

  const handleAddSeats = () => {
    const template = SEAT_TEMPLATES[selectedTemplate];
    const { startX, startY } = findAvailablePosition(roomData, template);

    const newSeats = template.seats.map(templateSeat => ({
      id: generateSeatId(),
      x: startX + templateSeat.x,
      y: startY + templateSeat.y
    }));

    onAddSeats(newSeats);
    setIsOpen(false);
  };

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
        //经典双层结构 外层做定位大小 内层padding撑起内容  
        <div style={styles.dropdown}>
          <div style={styles.dropdownContent}>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Select Template:
            </div>
            {Object.entries(SEAT_TEMPLATES).map(([key, template]) => (
              <label
                key={key}
                style={styles.dropdownLabel}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <input
                  type="radio"
                  name="template"
                  value={key}
                  checked={selectedTemplate === key}
                  onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
                  style={{ accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '14px' }}>{template.name}</span>
              </label>
            ))}
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
                  cursor: 'pointer'
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
                  cursor: 'pointer'
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