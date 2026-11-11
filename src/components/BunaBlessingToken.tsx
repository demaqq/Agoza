import React, { useState } from 'react';
import { LoyaltyPerk } from '../types';
import {
  X,
  Heart,
  Check,
  Gift,
} from 'lucide-react';
import {
  CoffeeBeansIcon,
  JebenaIcon,
  CoffeeSackIcon,
} from './EthiopianIcons';

const TRADITIONAL_BLESSINGS = [
  {
    amharic: 'ቡናና ፍቅር አይቋረጥባችሁ',
    english: 'May coffee, warm hospitality, and pure goodwill never cease in your home.',
    beans: 15,
  },
  {
    amharic: 'ዕድሜና ጤና ከበረከት ጋር ይስጣችሁ',
    english: 'May health, longevity, and honest abundance crown all your trades.',
    beans: 20,
  },
  {
    amharic: 'የንግድ በረከት ይግባላችሁ፡ እጅ በእጅ ይባረክ',
    english: 'May your handiwork and marketplace deals multiply with trusted integrity.',
    beans: 25,
  },
];

const AVAILABLE_PERKS: LoyaltyPerk[] = [
  {
    id: 'perk-zero-escrow',
    title: 'Zero Escrow Service Fee Pass',
    titleAmharic: 'የነጻ የኢስክሮው አገልግሎት ማለፊያ',
    beanCost: 80,
    description: 'Waives the standard 1.5% escrow inspection and protection fee on your next purchase.',
    type: 'fee_discount',
  },
  {
    id: 'perk-priority-hub',
    title: 'Priority Inspection Pass at CBE / Safe Hubs',
    titleAmharic: 'ቀዳሚ የደህንነት ማዕከል ፈጣን ምርመራ',
    beanCost: 50,
    description: 'Skip the standard physical check queue at CBE HQ Vault and Bole Safe Hubs.',
    type: 'priority_inspection',
  },
  {
    id: 'perk-spotlight',
    title: 'Spotlight Listing Boost (24h)',
    titleAmharic: 'የ24 ሰዓት ልዩ የገበያ ማስተዋወቂያ',
    beanCost: 70,
    description: 'Pins your collectible or trade offer at the top of the feed with a golden roast banner.',
    type: 'spotlight_boost',
  },
  {
    id: 'perk-heritage-badge',
    title: 'Verified Heritage Patron Badge',
    titleAmharic: 'የኢትዮጵያ ቅርሶች ታማኝ ደጋፊ ባጅ',
    beanCost: 100,
    description: 'Displays a permanent golden Jebena & roasted bean badge beside your trader profile.',
    type: 'heritage_badge',
  },
];

interface BunaBlessingTokenProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName?: string;
  itemTitle?: string;
}

