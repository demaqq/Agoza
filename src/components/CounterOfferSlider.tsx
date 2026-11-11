import React from 'react';
import { Tag } from 'lucide-react';
import { CoffeeBeansIcon } from './EthiopianIcons';

interface CounterOfferSliderProps {
  originalPriceETB: number;
  currentOfferETB: number;
  onChange: (newPrice: number) => void;
  formatPrice: (price: number) => string;
}

export const CounterOfferSlider: React.FC<CounterOfferSliderProps> = ({
  originalPriceETB,
  currentOfferETB,
  onChange,
  formatPrice,
}) => {
  const minOffer = Math.max(100, Math.round(originalPriceETB * 0.6));
  const maxOffer = Math.round(originalPriceETB * 1.15);

  const percentageOfOriginal = Math.round((currentOfferETB / originalPriceETB) * 100);
  const discountAmount = originalPriceETB - currentOfferETB;
  const isDiscount = discountAmount > 0;

  // Ethiopian cultural negotiation likelihood calculation
  let likelihoodText = 'Fair Market Bargain (ሚዛናዊ ድርድር)';
  let likelihoodAmharic = 'ተቀባይነት ያለው ቅናሽ';
  let likelihoodColor = 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40';
  let gaugeWidth = 70;

  if (percentageOfOriginal >= 92) {
    likelihoodText = 'High Acceptance (ፈጣን ስምምነት)';
    likelihoodAmharic = 'በጣም ከፍተኛ የመስማማት ዕድል';
    likelihoodColor = 'text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40';
    gaugeWidth = 95;
  } else if (percentageOfOriginal < 78) {
    likelihoodText = 'Aggressive Bargain (ከበድ ያለ ድርድር)';
    likelihoodAmharic = 'ሻጩ የመቃወም ዕድሉ ከፍተኛ ነው';
    likelihoodColor = 'text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40';
    gaugeWidth = 35;
  }

  const handlePreset = (pct: number) => {
    const calculated = Math.round(originalPriceETB * (1 - pct / 100));
    onChange(calculated);
  };

  return (
    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#1a110a] border border-amber-200 dark:border-[#422919] space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#f7ede2]">
          <Tag className="w-4 h-4 text-amber-700 dark:text-[#d4a373]" />
          <span>Interactive Bargain Slider (የዋጋ ድርድር)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800 dark:text-[#d4a373]">
          <CoffeeBeansIcon className="w-3.5 h-3.5" />
          <span>{percentageOfOriginal}% of Ask</span>
        </div>
      </div>

      {/* Numerical Display and Difference */}
      <div className="flex items-baseline justify-between p-3 rounded-xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#4d3221]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#a8907f] block">
            Your Counter Offer:
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-[#1b5e20] dark:text-[#d4a373]">
            {formatPrice(currentOfferETB)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 dark:text-[#a8907f] block">
            {isDiscount ? 'Customer Savings' : 'Above Listing'}
          </span>
          <span
            className={`font-mono text-xs font-bold ${
              isDiscount ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isDiscount ? `-${formatPrice(discountAmount)} (-${100 - percentageOfOriginal}%)` : `+${formatPrice(-discountAmount)}`}
          </span>
        </div>
      </div>

      {/* Tactile Slider */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={minOffer}
          max={maxOffer}
          step={50}
          value={currentOfferETB}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-[#342318] rounded-lg appearance-none cursor-pointer accent-[#1b5e20] dark:accent-[#d4a373]"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-[#9e8471]">
          <span>Min: {formatPrice(minOffer)}</span>
          <span>Asking: {formatPrice(originalPriceETB)}</span>
          <span>Max: {formatPrice(maxOffer)}</span>
        </div>
      </div>

      {/* Likelihood Meter */}
      <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${likelihoodColor}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
          <div>
            <div className="font-bold leading-tight">{likelihoodText}</div>
            <div className="text-[10px] opacity-80">{likelihoodAmharic}</div>
          </div>
        </div>
        <div className="w-24 bg-black/15 rounded-full h-2 overflow-hidden shrink-0">
          <div
            className="h-full bg-current transition-all duration-300 rounded-full"
            style={{ width: `${gaugeWidth}%` }}
          />
        </div>
      </div>

      {/* Quick Percentage Presets */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-semibold text-slate-500 dark:text-[#a8907f]">Quick Presets:</span>
        {[5, 10, 15, 20].map((pct) => {
          const target = Math.round(originalPriceETB * (1 - pct / 100));
          const isSelected = Math.abs(currentOfferETB - target) < 100;
          return (
            <button
              key={pct}
              type="button"
              onClick={() => handlePreset(pct)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ${
                isSelected
                  ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c] dark:border-[#d4a373] shadow-xs'
                  : 'bg-white dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4d3221] hover:border-amber-400'
              }`}
            >
              -{pct}%
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange(originalPriceETB)}
          className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer min-h-[36px] ml-auto ${
            currentOfferETB === originalPriceETB
              ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c] dark:border-[#d4a373] shadow-xs'
              : 'bg-white dark:bg-[#251810] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4d3221] hover:border-amber-400'
          }`}
        >
          100% Ask
        </button>
      </div>
    </div>
  );
};
