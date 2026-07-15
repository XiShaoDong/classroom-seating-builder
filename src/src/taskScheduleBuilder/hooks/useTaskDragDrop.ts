import { useState, useCallback } from 'react';
import type { Task } from '../../taskUtils';

interface UseTaskDragDropArgs {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const useTaskDragDrop = ({ onReorder }: UseTaskDragDropArgs) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task, index: number) => {
    setDraggedTaskId(task.id);
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) return;

      onReorder(dragIndex, index);
      setDragIndex(index);
    },
    [dragIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragIndex(null);
  }, []);

  return {
    draggedTaskId,
    dragIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useTaskDragDrop;
