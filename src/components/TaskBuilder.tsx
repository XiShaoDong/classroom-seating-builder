import { Edit2, GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react'

type TaskType = 'Lecture' | 'Discussion' | 'Poll' | 'Breakout' | 'Presentation' | 'Break' | 'Custom';

interface Task {
  id: number;
  taskType: TaskType;
  taskName: string;
  taskTime: number;
  taskDescription: string;
  instructions: string;
}

interface TaskTemplate {
  taskType: TaskType;
  taskName: string;
  taskTime: number;
  taskDescription: string;
  instructions: string;
}

interface StartTime {
  hours: number;
  minutes: number;
}

interface ScheduleData {
  startTime: StartTime;
  tasks: Task[];
}

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    taskType: 'Lecture',
    taskName: 'Standard Intro',
    taskTime: 5,
    taskDescription: 'Welcome and introduction',
    instructions: ''
  },
  {
    taskType: 'Discussion',
    taskName: 'Interactive Discussion',
    taskTime: 15,
    taskDescription: 'Group discussion activity',
    instructions: ''
  },
  {
    taskType: 'Poll',
    taskName: 'Multiple Choice',
    taskTime: 5,
    taskDescription: 'Quick assessment poll',
    instructions: ''
  },
  {
    taskType: 'Breakout',
    taskName: 'Group Breakout',
    taskTime: 20,
    taskDescription: 'Small group collaboration',
    instructions: ''
  },
  {
    taskType: 'Presentation',
    taskName: 'Presentation Setup',
    taskTime: 10,
    taskDescription: 'Prepare for student presentations',
    instructions: ''
  },
  {
    taskType: 'Break',
    taskName: 'Quick Break',
    taskTime: 10,
    taskDescription: 'Short break for students',
    instructions: ''
  }
];

