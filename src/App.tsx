import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Save, Upload, Trash2, GripVertical } from 'lucide-react';

// ==================== TYPES ====================
interface Seat {
  id: string;
  x: number;
  y: number;
}

interface RoomData {
  cols: number;
  rows: number;
  seats: Seat[];
}

// ==================== CONSTANTS ====================
const SEAT_TEMPLATES = {
  single: { name: 'Single Seat', seats: [{ x: 0, y: 0 }] },
  row: { name: 'Row of Seats (1x4)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }] },
  column: { name: 'Column of Seats (4x1)', seats: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }] },
  block: { name: 'Block of 4 (2x2)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] }
};

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '500vh',
    backgroundColor: '#f3f4f6',
    padding: '24px',
    width: '100vw',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  controlPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  },
  controlFlex: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '16px'
  },
  mainPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center'
  },
  seat: {
    position: 'absolute' as const,
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #2563eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    zIndex: 1
  },
  seatHover: {
    backgroundColor: '#2563eb',
    transform: 'scale(1.05)'
  },
  seatDragging: {
    opacity: 0.5,
    transform: 'scale(1.1)',
    zIndex: 1000
  },
  gridContainer: {
    position: 'relative' as const,
    border: '2px solid #d1d5db',
    backgroundColor: 'white',
    minWidth: '320px',
    minHeight: '200px',
    width: "100%",
    height: "100%"
  },
  gridCell: {
    position: 'absolute' as const,
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    width: '40px',
    height: '40px'
  },
  trashBin: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 50
  },
  trashBinInactive: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280'
  },
  trashBinActive: {
    backgroundColor: '#ef4444',
    color: 'white',
    transform: 'scale(1.1)',
    animation: 'pulse 1s infinite'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'black',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  buttonGreen: {
    backgroundColor: '#10b981'
  },
  buttonBlue: {
    backgroundColor: '#3b82f6'
  },
  buttonPurple: {
    backgroundColor: '#8b5cf6'
  },
  buttonGray: {
    backgroundColor: '#6b7280'
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    minWidth: '192px'
  },
  dropdownContent: {
    padding: '8px'
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  input: {
    width: '64px',
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '400px',
    width: '100%',
    margin: '16px'
  },
  instructionBox: {
    marginTop: '24px',
    backgroundColor: '#eff6ff',
    padding: '16px',
    borderRadius: '8px'
  }
};

// ==================== HOOKS ====================
// Custom hook for room data management
const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    cols: 8,
    rows: 5,
    seats: []
  });

  const addSeats = useCallback((newSeats: Seat[]) => {
    setRoomData(prev => ({
      ...prev,
      seats: [...prev.seats, ...newSeats]
    }));
  }, []);

  const updateSeat = useCallback((seatId: string, x: number, y: number) => {
    setRoomData(prev => ({
      ...prev,
      seats: prev.seats.map(seat =>
        seat.id === seatId ? { ...seat, x, y } : seat
      )
    }));
  }, []);

  const removeSeat = useCallback((seatId: string) => {
    setRoomData(prev => ({
      ...prev,
      seats: prev.seats.filter(seat => seat.id !== seatId)
    }));
  }, []);

  const updateRoomSize = useCallback((dimension: 'cols' | 'rows', value: number) => {
    const newValue = Math.max(1, Math.min(20, value));
    setRoomData(prev => {
      const newRoomData = { ...prev, [dimension]: newValue };

      // Remove seats outside boundaries
      if (dimension === 'cols' && newValue < prev.cols) {
        newRoomData.seats = prev.seats.filter(seat => seat.x < newValue);
      }
      if (dimension === 'rows' && newValue < prev.rows) {
        newRoomData.seats = prev.seats.filter(seat => seat.y < newValue);
      }

      return newRoomData;
    });
  }, []);

  return {
    roomData,
    setRoomData,
    addSeats,
    updateSeat,
    removeSeat,
    updateRoomSize
  };
};

