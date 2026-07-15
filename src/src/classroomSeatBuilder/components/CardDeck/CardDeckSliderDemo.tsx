import { useState } from 'react';
import type { ReactNode } from 'react';
import { Grid2x2, ListTodo } from 'lucide-react';
import CardDeckSlider from './CardDeckSlider';
import CardCarousel from './CardCarousel';
import SeatLayoutPreview from './SeatLayoutPreview';
import { styles } from '../../../classroomSeatBuilder/style/styles';

// ==================== SEAT LAYOUT PREVIEW DATA ====================

const block = (rows: number, cols: number) => {
  const seats: { x: number; y: number }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) seats.push({ x, y });
  }
  return seats;
};

const uShape = () => {
  const seats: { x: number; y: number }[] = [];
  const cols = 6;
  const rows = 4;
  for (let x = 0; x < cols; x++) {
    seats.push({ x, y: 0 });
    seats.push({ x, y: rows - 1 });
  }
  for (let y = 1; y < rows - 1; y++) {
    seats.push({ x: 0, y });
    seats.push({ x: cols - 1, y });
  }
  return seats;
};

interface DeckItem {
  icon: ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  gradient: string;
  content: ReactNode;
}

// Card 1: Classroom Seat Builder preview
const seatCard: DeckItem = {
  icon: <Grid2x2 size={28} color="white" />,
  title: 'Classroom Seating',
  subtitle: 'Seat Builder',
  desc: 'Design classroom layouts by dragging seats onto a grid. Save and load templates.',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  content: (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
      <SeatLayoutPreview seats={[{ x: 0, y: 0 }]} />
      <SeatLayoutPreview seats={[{ x: 0, y: 0 }, { x: 1, y: 0 }]} />
      <SeatLayoutPreview seats={block(4, 4)} />
      <SeatLayoutPreview seats={uShape()} />
    </div>
  ),
};

// Card 2: Task Schedule Builder preview
const taskCard: DeckItem = {
  icon: <ListTodo size={28} color="white" />,
  title: 'Task Schedule',
  subtitle: 'Timeline Builder',
  desc: 'Plan class schedules with task templates. Drag to reorder, set start times, save your schedule.',
  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  content: (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
      {['Lecture', 'Discussion', 'Poll', 'Breakout', 'Presentation', 'Break'].map((type) => {
        const colorMap: Record<string, { bg: string; color: string }> = {
          Lecture: { bg: '#dbeafe', color: '#1d4ed8' },
          Discussion: { bg: '#dcfce7', color: '#15803d' },
          Poll: { bg: '#f3e8ff', color: '#7e22ce' },
          Breakout: { bg: '#ffedd5', color: '#c2410c' },
          Presentation: { bg: '#fce7f3', color: '#be185d' },
          Break: { bg: '#f3f4f6', color: '#374151' },
        };
        const c = colorMap[type] || { bg: '#fef9c3', color: '#a16207' };
        return (
          <div
            key={type}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: c.bg,
              color: c.color,
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            {type}
          </div>
        );
      })}
    </div>
  ),
};

const ITEMS = [seatCard, taskCard];

const renderCardContent = (item: DeckItem) => (
  <div style={{ ...styles.layoutCardInner, background: item.gradient }}>
    <div style={styles.layoutCardHeader}>
      <div style={styles.layoutCardIcon}>{item.icon}</div>
      <div>
        <h3 style={styles.layoutCardTitle}>{item.title}</h3>
        <div style={styles.layoutCardSubtitle}>{item.subtitle}</div>
      </div>
    </div>
    <p style={styles.layoutCardDesc}>{item.desc}</p>
    <div style={styles.layoutPreviewWrap}>{item.content}</div>
    <div style={styles.layoutCardFooter}>
      <span>Interactive Builder</span>
      <span>Preview</span>
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
          🃏 Deck
        </button>
        <button
          type="button"
          onClick={() => setMode('expanded')}
          style={{
            ...styles.deckToolbarButton,
            ...(mode === 'expanded' ? styles.deckToolbarButtonActive : {}),
          }}
        >
          ↔ Expanded
        </button>
      </div>

      {mode === 'deck' ? (
        <CardDeckSlider cardWidth={340} cardHeight={460}>
          {ITEMS.map(renderCardContent)}
        </CardDeckSlider>
      ) : (
        <CardCarousel cardWidth={300} cardHeight={440} visibleCount={ITEMS.length}>
          {ITEMS.map(renderCardContent)}
        </CardCarousel>
      )}
    </>
  );
};

export default CardDeckSliderDemo;
