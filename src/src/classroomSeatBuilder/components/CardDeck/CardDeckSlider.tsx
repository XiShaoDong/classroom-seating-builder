import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styles } from '../../style/styles';

interface Props {
  /** Each child is the content of a single card in the deck. */
  children: React.ReactNode[];
  /** Stage width in px (cards fill the stage). */
  cardWidth?: number;
  /** Stage height in px (cards fill the stage). */
  cardHeight?: number;
  /** Called whenever the active (head) card changes. */
  onChange?: (index: number) => void;
}

const TRANSITION_MS = 450;
const MAX_VISIBLE_DEPTH = 4;
const DEPTH_STEP_PX = 14;
const SCALE_STEP = 0.05;

/**
 * Maps a card's depth (0 = active head, 1..n = further back in the stack)
 * to an inline transform/opacity/zIndex so the deck reads as a physical
 * stack: one focused card in front, the rest fanned subtly behind it.
 */
const depthStyle = (depth: number, total: number): React.CSSProperties => {
  if (depth === 0) {
    return { transform: 'translateY(0px) scale(1) rotate(0deg)', opacity: 1, zIndex: total };
  }
  const clamped = Math.min(depth, MAX_VISIBLE_DEPTH);
  const translateY = DEPTH_STEP_PX * clamped;
  const scale = 1 - SCALE_STEP * clamped;
  const rotate = depth % 2 === 0 ? -2.5 * clamped : 2.5 * clamped;
  const opacity = depth > MAX_VISIBLE_DEPTH ? 0 : Math.max(0, 1 - 0.2 * clamped);
  return {
    transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    zIndex: Math.max(1, total - depth),
  };
};

/**
 * CardDeckSlider — a single-card-focused deck navigation component.
 *
 * Mental model: a physical stack of cards. One card is in focus at a time;
 * the rest sit behind it as depth cues. Next/Prev move the head card to the
 * back (or bring the back card forward), shuffling through the deck.
 *
 * Navigation: Prev/Next buttons flanking the card, keyboard arrows,
 * and mouse-wheel / trackpad swipe.
 *
 * Not a carousel: no horizontal scroll, no side-by-side cards, no snap.
 */
const CardDeckSlider = ({ children, cardWidth = 320, cardHeight = 420, onChange }: Props) => {
  const cards = Array.isArray(children) ? children : [children];
  const total = cards.length;

  const [headIndex, setHeadIndex] = useState(0);
  const isAnimatingRef = useRef(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total === 0 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setHeadIndex((prev) => (prev + dir + total) % total);
      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, TRANSITION_MS);
    },
    [total]
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  // Notify on head change.
  useEffect(() => {
    onChange?.(headIndex);
  }, [headIndex, onChange]);

  // Keyboard navigation: arrows move through the deck.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Mouse-wheel / trackpad navigation. Prefer horizontal deltaX (trackpad
  // horizontal swipe / shift+wheel), fall back to vertical deltaY.
  // isAnimatingRef naturally throttles to one step per animation cycle.
  const onWheel = (e: React.WheelEvent) => {
    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    if (dx === 0 && dy === 0) return;
    const forward = dx >= dy ? e.deltaX > 0 : e.deltaY > 0;
    e.preventDefault();
    go(forward ? 1 : -1);
  };

  return (
    <div style={styles.cardDeck}>
      <div style={styles.deckRow}>
        {/* Prev — sits outside the card on the left */}
        <button
          type="button"
          aria-label="Previous card"
          onClick={prev}
          style={styles.deckSideButton}
          onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, styles.deckSideButtonHover)}
          onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, styles.deckSideButton)}
        >
          <ChevronLeft size={26} />
        </button>

        <div
          style={{ ...styles.deckStage, width: cardWidth, height: cardHeight }}
          onWheel={onWheel}
        >
          {cards.map((card, i) => {
            // Circular offset from the current head: 0 = head, 1..n = behind.
            const normalizedOffset = (((i - headIndex) % total) + total) % total;
            const dStyle = depthStyle(normalizedOffset, total);
            // Pointer events only for the active card; the rest are pure depth.
            const interactive = normalizedOffset === 0;
            return (
              <div
                key={i}
                style={{
                  ...styles.deckCard,
                  ...dStyle,
                  transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${TRANSITION_MS}ms ease`,
                  pointerEvents: interactive ? 'auto' : 'none',
                }}
              >
                {card}
              </div>
            );
          })}
        </div>

        {/* Next — sits outside the card on the right */}
        <button
          type="button"
          aria-label="Next card"
          onClick={next}
          style={styles.deckSideButton}
          onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, styles.deckSideButtonHover)}
          onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, styles.deckSideButton)}
        >
          <ChevronRight size={26} />
        </button>
      </div>

      <div style={styles.deckCounter}>
        {Math.min(headIndex + 1, total)} / {total}
      </div>
      <div style={styles.deckHint}>Arrows, scroll, or swipe to move through the deck</div>
    </div>
  );
};

export default CardDeckSlider;
