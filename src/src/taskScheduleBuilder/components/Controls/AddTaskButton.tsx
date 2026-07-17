import { Plus, X } from 'lucide-react';
import { styles } from '../../../classroomSeatBuilder/style/styles';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Just the trigger button. The expanded panel is rendered by the page
 * (TaskScheduleEditor) so it can anchor to the whole frame (componentCard)
 * rather than the button — enabling a slide-out-from-the-frame animation
 * that matches the frame's height.
 */
const AddTaskButton = ({ isOpen, onToggle }: Props) => (
  <div style={{ position: 'relative' }}>
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...styles.button,
        ...styles.buttonGray,
        backgroundColor: isOpen ? '#4b5563' : '#6b7280',
        // Reserve width for the longest label so the frame doesn't
        // shrink/grow when toggling.
        minWidth: '104px',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => { if (!isOpen) Object.assign(e.currentTarget.style, { backgroundColor: '#4b5563' }); }}
      onMouseLeave={(e) => { if (!isOpen) Object.assign(e.currentTarget.style, { backgroundColor: '#6b7280' }); }}
    >
      {isOpen ? <X size={18} /> : <Plus size={18} />}
      Add Task
    </button>
  </div>
);

export default AddTaskButton;
