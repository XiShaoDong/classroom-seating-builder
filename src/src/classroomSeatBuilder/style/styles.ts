export const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '48px 16px',
    backgroundColor: '#eef0f3',
  },
  componentCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    width: 'fit-content',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#fafbfc',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  controlsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#fff',
  },
  gridPanel: {
    padding: '24px',
    backgroundColor: '#f9fafb',
    position: 'relative',
    borderRadius: '0 0 12px 12px',
    minHeight: '100px',
  },
  seat: {
    position: 'absolute' as const,
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #2563eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    zIndex: 1
  },
  seatHover: {
    backgroundColor: '#2563eb',
    transform: 'scale(1.05)'
  },
  seatDragging: {
    opacity: 0.5,
    transform: 'scale(1.1)',
    zIndex: 1000
  },
  gridContainer: {
    position: 'relative' as const,
    border: '2px solid #d1d5db',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: '6px',
  },
  gridContainerDragging: {
    position: 'relative' as const,
    border: '2px dashed #3b82f6',
    backgroundColor: '#eff6ff',
    cursor: 'copy',
    overflow: 'hidden',
    borderRadius: '6px',
  },
  gridCellDroppable: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    border: '1px dashed rgba(34, 197, 94, 0.4)'
  },
  gridCellOccupied: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px dashed rgba(239, 68, 68, 0.4)'
  },
  gridCell: {
    position: 'absolute' as const,
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    width: '40px',
    height: '40px'
  },
  trashBin: {
    position: 'absolute' as const,
    bottom: '12px',
    right: '12px',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    zIndex: 10,
    border: '2px dashed transparent',
    backdropFilter: 'blur(4px)',
  },
  trashBinInactive: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    borderColor: '#d1d5db',
    opacity: 0.6,
  },
  trashBinActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    borderColor: '#ef4444',
    opacity: 1,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'black',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  buttonGreen: {
    backgroundColor: '#10b981'
  },
  buttonBlue: {
    backgroundColor: '#3b82f6'
  },
  buttonPurple: {
    backgroundColor: '#8b5cf6'
  },
  buttonGray: {
    backgroundColor: '#6b7280'
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    minWidth: '192px',
    // padding: '8px'
  },
  dropdownContent: {
    padding: '8px'
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  input: {
    width: '64px',
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '400px',
    width: '100%',
    margin: '16px'
  },
  instructionBox: {
    marginTop: '24px',
    backgroundColor: '#eff6ff',
    padding: '16px',
    borderRadius: '8px'
  },
  separator: {
    width: '1px',
    height: '28px',
    backgroundColor: '#e5e7eb',
  },
};
