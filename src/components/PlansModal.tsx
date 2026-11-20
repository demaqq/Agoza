import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SUBSCRIPTION_PLANS } from '../data/plansData';
import { PlanTier } from '../types';
import {
Check,
  X,
  Crown,
  Zap,
  ShieldCheck,
  CreditCard,
  Phone,
  Building,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

export const PlansModal: React.FC = () => {
  const {
    isPlansModalOpen,
    setIsPlansModalOpen,
    userPlan,
    subscribeToPlan,
    formatPrice,
  } = useMarketplace();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe' | 'chapa' | 'awash'>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('+251 91 199 8877');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activatedPlanName, setActivatedPlanName] = useState('');

  if (!isPlansModalOpen) return null;

  const handleStartUpgrade = (planId: PlanTier) => {
    if (planId === userPlan) return;
    if (planId === 'free') {
      subscribeToPlan('free');
      setIsPlansModalOpen(false);
      return;
    }
    setSelectedPlanForCheckout(planId);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlanForCheckout) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const res = subscribeToPlan(selectedPlanForCheckout, paymentMethod.toUpperCase());
      setActivatedPlanName(res.message);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForCheckout(null);
        setIsPlansModalOpen(false);
      }, 2000);
    }, 1200);
  };

  const checkoutPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanForCheckout);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-black shrink-0">
              <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-[#f5f6f8]">
                  Agoza Seller Plans & Pricing (እቅዶች)
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  ETB / ብር
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent monthly plans for sellers and merchants across Ethiopia.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedPlanForCheckout(null);
              setIsPlansModalOpen(false);
            }}
            className="p-1.5 rounded-xl bg-white dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#5a3a24] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 space-y-8">
          {/* CHECKOUT STEP MODAL IF UPGRADING */}
          {selectedPlanForCheckout && checkoutPlan && (
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-[#2d1c12] border-2 border-amber-400/80 shadow-lg space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-amber-200 dark:border-[#473020] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Upgrade to {checkoutPlan.name} ({checkoutPlan.nameAmharic})
                    </h4>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Amount Due: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-sm">{formatPrice(checkoutPlan.priceETB)} / month</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Ethiopian Payment Provider:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telebirr')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'telebirr'
                        ? 'border-[#0072ce] bg-[#0072ce]/10 text-slate-900 dark:text-white ring-2 ring-[#0072ce]'
                        : 'border-slate-200 dark:border-[#5a3a24] bg-white dark:bg-[#1a1009] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Telebirr (ቴሌብር)</span>
                      <Phone className="w-3.5 h-3.5 text-[#0072ce]" />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Instant Activation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cbe')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'cbe'
                        ? 'border-[#7b1480] bg-[#7b1480]/10 text-slate-900 dark:text-white ring-2 ring-[#7b1480]'
                        : 'border-slate-200 dark:border-[#5a3a24] bg-white dark:bg-[#1a1009] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">CBE Birr (ሲቢኢ)</span>
                      <Building className="w-3.5 h-3.5 text-[#7b1480]" />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Commercial Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('chapa')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'chapa'
                        ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500'
                        : 'border-slate-200 dark:border-[#5a3a24] bg-white dark:bg-[#1a1009] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Chapa / Card</span>
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Visa & Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('awash')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'awash'
                        ? 'border-amber-600 bg-amber-600/10 text-slate-900 dark:text-white ring-2 ring-amber-600'
                        : 'border-slate-200 dark:border-[#5a3a24] bg-white dark:bg-[#1a1009] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Awash Birr</span>
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Awash Bank App</span>
                  </button>
                </div>
              </div>

              {/* Phone / Account input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Billing Phone Number / Wallet Account:
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+251 9... / 09..."
                  className="w-full sm:w-80 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-[#5a3a24] bg-white dark:bg-[#1e130c] text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Processing Payment via {paymentMethod.toUpperCase()}...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Activate {checkoutPlan.name} ({formatPrice(checkoutPlan.priceETB)})</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="py-3 px-4 bg-white dark:bg-[#2d1c12] text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-300 dark:border-[#5a3a24] hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {paymentSuccess && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{activatedPlanName || 'Plan activated successfully!'}</span>
                </div>
              )}
            </div>
          )}

          {/* 3 PLAN TIERS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = userPlan === plan.id;
              const isPro = plan.id === 'pro';
              const isStarter = plan.id === 'starter';

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPro
                      ? 'bg-gradient-to-b from-[#382214] to-[#1a1009] border-2 border-amber-400 text-white shadow-xl shadow-amber-400/10'
                      : isStarter
                      ? 'bg-white dark:bg-[#2d1c12] border-2 border-[#1b5e20] dark:border-[#c5a059] shadow-lg'
                      : 'bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] text-slate-900 dark:text-white'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isPro
                          ? 'bg-amber-400 text-slate-950'
                          : isStarter
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {plan.badge}
                    </span>

                    {plan.popular && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Recommended</span>
                      </span>
                    )}

                    {isPro && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950 border border-amber-500/60 px-2 py-0.5 rounded-full font-mono">
                        <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Full Features</span>
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Price */}
                  <div>
                    <h4 className="text-xl font-bold font-cinzel text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <p className="text-xs font-serif text-slate-500 dark:text-slate-400 mt-0.5">
                      {plan.nameAmharic}
                    </p>

                    <div className="mt-4 mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                          {plan.priceETB === 0 ? '0 Br' : formatPrice(plan.priceETB)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {plan.priceETB === 0 ? 'free forever' : '/ month'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {plan.headline}
                      </p>
                    </div>

                    {/* Key Limits Overview */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#140c07] border border-slate-100 dark:border-[#473020] space-y-1.5 mb-5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Active Listings:</span>
                        <strong className="text-slate-900 dark:text-white">
                          {plan.maxListings === 'Unlimited' ? 'Unlimited' : `${plan.maxListings} Listings`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Photos per Ad:</span>
                        <strong className="text-slate-900 dark:text-white">
                          {plan.maxPhotosPerListing} Photos
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Protection Fee:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {plan.commissionEscrowRate === 0 ? '0% Free' : `${plan.commissionEscrowRate}%`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Visibility:</span>
                        <strong className="text-amber-600 dark:text-amber-400">
                          {plan.visibilityBoost}
                        </strong>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-6 text-xs">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Features Included:
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {feat.included ? (
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feat.included
                                ? feat.highlight
                                  ? 'font-bold text-slate-900 dark:text-white'
                                  : 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 dark:text-slate-600 line-through'
                            }
                          >
                            {feat.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan CTA Button */}
                  <div className="pt-2">
                    {isCurrent ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-[#473020] text-slate-700 dark:text-slate-300 font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-default">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Your Current Active Plan</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartUpgrade(plan.id)}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                          isPro
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                            : isStarter
                            ? 'bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c]'
                            : 'bg-white dark:bg-[#251810] hover:bg-slate-100 dark:hover:bg-[#473020] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#5a3a24]'
                        }`}
                      >
                        {isPro ? (
                          <>
                            <Crown className="w-4 h-4" />
                            <span>Upgrade to Pro (1,499 Br/mo)</span>
                          </>
                        ) : isStarter ? (
                          <>
                            <Zap className="w-4 h-4" />
                            <span>Upgrade to Starter (699 Br/mo)</span>
                          </>
                        ) : (
                          <span>Switch to Free Plan</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DETAILED COMPARISON TABLE */}
          <div className="bg-slate-50 dark:bg-[#251810] rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-[#473020] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Feature-by-Feature Comparison Matrix
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compare all features across Free, Starter (699 Br/mo), and Pro (1,499 Br/mo).
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">Agoza Policy Protected</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#473020] text-slate-500 font-mono">
                    <th className="py-2.5 pr-4">Features</th>
                    <th className="py-2.5 px-3">Free (0 Br)</th>
                    <th className="py-2.5 px-3 text-[#1b5e20] dark:text-[#c5a059] font-bold">Starter (699 Br/mo)</th>
                    <th className="py-2.5 px-3 text-amber-500 font-bold">Pro (1,499 Br/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#473020] text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Active Classified Listings</td>
                    <td className="py-2.5 px-3 font-mono">3 Listings</td>
                    <td className="py-2.5 px-3 font-mono font-bold">15 Listings</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Photos per Item</td>
                    <td className="py-2.5 px-3 font-mono">1 Photo</td>
                    <td className="py-2.5 px-3 font-mono font-bold">4 Photos</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">10 Photos (HD)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Official Agoza Verified Stamping</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">✓ Standard</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ Included</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">✓ Pro Security Stamp</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Seller Trust Badge</td>
                    <td className="py-2.5 px-3 text-slate-400">—</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">✓ Verified Trader</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">👑 Pro Merchant Gold</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Marketplace Visibility Boost</td>
                    <td className="py-2.5 px-3 text-slate-500">Standard</td>
                    <td className="py-2.5 px-3 font-bold text-[#1b5e20] dark:text-[#c5a059]">2x Category Boost</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">5x Top Homepage Spotlight</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Protection Fee Rate</td>
                    <td className="py-2.5 px-3 font-mono">2.5%</td>
                    <td className="py-2.5 px-3 font-mono font-bold">1.5% (Discounted)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">0% (Zero Fee)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Price Intelligence & Suggestions</td>
                    <td className="py-2.5 px-3 text-slate-500">Basic</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">✓ Full Auto-Suggestions</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">✓ Real-Time Arbitrage</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">SMS & Telegram Instant Alerts</td>
                    <td className="py-2.5 px-3 text-slate-400">—</td>
                    <td className="py-2.5 px-3 font-mono">50 Alerts / mo</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Support Service Level</td>
                    <td className="py-2.5 px-3 text-slate-500">Community</td>
                    <td className="py-2.5 px-3">Priority Email (4h)</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">24/7 Dedicated VIP Phone</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pay safely with Telebirr, CBE Birr, Chapa, or Awash Bank. Cancel or switch plans anytime.</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlansModalOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-[#473020] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