// Custom hook for drag and drop
const useDragDrop = (roomData: RoomData, updateSeat: Function, removeSeat: Function) => {
  const [draggedSeat, setDraggedSeat] = useState<Seat | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTrashActive, setIsTrashActive] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, seat: Seat) => {
    setDraggedSeat(seat);
    setIsDragging(true);
    setIsTrashActive(true);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSeat(null);
    setIsDragging(false);
    setIsTrashActive(false);
  }, []);

  const handleGridDrop = useCallback((e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedSeat || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 40);
    const y = Math.floor((e.clientY - rect.top) / 40);

    if (x >= 0 && x < roomData.cols && y >= 0 && y < roomData.rows) {
      const isOccupied = roomData.seats.some(seat =>
        seat.id !== draggedSeat.id && seat.x === x && seat.y === y
      );

      if (!isOccupied) {
        updateSeat(draggedSeat.id, x, y);
      }
    }
  }, [draggedSeat, roomData, updateSeat]);

  const handleTrashDrop = useCallback(() => {
    if (draggedSeat) {
      removeSeat(draggedSeat.id);
    }
  }, [draggedSeat, removeSeat]);

  return {
    draggedSeat,
    isDragging,
    isTrashActive,
    handleDragStart,
    handleDragEnd,
    handleGridDrop,
    handleTrashDrop
  };
};

// ==================== UTILS ====================
const generateSeatId = () => `seat-${Date.now()}-${Math.random()}`;

const findAvailablePosition = (roomData: RoomData, template: any) => {
  for (let y = 0; y <= roomData.rows - Math.max(...template.seats.map((s: { y: any; }) => s.y)) - 1; y++) {
    for (let x = 0; x <= roomData.cols - Math.max(...template.seats.map((s: { x: any; }) => s.x)) - 1; x++) {
      const canPlace = template.seats.every((templateSeat: { x: number; y: number; }) => {
        const targetX = x + templateSeat.x;
        const targetY = y + templateSeat.y;
        return !roomData.seats.some(existingSeat =>
          existingSeat.x === targetX && existingSeat.y === targetY
        );
      });

      if (canPlace) {
        return { startX: x, startY: y };
      }
    }
  }
  return { startX: 0, startY: 0 };
};

// ==================== COMPONENTS ====================

// components/RoomGrid/Seat.tsx
interface SeatProps {
  seat: Seat;
  onDragStart: (e: React.DragEvent, seat: Seat) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const Seat = ({ seat, onDragStart, onDragEnd, isDragging }: SeatProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const seatStyle = {
    ...styles.seat,
    left: `${seat.x * 40 + 8}px`,
    top: `${seat.y * 40 + 8}px`,
    ...(isHovered && !isDragging ? styles.seatHover : {}),
    ...(isDragging ? styles.seatDragging : {})
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, seat)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={seatStyle}
    >
      <GripVertical size={12} />
    </div>
  );
};

// components/RoomGrid/TrashBin.tsx
interface TrashBinProps {
  isActive: boolean;
  onDrop: () => void;
}

const TrashBin = ({ isActive, onDrop }: TrashBinProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  const trashStyle = {
    ...styles.trashBin,
    ...(isActive ? styles.trashBinActive : styles.trashBinInactive)
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={trashStyle}
      >
        <Trash2 size={24} />
      </div>
    </>
  );
};

// components/RoomGrid/RoomGrid.tsx
interface RoomGridProps {
  roomData: RoomData;
  draggedSeat: Seat | null;
  isDragging: boolean;
  isTrashActive: boolean;
  onDragStart: (e: React.DragEvent, seat: Seat) => void;
  onDragEnd: () => void;
  onGridDrop: (e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement>) => void;
  onTrashDrop: () => void;
}

const RoomGrid = ({
  roomData,
  draggedSeat,
  isDragging,
  isTrashActive,
  onDragStart,
  onDragEnd,
  onGridDrop,
  onTrashDrop
}: RoomGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < roomData.rows; y++) {
      for (let x = 0; x < roomData.cols; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            style={{
              ...styles.gridCell,
              left: `${x * 40}px`,
              top: `${y * 40}px`
            }}
          />
        );
      }
    }
    return cells;
  };

  const gridStyle = {
    ...styles.gridContainer,
    width: `${roomData.cols * 40}px`,
    height: `${roomData.rows * 40}px`
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={gridRef}
        style={gridStyle}
        onDrop={(e) => onGridDrop(e, gridRef)}
        onDragOver={handleDragOver}
      >
        {renderGrid()}
        {roomData.seats.map(seat => (
          <Seat
            key={seat.id}
            seat={seat}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedSeat?.id === seat.id}
          />
        ))}
      </div>
      <TrashBin
        isActive={isTrashActive}
        onDrop={onTrashDrop}
      />
    </div>
  );
};

// components/Controls/AddSeatButton.tsx
interface AddSeatButtonProps {
  onAddSeats: (newSeats: Seat[]) => void;
  roomData: RoomData;
}

