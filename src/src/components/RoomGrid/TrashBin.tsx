import { Trash2 } from 'lucide-react';
import { styles } from '../../style/styles';

interface Props { isActive: boolean; onDrop: () => void; }

const TrashBin = ({ isActive, onDrop }: Props) => (
  <>
    <style>{`@keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.5;} }`}</style>
    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); onDrop(); }}
         style={{ ...styles.trashBin, ...(isActive ? styles.trashBinActive : styles.trashBinInactive) }}>
      <Trash2 size={24} />
    </div>
  </>
);

export default TrashBin 