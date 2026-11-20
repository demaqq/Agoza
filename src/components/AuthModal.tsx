import React, { useEffect, useState } from 'react';
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
  const { signup, login, t } = useMarketplace();
  const a = t.auth;
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The modal stays mounted, so re-sync the requested mode and clear stale
  // messages every time it opens.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(false);
    setPassword('');
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg(a.errName);
        setIsSubmitting(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg(a.errEmail);
        setIsSubmitting(false);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg(a.errPassword);
        setIsSubmitting(false);
        return;
      }
      if (!phone.trim()) {
        setErrorMsg(a.errPhone);
        setIsSubmitting(false);
        return;
      }
      // Telegram is optional — asking for it up front was a sign-up blocker.
      const tg = telegramUsername.trim();
      const cleanTelegram = !tg ? '' : tg.startsWith('@') ? tg : `@${tg}`;

      const res = await signup({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city,
        telegramUsername: cleanTelegram,
        password,
      });

      if (res.success) {
        setSuccessMsg(a.successSignup);
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg(a.errEmail);
        setIsSubmitting(false);
        return;
      }
      if (!password) {
        setErrorMsg(a.errPassword);
        setIsSubmitting(false);
        return;
      }

      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccessMsg(a.successSignin);
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-lg bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
              <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {mode === 'signup' ? a.titleSignup : a.titleSignin}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#a8907f]">
                {mode === 'signup' ? a.subSignup : a.subSignin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#2d1c12] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#5a3a24] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-[#1a1009] border-b border-slate-200 dark:border-[#473020] text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchMode('signup')}
            aria-pressed={mode === 'signup'}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#473020] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {a.tabSignup}
          </button>
          <button
            type="button"
            onClick={() => switchMode('signin')}
            aria-pressed={mode === 'signin'}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#473020] text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {a.tabSignin}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div role="status" className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {a.fullName} <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Abebe Bikila"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* City Selection (Ethiopian Cities Dropdown) */}
              <div>
                <label htmlFor="auth-city" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {a.city} <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-amber-500 absolute left-3.5 pointer-events-none" />
                  <select
                    id="auth-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059] appearance-none cursor-pointer font-medium"
                  >
                    {ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id} className="bg-white dark:bg-[#251810] text-slate-900 dark:text-white py-1">
                        {c.name} ({c.amharic}) — {c.region}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">▼</span>
                </div>
              </div>

              {/* Telegram Username */}
              <div>
                <label htmlFor="auth-telegram" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {a.telegram} <span className="normal-case font-normal text-slate-400">({a.optional})</span>
                </label>
                <div className="relative flex items-center">
                  <Send className="w-4 h-4 text-blue-500 absolute left-3.5 pointer-events-none" />
                  <input
                    id="auth-telegram"
                    type="text"
                    autoComplete="off"
                    placeholder="@username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {a.telegramHint}
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="auth-phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {a.phone} <span className="text-amber-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 pointer-events-none" />
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+251 91 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {a.email} <span className="text-amber-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {a.password} <span className="text-amber-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#473020] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>{a.trustTitle}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {a.trustBody}
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
              <span>{a.processing}</span>
            ) : mode === 'signup' ? (
              <>
                <span>{a.submitSignup}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>{a.submitSignin}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#1a1009] border-t border-slate-100 dark:border-[#473020] text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signup' ? (
            <span>
              {a.haveAccount}{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                {a.tabSignin}
              </button>
            </span>
          ) : (
            <span>
              {a.noAccount}{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                {a.createAccount}
              </button>
              {' · '}
              <button
                type="button"
                onClick={async () => {
                  if (!email.trim() || !email.includes('@')) {
                    setErrorMsg(a.errResetEmail);
                    return;
                  }
                  setIsSubmitting(true);
                  const { resetPassword } = await import('../firebase/authLazy');
                  const res = await resetPassword(email.trim());
                  if (res.success) {
                    setSuccessMsg(a.resetSent);
                  } else {
                    setErrorMsg(res.error || 'Could not send reset email.');
                  }
                  setIsSubmitting(false);
                }}
                className="text-[#1b5e20] dark:text-[#c5a059] font-bold hover:underline cursor-pointer"
              >
                {a.forgot}
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
