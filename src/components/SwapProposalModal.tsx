import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ArrowLeftRight, X, Check } from 'lucide-react';

export const SwapProposalModal: React.FC = () => {
  const {
    isSwapModalOpen,
    setIsSwapModalOpen,
    selectedCollectible,
    formatPrice,
    submitOffer,
    userListings,
  } = useMarketplace();

  const [offeredTitle, setOfferedTitle] = useState('');
  const [offeredImage, setOfferedImage] = useState('/src/assets/images/antique_ethiopian_cross_1790762204479.jpg');
  const [cashAdjustment, setCashAdjustment] = useState<number>(0);
  const [cashDirection, setCashDirection] = useState<'i-pay' | 'even' | 'seller-pays'>('even');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isSwapModalOpen || !selectedCollectible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAdjustment = cashDirection === 'even' ? 0 : cashDirection === 'i-pay' ? Math.abs(cashAdjustment) : -Math.abs(cashAdjustment);

    submitOffer({
      collectibleId: selectedCollectible.id,
      collectibleTitle: selectedCollectible.title,
      buyerName: 'You (Collector)',
      buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      buyerLocation: 'Addis Ababa',
      type: 'swap-trade',
      offeredItemTitle: offeredTitle,
      offeredItemImage: offeredImage,
      cashAdjustmentETB: finalAdjustment,
      message: message || `Greetings! Proposing a collector swap of "${offeredTitle}" with ${finalAdjustment === 0 ? 'an even exchange' : finalAdjustment > 0 ? `an additional ${formatPrice(finalAdjustment)} payment from my side` : `a ${formatPrice(Math.abs(finalAdjustment))} adjustment from your side`}.`,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSwapModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#11131c] border border-[#262939] rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#212433] bg-[#0e1017]">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <h3 className="font-cinzel text-base font-bold text-[#f5f6f8]">
              Propose Collectible Swap
            </h3>
          </div>
          <button
            onClick={() => setIsSwapModalOpen(false)}
            className="p-1.5 rounded-lg bg-[#181a24] text-[#8e94a6] hover:text-white border border-[#2a2d3e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Collectible */}
              <div className="flex items-center justify-between p-3 bg-[#151722] border border-[#232637] rounded-xl text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCollectible.imageUrl}
                    alt={selectedCollectible.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-[#6e758a] uppercase block">You Want to Receive</span>
                    <span className="font-semibold text-[#f1f2f6] line-clamp-1">{selectedCollectible.title}</span>
                    <span className="font-mono text-[#c5a059]">{formatPrice(selectedCollectible.priceETB)}</span>
                  </div>
                </div>
              </div>

              {/* What You Are Offering */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#8b91a4] uppercase tracking-wider">
                  Item You Are Offering in Swap
                </label>

                <input
                  type="text"
                  placeholder="e.g., 1968 Omega Seamaster 300 or 19th C. Harari Silver Amulet"
                  value={offeredTitle}
                  onChange={(e) => setOfferedTitle(e.target.value)}
                  className="w-full bg-[#171924] border border-[#282b3c] rounded-xl px-4 py-2.5 text-xs text-[#f2f3f6] focus:outline-none focus:border-[#c5a059]"
                  required
                />

                {/* Authentic Photo Upload for Swapped Item */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#71788c]">Photo of your offered item:</span>
                  <input
                    type="url"
                    placeholder="Photo URL or image link (https://...)"
                    value={offeredImage}
                    onChange={(e) => setOfferedImage(e.target.value)}
                    className="w-full bg-[#171924] border border-[#282b3c] rounded-xl px-4 py-2 text-xs text-[#f2f3f6] focus:outline-none focus:border-[#c5a059]"
                  />
                  {offeredImage && (
                    <div className="mt-2 w-20 h-16 rounded-lg overflow-hidden border border-[#282b3c]">
                      <img src={offeredImage} alt="Offered swap" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Cash Balancing */}
              <div>
                <label className="block text-xs font-semibold text-[#8b91a4] uppercase tracking-wider mb-2">
                  Cash Balance / Value Adjustment
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setCashDirection('even')}
                    className={`py-2 px-1 text-xs rounded-lg border text-center cursor-pointer transition-colors ${
                      cashDirection === 'even'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-[#161824] border-[#26293a] text-[#858b9f]'
                    }`}
                  >
                    Even Swap (0 Br)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashDirection('i-pay')}
                    className={`py-2 px-1 text-xs rounded-lg border text-center cursor-pointer transition-colors ${
                      cashDirection === 'i-pay'
                        ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#f5f6f8] font-semibold'
                        : 'bg-[#161824] border-[#26293a] text-[#858b9f]'
                    }`}
                  >
                    + I Pay Difference
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashDirection('seller-pays')}
                    className={`py-2 px-1 text-xs rounded-lg border text-center cursor-pointer transition-colors ${
                      cashDirection === 'seller-pays'
                        ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#f5f6f8] font-semibold'
                        : 'bg-[#161824] border-[#26293a] text-[#858b9f]'
                    }`}
                  >
                    - Seller Pays Difference
                  </button>
                </div>

                {cashDirection !== 'even' && (
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={cashAdjustment}
                      onChange={(e) => setCashAdjustment(Number(e.target.value))}
                      placeholder="Cash adjustment in Br"
                      className="w-full bg-[#171924] border border-[#282b3c] rounded-xl px-4 py-2.5 text-sm font-mono text-[#f5f6f8] focus:outline-none focus:border-[#c5a059]"
                      required
                    />
                    <div className="absolute right-4 top-2.5 text-xs text-[#8c92a6] font-mono">
                      ≈ {formatPrice(cashAdjustment)}
                    </div>
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-[#8b91a4] uppercase tracking-wider mb-2">
                  Proposal Note
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding condition, original papers, or preferred inspection hub..."
                  className="w-full bg-[#171924] border border-[#282b3c] rounded-xl p-3 text-xs text-[#f2f3f6] focus:outline-none focus:border-[#c5a059] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Send Swap Proposal</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-600 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-cinzel text-lg font-bold text-[#f5f6f8]">
                Swap Proposal Transmitted
              </h4>
              <p className="text-xs text-[#8c92a6] max-w-xs mx-auto">
                The seller has been notified of your trade offer. Both items will undergo verified inspection at the safe hub if agreed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
