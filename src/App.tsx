import React, { Suspense, lazy } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Lazy-load view components (only load when navigated to)
const MarketplaceFeed = lazy(() => import('./components/MarketplaceFeed').then(m => ({ default: m.MarketplaceFeed })));
const MyVaultView = lazy(() => import('./components/MyVaultView').then(m => ({ default: m.MyVaultView })));
const UserDashboardView = lazy(() => import('./components/UserDashboardView').then(m => ({ default: m.UserDashboardView })));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const PlansView = lazy(() => import('./components/PlansView').then(m => ({ default: m.PlansView })));

// Lazy-load modals & drawers (only load when opened)
const CollectibleDetailModal = lazy(() => import('./components/CollectibleDetailModal').then(m => ({ default: m.CollectibleDetailModal })));
const PlansModal = lazy(() => import('./components/PlansModal').then(m => ({ default: m.PlansModal })));
const EscrowCheckoutModal = lazy(() => import('./components/EscrowCheckoutModal').then(m => ({ default: m.EscrowCheckoutModal })));
const TradeOfferModal = lazy(() => import('./components/TradeOfferModal').then(m => ({ default: m.TradeOfferModal })));
const SwapProposalModal = lazy(() => import('./components/SwapProposalModal').then(m => ({ default: m.SwapProposalModal })));
const ListCollectibleModal = lazy(() => import('./components/ListCollectibleModal').then(m => ({ default: m.ListCollectibleModal })));
const ChatNegotiationDrawer = lazy(() => import('./components/ChatNegotiationDrawer').then(m => ({ default: m.ChatNegotiationDrawer })));
const AlertsDrawer = lazy(() => import('./components/AlertsDrawer').then(m => ({ default: m.AlertsDrawer })));
const ActivityFeedDrawer = lazy(() => import('./components/ActivityFeedDrawer').then(m => ({ default: m.ActivityFeedDrawer })));
const MobileCategoriesSheet = lazy(() => import('./components/MobileCategoriesSheet').then(m => ({ default: m.MobileCategoriesSheet })));
const SearchModal = lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));
const QuickBuyModal = lazy(() => import('./components/QuickBuyModal').then(m => ({ default: m.QuickBuyModal })));

const ViewFallback = () => <div className="h-full flex items-center justify-center" />;
const ModalFallback = () => <div className="h-24 flex items-center justify-center" />;

const AppContent: React.FC = () => {
  const { activeView, isSearchModalOpen, setIsSearchModalOpen } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#1e130c] text-slate-900 dark:text-[#fbf5ef] flex flex-col selection:bg-[#1b5e20]/20 dark:selection:bg-[#d4a373]/30 transition-colors">
      <Header />

      {/* Main View Router */}
      <div className="flex-1">
        <Suspense fallback={<ViewFallback />}>
          {activeView === 'marketplace' && <MarketplaceFeed />}
          {activeView === 'vault' && <MyVaultView />}
          {activeView === 'user-dashboard' && <UserDashboardView />}
          {activeView === 'admin-dashboard' && <AdminDashboardView />}
          {activeView === 'plans' && <PlansView />}
        </Suspense>
      </div>

      {/* Global Modals & Drawers (lazy-loaded) */}
      <Suspense fallback={<ModalFallback />}>
        <CollectibleDetailModal />
        <PlansModal />
        <EscrowCheckoutModal />
        <TradeOfferModal />
        <SwapProposalModal />
        <ListCollectibleModal />
        <ChatNegotiationDrawer />
        <AlertsDrawer />
        <ActivityFeedDrawer />
        <MobileCategoriesSheet />
        <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
        <QuickBuyModal />
      </Suspense>

      {/* Mobile-First Sticky Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Clean Domain Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
