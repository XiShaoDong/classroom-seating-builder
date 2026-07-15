import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TaskType } from '../../../taskUtils';
import { TASK_TEMPLATES, TASK_TYPE_COLORS } from '../../../taskUtils';
import { styles } from '../../../classroomSeatBuilder/style/styles';
import { taskStyles } from '../../style/styles';

interface Props {
  onAddTask: (template: {
    taskType: TaskType;
    taskName: string;
    taskTime: number;
    taskDescription: string;
    instructions: string;
  }) => void;
  onCreateCustomTask: () => void;
}

const AddTaskButton = ({ onAddTask, onCreateCustomTask }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...styles.button, ...styles.buttonGray }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#4b5563' })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#6b7280' })}
      >
        <Plus size={18} />
        Add Task
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9 }}
            onClick={() => setIsOpen(false)}
          />
          <div style={styles.dropdown}>
            <div style={styles.dropdownContent}>
              <div
                style={{
                  ...styles.dropdownLabel,
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#6b7280',
                }}
              >
                Activity Templates
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginTop: '8px' }}>
                {TASK_TEMPLATES.map((tpl) => {
                  const colors = TASK_TYPE_COLORS[tpl.taskType];
                  return (
                    <button
                      key={tpl.taskType}
                      type="button"
                      onClick={() => {
                        onAddTask(tpl);
                        setIsOpen(false);
                      }}
                      style={{
                        ...taskStyles.templateBtn,
                        borderColor: colors.border,
                        backgroundColor: colors.bg,
                      }}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' })}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { boxShadow: 'none' })}
                    >
                      <div style={{ ...taskStyles.templateName, color: colors.color }}>{tpl.taskName}</div>
                      <div style={taskStyles.templateMeta}>
                        {tpl.taskType} · {tpl.taskTime} min
                      </div>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    onCreateCustomTask();
                    setIsOpen(false);
                  }}
                  style={taskStyles.templateBtn}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' })}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { boxShadow: 'none' })}
                >
                  <div style={taskStyles.templateName}>✏️ Custom</div>
                  <div style={taskStyles.templateMeta}>Create new task</div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddTaskButton;
