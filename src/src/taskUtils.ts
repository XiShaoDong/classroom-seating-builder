// ==================== TYPES ====================

export type TaskType =
  | 'Lecture'
  | 'Discussion'
  | 'Poll'
  | 'Breakout'
  | 'Presentation'
  | 'Break'
  | 'Custom';

export interface Task {
  id: string;
  taskType: TaskType;
  taskName: string;
  taskTime: number;
  taskDescription: string;
  instructions: string;
}

export interface TaskTemplate {
  taskType: TaskType;
  taskName: string;
  taskTime: number;
  taskDescription: string;
  instructions: string;
}

export interface StartTime {
  hours: number;
  minutes: number;
}

export interface ScheduleData {
  startTime: StartTime;
  tasks: Task[];
}

// ==================== PER-TYPE COLORS ====================

export const TASK_TYPE_COLORS: Record<TaskType, { bg: string; color: string; border: string }> = {
  Lecture:      { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  Discussion:   { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  Poll:         { bg: '#f3e8ff', color: '#7e22ce', border: '#c4b5fd' },
  Breakout:     { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
  Presentation: { bg: '#fce7f3', color: '#be185d', border: '#f9a8d4' },
  Break:        { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
  Custom:       { bg: '#fef9c3', color: '#a16207', border: '#fde047' },
};

// ==================== TEMPLATES ====================

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    taskType: 'Lecture',
    taskName: 'Standard Intro',
    taskTime: 5,
    taskDescription: 'Welcome and introduction',
    instructions: '',
  },
  {
    taskType: 'Discussion',
    taskName: 'Interactive Discussion',
    taskTime: 15,
    taskDescription: 'Group discussion activity',
    instructions: '',
  },
  {
    taskType: 'Poll',
    taskName: 'Multiple Choice',
    taskTime: 5,
    taskDescription: 'Quick assessment poll',
    instructions: '',
  },
  {
    taskType: 'Breakout',
    taskName: 'Group Breakout',
    taskTime: 20,
    taskDescription: 'Small group collaboration',
    instructions: '',
  },
  {
    taskType: 'Presentation',
    taskName: 'Presentation Setup',
    taskTime: 10,
    taskDescription: 'Prepare for student presentations',
    instructions: '',
  },
  {
    taskType: 'Break',
    taskName: 'Quick Break',
    taskTime: 10,
    taskDescription: 'Short break for students',
    instructions: '',
  },
];

// ==================== UTILS ====================

export const generateTaskId = () => `task-${Date.now()}-${Math.random()}`;

export const calculateStartTime = (
  index: number,
  startTime: StartTime,
  tasks: Task[]
): string => {
  let totalMinutes = startTime.hours * 60 + startTime.minutes;
  for (let i = 0; i < index; i++) {
    totalMinutes += tasks[i].taskTime;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
