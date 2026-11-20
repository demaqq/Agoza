import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Tag, X, Check, ArrowRight } from 'lucide-react';
import { CounterOfferSlider } from './CounterOfferSlider';


export const TradeOfferModal: React.FC = () => {
  const {
    isOfferModalOpen,
    setIsOfferModalOpen,
    selectedCollectible,
    formatPrice,
    submitOffer,
    currency,
  } = useMarketplace();

  const [offerPrice, setOfferPrice] = useState<number>(() => {
    return selectedCollectible ? Math.round(selectedCollectible.priceETB * 0.9) : 0;
  });
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update offer price when selectedCollectible changes
  React.useEffect(() => {
    if (selectedCollectible) {
      setOfferPrice(Math.round(selectedCollectible.priceETB * 0.9));
    }
  }, [selectedCollectible]);

  if (!isOfferModalOpen || !selectedCollectible) return null;

  const handleShortcut = (pct: number) => {
    const discounted = Math.round(selectedCollectible.priceETB * (1 - pct / 100));
    setOfferPrice(discounted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOffer({
      collectibleId: selectedCollectible.id,
      collectibleTitle: selectedCollectible.title,
      buyerName: 'You (Collector)',
      buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      buyerLocation: 'Addis Ababa',
      type: 'cash-offer',
      offerAmountETB: offerPrice,
      message: message || `Greetings, I would like to offer ${formatPrice(offerPrice)} for your "${selectedCollectible.title}".`,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOfferModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1e130c] border border-amber-900/30 dark:border-[#422919] rounded-3xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#382316] bg-slate-50 dark:bg-[#251810]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-700 dark:text-[#d4a373]" />
            <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-[#fbf5ef]">
              Customer Bargain & Offer (ዋጋ አቅርብ)
            </h3>
          </div>
          <button
            onClick={() => setIsOfferModalOpen(false)}
            className="p-1.5 rounded-xl bg-white dark:bg-[#342318] text-slate-500 dark:text-[#d7beaa] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#4d3221] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-[#1e130c]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Preview */}
              <div className="flex items-center gap-3 p-3 bg-[#251810] border border-[#382214] rounded-xl">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-amber-400/40">
                  <img
                    src={selectedCollectible.imageUrl}
                    alt={selectedCollectible.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/85 text-[7px] font-serif text-amber-300 text-center font-bold">
                    አጎዛ
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#f5f6f8] truncate">
                    {selectedCollectible.title}
                  </h4>
                  <div className="text-xs text-[#a8907f] mt-0.5">
                    Original Asking Price:{' '}
                    <span className="font-mono text-[#f5f6f8] font-bold">
                      {formatPrice(selectedCollectible.priceETB)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Counter Offer Slider with Ethiopian Bargain Math */}
              <CounterOfferSlider
                originalPriceETB={selectedCollectible.priceETB}
                currentOfferETB={offerPrice}
                onChange={setOfferPrice}
                formatPrice={formatPrice}
              />

              {/* Message to Seller */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-[#a8907f] uppercase tracking-wider mb-2">
                  Personal Note or Meetup Preference (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Greetings! I can meet at the CBE HQ Vault or Bole hub tomorrow with quick verified safe release."
                  className="w-full bg-slate-100 dark:bg-[#1a110a] border border-slate-200 dark:border-[#422919] rounded-xl p-3 text-xs text-slate-900 dark:text-[#fbf5ef] focus:outline-none focus:border-[#d4a373] resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>Submit Bargain Offer to {selectedCollectible.seller.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-slate-500 dark:text-[#9e8471] mt-2">
                  Protected under Agoza's verified physical handoff protocol. Payment held until inspection.
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-600 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-cinzel text-lg font-bold text-[#f5f6f8]">
                Offer Submitted Successfully!
              </h4>
              <p className="text-xs text-[#a8907f] max-w-xs mx-auto">
                Sent to {selectedCollectible.seller.name}. You will see this thread in your Direct Chat and Vault.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
