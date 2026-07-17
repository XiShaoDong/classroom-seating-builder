import { useState, useRef } from 'react';
import { Clock, ListTodo } from 'lucide-react';
import useTaskData from '../hooks/useTaskData';
import useTaskDragDrop from '../hooks/useTaskDragDrop';
import { styles } from '../../classroomSeatBuilder/style/styles';
import { taskStyles } from '../style/styles';
import AddTaskButton from '../components/Controls/AddTaskButton';
import AddTaskPanel from '../components/Controls/AddTaskPanel';
import StartTimeInput from '../components/Controls/StartTimeInput';
import SaveLoadButtons from '../components/Controls/SaveLoadButtons';
import TaskList from '../components/TaskList/TaskList';

const TaskScheduleEditor = () => {
  const {
    tasks,
    startTime,
    setStartTime,
    addTask,
    createCustomTask,
    deleteTask,
    updateTask,
    reorderTasks,
    setScheduleData,
  } = useTaskData();

  const totalTime = tasks.reduce((sum, t) => sum + t.taskTime, 0);

  const { draggedTaskId, handleDragStart, handleDragOver, handleDragEnd } =
    useTaskDragDrop({ onReorder: reorderTasks });

  // Add-task panel: slides out from the frame's left border.
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <div style={styles.pageWrapper}>
      <div ref={frameRef} style={styles.componentCard}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <h1 style={styles.cardTitle}>
            <Clock size={20} />
            Task Schedule
          </h1>
          <span style={styles.badge}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {totalTime} min
          </span>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          <AddTaskButton isOpen={addTaskOpen} onToggle={() => setAddTaskOpen((v) => !v)} />
          <div style={styles.separator} />
          <StartTimeInput startTime={startTime} onStartTimeChange={setStartTime} />
          <div style={styles.separator} />
          <SaveLoadButtons
            scheduleData={{ startTime, tasks }}
            setScheduleData={setScheduleData}
          />
        </div>

        {/* Task list */}
        <div style={{ ...styles.gridPanel, minHeight: '420px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              <ListTodo size={18} />
              Schedule Tasks
            </div>
            <div style={taskStyles.totalTimeLabel}>
              Total: {totalTime} minutes
            </div>
          </div>

          <TaskList
            tasks={tasks}
            startTime={startTime}
            draggedTaskId={draggedTaskId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </div>
      </div>

      {/* Slide-out panel, rendered via portal so it floats above the window
          and anchors to the frame (matches its top + height). */}
      {addTaskOpen && (
        <AddTaskPanel
          frameRef={frameRef}
          onClose={() => setAddTaskOpen(false)}
          onAddTask={addTask}
          onCreateCustomTask={createCustomTask}
        />
      )}
    </div>
  );
};

export default TaskScheduleEditor;