export const BunaBlessingToken: React.FC<BunaBlessingTokenProps> = ({
  isOpen,
  onClose,
  sellerName = 'Abebe Antiquities',
  itemTitle = 'Authentic 19th Century Axumite Coin',
}) => {
  const [activeTab, setActiveTab] = useState<'blessing' | 'rewards'>('blessing');
  const [selectedBlessingIndex, setSelectedBlessingIndex] = useState(0);
  const [beansBalance, setBeansBalance] = useState(195);
  const [redeemedPerks, setRedeemedPerks] = useState<string[]>([]);
  const [isBlessingSent, setIsBlessingSent] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendBlessing = () => {
    const chosen = TRADITIONAL_BLESSINGS[selectedBlessingIndex];
    setBeansBalance((prev) => prev + chosen.beans);
    setIsBlessingSent(true);
    setTimeout(() => {
      setIsBlessingSent(false);
      setActiveTab('rewards');
    }, 1800);
  };

  const handleRedeemPerk = (perk: LoyaltyPerk) => {
    if (beansBalance < perk.beanCost) return;
    setBeansBalance((prev) => prev - perk.beanCost);
    setRedeemedPerks((prev) => [...prev, perk.id]);
    setRedeemSuccess(`Successfully unlocked "${perk.title}"!`);
    setTimeout(() => setRedeemSuccess(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1e130c] border border-amber-900/40 dark:border-[#4d3221] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-[#382316] bg-amber-50/70 dark:bg-[#251810] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600/10 dark:bg-[#d4a373]/20 flex items-center justify-center text-amber-800 dark:text-[#d4a373]">
              <JebenaIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-900 dark:text-[#fbf5ef] leading-tight">
                Buna Baraka & Coffee Rewards (የቡና ምርቃት)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-[#a8907f]">
                Traditional Ethiopian Customer Appreciation System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white dark:bg-[#342318] text-slate-500 dark:text-[#d7beaa] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#4d3221] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bean Balance Strip */}
        <div className="px-6 py-2.5 bg-[#251810] text-[#fbf5ef] flex items-center justify-between border-b border-[#3d2719]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500/20 text-[#d4a373]">
              <CoffeeBeansIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-300">Your Roasted Coffee Beans:</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-[#d4a373]">
            <span>{beansBalance}</span>
            <span className="text-[11px] text-amber-200/70 font-sans">የተቆላ ፍሬ</span>
          </div>
        </div>

        {/* Sub-Navigation Switcher */}
        <div className="flex border-b border-slate-200 dark:border-[#382316] bg-slate-50 dark:bg-[#1a110a] p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('blessing')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
              activeTab === 'blessing'
                ? 'bg-white dark:bg-[#251810] text-amber-800 dark:text-[#d4a373] shadow-xs border border-slate-200 dark:border-[#4d3221]'
                : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Send Buna Blessing (ምርቃት)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] ${
              activeTab === 'rewards'
                ? 'bg-white dark:bg-[#251810] text-amber-800 dark:text-[#d4a373] shadow-xs border border-slate-200 dark:border-[#4d3221]'
                : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Loyalty Bean Rewards ({AVAILABLE_PERKS.length})</span>
          </button>
        </div>

        {/* Tab 1: Send Coffee Blessing */}
        {activeTab === 'blessing' && (
          <div className="p-6 space-y-5 bg-white dark:bg-[#1e130c]">
            {isBlessingSent ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-[#fbf5ef]">
                  የቡና ምርቃት ተልኳል! (Blessing Bestowed!)
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#a8907f] max-w-xs mx-auto">
                  Seller {sellerName} has received your sincere Ethiopian blessing card. You earned +{TRADITIONAL_BLESSINGS[selectedBlessingIndex].beans} Roasted Beans!
                </p>
              </div>
            ) : (
              <>
                {/* Context Header */}
                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-[#251810] border border-amber-200 dark:border-[#382316] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#342318] flex items-center justify-center text-amber-800 dark:text-[#d4a373] shrink-0">
                    <CoffeeSackIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-[#a8907f] uppercase font-bold tracking-wider">
                      Blessing Recipient:
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef] truncate">
                      {sellerName} · For "{itemTitle}"
                    </div>
                  </div>
                </div>

                {/* Blessing Cards Choice */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#d7beaa]">
                    Choose a Traditional Ethiopian Blessing:
                  </label>

                  {TRADITIONAL_BLESSINGS.map((blessing, idx) => {
                    const isSelected = selectedBlessingIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedBlessingIndex(idx)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-[#281b12] border-amber-500 dark:border-[#d4a373] shadow-xs'
                            : 'bg-white dark:bg-[#251810] border-slate-200 dark:border-[#382316] hover:border-amber-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#1b5e20] dark:border-[#d4a373] bg-[#1b5e20] dark:bg-[#d4a373] text-white dark:text-[#1e130c]'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-sm text-slate-900 dark:text-[#fbf5ef] leading-snug">
                            "{blessing.amharic}"
                          </div>
                          <div className="text-xs text-slate-500 dark:text-[#a8907f] mt-0.5 leading-relaxed">
                            {blessing.english}
                          </div>
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CoffeeBeansIcon className="w-3 h-3" />
                            <span>+{blessing.beans} Beans Awarded</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendBlessing}
                  className="w-full py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Bestow Buna Blessing & Collect Beans</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Loyalty Bean Rewards Redemption */}
        {activeTab === 'rewards' && (
          <div className="p-6 space-y-4 bg-white dark:bg-[#1e130c]">
            {redeemSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{redeemSuccess}</span>
              </div>
            )}

            <div className="space-y-3">
              {AVAILABLE_PERKS.map((perk) => {
                const isRedeemed = redeemedPerks.includes(perk.id);
                const canAfford = beansBalance >= perk.beanCost;

                return (
                  <div
                    key={perk.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#382316] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-[#fbf5ef]">
                          {perk.title}
                        </span>
                        <span className="text-[10px] font-serif text-amber-700 dark:text-[#d4a373]">
                          ({perk.titleAmharic})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#a8907f] leading-relaxed">
                        {perk.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 font-mono text-[11px] font-bold text-amber-800 dark:text-[#d4a373]">
                        <CoffeeBeansIcon className="w-3.5 h-3.5" />
                        <span>{perk.beanCost} Roasted Beans</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isRedeemed || !canAfford}
                      onClick={() => handleRedeemPerk(perk)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer min-h-[40px] flex items-center gap-1 ${
                        isRedeemed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-400'
                          : canAfford
                          ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] hover:opacity-90 shadow-xs'
                          : 'bg-slate-200 dark:bg-[#342318] text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isRedeemed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <span>Redeem</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