const AddSeatButton = ({ onAddSeats, roomData }: AddSeatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('single');

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
                  onChange={(e) => setSelectedTemplate(e.target.value)}
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

// components/Controls/RoomSizeInput.tsx
interface RoomSizeInputProps {
  roomData: RoomData;
  onSizeChange: (dimension: 'cols' | 'rows', value: number) => void;
}

const RoomSizeInput = ({ roomData, onSizeChange }: RoomSizeInputProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Columns:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={roomData.cols}
          onChange={(e) => onSizeChange('cols', parseInt(e.target.value) || 1)}
          style={styles.input}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Rows:</label>
        <input
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

// components/Controls/SaveLoadButtons.tsx
interface SaveLoadButtonsProps {
  roomData: RoomData;
  setRoomData: (data: RoomData) => void;
}

const SaveLoadButtons = ({ roomData, setRoomData }: SaveLoadButtonsProps) => {
  const [savedLayouts, setSavedLayouts] = useState<string[]>([]);
  const [layoutName, setLayoutName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [memoryStorage, setMemoryStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = Object.keys(memoryStorage)
      .filter(key => key.startsWith('classroom-layout-'))
      .map(key => key.replace('classroom-layout-', ''));
    setSavedLayouts(saved);
  }, [memoryStorage]);

  const handleSave = () => {
    if (!layoutName.trim()) {
      alert('Please name the template');
      return;
    }

    const key = `classroom-layout-${layoutName}`;
    const roomDataToSave = {
      cols: roomData.cols,
      rows: roomData.rows,
      seats: roomData.seats.map(seat => ({
        id: seat.id,
        x: seat.x,
        y: seat.y
      }))
    };

    setMemoryStorage(prev => ({
      ...prev,
      [key]: JSON.stringify(roomDataToSave)
    }));

    setLayoutName('');
    setShowSaveDialog(false);
    alert('Save Template Success!');
    console.log(roomDataToSave)
  };

  const handleLoad = (name: string) => {
    const key = `classroom-layout-${name}`;
    const savedData = memoryStorage[key];

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        if (data.cols && data.rows && Array.isArray(data.seats)) {
          setRoomData({
            cols: data.cols,
            rows: data.rows,
            seats: data.seats
          });
          setShowLoadDialog(false);
          alert('Loaded Template!');
        } else {
          alert('Data fromat error, unable to load Template');
        }
      } catch (error) {
        alert('Failed to load, data format error');
        console.error('Load error:', error);
      }
    } else {
      alert('No template');
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`Comfirm to delte template "${name}" ？`)) {
      const key = `classroom-layout-${name}`;

      setMemoryStorage(prev => {
        const newStorage = { ...prev };
        delete newStorage[key];
        return newStorage;
      });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={() => setShowSaveDialog(true)}
        style={{ ...styles.button, ...styles.buttonBlue }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        <Save size={20} />
        Save Template
      </button>

      {savedLayouts.length > 0 && (
        <button
          onClick={() => setShowLoadDialog(true)}
          style={{ ...styles.button, ...styles.buttonPurple }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
        >
          <Upload size={20} />
          Load Template
        </button>
      )}

      {showSaveDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Save Template</h3>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Name Template"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSave}
                style={{ ...styles.button, ...styles.buttonBlue, flex: 1, justifyContent: 'center' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                style={{ ...styles.button, ...styles.buttonGray, flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Load Template</h3>
            <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
              {savedLayouts.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>Unable to Save Template</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedLayouts.map(name => (
                    <div
                      key={name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <button
                        onClick={() => handleLoad(name)}
                        style={{
                          flex: 1,
                          textAlign: 'left',
                          fontWeight: '500',
                          color: '#1f2937',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0'
                        }}
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => handleDelete(name)}
                        style={{
                          marginLeft: '8px',
                          padding: '8px',
                          color: '#ef4444',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setShowLoadDialog(false)}
                style={{ ...styles.button, ...styles.buttonGray, width: '100%', justifyContent: 'center' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

// pages/ClassroomEditor.tsx
const ClassroomEditor = () => {
  const {
    roomData,
    setRoomData,
    addSeats,
    updateSeat,
    removeSeat,
    updateRoomSize
  } = useRoomData();

  const {
    draggedSeat,
    isDragging,
    isTrashActive,
    handleDragStart,
    handleDragEnd,
    handleGridDrop,
    handleTrashDrop
  } = useDragDrop(roomData, updateSeat, removeSeat);

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

export default ClassroomEditor;