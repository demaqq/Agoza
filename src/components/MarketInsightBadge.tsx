import React, { useState, useEffect } from 'react';
import { Collectible } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  TrendingDown,
  Flame,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { geminiChat } from '../services/gemini';

interface MarketInsightBadgeProps {
  collectible: Collectible;
  variant?: 'compact' | 'detailed' | 'pill';
  className?: string;
}

export interface MarketPriceInsight {
  type: 'below-market' | 'hot-item' | 'great-value' | 'fair-market';
  label: string;
  sublabel: string;
  savingsPercent?: number;
  savingsAmountETB?: number;
  averageCategoryPriceETB: number;
  demandScore: number;
}

export function computeMarketInsight(collectible: Collectible, allCollectibles: Collectible[]): MarketPriceInsight {
  // Find all items in the same category
  const categoryItems = allCollectibles.filter((c) => c.category === collectible.category);
  const avgPrice = categoryItems.length > 0
    ? Math.round(categoryItems.reduce((sum, item) => sum + item.priceETB, 0) / categoryItems.length)
    : collectible.priceETB;

  const priceDiff = avgPrice - collectible.priceETB;
  const percentBelow = avgPrice > 0 ? Math.round((priceDiff / avgPrice) * 100) : 0;
  const demandScore = (collectible.likesCount * 3) + Math.min(100, Math.round(collectible.viewsCount / 5));

  // Determine insight hierarchy
  if (percentBelow >= 10) {
    return {
      type: 'below-market',
      label: `${percentBelow}% Below Market`,
      sublabel: `Lower than ${collectible.category.replace('-', ' ')} average`,
      savingsPercent: percentBelow,
      savingsAmountETB: priceDiff,
      averageCategoryPriceETB: avgPrice,
      demandScore,
    };
  }

  if (demandScore >= 70 || collectible.likesCount >= 40) {
    return {
      type: 'hot-item',
      label: '🔥 Hot item',
      sublabel: `${collectible.likesCount} buyers watching`,
      averageCategoryPriceETB: avgPrice,
      demandScore,
    };
  }

  if ((collectible.condition === 'Brand New' || collectible.condition === 'Like New') && percentBelow >= 0) {
    return {
      type: 'great-value',
      label: '⚡ Great Value',
      sublabel: 'Sealed / pristine condition',
      savingsPercent: percentBelow,
      averageCategoryPriceETB: avgPrice,
      demandScore,
    };
  }

  return {
    type: 'fair-market',
    label: 'Verified Price',
    sublabel: 'Fair market valuation',
    averageCategoryPriceETB: avgPrice,
    demandScore,
  };
}

export const MarketInsightBadge: React.FC<MarketInsightBadgeProps> = ({
  collectible,
  variant = 'compact',
  className = '',
}) => {
  const { collectibles, formatPrice } = useMarketplace();
  const [showTooltip, setShowTooltip] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  const insight = computeMarketInsight(collectible, collectibles);

  useEffect(() => {
    if (!showTooltip) return;
    let cancelled = false;
    const avgPrice = insight.averageCategoryPriceETB || collectible.priceETB;
    const prompt = `You are a pricing advisor for an Ethiopian peer-to-peer marketplace (Agoza). Write one concise sentence explaining whether this listing is fair, underpriced, or overpriced, and what the buyer/seller should do.\n\nItem: ${collectible.title}\nCondition: ${collectible.condition}\nListed: ${collectible.priceETB} ETB\nCategory average: ${avgPrice} ETB\nInsight: ${insight.label} — ${insight.sublabel}`;
    geminiChat(prompt, {
      systemPrompt: 'You are a concise marketplace pricing advisor. One sentence only.',
      temperature: 0.4,
      maxOutputTokens: 160,
    }).then((res) => {
      if (res.success && res.data && !cancelled) setAiRationale(res.data);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTooltip, collectible.id, collectible.priceETB]);

  // Styling maps based on insight type
  const styleConfig = {
    'below-market': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300/80 dark:border-emerald-700/80',
      icon: TrendingDown,
      dot: 'bg-emerald-500',
    },
    'hot-item': {
      bg: 'bg-amber-50 dark:bg-[#341d10]',
      text: 'text-amber-900 dark:text-[#d4a373]',
      border: 'border-amber-300 dark:border-[#52331f]',
      icon: Flame,
      dot: 'bg-amber-500',
    },
    'great-value': {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Zap,
      dot: 'bg-blue-500',
    },
    'fair-market': {
      bg: 'bg-slate-50 dark:bg-[#1a120b]',
      text: 'text-slate-700 dark:text-[#c4b5a5]',
      border: 'border-slate-200 dark:border-[#382214]',
      icon: CheckCircle2,
      dot: 'bg-slate-400',
    },
  };

  const currentStyle = styleConfig[insight.type];
  const Icon = currentStyle.icon;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs select-none ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
        title="Click for market price insights"
      >
        <Icon className="w-3 h-3 shrink-0" />
        <span className="truncate">{insight.label}</span>
      </button>

      {/* Interactive Market Insight Popover / Tooltip */}
      {showTooltip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-0 mb-1.5 w-56 sm:w-64 p-2.5 bg-white dark:bg-[#251810] border border-amber-200 dark:border-[#473020] rounded-xl shadow-xl z-30 text-left animate-in fade-in zoom-in-95 pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-1 pb-1 mb-1.5 border-b border-amber-100 dark:border-[#382214]">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-950 dark:text-[#f8edd6]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4a373]" />
              <span>Agoza Market Insight</span>
            </div>
            <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-100 dark:bg-[#382214] text-amber-900 dark:text-[#d4a373] font-bold">
              Live
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-[#c4b5a5] leading-relaxed mb-2">
            {aiRationale || (insight.sublabel + ' across verified listings in Ethiopia.')}
          </p>

          <div className="space-y-1 bg-slate-50 dark:bg-[#1a1009] p-2 rounded-lg text-[10px] border border-slate-100 dark:border-[#382214]">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>This Listing:</span>
              <span className="font-mono font-bold text-[#1b5e20] dark:text-[#d4a373]">
                {formatPrice(collectible.priceETB)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Category Avg:</span>
              <span className="font-mono font-medium text-slate-700 dark:text-[#cbd0dc]">
                {formatPrice(insight.averageCategoryPriceETB)}
              </span>
            </div>
            {insight.savingsAmountETB && insight.savingsAmountETB > 0 && (
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold pt-1 border-t border-slate-200/80 dark:border-[#382214]">
                <span>Est. Buyer Savings:</span>
                <span className="font-mono">
                  +{formatPrice(insight.savingsAmountETB)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[9px] text-slate-400 dark:text-[#8d796b]">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Backed by CBE In-Person Escrow Trust</span>
          </div>
        </div>
      )}
    </div>
  );
};
