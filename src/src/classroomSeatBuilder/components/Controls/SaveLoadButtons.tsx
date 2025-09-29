import { useState, useEffect } from "react";
import type { RoomData } from "../../../seatUtils";
import { Save, Trash2, Upload } from "lucide-react";
import { styles } from "../../style/styles";


interface SaveLoadButtonsProps {
  roomData: RoomData;
  setRoomData: (data: RoomData) => void;
}

const SaveLoadButtons = ({ roomData, setRoomData }: SaveLoadButtonsProps) => {
  const [savedLayouts, setSavedLayouts] = useState<string[]>([]);
  const [layoutName, setLayoutName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  // @TODO:考虑替换为 loadStorage
  // const [memoryStorage, setMemoryStorage] = useState<Record<string, string>>({});

  //添加一个刷新函数来更新列表
  const refreshSavedLayouts = () => {
    const saved = Object.keys(localStorage)
      .filter(key => key.startsWith('classroom-layout-'))
      .map(key => key.replace('classroom-layout-', ''));
    setSavedLayouts(saved);
  };
  
  useEffect(() => {
    refreshSavedLayouts();
  }, []);


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

    localStorage.setItem(key, JSON.stringify(roomDataToSave));

    setLayoutName('');
    setShowSaveDialog(false);
    refreshSavedLayouts();
    alert('Save Template Success!');
    console.log(roomDataToSave)
  };

  const handleLoad = (name: string) => {
    const key = `classroom-layout-${name}`;
    const savedData = localStorage.getItem(key); 

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
      localStorage.removeItem(key);
      refreshSavedLayouts();
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

export default SaveLoadButtons 