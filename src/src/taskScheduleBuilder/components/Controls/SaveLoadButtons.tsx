import { useState, useEffect } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import type { ScheduleData } from '../../../taskUtils';
import { styles } from '../../../classroomSeatBuilder/style/styles';

interface Props {
  scheduleData: ScheduleData;
  setScheduleData: (data: ScheduleData) => void;
}

const SaveLoadButtons = ({ scheduleData, setScheduleData }: Props) => {
  const [savedSchedules, setSavedSchedules] = useState<string[]>([]);
  const [scheduleName, setScheduleName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const STORAGE_PREFIX = 'task-schedule-';

  const refreshSavedSchedules = () => {
    const saved = Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .map((key) => key.replace(STORAGE_PREFIX, ''));
    setSavedSchedules(saved);
  };

  useEffect(() => {
    refreshSavedSchedules();
  }, []);

  const handleSave = () => {
    if (!scheduleName.trim()) {
      alert('Please name the schedule');
      return;
    }
    const key = `${STORAGE_PREFIX}${scheduleName}`;
    localStorage.setItem(key, JSON.stringify(scheduleData));
    setScheduleName('');
    setShowSaveDialog(false);
    refreshSavedSchedules();
    alert('Schedule saved!');
  };

  const handleLoad = (name: string) => {
    const key = `${STORAGE_PREFIX}${name}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.startTime && Array.isArray(data.tasks)) {
        setScheduleData(data);
        setShowLoadDialog(false);
        alert('Schedule loaded!');
      } else {
        alert('Invalid data format');
      }
    } catch {
      alert('Failed to load schedule');
    }
  };

  const handleDelete = (name: string) => {
    if (!confirm(`Delete schedule "${name}"?`)) return;
    localStorage.removeItem(`${STORAGE_PREFIX}${name}`);
    refreshSavedSchedules();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        onClick={() => setShowSaveDialog(true)}
        style={{ ...styles.button, ...styles.buttonBlue }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#2563eb' })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#3b82f6' })}
      >
        <Save size={18} />
        Save
      </button>

      <button
        type="button"
        onClick={() => setShowLoadDialog(true)}
        style={{ ...styles.button, ...styles.buttonPurple }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#7c3aed' })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#8b5cf6' })}
      >
        <Upload size={18} />
        Load
      </button>

      {/* Save dialog */}
      {showSaveDialog && (
        <div style={styles.modal} onClick={() => setShowSaveDialog(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>Save Schedule</h3>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Schedule name..."
              style={styles.input}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                style={{ ...styles.button, backgroundColor: '#e5e7eb', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{ ...styles.button, ...styles.buttonBlue }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load dialog */}
      {showLoadDialog && (
        <div style={styles.modal} onClick={() => setShowLoadDialog(false)}>
          <div style={{ ...styles.modalContent, maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>Load Schedule</h3>
            {savedSchedules.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>No saved schedules</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {savedSchedules.map((name) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#374151' }}>{name}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleLoad(name)}
                        style={{ ...styles.button, padding: '4px 10px', fontSize: '12px' }}
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(name)}
                        style={{ ...styles.button, padding: '4px 8px', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '12px', textAlign: 'right' as const }}>
              <button
                type="button"
                onClick={() => setShowLoadDialog(false)}
                style={{ ...styles.button, backgroundColor: '#e5e7eb', color: '#374151' }}
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

export default SaveLoadButtons;
