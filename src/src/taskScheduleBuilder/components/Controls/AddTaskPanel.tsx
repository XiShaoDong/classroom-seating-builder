import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TaskType } from '../../../taskUtils';
import { TASK_TEMPLATES, TASK_TYPE_COLORS } from '../../../taskUtils';

interface Props {
  /** Ref to the frame (componentCard) the panel slides out from. */
  frameRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onAddTask: (template: {
    taskType: TaskType;
    taskName: string;
    taskTime: number;
    taskDescription: string;
    instructions: string;
  }) => void;
  onCreateCustomTask: () => void;
}

const PANEL_WIDTH = 260;

/**
 * A panel that slides out to the LEFT of the frame.
 *
 * - Anchored to the frame's screen coordinates via position: fixed + portal,
 *   so it floats above the whole window and is never clipped.
 * - Top + height match the frame, so it reads as an extension of the frame.
 * - Slides outward (from the frame's left border) using a translateX animation.
 */
const AddTaskPanel = ({ frameRef, onClose, onAddTask, onCreateCustomTask }: Props) => {
  // Anchor = the frame's live screen rect. Starts hidden off-screen so the
  // first paint animates in from the frame's left edge.
  const [rect, setRect] = useState<{ top: number; left: number; height: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const r = frameRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.top, left: r.left, height: r.height });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [frameRef]);

  // Kick off the slide-in on mount (next frame).
  const [shown, setShown] = useState(false);
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!rect) return null;

  // Panel's resting left edge = frame's left edge - panel width (no overlap).
  const restLeft = rect.left - PANEL_WIDTH;
  // Animate from the frame's left edge (width 0 visible) outward to restLeft.
  const left = shown ? restLeft : rect.left;

  const handleAdd = (tpl: (typeof TASK_TEMPLATES)[number]) => {
    onAddTask(tpl);
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: `${rect.top}px`,
          left: `${left}px`,
          width: `${PANEL_WIDTH}px`,
          height: `${rect.height}px`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '-10px 0 30px -5px rgba(0, 0, 0, 0.2)',
          padding: '16px',
          zIndex: 9999,
          transition: 'left 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
          opacity: shown ? 1 : 0,
        }}
      >
        <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600, color: '#6b7280'}}>
          Activity Templates
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TASK_TEMPLATES.map((tpl) => {
            const colors = TASK_TYPE_COLORS[tpl.taskType];
            return (
              <button
                key={tpl.taskType}
                type="button"
                onClick={() => handleAdd(tpl)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  border: '1px solid',
                  borderColor: colors.border,
                  borderRadius: '10px',
                  backgroundColor: colors.bg,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'box-shadow 0.15s, transform 0.15s',
                }}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 3px 10px rgba(0,0,0,0.12)', transform: 'translateX(2px)' })}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateX(0)' })}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: colors.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: colors.color }}>{tpl.taskName}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, color: colors.color }}>
                    {tpl.taskType} · {tpl.taskTime} min
                  </div>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => { onCreateCustomTask(); onClose(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'box-shadow 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 3px 10px rgba(0,0,0,0.12)', transform: 'translateX(2px)' })}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateX(0)' })}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a16207', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>✏️ Custom</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Create new task</div>
            </div>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddTaskPanel;
