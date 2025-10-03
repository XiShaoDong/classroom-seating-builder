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


  return (
    <div>timeline</div>
  )
}

export default TaskBuilder