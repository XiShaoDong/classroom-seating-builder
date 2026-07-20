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

  // Resting position: flush against the frame's left border, no overlap.
  const restLeft = rect.left - PANEL_WIDTH;

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
      {/*
        CLIPPING WRAPPER:
        - Positioned flush against the frame's left border (its right edge
          meets the frame's left edge), spanning outward to the left.
        - width animates from 0 -> PANEL_WIDTH. Because overflow is hidden,
          the inner panel is revealed progressively from the frame's left
          border outward — a true "grow out of the frame's edge" effect,
          with no visible sliding/jumping from the button area.
        - The wrapper carries the frame-matching styling (bg, left-side
          radius, borders, shadow) so it looks like an extension of the frame.
      */}
      <div
        style={{
          position: 'fixed',
          top: `${rect.top}px`,
          left: `${restLeft}px`,
          width: shown ? `${PANEL_WIDTH}px` : '0px',
          height: `${rect.height}px`,
          overflow: 'hidden',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          borderLeft: '1px solid #e5e7eb',
          borderRight: 'none',
          borderRadius: '12px',
          boxShadow: '-10px 0 30px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/*
          Inner panel: fixed at PANEL_WIDTH so it never reflows while the
          wrapper's width animates. Scrollable if content overflows.
        */}
        <div
          ref={panelRef}
          style={{
            width: `${PANEL_WIDTH}px`,
            height: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
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
      </div>
    </>,
    document.body
  );
};

export default AddTaskPanel;
