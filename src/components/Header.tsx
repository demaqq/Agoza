import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Language } from '../types';
import { Logo } from './Logo';
import { updatePageMeta, MetaSnapshot } from '../utils/seoMetaManager';
import { ETHIOPIAN_CITIES } from '../data/citiesData';
import { AuthModal } from './AuthModal';
import {
  Plus,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  User,
  Search,
  Copy,
  Check,
  X,
  MapPin,
  ChevronDown,
  CheckCircle2,
  Menu,
  Settings,
  ExternalLink,
  Globe,
} from 'lucide-react';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'am', label: 'አማ', native: 'አማርኛ' },
  { code: 'ti', label: 'ትግ', native: 'ትግርኛ' },
  { code: 'om', label: 'ORO', native: 'Afaan Oromoo' },
  { code: 'so', label: 'SOM', native: 'Af-Soomaali' },
];

export const Header: React.FC = () => {
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
    activeView,
    setActiveView,
    setIsListModalOpen,
    setIsChatOpen,
    setIsAlertsOpen,
    filters,
    setFilters,
    isSearchModalOpen,
    setIsSearchModalOpen,
    chatThreads,
    alertNotifications,
    userPlan,
    setIsPlansModalOpen,
    selectedCollectible,
    formatPrice,
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    selectedCity,
    setSelectedCity,
    isAdmin,
  } = useMarketplace();

  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [metaSnapshot, setMetaSnapshot] = useState<MetaSnapshot | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Global search shortcut (Cmd+K, Ctrl+K, or /)
  useEffect(() => {
    const handleSearchKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleSearchKey);
    return () => window.removeEventListener('keydown', handleSearchKey);
  }, [setIsSearchModalOpen]);

  // Close open dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-header-dropdown]')) {
        setCityMenuOpen(false);
        setSettingsMenuOpen(false);
        setLangMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCityMenuOpen(false);
        setSettingsMenuOpen(false);
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    if (cityMenuOpen || settingsMenuOpen || langMenuOpen || mobileMenuOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cityMenuOpen, settingsMenuOpen, langMenuOpen, mobileMenuOpen]);

  const totalUnreadMessages = chatThreads.reduce((acc, thread) => acc + (thread.unreadCount || 0), 0);

  const handleCitySelect = (cityName: string) => {
    if (cityName !== 'All Ethiopia') setSelectedCity(cityName);
    // Only drive `city`; also setting `location` produced a duplicate filter chip.
    setFilters((prev) => ({
      ...prev,
      city: cityName === 'All Ethiopia' ? 'all' : cityName,
      location: 'all',
    }));
    setCityMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Synchronize dynamic HTML meta tags for SEO
  useEffect(() => {
    const snapshot = updatePageMeta(selectedCollectible, formatPrice);
    setMetaSnapshot(snapshot);
  }, [selectedCollectible, formatPrice]);

  const handleCopyLink = () => {
    if (!metaSnapshot) return;
    navigator.clipboard?.writeText(metaSnapshot.canonicalUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* Sticky Top Navigation Bar following Strict Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#fffdf7]/95 dark:bg-[#1e130c]/95 backdrop-blur-md border-b border-amber-200/60 dark:border-[#382214] transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Brand Wordmark & Official Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                setActiveView('marketplace');
                setMobileMenuOpen(false);
              }}
              className="text-left group cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e20] dark:focus-visible:outline-[#d4a373] flex items-center"
              aria-label="Agoza — home"
            >
              <Logo size="md" showText={true} />
            </button>
          </div>

          {/* Zone 2: Primary Navigation Links (Nike-style category nav) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#d5c3b1] whitespace-nowrap shrink-0">
            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, category: 'all', subcategory: 'all' }));
              }}
              className={`hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 whitespace-nowrap shrink-0 ${
                activeView === 'marketplace' && filters.category === 'all'
                  ? 'border-[#1b5e20] dark:border-[#d4a373] text-[#1b5e20] dark:text-[#d4a373] font-bold'
                  : 'border-transparent'
              }`}
            >
              {t.nav.newFeatured}
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, category: 'phones-tablets' }));
              }}
              className={`hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 whitespace-nowrap shrink-0 ${
                filters.category === 'phones-tablets' ? 'border-[#1b5e20] dark:border-[#d4a373] text-[#1b5e20] dark:text-[#d4a373] font-bold' : 'border-transparent'
              }`}
            >
              {t.nav.phonesTech}
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, category: 'vehicles-cars' }));
              }}
              className={`hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 whitespace-nowrap shrink-0 ${
                filters.category === 'vehicles-cars' ? 'border-[#1b5e20] dark:border-[#d4a373] text-[#1b5e20] dark:text-[#d4a373] font-bold' : 'border-transparent'
              }`}
            >
              {t.nav.vehicles}
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, category: 'fashion-clothes' }));
              }}
              className={`hidden 2xl:block hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 whitespace-nowrap shrink-0 ${
                filters.category === 'fashion-clothes' ? 'border-[#1b5e20] dark:border-[#d4a373] text-[#1b5e20] dark:text-[#d4a373] font-bold' : 'border-transparent'
              }`}
            >
              {t.nav.fashion}
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, category: 'home-furniture' }));
              }}
              className={`hidden 2xl:block hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 whitespace-nowrap shrink-0 ${
                filters.category === 'home-furniture' ? 'border-[#1b5e20] dark:border-[#d4a373] text-[#1b5e20] dark:text-[#d4a373] font-bold' : 'border-transparent'
              }`}
            >
              {t.nav.homeDecor}
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                setFilters((f) => ({ ...f, openToTradeOnly: !f.openToTradeOnly }));
              }}
              className={`hover:opacity-75 transition-opacity cursor-pointer py-5 border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                filters.openToTradeOnly ? 'border-[#1b5e20] dark:border-[#d4a373] text-emerald-700 dark:text-emerald-400 font-bold' : 'border-transparent'
              }`}
            >
              <span>{t.nav.swapsBarter}</span>
            </button>
          </nav>

          {/* Zone 3: Compact Control Utilities & Primary Action CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* 1. Ethiopian City Selector Dropdown */}
            <div className="relative hidden sm:block" data-header-dropdown="city">
              <button
                onClick={() => {
                  setCityMenuOpen(!cityMenuOpen);
                  setSettingsMenuOpen(false);
                }}
                className="flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-100 dark:bg-[#251810] dark:hover:bg-[#342115] border border-amber-300/80 dark:border-[#473020] px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-950 dark:text-[#f3ddc9] cursor-pointer transition-colors min-h-[38px]"
                title={t.header.selectCity}
                aria-haspopup="listbox"
                aria-expanded={cityMenuOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-[#d4a373] shrink-0" />
                <span className="truncate max-w-[90px] md:max-w-[120px]">{!filters.city || filters.city === 'all' ? t.filters.allCities : filters.city}</span>
                <ChevronDown className="w-3 h-3 text-amber-700 dark:text-[#d4a373] opacity-80" />
              </button>

              {cityMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white dark:bg-[#251810] border border-amber-200 dark:border-[#473020] rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3.5 py-1.5 text-[10px] text-amber-900 dark:text-[#d4a373] uppercase tracking-wider font-bold border-b border-amber-100 dark:border-[#382214] flex items-center justify-between">
                    <span>{t.header.ethiopianCities}</span>
                    <span className="font-serif">ኢትዮጵያ</span>
                  </div>
                  {ETHIOPIAN_CITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCitySelect(c.id === 'all' ? 'All Ethiopia' : c.id)}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        (filters.city || 'all') === c.id
                          ? 'bg-amber-100/80 dark:bg-[#382214] text-amber-950 dark:text-[#f8edd6] font-bold'
                          : 'text-slate-700 dark:text-[#c4b5a5] hover:bg-amber-50 dark:hover:bg-[#2d1c12] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{c.id === 'all' ? t.filters.allCities : c.name}</span>
                      <span className="font-serif text-[11px] text-slate-400">{c.amharic}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Nike Pill Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-amber-100/70 dark:bg-[#251810] hover:bg-amber-200/60 dark:hover:bg-[#2d1c12] px-3.5 py-2 rounded-full text-xs text-slate-700 dark:text-[#d5c3b1] cursor-pointer transition-colors min-w-[120px] 2xl:min-w-[180px]"
              title={`${t.header.search} (⌘K)`}
              aria-label={t.header.search}
            >
              <Search className="w-4 h-4 text-[#1b5e20] dark:text-[#d4a373] shrink-0" />
              <span className="truncate max-w-[80px] 2xl:max-w-[140px] text-slate-500 dark:text-[#a8907f] font-medium">{t.header.search}</span>
              <kbd className="hidden 2xl:inline text-[9px] bg-white dark:bg-black/40 px-1.5 py-0.5 rounded border border-amber-300 dark:border-[#473020] font-mono ml-auto">⌘K</kbd>
            </button>

            {/* 3. Notifications & Chat Quick Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsAlertsOpen(true)}
                className="relative p-2 text-slate-700 dark:text-[#d5c3b1] hover:bg-amber-100/60 dark:hover:bg-[#2d1c12] rounded-xl transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                title={t.header.alerts}
                aria-label={t.header.alerts}
              >
                <Bell className="w-4 h-4" />
                {alertNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#1b5e20] dark:bg-[#d4a373] text-white dark:text-[#1e130c] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {alertNotifications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 text-slate-700 dark:text-[#d5c3b1] hover:bg-amber-100/60 dark:hover:bg-[#2d1c12] rounded-xl transition-colors cursor-pointer hidden md:flex min-w-[38px] min-h-[38px] items-center justify-center"
                title={t.header.chat}
                aria-label={t.header.chat}
              >
                <MessageSquare className="w-4 h-4" />
                {totalUnreadMessages > 0 && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {totalUnreadMessages}
                  </span>
                )}
              </button>
            </div>

            {/* Language quick switcher (always visible — key for a multilingual market) */}
            <div className="relative hidden sm:block" data-header-dropdown="language">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setCityMenuOpen(false);
                  setSettingsMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-[#d5c3b1] hover:bg-amber-100/60 dark:hover:bg-[#2d1c12] transition-colors cursor-pointer min-w-[38px] min-h-[38px] justify-center"
                title={t.header.language}
                aria-label={t.header.language}
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">{LANGUAGES.find((l) => l.code === language)?.label}</span>
              </button>
              {langMenuOpen && (
                <div role="listbox" aria-label={t.header.language} className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#251810] border border-amber-200 dark:border-[#473020] rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={language === lang.code}
                      lang={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        language === lang.code
                          ? 'bg-amber-100/80 dark:bg-[#382214] text-amber-950 dark:text-[#f8edd6] font-bold'
                          : 'text-slate-700 dark:text-[#c4b5a5] hover:bg-amber-50 dark:hover:bg-[#2d1c12]'
                      }`}
                    >
                      <span>{lang.native}</span>
                      {language === lang.code && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Settings Popover Menu (Groups Theme, Currency, Language, SEO Inspector, Admin) */}
            <div className="relative" data-header-dropdown="settings">
              <button
                onClick={() => {
                  setSettingsMenuOpen(!settingsMenuOpen);
                  setCityMenuOpen(false);
                  setLangMenuOpen(false);
                }}
                className={`p-2 rounded-xl border transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center ${
                  settingsMenuOpen
                    ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] border-transparent'
                    : 'bg-amber-100/60 dark:bg-[#251810] text-slate-700 dark:text-[#d5c3b1] border-amber-200/80 dark:border-[#473020] hover:bg-amber-200/60 dark:hover:bg-[#342115]'
                }`}
                title={t.header.settings}
                aria-label={t.header.settings}
                aria-expanded={settingsMenuOpen}
              >
                <Settings className="w-4 h-4" />
              </button>

              {settingsMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#251810] border border-amber-200 dark:border-[#473020] rounded-2xl shadow-xl p-3 z-50 space-y-3 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-900 dark:text-[#d4a373] pb-1 border-b border-amber-100 dark:border-[#382214] flex items-center justify-between">
                    <span>{t.header.preferences}</span>
                  </div>

                  {/* Light / Dark Mode Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-slate-800 dark:text-[#f8edd6]">{t.header.theme}</span>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-[#1a1009] border border-amber-200 dark:border-[#422919] text-slate-800 dark:text-[#f3ddc9] font-medium cursor-pointer"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Moon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.header.dark}</span>
                        </>
                      ) : (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.header.light}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Currency Toggle Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-slate-800 dark:text-[#f8edd6]">{t.header.currency}</span>
                    <div className="flex items-center bg-amber-50 dark:bg-[#1a1009] border border-amber-200 dark:border-[#422919] rounded-xl p-0.5 font-mono">
                      <button
                        onClick={() => setCurrency('ETB')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                          currency === 'ETB'
                            ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] font-bold'
                            : 'text-slate-600 dark:text-[#a8907f]'
                        }`}
                      >
                        ETB
                      </button>
                      <button
                        onClick={() => setCurrency('USD')}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                          currency === 'USD'
                            ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] font-bold'
                            : 'text-slate-600 dark:text-[#a8907f]'
                        }`}
                      >
                        USD
                      </button>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="py-1">
                    <span className="font-semibold text-slate-800 dark:text-[#f8edd6] block mb-1.5">
                      {t.header.language}
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          lang={lang.code}
                          className={`py-1 px-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                            language === lang.code
                              ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] border-transparent font-bold'
                              : 'bg-amber-50/80 dark:bg-[#1a1009] text-slate-700 dark:text-[#a8907f] border-amber-200 dark:border-[#382214]'
                          }`}
                        >
                          {lang.native}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick System Tools */}
                  {isAdmin && (
                  <div className="pt-2 border-t border-amber-100 dark:border-[#382214] space-y-1.5">
                    <button
                      onClick={() => {
                        setShowSeoModal(true);
                        setSettingsMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-[#1a1009] hover:bg-amber-100 dark:hover:bg-[#2e1d13] text-slate-800 dark:text-[#f3ddc9] font-medium flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
                        <span>{t.header.seoInspector}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('admin-dashboard');
                        setSettingsMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-[#1a1009] hover:bg-amber-100 dark:hover:bg-[#2e1d13] text-slate-800 dark:text-[#f3ddc9] font-medium flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{t.header.adminModeration}</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90" />
                    </button>
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. User Account / Sign In Action */}
            <button
              onClick={() => {
                if (currentUser) {
                  setActiveView('user-dashboard');
                } else {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                currentUser
                  ? 'bg-amber-100/60 dark:bg-[#251810] border-amber-200 dark:border-[#473020] text-slate-800 dark:text-[#f3ddc9]'
                  : 'bg-white dark:bg-[#251810] border-amber-300 dark:border-[#473020] text-[#1b5e20] dark:text-[#d4a373]'
              }`}
              title={currentUser ? currentUser.name : t.header.signIn}
              aria-label={currentUser ? `${t.nav.myAccount}: ${currentUser.name}` : t.header.signIn}
            >
              <User className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
              <span className="hidden md:inline xl:hidden 2xl:inline max-w-[90px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : t.header.signIn}
              </span>
              {currentUser && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* 5. Primary CTA Action: Post Ad Free */}
            <button
              onClick={() => setIsListModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-white dark:text-[#1e130c] bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] active:scale-95 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap min-h-[38px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.listCollectible}</span>
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-800 dark:text-[#f8edd6] hover:bg-amber-100/80 dark:hover:bg-[#2d1c12] rounded-xl cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center border border-amber-200/80 dark:border-[#473020]"
              aria-label={t.header.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Sheet */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-amber-200/80 dark:border-[#382214] bg-[#fffdf7] dark:bg-[#1e130c] px-4 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
            {/* Primary Mobile Nav Links */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveView('marketplace');
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-colors ${
                  activeView === 'marketplace'
                    ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] border-transparent'
                    : 'bg-amber-50 dark:bg-[#251810] text-slate-800 dark:text-[#f3ddc9] border-amber-200 dark:border-[#473020]'
                }`}
              >
                {t.nav.marketplaceFeed}
              </button>

              <button
                onClick={() => {
                  setActiveView('user-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-colors ${
                  activeView === 'user-dashboard'
                    ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] border-transparent'
                    : 'bg-amber-50 dark:bg-[#251810] text-slate-800 dark:text-[#f3ddc9] border-amber-200 dark:border-[#473020]'
                }`}
              >
                {t.nav.myAccount}
              </button>
            </div>

            {/* Mobile Location Selector */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-[#382214]">
              <label className="text-[11px] font-bold text-amber-900 dark:text-[#d4a373] block mb-1.5 uppercase tracking-wider">
                {t.header.selectCity}
              </label>
              <select
                value={!filters.city || filters.city === 'all' ? 'All Ethiopia' : filters.city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-[#251810] border border-amber-300 dark:border-[#473020] text-slate-900 dark:text-[#f3ddc9] text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id === 'all' ? 'All Ethiopia' : c.id}>
                    {c.id === 'all' ? t.filters.allCities : `${c.name} (${c.amharic})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile language picker */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-[#382214]">
              <span className="text-[11px] font-bold text-amber-900 dark:text-[#d4a373] block mb-1.5 uppercase tracking-wider">
                {t.header.language}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    lang={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    aria-pressed={language === lang.code}
                    className={`py-2 px-1.5 rounded-xl border text-xs text-center cursor-pointer transition-colors min-h-[40px] ${
                      language === lang.code
                        ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c] border-transparent font-bold'
                        : 'bg-amber-50 dark:bg-[#251810] text-slate-700 dark:text-[#c4b5a5] border-amber-200 dark:border-[#473020]'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Post Ad Primary Action */}
            <button
              onClick={() => {
                setIsListModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.listCollectible}</span>
            </button>
          </div>
        )}
      </header>

      {/* DYNAMIC SEO & SOCIAL METADATA INSPECTOR MODAL */}
      {showSeoModal && metaSnapshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-6"
          onClick={() => setShowSeoModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 dark:border-[#382214] bg-amber-50/80 dark:bg-[#1a1009]">
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-[#1b5e20] dark:text-[#d4a373]" />
                <div>
                  <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-[#f8edd6]">
                    Search Engine Visibility & Dynamic Meta Tags
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-[#a8907f]">
                    Live HTML &lt;head&gt; tags and Schema.org structured data active on this page.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSeoModal(false)}
                className="p-1.5 rounded-xl bg-white dark:bg-[#2d1c12] text-slate-600 dark:text-[#d5c3b1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#422919] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Context Indicator */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 dark:bg-[#1a1009] border border-amber-200 dark:border-[#382214] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-800 dark:text-[#f3ddc9]">
                    {metaSnapshot.isItemSpecific
                      ? 'Specific Listing Page (Product Schema Active)'
                      : 'Marketplace Feed Page (WebApplication Schema Active)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#251810] text-[11px] font-mono font-bold text-slate-700 dark:text-[#d4a373] border border-amber-200 dark:border-[#473020] flex items-center gap-1 cursor-pointer hover:bg-slate-50"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Canonical Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. Google Search Result Snippet Preview */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-[#a8907f] block">
                  Google Search Engine Result Snippet:
                </span>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1009] border border-amber-200 dark:border-[#382214] space-y-1 shadow-sm font-sans">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {metaSnapshot.canonicalUrl}
                  </div>
                  <h4 className="text-base text-[#1a0dab] dark:text-[#d4a373] hover:underline cursor-pointer font-medium leading-snug">
                    {metaSnapshot.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#d5c3b1] leading-relaxed">
                    {metaSnapshot.description}
                  </p>
                </div>
              </div>

              {/* 2. OpenGraph & Twitter Social Share Card Preview */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-[#a8907f] block">
                  Social Sharing Card Preview (OpenGraph / Twitter / Telegram):
                </span>
                <div className="rounded-2xl overflow-hidden border border-amber-200 dark:border-[#382214] bg-white dark:bg-[#1a1009] shadow-md">
                  <div className="relative aspect-[16/9] w-full bg-black overflow-hidden flex items-center justify-center">
                    <img
                      src={metaSnapshot.ogImage}
                      alt={metaSnapshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      agoza.et · {metaSnapshot.ogType.toUpperCase()}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {metaSnapshot.title}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {metaSnapshot.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Schema.org JSON-LD Structured Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-[#a8907f] block">
                    Schema.org Structured Data (JSON-LD) Injected:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Validated for Rich Snippets
                  </span>
                </div>

                <pre className="p-3.5 rounded-2xl bg-slate-900 text-amber-300 dark:bg-[#1a1009] dark:text-[#d4a373] border border-slate-800 dark:border-[#382214] text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                  {metaSnapshot.schemaJson}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-amber-100 dark:border-[#382214] bg-amber-50/80 dark:bg-[#1a1009] flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-[#a8907f]">
                SEO automatically updates as items are opened and closed.
              </span>
              <button
                type="button"
                onClick={() => setShowSeoModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-[#d4a373] text-white dark:text-[#1e130c] text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trader Sign Up / Sign In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};
