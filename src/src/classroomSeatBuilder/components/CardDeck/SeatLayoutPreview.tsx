import { styles } from '../../style/styles';

interface Props {
  /** Seat coordinates {x, y} relative to a 0-based grid. */
  seats: { x: number; y: number }[];
}

/**
 * Read-only miniature render of a seating layout.
 * Computes the bounding box of the seats and renders a CSS grid preview,
 * mirroring the app's grid-cell concept but scaled down for a card.
 */
const SeatLayoutPreview = ({ seats }: Props) => {
  if (seats.length === 0) return null;

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));
  const cols = maxX + 1;
  const rows = maxY + 1;

  // Map (x,y) -> presence for quick lookup.
  const occupied = new Set(seats.map((s) => `${s.x},${s.y}`));

  const cells: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const isOccupied = occupied.has(`${x},${y}`);
      cells.push(
        <div
          key={`${x}-${y}`}
          style={
            isOccupied
              ? styles.layoutPreviewSeat
              : { width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.12)' }
          }
        />
      );
    }
  }

  return (
    <div
      style={{
        ...styles.layoutPreview,
        gridTemplateColumns: `repeat(${cols}, 14px)`,
        gridTemplateRows: `repeat(${rows}, 14px)`,
      }}
    >
      {cells}
    </div>
  );
};

export default SeatLayoutPreview;
