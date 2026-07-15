import { useState } from 'react';
import type { ReactNode } from 'react';
import { Armchair, Users, Grid2x2, GitBranch, Square } from 'lucide-react';
import CardDeckSlider from './CardDeckSlider';
import CardCarousel from './CardCarousel';
import SeatLayoutPreview from './SeatLayoutPreview';
import { styles } from '../../style/styles';

/** Build a rectangular block of seats for previews. */
const block = (rows: number, cols: number) => {
  const seats: { x: number; y: number }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) seats.push({ x, y });
  }
  return seats;
};

/** U-shape: top row + bottom row + left/right columns, hollow center. */
const uShape = () => {
  const seats: { x: number; y: number }[] = [];
  const cols = 6;
  const rows = 4;
  for (let x = 0; x < cols; x++) {
    seats.push({ x, y: 0 }); // top row
    seats.push({ x, y: rows - 1 }); // bottom row
  }
  for (let y = 1; y < rows - 1; y++) {
    seats.push({ x: 0, y }); // left column
    seats.push({ x: cols - 1, y }); // right column
  }
  return seats;
};

interface DeckItem {
  icon: ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  seats: { x: number; y: number }[];
  gradient: string;
  seatCount: string;
}

const ITEMS: DeckItem[] = [
  {
    icon: <Armchair size={24} color="white" />,
    title: 'Single Seat',
    subtitle: '单人桌模板',
    desc: 'A standalone seat for individual placement. The atomic unit of any classroom layout.',
    seats: [{ x: 0, y: 0 }],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    seatCount: '1 seat',
  },
  {
    icon: <Users size={24} color="white" />,
    title: '双人桌',
    subtitle: 'Double Desk',
    desc: 'Two adjacent seats sharing a workspace — ideal for pair work and collaboration.',
    seats: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    seatCount: '2 seats',
  },
  {
    icon: <Grid2x2 size={24} color="white" />,
    title: 'Small Classroom',
    subtitle: '4 × 4 Grid',
    desc: 'A compact 4×4 arrangement of 16 seats. Fits a standard small classroom grid.',
    seats: block(4, 4),
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    seatCount: '16 seats',
  },
  {
    icon: <GitBranch size={24} color="white" />,
    title: 'U-Shape',
    subtitle: 'Discussion Layout',
    desc: 'Seats wrap around three sides, leaving the center open — perfect for group discussion.',
    seats: uShape(),
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    seatCount: '16 seats',
  },
  {
    icon: <Square size={24} color="white" />,
    title: 'Custom Block',
    subtitle: '3 × 5 Block',
    desc: 'A larger custom block of 15 seats. Drag-and-drop ready for the seating builder canvas.',
    seats: block(3, 5),
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    seatCount: '15 seats',
  },
];

const renderCard = (item: DeckItem) => (
  <div style={{ ...styles.layoutCardInner, background: item.gradient }}>
    <div style={styles.layoutCardHeader}>
      <div style={styles.layoutCardIcon}>{item.icon}</div>
      <div>
        <h3 style={styles.layoutCardTitle}>{item.title}</h3>
        <div style={styles.layoutCardSubtitle}>{item.subtitle}</div>
      </div>
    </div>
    <p style={styles.layoutCardDesc}>{item.desc}</p>
    <div style={styles.layoutPreviewWrap}>
      <SeatLayoutPreview seats={item.seats} />
    </div>
    <div style={styles.layoutCardFooter}>
      <span>{item.seatCount}</span>
      <span>Template Preview</span>
    </div>
  </div>
);

const CardDeckSliderDemo = () => {
  const [mode, setMode] = useState<'deck' | 'expanded'>('deck');

  return (
    <>
      {/* Mode switcher */}
      <div style={{ ...styles.deckToolbar, position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
        <button
          type="button"
          onClick={() => setMode('deck')}
          style={{
            ...styles.deckToolbarButton,
            ...(mode === 'deck' ? styles.deckToolbarButtonActive : {}),
          }}
        >
          🃏 Deck Mode
        </button>
        <button
          type="button"
          onClick={() => setMode('expanded')}
          style={{
            ...styles.deckToolbarButton,
            ...(mode === 'expanded' ? styles.deckToolbarButtonActive : {}),
          }}
        >
          ↔ Expanded Mode
        </button>
      </div>

      {mode === 'deck' ? (
        <CardDeckSlider cardWidth={340} cardHeight={460}>
          {ITEMS.map(renderCard)}
        </CardDeckSlider>
      ) : (
        <CardCarousel cardWidth={300} cardHeight={440} visibleCount={3}>
          {ITEMS.map(renderCard)}
        </CardCarousel>
      )}
    </>
  );
};

export default CardDeckSliderDemo;
