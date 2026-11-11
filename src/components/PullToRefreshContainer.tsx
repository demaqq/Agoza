import React, { useState, useRef, useCallback } from 'react';
import { CoffeeBeansIcon, JebenaIcon } from './EthiopianIcons';

interface PullToRefreshContainerProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  onRefresh,
  children,
  disabled = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isPullingRef = useRef<boolean>(false);

  const THRESHOLD = 72; // Pull threshold in px
  const MAX_PULL = 120; // Maximum visual pull distance

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    // Only allow pull to refresh when page is scrolled to the very top
    if (window.scrollY <= 2 && e.touches.length === 1) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || startYRef.current === null || isRefreshing) return;
    if (window.scrollY > 5) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const rawDy = currentY - startYRef.current;

    if (rawDy > 0) {
      // Apply rubber band resistance formula
      const dampened = Math.min(MAX_PULL, rawDy * 0.45);
      setPullDistance(dampened);
    } else {
      setPullDistance(0);
    }
  };

  const triggerHaptic = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([25]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || isRefreshing) return;
    isPullingRef.current = false;

    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      triggerHaptic();
      setPullDistance(THRESHOLD);

      try {
        await Promise.resolve(onRefresh());
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 650);
      }
    } else {
      setPullDistance(0);
    }

    startYRef.current = null;
  };

  const pullProgress = Math.min(1, pullDistance / THRESHOLD);
  const rotationDeg = pullProgress * 360;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull-Down Ethiopian Coffee Brewing Indicator */}
      <div
        className="w-full flex items-center justify-center overflow-hidden transition-all duration-200 pointer-events-none select-none z-30"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-[#251810] border border-amber-300 dark:border-[#4d3221] shadow-md my-auto">
          {/* Animated Coffee Jebena & Beans */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div
              className={`text-amber-800 dark:text-[#d4a373] transition-transform ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              style={{
                transform: isRefreshing ? undefined : `rotate(${rotationDeg}deg)`,
              }}
            >
              <CoffeeBeansIcon className="w-6 h-6" />
            </div>

            {/* Steaming Jebena icon overlay when threshold is met */}
            {pullProgress >= 0.9 && !isRefreshing && (
              <div className="absolute -top-1 -right-1 text-amber-700 dark:text-[#e0b487] animate-bounce">
                <JebenaIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-[#fbf5ef] leading-tight">
              {isRefreshing
                ? 'ቡናውን እያፈላን ነው... (Brewing Fresh Listings)'
                : pullProgress >= 1
                ? 'ልቀቁት ይታደሳል (Release to Refresh)'
                : 'ጎትተው ያድሱ (Pull to Brew Listings)'}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-[#d4a373] font-medium font-serif">
              {isRefreshing ? 'Fetching updated verified ads...' : 'Medium Roast Refresh'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          transform: `translate3d(0, ${isRefreshing ? 6 : pullDistance * 0.25}px, 0)`,
          transition: isPullingRef.current ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
