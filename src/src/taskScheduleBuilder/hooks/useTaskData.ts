import { useState, useCallback } from 'react';
import type { Task, StartTime, ScheduleData } from '../../taskUtils';
import { generateTaskId } from '../../taskUtils';

const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [startTime, setStartTime] = useState<StartTime>({ hours: 9, minutes: 0 });

  const addTask = useCallback((template: {
    taskType: Task['taskType'];
    taskName: string;
    taskTime: number;
    taskDescription: string;
    instructions: string;
  }) => {
    const newTask: Task = {
      id: generateTaskId(),
      ...template,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const createCustomTask = useCallback(() => {
    const newTask: Task = {
      id: generateTaskId(),
      taskType: 'Custom',
      taskName: 'New Task',
      taskTime: 10,
      taskDescription: 'Task description',
      instructions: '',
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, field: keyof Task, value: string | number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }, []);

  const reorderTasks = useCallback((fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const setScheduleData = useCallback((data: ScheduleData) => {
    setTasks(data.tasks);
    setStartTime(data.startTime);
  }, []);

  return {
    tasks,
    startTime,
    setStartTime,
    addTask,
    createCustomTask,
    deleteTask,
    updateTask,
    reorderTasks,
    setScheduleData,
  };
};

export default useTaskData;
