import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Home, Grid, Plus, MessageSquare, User, ShieldAlert } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsListModalOpen,
    setIsChatOpen,
    setIsMobileCategoriesOpen,
    chatThreads,
    isAdmin,
    t,
  } = useMarketplace();

  const unreadChats = chatThreads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  return (
    <nav aria-label={t.nav.marketplaceFeed} className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1e130c]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#382214] h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-1">
      <div className={`grid ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} h-full items-center`}>
        {/* 1. Home */}
        <button
          onClick={() => setActiveView('marketplace')}
          aria-current={activeView === 'marketplace' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
            activeView === 'marketplace'
              ? 'text-[#1b5e20] dark:text-[#d4a373] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-tight tracking-tight mt-0.5 max-w-full truncate px-0.5">{t.nav.home}</span>
        </button>

        {/* 2. Categories */}
        <button
          onClick={() => setIsMobileCategoriesOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] leading-tight tracking-tight mt-0.5 max-w-full truncate px-0.5">{t.nav.categories}</span>
        </button>

        {/* 3. Sell / Post Ad (Prominent Center Button) */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsListModalOpen(true)}
            className="w-11 h-11 rounded-full bg-[#1b5e20] dark:bg-[#d4a373] hover:bg-[#2e7d32] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] shadow-lg flex items-center justify-center cursor-pointer -mt-4 transition-transform active:scale-95 border-2 border-white dark:border-[#1e130c]"
            title={t.nav.postAd}
            aria-label={t.nav.postAd}
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* 4. Chats */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5 max-w-full truncate px-0.5">{t.nav.chats}</span>
        </button>

        {/* 5. User Dashboard (My Ads) */}
        <button
          onClick={() => setActiveView('user-dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
            activeView === 'user-dashboard'
              ? 'text-[#1b5e20] dark:text-[#c5a059] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-tight tracking-tight mt-0.5 max-w-full truncate px-0.5">{t.nav.myAds}</span>
        </button>

        {/* 6. Admin Panel (only visible to logged-in admins) */}
        {isAdmin && (
          <button
            onClick={() => setActiveView('admin-dashboard')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors ${
              activeView === 'admin-dashboard'
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] leading-tight tracking-tight mt-0.5 max-w-full truncate px-0.5 text-amber-600 dark:text-amber-400 font-semibold">{t.nav.admin}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
