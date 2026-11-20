import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAFE_HUBS } from '../data/mockData';
import { ShieldCheck, X, Check, Lock, Building2, Truck, Key } from 'lucide-react';

export const EscrowCheckoutModal: React.FC = () => {
  const {
    isEscrowModalOpen,
    setIsEscrowModalOpen,
    selectedCollectible,
    formatPrice,
    createEscrowOrder,
  } = useMarketplace();

  const [handoffMethod, setHandoffMethod] = useState<'safe-hub-meetup' | 'secure-escrow-courier'>(
    'safe-hub-meetup'
  );
  const [selectedHub, setSelectedHub] = useState(SAFE_HUBS[0]?.name || 'CBE Main Tower Hub (Bole)');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe-birr' | 'bank-wire' | 'card'>('telebirr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [inspectionCode, setInspectionCode] = useState<string | null>(null);

  if (!isEscrowModalOpen || !selectedCollectible) return null;

  const handleConfirmEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = createEscrowOrder({
        collectibleId: selectedCollectible.id,
        collectibleTitle: selectedCollectible.title,
        collectibleImage: selectedCollectible.imageUrl,
        priceETB: selectedCollectible.priceETB,
        sellerId: selectedCollectible.seller.id,
        sellerName: selectedCollectible.seller.name,
        buyerId: 'buyer-me',
        buyerName: 'Dawit Bekele',
        handoffMethod,
        selectedHub,
        paymentMethod,
      });

      setConfirmedOrderId(orderId);
      setInspectionCode('AGOZA-9921-VERIFIED');
      setIsProcessing(false);
    }, 1200);
  };

  const handleClose = () => {
    setIsEscrowModalOpen(false);
    setConfirmedOrderId(null);
    setInspectionCode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#262939] rounded-2xl shadow-2xl overflow-hidden my-auto transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#212433] bg-slate-50 dark:bg-[#0e1017]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1b5e20] dark:text-[#c5a059]" />
            <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-[#f5f6f8]">
              {confirmedOrderId ? 'Buyer Protection Activated' : 'Secure Purchase & Buyer Safeguard'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#251810] text-slate-600 dark:text-[#8e94a6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#2a2d3e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!confirmedOrderId ? (
            <div className="space-y-6">
              {/* Item Summary */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-[#151722] border border-slate-200 dark:border-[#382214] rounded-xl">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-amber-400/40">
                  <img
                    src={selectedCollectible.imageUrl}
                    alt={selectedCollectible.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-cinzel text-amber-300 text-center font-bold">
                    Agoza
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-[#f5f6f8] truncate">
                    {selectedCollectible.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#81879c] mt-0.5">
                    <span>Seller: {selectedCollectible.seller.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1b5e20] dark:text-[#c5a059] font-mono font-bold">
                      {formatPrice(selectedCollectible.priceETB)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Step Guarantee Visual */}
              <div className="bg-slate-50 dark:bg-[#161926] border border-slate-200 dark:border-[#272b3d] rounded-xl p-4">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#1b5e20] dark:text-[#c5a059] mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>How Agoza Buyer Safeguard Protects You</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020]">
                    <span className="font-mono text-xs font-bold text-[#1b5e20] dark:text-[#c5a059] block mb-1">01. Safe Hold</span>
                    <p className="text-[11px] text-slate-600 dark:text-[#8a91a4]">Funds are held securely by Agoza Trust; seller is not paid upfront.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020]">
                    <span className="font-mono text-xs font-bold text-[#1b5e20] dark:text-[#c5a059] block mb-1">02. Physical Inspection</span>
                    <p className="text-[11px] text-slate-600 dark:text-[#8a91a4]">Inspect item at verified safe hub or upon courier arrival with your private code.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020]">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-[#48bb78] block mb-1">03. Approval</span>
                    <p className="text-[11px] text-slate-600 dark:text-[#8a91a4]">Funds only released when you confirm physical authenticity and complete satisfaction.</p>
                  </div>
                </div>
              </div>

              {/* Handoff Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-2">
                  Select Safe Handoff Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHandoffMethod('safe-hub-meetup')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      handoffMethod === 'safe-hub-meetup'
                        ? 'bg-amber-50/60 dark:bg-[#1b1e2d] border-[#1b5e20] dark:border-[#c5a059] text-slate-900 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-[#141620] border-slate-200 dark:border-[#252837] text-slate-600 dark:text-[#8b91a4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-[#f1f2f6] mb-1">
                      <Building2 className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
                      <span>Safe Hub Meetup</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#767d91]">Meet at verified bank tower or partner business hub.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHandoffMethod('secure-escrow-courier')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      handoffMethod === 'secure-escrow-courier'
                        ? 'bg-amber-50/60 dark:bg-[#1b1e2d] border-[#1b5e20] dark:border-[#c5a059] text-slate-900 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-[#141620] border-slate-200 dark:border-[#252837] text-slate-600 dark:text-[#8b91a4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-[#f1f2f6] mb-1">
                      <Truck className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
                      <span>Verified Courier Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#767d91]">Secure doorstep courier with inspection window.</p>
                  </button>
                </div>
              </div>

              {/* Hub Selection if Meetup */}
              {handoffMethod === 'safe-hub-meetup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-2">
                    Verified Safe Hub Location
                  </label>
                  <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  >
                    {SAFE_HUBS.map((hub) => (
                      <option key={hub.id} value={hub.name} className="bg-white dark:bg-[#171924] text-slate-900 dark:text-white">
                        {hub.name} ({hub.city} - {hub.area})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-2">
                  Deposit Protected Funds via
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'telebirr', name: 'Telebirr', sub: 'Instant' },
                    { id: 'cbe-birr', name: 'CBE Birr', sub: 'Instant' },
                    { id: 'bank-wire', name: 'Bank Transfer', sub: 'Direct' },
                    { id: 'card', name: 'Credit/Debit', sub: 'Global' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                        paymentMethod === p.id
                          ? 'bg-[#1b5e20]/15 dark:bg-[#c5a059]/20 border-[#1b5e20] dark:border-[#c5a059] text-slate-900 dark:text-[#f5f6f8] font-bold'
                          : 'bg-slate-50 dark:bg-[#151722] border-slate-200 dark:border-[#262939] text-slate-600 dark:text-[#83899d] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="block font-medium truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#6d7386]">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-slate-50 dark:bg-[#141620] border border-slate-200 dark:border-[#212433] rounded-xl p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600 dark:text-[#8b91a4]">
                  <span>Item Subtotal:</span>
                  <span>{formatPrice(selectedCollectible.priceETB)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-[#8b91a4]">
                  <span>Buyer Safeguard Fee (1.5%):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Covered by Promotion (0 Br)</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-[#f5f6f8] font-bold pt-2 border-t border-slate-200 dark:border-[#202332] text-sm">
                  <span>Total Protected Deposit:</span>
                  <span className="text-[#1b5e20] dark:text-[#c5a059]">{formatPrice(selectedCollectible.priceETB)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleConfirmEscrow}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] active:bg-[#1b5e20] text-white dark:text-[#1e130c] font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Securing Protected Funds...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Deposit {formatPrice(selectedCollectible.priceETB)} with Buyer Safeguard</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Confirmation View */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="font-cinzel text-xl font-bold text-slate-900 dark:text-[#f5f6f8] mb-1">
                  Payment Successfully Secured & Protected
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#8c92a6] max-w-md mx-auto">
                  The funds are locked safely in the Agoza vault. The seller ({selectedCollectible.seller.name}) has been notified to meet at your chosen safe hub.
                </p>
              </div>

              {/* Inspection Token Card */}
              <div className="bg-slate-50 dark:bg-[#181b29] border border-slate-200 dark:border-[#2f344a] rounded-xl p-5 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[#8c92a6] mb-2">
                  <span className="flex items-center gap-1.5 text-[#1b5e20] dark:text-[#c5a059] font-bold">
                    <Key className="w-3.5 h-3.5" /> Private Inspection Code
                  </span>
                  <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">DO NOT SHARE BEFORE INSPECTION</span>
                </div>
                <div className="font-mono text-xl font-bold text-center py-2.5 bg-white dark:bg-[#0e1017] rounded-lg border border-slate-200 dark:border-[#473020] text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {inspectionCode}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#787f94] mt-3">
                  Only provide this code to the seller once you have physically held, appraised, and verified the item at the safe meetup hub.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                >
                  Done & View Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