const TaskBuilder: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<StartTime>({ hours: 9, minutes: 0 });
  const [showTimeSettings, setShowTimeSettings] = useState<boolean>(false);
  const totalTime = tasks.reduce((sum,task)=> sum + task.taskTime,0);
  const calculateStartTime = (index: number) => {
    let totalMinutes = startTime.hours * 60 + startTime.minutes;
    for (let i = 0; i < index; i++) {
      totalMinutes += tasks[i].taskTime;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  };

  const addTask = (template: TaskTemplate): void => {
    const newTask: Task = {
      ...template,
      id: Date.now() + Math.random()
    };

    setTasks(prev => [...prev, newTask]);

  };

  const createCustomTask = (): void => {

    const newTask: Task = {
      id: Date.now() + Math.random(),
      taskType: 'Custom',
      taskName: 'New Task',
      taskTime: 10,
      taskDescription: 'Task description',
      instructions: ''
    };

    setTasks(prev => [...prev, newTask]);
  };


  const deleteTask = (id: number): void => {

    setTasks(prev => (prev.filter(task => task.id !== id)));

  };

  const updateTask = (id: number, field: keyof Task, value: string | number): void => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    e.preventDefault();
    // 2nd csae prevent unneccessary self switch
    if (dragIndex === null || dragIndex === index) return;

    // swtich early can let user saw the effect

    setTasks(prev => {
      const newTasks = [...prev];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1) // delete
      newTasks.splice(index, 0, draggedTask) // add on to the index position
      return newTasks;
    })
    // update the index in new position
    setDragIndex(index);

  };

  const handleDragEnd = (): void => {
    setDragIndex(null);
  };


  const saveSchedule = (): void => {
    if (tasks.length === 0) {
      alert('No taks to save!');
      return;
    }

    const scheduleData: ScheduleData = {
      startTime,
      tasks
    };

    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: 'appliation/json' });
    const url = URL.createObjectURL(blob);
    console.log(blob)
    const a = document.createElement('a');
    a.href = url;
    a.download = `schdule_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Schedule saved successfully!');
  };

  const loadSchedule = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result as string;
          const data = JSON.parse(result);
          if (data.tasks) {
            setTasks(data.tasks);
            if (data.startTime) {
              setStartTime(data.startTime);
            } else {
              setTasks(data);
            }
          }
          alert('Schedule loaded successfully!');
        } catch (error) {
          alert('Error loading schedule');
        }
      };

      reader.readAsText(file);
    }

  }

  const TaskTypeColors: Record<TaskType, string> = {
    Lecture: 'bg-blue-100 text-blue-700 border-blue-300',
    Discussion: 'bg-green-100 text-green-700 border-green-300',
    Poll: 'bg-purple-100 text-purple-700 border-purple-300',
    Breakout: 'bg-orange-100 text-orange-700 border-orange-300',
    Presentation: 'bg-pink-100 text-pink-700 border-pink-300',
    Break: 'bg-gray-100 text-gray-700 border-gray-300',
    Custom: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Schedule Builder</h1>
        
        {/* Top Button Area */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => createCustomTask()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900  text-white rounded-lg hover:bg-gray-700 transition"
            >
              <Plus size={20} />
              Create Custom Task
            </button>
            <button
              onClick={saveSchedule}
              className="px-4 py-2 bg-white-200 text-black border border-gray-200 hover:bg-gray-100 rounded-lg transition"
            >
              Save Schedule
            </button>
            <label className="px-4 py-2 bg-white-200 text-black border border-gray-200 hover:bg-gray-100 rounded-lg transition cursor-pointer">
              Load Schedule
              <input
                type="file"
                accept=".json"
                onChange={loadSchedule}
                className="hidden"
              />
            </label>
            
            {/* Start Time Setting */}
            
              <button
                onClick={() => setShowTimeSettings(!showTimeSettings)}
                className="px-4 py-2 bg-white-200 text-black border border-gray-200 hover:bg-gray-100 rounded-lg transition"
              >
               Start Time: {startTime.hours.toString().padStart(2, '0')}:{startTime.minutes.toString().padStart(2, '0')}
              </button>
          
          </div>
          
          {/* Start Time Settings */}
          {showTimeSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Course Start Time:</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={startTime.hours}
                  onChange={(e) => setStartTime({ ...startTime, hours: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  placeholder="HH"
                />
                <span className="text-gray-600">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={startTime.minutes}
                  onChange={(e) => setStartTime({ ...startTime, minutes: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  placeholder="MM"
                />
                <button
                  onClick={() => setShowTimeSettings(false)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Task Display Area */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 min-h-96">
          <div className='flex items-center justify-between mb-4'>
            <div className= "flex text-xl font-semibold text-gray-700">Schedule Tasks</div>
            <div className='flex tesx-1xl '> Total: {totalTime} minutes</div>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No tasks yet. Add tasks from templates below.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-gray-50 border border-gray-200 rounded-lg p-4 transition ${
                    dragIndex === index ? 'opacity-50' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="cursor-move pt-1">
                      <GripVertical size={20} className="text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      {editingTaskIndex === task.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={task.taskName}
                            onChange={(e) => updateTask(task.id, 'taskName', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={task.taskDescription}
                            onChange={(e) => updateTask(task.id, 'taskDescription', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded"
                          />
                          <input
                            type="number"
                            value={task.taskTime}
                            onChange={(e) => updateTask(task.id, 'taskTime', parseInt(e.target.value) || 0)}
                            className="w-24 px-3 py-1 border border-gray-300 rounded"
                          />
                          <textarea
                            value={task.instructions}
                            onChange={(e) => updateTask(task.id, 'instructions', e.target.value)}
                            placeholder="Facilitator instructions (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            rows={2}
                          />
                          <button
                            onClick={() => setEditingTaskIndex(null)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-500 mb-1">
                            Start Time: {calculateStartTime(index)}
                          </div>
                          <div className="font-semibold text-gray-800 mb-1">
                            {task.taskName}
                          </div>
                          <div className="text-gray-600 text-sm mb-2">
                            {task.taskDescription}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${TaskTypeColors[task.taskType]}`}>
                              {task.taskType} - {task.taskTime} min
                            </span>
                          </div>
                          {task.instructions && (
                            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded mt-2">
                              <span className="font-medium">Instructions: </span>
                              {task.instructions}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTaskIndex(editingTaskIndex === task.id ? null : task.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Templates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Activity Templates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TASK_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => addTask(template)}
                className={`p-4 rounded-lg border border-gray-200 text-left transition hover:shadow-md bg-gray-50 `}
              >
                <div className="font-semibold mb-1">{template.taskName}</div>
                <div className="text-xs opacity-75">{template.taskType} - {template.taskTime} min</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskBuilder