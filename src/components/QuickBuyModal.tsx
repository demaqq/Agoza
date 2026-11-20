import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Zap,
  X,
  Check,
  ShieldCheck,
  MapPin,
  Lock,
  Building2,
  Smartphone,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { SAFE_HUBS } from '../data/mockData';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

export const QuickBuyModal: React.FC = () => {
  const {
    isQuickBuyOpen,
    setIsQuickBuyOpen,
    quickBuyItem,
    formatPrice,
    createEscrowOrder,
    currentUser,
    setIsChatOpen,
    setActiveView,
  } = useMarketplace();

  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe-birr' | 'card'>('telebirr');
  const [selectedHub, setSelectedHub] = useState<string>(SAFE_HUBS[0]?.name || 'CBE Main Tower Hub (Bole)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    inspectionPin: string;
  } | null>(null);

  useEffect(() => {
    if (isQuickBuyOpen) {
      document.body.style.overflow = 'hidden';
      setOrderConfirmed(null);
      setIsProcessing(false);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickBuyOpen) {
        setIsQuickBuyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isQuickBuyOpen, setIsQuickBuyOpen]);

  if (!isQuickBuyOpen || !quickBuyItem) return null;

  const handleExecuteQuickBuy = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = createEscrowOrder({
        collectibleId: quickBuyItem.id,
        collectibleTitle: quickBuyItem.title,
        collectibleImage: quickBuyItem.imageUrl,
        priceETB: quickBuyItem.priceETB,
        sellerId: quickBuyItem.seller.id,
        sellerName: quickBuyItem.seller.name,
        buyerId: currentUser?.id || 'usr-buyer-quick',
        buyerName: currentUser?.name || 'You (Verified Buyer)',
        handoffMethod: 'safe-hub-meetup',
        selectedHub,
        paymentMethod: paymentMethod === 'telebirr' ? 'telebirr' : paymentMethod === 'cbe-birr' ? 'cbe-birr' : 'card',
      });

      const pin = `AGZ-${Math.floor(1000 + Math.random() * 9000)}-ESCROW`;
      setOrderConfirmed({ orderId, inspectionPin: pin });
      setIsProcessing(false);

      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([40, 60, 40]);
        }
      } catch {
        // ignore
      }
    }, 700);
  };

  const handleClose = () => {
    setIsQuickBuyOpen(false);
    setOrderConfirmed(null);
  };

  const handleGoToDashboard = () => {
    setIsQuickBuyOpen(false);
    setActiveView('user-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#fffdf7] dark:bg-[#1e130c] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-200/80 dark:border-[#382214] overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-amber-200/80 dark:border-[#382214] bg-white dark:bg-[#251810] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/15 dark:bg-amber-400/20 flex items-center justify-center text-amber-700 dark:text-[#d4a373]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#fbf5ef] flex items-center gap-1.5">
                <span>Quick Buy</span>
                <span className="text-[10px] font-mono font-normal uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  1-Tap Escrow
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-[#a8907f]">
                Fast, secure checkout backed by CBE Trust
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!orderConfirmed ? (
            <>
              {/* Product Preview Card */}
              <div className="p-3 rounded-2xl bg-white dark:bg-[#251810] border border-slate-200/80 dark:border-[#3a2315] flex items-center gap-3 shadow-2xs">
                <img
                  src={quickBuyItem.imageUrl}
                  alt={quickBuyItem.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200/70 dark:border-[#473020] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#d4a373] block truncate">
                    {quickBuyItem.category.replace('-', ' ')} · {quickBuyItem.condition}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#fbf5ef] truncate">
                    {quickBuyItem.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-[#b89f8b]">
                    <span>Seller: {quickBuyItem.seller.name}</span>
                    <span>★ {quickBuyItem.seller.rating}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-extrabold font-mono text-[#1b5e20] dark:text-[#d4a373]">
                    {formatPrice(quickBuyItem.priceETB)}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">
                    0 Br Escrow Fee
                  </span>
                </div>
              </div>

              {/* Saved Payment Method Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-[#e4d2c3] mb-2 uppercase tracking-wider">
                  Saved Payment Method (One-Tap)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Telebirr */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telebirr')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'telebirr'
                        ? 'bg-amber-50 dark:bg-[#342115] border-[#1b5e20] dark:border-[#d4a373] ring-1 ring-[#1b5e20] dark:ring-[#d4a373]'
                        : 'bg-white dark:bg-[#251810] border-slate-200 dark:border-[#382214] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {paymentMethod === 'telebirr' && (
                        <Check className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef]">Telebirr</div>
                    <div className="text-[10px] text-slate-500 font-mono">0911 •••• 77</div>
                  </button>

                  {/* CBE Birr */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cbe-birr')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'cbe-birr'
                        ? 'bg-amber-50 dark:bg-[#342115] border-[#1b5e20] dark:border-[#d4a373] ring-1 ring-[#1b5e20] dark:ring-[#d4a373]'
                        : 'bg-white dark:bg-[#251810] border-slate-200 dark:border-[#382214] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building2 className="w-4 h-4 text-amber-600 dark:text-[#d4a373]" />
                      {paymentMethod === 'cbe-birr' && (
                        <Check className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef]">CBE Birr</div>
                    <div className="text-[10px] text-slate-500 font-mono">•••• 4892</div>
                  </button>

                  {/* Saved Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-amber-50 dark:bg-[#342115] border-[#1b5e20] dark:border-[#d4a373] ring-1 ring-[#1b5e20] dark:ring-[#d4a373]'
                        : 'bg-white dark:bg-[#251810] border-slate-200 dark:border-[#382214] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      {paymentMethod === 'card' && (
                        <Check className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef]">Saved Card</div>
                    <div className="text-[10px] text-slate-500 font-mono">Visa •• 3192</div>
                  </button>
                </div>
              </div>

              {/* Verified Safe Hub Destination */}
              <div className="p-3 rounded-2xl bg-white dark:bg-[#251810] border border-slate-200/80 dark:border-[#382214] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#fbf5ef]">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4a373]" />
                    <span>In-Person Exchange Station</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                    CBE Officer Stationed
                  </span>
                </div>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 dark:bg-[#1a1009] border border-slate-200 dark:border-[#422919] rounded-xl px-3 py-2 text-slate-800 dark:text-[#e5d4c5] focus:outline-none"
                >
                  {SAFE_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.name}>
                      {hub.name} ({hub.city})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 dark:text-[#a8907f]">
                  Funds stay safely in escrow until you physically test and approve the item at the hub.
                </p>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] leading-snug">
                  <strong>Zero-Risk Buyer Protection:</strong> Instant refund if condition doesn&apos;t match.
                </span>
              </div>

              {/* 1-Tap Quick Buy Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecuteQuickBuy}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white dark:border-black/40 dark:border-t-black rounded-full animate-spin" />
                      <span>Locking Escrow Funds...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>1-Tap Buy Now · {formatPrice(quickBuyItem.priceETB)}</span>
                    </>
                  )}
                </button>
                <div className="mt-2 text-center text-[10px] text-slate-400 dark:text-[#88776b] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-bit encrypted escrow holding with Commercial Bank of Ethiopia</span>
                </div>
              </div>
            </>
          ) : (
            /* Order Success State */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Escrow Locked Successfully!
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Your Deal is Secured
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#a8907f] max-w-sm mx-auto mt-1">
                  Funds for &ldquo;{quickBuyItem.title}&rdquo; are held in safe escrow until your in-person inspection.
                </p>
              </div>

              {/* Inspection PIN Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#27180e] border border-amber-300 dark:border-[#473020] max-w-sm mx-auto text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-800 dark:text-[#d4a373] uppercase tracking-wider">
                  In-Person Inspection PIN (ማረጋገጫ ኮድ)
                </span>
                <div className="text-xl font-mono font-extrabold text-[#1b5e20] dark:text-[#d4a373] tracking-widest">
                  {orderConfirmed.inspectionPin}
                </div>
                <p className="text-[10px] text-slate-500">
                  Show this PIN to the CBE Safe Hub agent when receiving your item.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#251810] dark:hover:bg-[#342115] text-slate-800 dark:text-[#f1f2f6] text-xs font-bold cursor-pointer transition-colors"
                >
                  Track in Vault
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setIsChatOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Seller</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
