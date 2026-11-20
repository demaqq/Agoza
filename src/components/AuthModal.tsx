import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Send,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { ETHIOPIAN_CITIES } from '../data/citiesData';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
}) => {
  const { currentUser, signup, login, t } = useMarketplace();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToProtectionTerms, setAgreedToProtectionTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Please enter your phone number (+251...).');
        setIsSubmitting(false);
        return;
      }
      if (!city) {
        setErrorMsg('Please select your city within Ethiopia.');
        setIsSubmitting(false);
        return;
      }
      if (!telegramUsername.trim()) {
        setErrorMsg('Please provide your Telegram username (@yourhandle).');
        setIsSubmitting(false);
        return;
      }

      const cleanTelegram = telegramUsername.startsWith('@')
        ? telegramUsername.trim()
        : `@${telegramUsername.trim()}`;

      const res = await signup({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city,
        telegramUsername: cleanTelegram,
        password,
      });

      if (res.success) {
        setSuccessMsg('Account created successfully! Check your email to verify, then sign in.');
        setTimeout(() => {
          setMode('signin');
          setIsSubmitting(false);
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
        setIsSubmitting(false);
      }
    } else {
      // Sign in mode
      if (!email.trim()) {
        setErrorMsg('Please enter your email or phone number.');
        setIsSubmitting(false);
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password.');
        setIsSubmitting(false);
        return;
      }

      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#262939] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#212433] bg-slate-50 dark:bg-[#0e1017] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
              <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {mode === 'signup' ? 'Create Trader Account' : 'Welcome Back to Agoza'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8b92a6]">
                {mode === 'signup'
                  ? 'Join verified Ethiopian buyers & sellers with buyer protection'
                  : 'Sign in to manage your listings, bids, and verified trades'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#191c28] text-slate-600 dark:text-[#8e94a6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#2b2e40] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-[#1a1009] border-b border-slate-200 dark:border-[#202332] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#232738] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-[#7f869a] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ✨ Sign Up (New Trader)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#232738] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-[#7f869a] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔐 Sign In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name (ሙሉ ስም) <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Bikila"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* City Selection (Ethiopian Cities Dropdown) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Your City in Ethiopia (ከተማ) <span className="text-amber-500">*</span></span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Ethiopia Only</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-amber-500 absolute left-3.5 pointer-events-none" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059] appearance-none cursor-pointer font-medium"
                  >
                    {ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.name} className="bg-white dark:bg-[#251810] text-slate-900 dark:text-white py-1">
                        {c.name} ({c.amharic}) — {c.region}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">▼</span>
                </div>
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Telegram Username (ቴሌግራም) <span className="text-amber-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">For instant trade alerts</span>
                </label>
                <div className="relative flex items-center">
                  <Send className="w-4 h-4 text-blue-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="@your_telegram_username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Used by Agoza to notify you of cash offers, swaps, and verified inspections on Telegram.
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number (ስልክ ቁጥር) <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+251 91 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address (ኢሜይል) <span className="text-amber-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password (የይለፍ ቃል) <span className="text-amber-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#26293a] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Agoza Trust & Buyer Protection Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                By creating an account, you agree to trade responsibly at designated Safe Hubs (CBE Vault Zone, Bole Medhanialem) with 100% funds protection.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : mode === 'signup' ? (
              <>
                <span>Complete Sign Up & Join Agoza</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#0e1017] border-t border-slate-100 dark:border-[#202332] text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signup' ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                Create Account Free
              </button>
              {' · '}
              <button
                type="button"
                onClick={async () => {
                  if (!email.trim() || !email.includes('@')) {
                    setErrorMsg('Enter your email above to reset your password.');
                    return;
                  }
                  setIsSubmitting(true);
                  const { resetPassword } = await import('../firebase/authLazy');
                  const res = await resetPassword(email.trim());
                  if (res.success) {
                    setSuccessMsg('Password reset link sent to your email.');
                  } else {
                    setErrorMsg(res.error || 'Could not send reset email.');
                  }
                  setIsSubmitting(false);
                }}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
