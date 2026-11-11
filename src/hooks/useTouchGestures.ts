/**
 * useTouchGestures — lightweight touch gesture hook.
 * Provides swipe and long-press detection for touch-friendly interactions.
 */

import { useCallback, useRef, useState } from 'react';

interface UseTouchGesturesOptions {
  threshold?: number;
  longPressDelay?: number;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  onTap?: () => void;
  enableMouseDrag?: boolean;
}

interface GestureState {
  isDragging: boolean;
  deltaX: number;
  direction: 'left' | 'right' | 'none';
}

export function useTouchGestures({
  threshold = 75,
  longPressDelay = 420,
  onSwipeRight,
  onLongPress,
  onTap,
  enableMouseDrag = false,
}: UseTouchGesturesOptions): { gestureState: GestureState; bind: any } {
  const [gestureState, setGestureState] = useState<GestureState>({ isDragging: false, deltaX: 0, direction: 'none' });
  const startX = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = ('touches' in e ? e.touches?.[0]?.clientX : e.clientX) ?? 0;
      startX.current = clientX;
      setGestureState({ isDragging: true, deltaX: 0, direction: 'none' });
      if (onLongPress) {
        longPressTimer.current = setTimeout(onLongPress, longPressDelay);
      }
    },
    [onLongPress, longPressDelay]
  );

  const move = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!gestureState.isDragging) return;
      const clientX = ('touches' in e ? e.touches?.[0]?.clientX : e.clientX) ?? 0;
      const deltaX = clientX - startX.current;
      setGestureState({ isDragging: true, deltaX, direction: deltaX > 0 ? 'right' : 'left' });
    },
    [gestureState.isDragging]
  );

  const end = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!gestureState.isDragging) return;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      const clientX = ('touches' in e ? e.touches?.[0]?.clientX : e.clientX) ?? 0;
      const deltaX = clientX - startX.current;
      setGestureState({ isDragging: false, deltaX: 0, direction: 'none' });

      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (Math.abs(deltaX) < 10 && onTap) {
        onTap();
      }
    },
    [onSwipeRight, onTap, threshold]
  );

  const bind = {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    ...(enableMouseDrag ? { onMouseDown: start, onMouseMove: move, onMouseUp: end } : {}),
  };

  return { gestureState, bind };
}