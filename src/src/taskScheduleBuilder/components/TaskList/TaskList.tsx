import { useState } from 'react';
import type { Task, StartTime } from '../../../taskUtils';
import { taskStyles } from '../../style/styles';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  startTime: StartTime;
  draggedTaskId: string | null;
  onDragStart: (e: React.DragEvent, task: Task, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, field: keyof Task, value: string | number) => void;
}

const TaskList = ({
  tasks,
  startTime,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDeleteTask,
  onUpdateTask,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div style={taskStyles.taskList}>
      {tasks.length === 0 ? (
        <p style={taskStyles.emptyState}>
          No tasks yet. Add tasks from the templates above.
        </p>
      ) : (
        tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            startTime={startTime}
            tasks={tasks}
            isDragging={draggedTaskId === task.id}
            isEditing={editingId === task.id}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onToggleEdit={() =>
              setEditingId(editingId === task.id ? null : task.id)
            }
            onDelete={() => onDeleteTask(task.id)}
            onUpdate={(field, value) => onUpdateTask(task.id, field, value)}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
