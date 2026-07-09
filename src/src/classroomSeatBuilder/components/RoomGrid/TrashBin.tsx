import { Trash2 } from 'lucide-react';
import { styles } from '../../style/styles';

interface Props { isActive: boolean; isDragOutside: boolean; onDrop: () => void; }

const TrashBin = ({ isActive, isDragOutside, onDrop }: Props) => {
  const scale = isDragOutside ? 1.2 : 1;
  const iconSize = isDragOutside ? 20 : 18;
  const boxShadow = isDragOutside
    ? '0 3px 14px rgba(239, 68, 68, 0.35)'
    : '0 2px 8px rgba(0,0,0,0.12)';

  const baseStyle: React.CSSProperties = {
    ...styles.trashBin,
    ...(isActive ? styles.trashBinActive : styles.trashBinInactive),
    transform: 'scale(' + scale + ')',
    boxShadow: boxShadow,
    ...(isDragOutside ? { animation: 'pulse 0.8s ease-in-out infinite' } : {}),
  };

  return (
    <>
      <style>{'@keyframes pulse { 0%,100%{opacity:1;transform:scale(' + scale + ');}50%{opacity:0.7;transform:scale(' + (scale * 1.08).toFixed(3) + ');} }'}</style>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(); }}
        style={baseStyle}
      >
        <Trash2 size={iconSize} />
      </div>
    </>
  );
};

export default TrashBin
