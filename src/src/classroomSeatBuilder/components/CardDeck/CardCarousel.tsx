import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styles } from '../../style/styles';

interface Props {
  /** Each child is the content of a single card. */
  children: React.ReactNode[];
  /** Card width in px. */
  cardWidth?: number;
  /** Card height in px. */
  cardHeight?: number;
  /** Gap between cards in px. */
  gap?: number;
  /** Number of cards visible at once. */
  visibleCount?: number;
}

const TRANSITION_MS = 450;

/**
 * CardCarousel — the "expanded" mode.
 *
 * Shows `visibleCount` (default 3) cards in a row and slides one card at a
 * time via left/right buttons or mouse drag. The last position is reached
 * when the final card is in view (clamped, not infinite).
 */
const CardCarousel = ({
  children,
  cardWidth = 300,
  cardHeight = 440,
  gap = 30,
  visibleCount = 3,
}: Props) => {
  const cards = Array.isArray(children) ? children : [children];
  const total = cards.length;

  // Max index such that the last card is still fully visible.
  const maxIndex = Math.max(0, total - visibleCount);

  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<{ startX: number; startTranslate: number } | null>(null);
  // Live translate in px during a drag; null when settled.
  const [dragOffset, setDragOffset] = useState(0);
  const isAnimatingRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // One card stride = card width + gap.
  const stride = cardWidth + gap;
  const baseTranslate = -index * stride;

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(maxIndex, target));
      if (clamped === index) return;
      isAnimatingRef.current = true;
      setIndex(clamped);
      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, TRANSITION_MS);
    },
    [index, maxIndex]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Drag (mouse) handlers.
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimatingRef.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDrag({ startX: e.clientX, startTranslate: baseTranslate });
    setDragOffset(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setDragOffset(e.clientX - drag.startX);
  };

  const onPointerUp = () => {
    if (!drag) return;
    // Threshold: a third of a stride commits a step.
    const threshold = stride / 3;
    if (dragOffset <= -threshold) {
      next();
    } else if (dragOffset >= threshold) {
      prev();
    }
    setDrag(null);
    setDragOffset(0);
  };

  // Mouse-wheel navigation.
  const onWheel = (e: React.WheelEvent) => {
    if (isAnimatingRef.current) return;
    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    if (dx === 0 && dy === 0) return;
    const forward = dx >= dy ? e.deltaX > 0 : e.deltaY > 0;
    e.preventDefault();
    goTo(index + (forward ? 1 : -1));
  };

  // Keyboard arrows.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const atStart = index === 0;
  const atEnd = index >= maxIndex;

  const liveTranslate = drag ? drag.startTranslate + dragOffset : baseTranslate;
  const trackStyle: React.CSSProperties = {
    ...styles.carouselTrack,
    ...(drag ? styles.carouselTrackDragging : {}),
    transform: `translateX(${liveTranslate}px)`,
    transition: drag ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
  };

  const mergeButton = (disabled: boolean): React.CSSProperties =>
    disabled ? { ...styles.carouselSideButton, ...styles.carouselSideButtonDisabled } : styles.carouselSideButton;

  const hoverHandlers = (disabled: boolean) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      if (!disabled) Object.assign((e.currentTarget as HTMLElement).style, styles.carouselSideButtonHover);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (!disabled) Object.assign((e.currentTarget as HTMLElement).style, styles.carouselSideButton);
    },
  });

  return (
    <div style={styles.carousel}>
      <div style={styles.carouselRow}>
        <button
          type="button"
          aria-label="Previous"
          onClick={prev}
          disabled={atStart}
          style={mergeButton(atStart)}
          {...hoverHandlers(atStart)}
        >
          <ChevronLeft size={26} />
        </button>

        <div
          ref={viewportRef}
          style={{ ...styles.carouselViewport, width: visibleCount * stride + gap }}
          onWheel={onWheel}
        >
          <div
            style={trackStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {cards.map((card, i) => {
              // Dim cards outside the visible window slightly for depth.
              const visibleFrom = index;
              const visibleTo = index + visibleCount - 1;
              const inWindow = i >= visibleFrom && i <= visibleTo;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.carouselCardWrap,
                    width: cardWidth,
                    height: cardHeight,
                    opacity: inWindow ? 1 : 0.4,
                    transform: inWindow ? 'scale(1)' : 'scale(0.92)',
                  }}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={next}
          disabled={atEnd}
          style={mergeButton(atEnd)}
          {...hoverHandlers(atEnd)}
        >
          <ChevronRight size={26} />
        </button>
      </div>

      <div style={styles.deckCounter}>
        {Math.min(index + 1, maxIndex + 1)} / {maxIndex + 1}
      </div>
      <div style={styles.deckHint}>Drag the cards, scroll, use the arrows, or press ← / →</div>
    </div>
  );
};

export default CardCarousel;
