import { Clock } from 'lucide-react';
import type { StartTime } from '../../../taskUtils';
import { taskStyles } from '../../style/styles';

interface Props {
  startTime: StartTime;
  onStartTimeChange: (startTime: StartTime) => void;
}

const StartTimeInput = ({ startTime, onStartTimeChange }: Props) => {
  const pad2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div style={taskStyles.timeControls}>
      <Clock size={16} color="#6b7280" />
      <span style={taskStyles.timeLabel}>Start:</span>
      <input
        type="number"
        min={0}
        max={23}
        value={startTime.hours}
        onChange={(e) => onStartTimeChange({ ...startTime, hours: parseInt(e.target.value) || 0 })}
        style={taskStyles.timeInput}
      />
      <span style={taskStyles.timeColon}>:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={startTime.minutes}
        onChange={(e) => onStartTimeChange({ ...startTime, minutes: parseInt(e.target.value) || 0 })}
        style={taskStyles.timeInput}
      />
      <span style={{ fontSize: '12px', color: '#9ca3af', minWidth: '32px' }}>
        {pad2(startTime.hours)}:{pad2(startTime.minutes)}
      </span>
    </div>
  );
};

export default StartTimeInput;
