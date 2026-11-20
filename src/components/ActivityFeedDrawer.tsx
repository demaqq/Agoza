import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Activity,
  X,
  MapPin,
  Clock,
} from 'lucide-react';

export const ActivityFeedDrawer: React.FC = () => {
  const {
    isActivityFeedOpen,
    setIsActivityFeedOpen,
    activityFeed,
    formatPrice,
    t,
  } = useMarketplace();

  const [filterType, setFilterType] = useState<'all' | 'escrow' | 'swap' | 'offer' | 'listing'>('all');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActivityFeedOpen(false);
      }
    };
    if (isActivityFeedOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActivityFeedOpen, setIsActivityFeedOpen]);

  if (!isActivityFeedOpen) return null;

  const filteredFeed = activityFeed.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end"
      onClick={() => setIsActivityFeedOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1a1009] border-l border-slate-200 dark:border-[#262939] h-full flex flex-col shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#212433] bg-slate-50 dark:bg-[#0e1017] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
            <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-[#f5f6f8]">
              {t.liveActivityFeed}
            </h3>
          </div>
          <button
            onClick={() => setIsActivityFeedOpen(false)}
            className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#251810] text-slate-600 dark:text-[#8e94a6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#2a2d3e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-[#1a1009] border-b border-slate-200 dark:border-[#202332] flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'escrow', label: '🛡️ Protected' },
            { id: 'swap', label: '🔄 Swaps' },
            { id: 'offer', label: '🏷️ Offers' },
            { id: 'listing', label: '✨ Listings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                filterType === tab.id
                  ? 'bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] font-bold shadow-xs'
                  : 'bg-white dark:bg-[#251810] text-slate-600 dark:text-[#838a9d] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-transparent">
          {filteredFeed.map((item) => {
            const isEscrow = item.type === 'escrow';
            const isSwap = item.type === 'swap';
            const isOffer = item.type === 'offer';
            const isListing = item.type === 'listing';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#151722] border border-slate-200 dark:border-[#242738] hover:border-[#1b5e20] dark:hover:border-[#383c52] rounded-2xl p-3.5 transition-colors shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isEscrow
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#c5a059] border border-amber-300 dark:border-amber-800/50'
                        : isSwap
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50'
                        : isOffer
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800/50'
                        : isListing
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-800/50'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono">
                      {isEscrow ? '🛡️' : isSwap ? '🔄' : isOffer ? '🏷️' : '✨'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef] truncate">
                        {item.actorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#979eaf] leading-relaxed">
                      {item.actionText}{' '}
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        "{item.targetTitle}"
                      </strong>
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1d202d] text-[11px]">
                      {item.location && (
                        <span className="text-slate-500 dark:text-[#6a7185] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {item.location}
                        </span>
                      )}

                      {item.amountETB && (
                        <span className="font-mono font-bold text-[#1b5e20] dark:text-[#c5a059] ml-auto">
                          {formatPrice(item.amountETB)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
