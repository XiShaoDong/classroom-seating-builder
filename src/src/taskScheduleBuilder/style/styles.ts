// Task-specific styles. The page shell (pageWrapper, componentCard, cardHeader,
// controlsRow, gridPanel, badge, separator, button*, modal*, input) is reused
// from the classroom builder's styles.ts — imported directly in the page component.

export const taskStyles = {
  // Task list container
  taskList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  // Individual task card
  taskCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    transition: 'box-shadow 0.2s, opacity 0.2s',
  },
  taskCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  taskCardDragging: {
    opacity: 0.5,
  },

  // Task card inner layout
  taskCardInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  taskCardBody: {
    flex: 1,
    minWidth: 0,
  },
  taskCardActions: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  taskEditBtn: {
    padding: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#3b82f6',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  taskDeleteBtn: {
    padding: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ef4444',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },

  // Text elements
  startTimeLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  taskName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0',
  },
  taskDescription: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
  },

  // Type/duration badge
  taskBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid',
  },

  // Instructions box
  instructionsBox: {
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#eff6ff',
    padding: '8px 12px',
    borderRadius: '8px',
    marginTop: '8px',
  },

  // Edit-mode fields
  editField: {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '8px',
    boxSizing: 'border-box' as const,
  },
  editFieldSmall: {
    width: '80px',
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '8px',
    boxSizing: 'border-box' as const,
  },
  editDoneBtn: {
    padding: '6px 14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },

  // Grip handle
  gripHandle: {
    cursor: 'move',
    color: '#9ca3af',
    flexShrink: 0,
    paddingTop: '2px',
  },

  // Template button (used in AddTaskButton dropdown)
  templateBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, background-color 0.2s',
    textAlign: 'left' as const,
    width: '120px',
  },
  templateName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  },
  templateMeta: {
    fontSize: '11px',
    color: '#6b7280',
  },

  // Start time controls
  timeControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  timeInput: {
    width: '48px',
    padding: '4px 6px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  timeColon: {
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
  },
  timeLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginRight: '6px',
  },

  // Empty state
  emptyState: {
    color: '#9ca3af',
    textAlign: 'center' as const,
    padding: '48px 0',
    fontSize: '14px',
  },

  // Header total time
  totalTimeLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
};
