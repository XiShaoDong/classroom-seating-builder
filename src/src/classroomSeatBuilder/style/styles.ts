export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '24px',
    width: '100vw',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  controlPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  },
  controlFlex: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '16px'
  },
  mainPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center'
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
    minWidth: '320px',
    minHeight: '200px',
    width: "100%",
    height: "100%"
  },
  gridContainerDragging: {
    position: 'relative' as const,
    border: '2px dashed #3b82f6',
    backgroundColor: '#eff6ff',
    cursor: 'copy',
    minWidth: '320px',
    minHeight: '200px',
    width: "100%",
    height: "100%"
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
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 50
  },
  trashBinInactive: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280'
  },
  trashBinActive: {
    backgroundColor: '#ef4444',
    color: 'white',
    transform: 'scale(1.1)',
    animation: 'pulse 1s infinite'
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
  }
};
