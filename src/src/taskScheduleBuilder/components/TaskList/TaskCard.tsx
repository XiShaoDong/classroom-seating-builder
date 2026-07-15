import { useState } from 'react';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import type { Task } from '../../../taskUtils';
import { calculateStartTime, TASK_TYPE_COLORS } from '../../../taskUtils';
import type { StartTime } from '../../../taskUtils';
import { taskStyles } from '../../style/styles';

interface Props {
  task: Task;
  index: number;
  startTime: StartTime;
  tasks: Task[];
  isDragging: boolean;
  isEditing: boolean;
  onDragStart: (e: React.DragEvent, task: Task, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof Task, value: string | number) => void;
}

const TaskCard = ({
  task,
  index,
  startTime,
  tasks,
  isDragging,
  isEditing,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleEdit,
  onDelete,
  onUpdate,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = TASK_TYPE_COLORS[task.taskType];
  const timeStr = calculateStartTime(index, startTime, tasks);

  const cardStyle: React.CSSProperties = {
    ...taskStyles.taskCard,
    ...(isDragging ? taskStyles.taskCardDragging : {}),
    ...(isHovered && !isDragging ? taskStyles.taskCardHover : {}),
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
    >
      <div style={taskStyles.taskCardInner}>
        {/* Grip handle */}
        <div style={taskStyles.gripHandle}>
          <GripVertical size={20} />
        </div>

        {/* Body */}
        <div style={taskStyles.taskCardBody}>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={task.taskName}
                onChange={(e) => onUpdate('taskName', e.target.value)}
                style={taskStyles.editField}
              />
              <input
                type="text"
                value={task.taskDescription}
                onChange={(e) => onUpdate('taskDescription', e.target.value)}
                style={taskStyles.editField}
              />
              <input
                type="number"
                value={task.taskTime}
                onChange={(e) => onUpdate('taskTime', parseInt(e.target.value) || 0)}
                style={taskStyles.editFieldSmall}
              />
              <textarea
                value={task.instructions}
                onChange={(e) => onUpdate('instructions', e.target.value)}
                placeholder="Facilitator instructions (optional)"
                rows={2}
                style={{ ...taskStyles.editField, resize: 'vertical' as const }}
              />
              <button
                type="button"
                onClick={onToggleEdit}
                style={taskStyles.editDoneBtn}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div style={taskStyles.startTimeLabel}>Start: {timeStr}</div>
              <div style={taskStyles.taskName}>{task.taskName}</div>
              <div style={taskStyles.taskDescription}>{task.taskDescription}</div>

              <div style={{ marginBottom: '4px' }}>
                <span
                  style={{
                    ...taskStyles.taskBadge,
                    backgroundColor: colors.bg,
                    color: colors.color,
                    borderColor: colors.border,
                  }}
                >
                  {task.taskType} · {task.taskTime} min
                </span>
              </div>

              {task.instructions && (
                <div style={taskStyles.instructionsBox}>
                  <strong>Instructions: </strong>
                  {task.instructions}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions (view mode only) */}
        {!isEditing && (
          <div style={taskStyles.taskCardActions}>
            <button
              type="button"
              onClick={onToggleEdit}
              style={taskStyles.taskEditBtn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#eff6ff' })}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: 'transparent' })}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              style={taskStyles.taskDeleteBtn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, { backgroundColor: '#fef2f2' })}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: 'transparent' })}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
