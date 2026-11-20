import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SUBSCRIPTION_PLANS } from '../data/plansData';
import { PlanTier } from '../types';
import {
Check,
  X,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  Phone,
  Building,
  CreditCard,
  CheckCircle2,
  Flame,
  HelpCircle,
} from 'lucide-react';

export const PlansView: React.FC = () => {
  const {
    userPlan,
    subscribeToPlan,
    formatPrice,
    setActiveView,
    setIsListModalOpen,
  } = useMarketplace();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe' | 'chapa' | 'awash'>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('+251 91 199 8877');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activatedMsg, setActivatedMsg] = useState('');

  const handleStartUpgrade = (planId: PlanTier) => {
    if (planId === userPlan) return;
    if (planId === 'free') {
      subscribeToPlan('free');
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
      setActivatedMsg(res.message);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForCheckout(null);
      }, 2500);
    }, 1200);
  };

  const checkoutPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanForCheckout);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Agoza Classifieds & Protection Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-slate-900 dark:text-[#f5f6f8]">
          Find the Right Plan for Your Trade Journey
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          From casual peer-to-peer sellers to high-volume merchants, Agoza offers transparent monthly plans with instant Telebirr & CBE Birr activation.
        </p>

        {/* Current Active Plan Pill */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Your current active plan:</span>
          <span className="font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
            {userPlan} Plan Active
          </span>
        </div>
      </div>

      {/* Checkout Drawer/Card if Active */}
      {selectedPlanForCheckout && checkoutPlan && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-amber-50 dark:bg-[#2d1c12] border-2 border-amber-400 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-[#473020] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upgrade to {checkoutPlan.name} ({checkoutPlan.nameAmharic})
                </h3>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Rate: <strong className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{formatPrice(checkoutPlan.priceETB)} / month</strong>
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

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Choose Payment Method:
            </label>
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
                  <span className="font-bold text-xs">Telebirr</span>
                  <Phone className="w-3.5 h-3.5 text-[#0072ce]" />
                </div>
                <span className="text-[10px] text-slate-500 block">Instant</span>
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
                  <span className="font-bold text-xs">CBE Birr</span>
                  <Building className="w-3.5 h-3.5 text-[#7b1480]" />
                </div>
                <span className="text-[10px] text-slate-500 block">CBE App</span>
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
                  <span className="font-bold text-xs">Chapa</span>
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500 block">Visa/Master</span>
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
                <span className="text-[10px] text-slate-500 block">Awash App</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Billing Phone / Account:
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full sm:w-80 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-[#5a3a24] bg-white dark:bg-[#1e130c] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="flex-1 py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Confirming Transaction...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate {checkoutPlan.name} ({formatPrice(checkoutPlan.priceETB)})</span>
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
              <span>{activatedMsg || 'Plan upgraded successfully!'}</span>
            </div>
          )}
        </div>
      )}

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = userPlan === plan.id;
          const isPro = plan.id === 'pro';
          const isStarter = plan.id === 'starter';

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-gradient-to-b from-[#382214] to-[#1a1009] border-2 border-amber-400 text-white shadow-2xl shadow-amber-400/10'
                  : isStarter
                  ? 'bg-white dark:bg-[#2d1c12] border-2 border-[#1b5e20] dark:border-[#c5a059] shadow-xl'
                  : 'bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] text-slate-900 dark:text-white'
              }`}
            >
              <div>
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

                <h3 className="text-2xl font-bold font-cinzel text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-xs font-serif text-slate-500 dark:text-slate-400 mt-0.5">
                  {plan.nameAmharic}
                </p>

                <div className="mt-5 mb-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {plan.priceETB === 0 ? '0 Br' : formatPrice(plan.priceETB)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {plan.priceETB === 0 ? 'free forever' : '/ month'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {plan.headline}
                  </p>
                </div>

                {/* Plan Highlights Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#140c07] border border-slate-100 dark:border-[#473020] space-y-2 mb-6 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Listings:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {plan.maxListings === 'Unlimited' ? 'Unlimited' : `${plan.maxListings} Listings`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Photos per Listing:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {plan.maxPhotosPerListing} Photos
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protection Fee Rate:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {plan.commissionEscrowRate === 0 ? '0% Free' : `${plan.commissionEscrowRate}%`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Feed Visibility:</span>
                    <strong className="text-amber-600 dark:text-amber-400">
                      {plan.visibilityBoost}
                    </strong>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-8 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Features Included:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
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

              {/* Action Button */}
              <div className="pt-2">
                {isCurrent ? (
                  <div className="w-full py-3 px-4 rounded-xl bg-slate-200 dark:bg-[#473020] text-slate-700 dark:text-slate-300 font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-default">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Your Current Active Plan</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartUpgrade(plan.id)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
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
                      <span>Switch to Free Forever</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs & Protection Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#251810] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#473020]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#1b5e20] dark:text-[#c5a059]" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <strong className="block text-slate-800 dark:text-slate-200 mb-0.5">
                Can I upgrade or downgrade anytime?
              </strong>
              <p>Yes. You can switch between Free, Starter (699 Br/mo), and Pro (1,499 Br/mo) at any time. Changes apply immediately.</p>
            </div>
            <div>
              <strong className="block text-slate-800 dark:text-slate-200 mb-0.5">
                How are my photos protected?
              </strong>
              <p>Every photo uploaded is digitally authenticated with the official Agoza emblem stamp and verified. Photos opened in full view allow clear buyer inspection while protecting seller content.</p>
            </div>
            <div>
              <strong className="block text-slate-800 dark:text-slate-200 mb-0.5">
                How do I pay with Telebirr or CBE Birr?
              </strong>
              <p>Simply enter your mobile number or wallet ID. You'll receive an instant confirmation and your account is instantly upgraded.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#382214] border border-amber-300 dark:border-[#473020] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Agoza Buyer & Seller Protection Guarantee</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              All transactions conducted via Agoza Safe Hub protocol hold buyer funds in security until physical inspection is verified by an official safe hub agent in Addis Ababa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsListModalOpen(true)}
              className="flex-1 py-3 px-4 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer text-center"
            >
              + Post Classified Ad Now
            </button>
            <button
              onClick={() => setActiveView('marketplace')}
              className="py-3 px-4 bg-slate-100 dark:bg-[#251810] text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-[#473020] cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
