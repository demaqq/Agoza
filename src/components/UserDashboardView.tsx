import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { VerifiedBadge } from './VerifiedBadge';
import {
  Package,
  Tag,
  ShieldCheck,
  User,
  Plus,
  Eye,
  CheckCircle2,
  Trash2,
  Check,
  ShieldAlert,
  Crown,
  Zap,
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    collectibles,
    userListings,
    tradeOffers,
    updateOfferStatus,
    escrowOrders,
    completeEscrowInspection,
    markAsSold,
    deleteListing,
    formatPrice,
    setIsListModalOpen,
    setActiveView,
    openChatForCollectible,
    setSelectedCollectible,
    userPlan,
    setIsPlansModalOpen,
    activePlanDetails,
    currentUser,
    selectedCity,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
    t,
    isAdmin,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'ads' | 'offers' | 'escrow' | 'profile' | 'plans'>('ads');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleActionToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Toast Notification */}
      {successToast && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#382214] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b5e20] to-[#2e7d32] dark:from-[#c5a059] dark:to-[#8c6b2b] p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-[#1a1009] rounded-2xl flex items-center justify-center font-cinzel text-xl font-bold text-[#1b5e20] dark:text-[#c5a059]">
                {currentUser ? currentUser.name.slice(0, 2).toUpperCase() : 'AG'}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#f5f6f8]">
                  {currentUser ? currentUser.name : 'Trader Account'}
                </h1>
                <VerifiedBadge variant="profile" size="sm" label="Verified Authenticated Trader" />
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 border ${
                  userPlan === 'pro'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-400'
                    : userPlan === 'starter'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
                }`}>
                  {userPlan === 'pro' ? <Crown className="w-3 h-3 text-amber-500 fill-amber-500" /> : <Zap className="w-3 h-3 text-emerald-500" />}
                  <span>{activePlanDetails.badge}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 {currentUser?.city || selectedCity || 'Addis Ababa'}, Ethiopia</span>
                <span>·</span>
                <span className="text-blue-500 dark:text-blue-400 font-mono font-semibold">{currentUser?.telegramUsername || '@trader_ethiopia'}</span>
                <span>·</span>
                <span>100% Verified Completion</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setIsPlansModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 border border-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{userPlan === 'free' ? 'Upgrade Plan (from 699 Br)' : 'Manage Plan'}</span>
            </button>

            <button
              onClick={() => setIsListModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Post New Classified Ad</span>
            </button>
          </div>
        </div>

        {/* Admin Switcher Card (Admins Only) */}
        {isAdmin && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#473020] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Agoza Platform Admin & Moderation Panel
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Staff controls for reviewing flagged ads, contraband enforcement, and user moderation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('admin-dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Access Admin Panel →
          </button>
        </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-[#473020] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'ads'
                ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#1e130c]'
                : 'bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Ads ({userListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#1e130c]'
                : 'bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Offers & Swaps ({tradeOffers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'escrow'
                ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#1e130c]'
                : 'bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Deals ({escrowOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#1e130c]'
                : 'bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & KYC</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#1e130c]'
                : 'bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>My Plan & Limits ({userPlan.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Ads */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Active Classified Listings
            </h2>
            <button
              onClick={() => setIsListModalOpen(true)}
              className="text-xs text-[#1b5e20] dark:text-[#c5a059] hover:underline cursor-pointer font-semibold"
            >
              + Create new listing
            </button>
          </div>

          {userListings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1e130c] rounded-2xl border border-slate-200 dark:border-[#473020] p-6 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                You have no active ads yet
              </h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                Sell your phones, cars, electronics, or services to thousands of buyers across Ethiopia.
              </p>
              <button
                onClick={() => setIsListModalOpen(true)}
                className="py-2.5 px-4 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow"
              >
                + Post Your First Ad Free
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userListings.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      onClick={() => setSelectedCollectible(ad)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      title="Click to view listing details"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                          {ad.category.replace('-', ' ')}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          ad.status === 'sold'
                            ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}>
                          {ad.status === 'sold' ? 'SOLD' : 'ACTIVE'}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedCollectible(ad)}
                        className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-[#1b5e20] dark:hover:text-[#d4a373] transition-colors"
                        title="Click to view listing details"
                      >
                        {ad.title}
                      </h3>

                      <span className="text-sm font-bold font-mono text-[#1b5e20] dark:text-[#c5a059] block mt-0.5">
                        {formatPrice(ad.priceETB)}
                      </span>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {ad.viewsCount} views
                        </span>
                        <span>·</span>
                        <span>{ad.seller.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#473020]">
                    {ad.status !== 'sold' && (
                      <button
                        onClick={() => {
                          markAsSold(ad.id);
                          handleActionToast(`"${ad.title}" marked as sold.`);
                        }}
                        className="flex-1 sm:flex-initial py-2 px-3 bg-slate-100 dark:bg-[#473020] hover:bg-slate-200 dark:hover:bg-[#5a3a24] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Mark as Sold
                      </button>
                    )}
                    <button
                      onClick={() => {
                        deleteListing(ad.id);
                        handleActionToast(`"${ad.title}" removed.`);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Offers & Swaps */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Customer Offers & Trade Inquiries
            </h2>
          </div>

          {tradeOffers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1e130c] rounded-2xl border border-slate-200 dark:border-[#473020] p-6 text-slate-500">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
              <p className="text-xs">No active price offers or barter proposals.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tradeOffers.map((offer) => {
                const isPending = offer.status === 'pending';
                return (
                  <div
                    key={offer.id}
                    className="bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={offer.buyerAvatar}
                        alt={offer.buyerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {offer.buyerName}
                          </span>
                          <span className="text-[11px] text-slate-500">· {offer.createdAt}</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            offer.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                              : offer.status === 'declined'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-[#c5a059]/20 dark:text-[#c5a059]'
                          }`}>
                            {offer.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          For: {offer.collectibleTitle}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 max-w-lg">
                          "{offer.message}"
                        </p>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            updateOfferStatus(offer.id, 'accepted');
                            handleActionToast('Offer accepted!');
                          }}
                          className="flex-1 sm:flex-initial py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            updateOfferStatus(offer.id, 'declined');
                            handleActionToast('Offer declined.');
                          }}
                          className="flex-1 sm:flex-initial py-2 px-3.5 bg-slate-100 dark:bg-[#473020] text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-300 dark:border-[#5a3a24] transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Escrow */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Verified Protection Contracts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escrowOrders.map((order) => {
              const isReleased = order.status === 'funds-released';
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-2xl p-5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100 dark:border-[#473020]">
                      <span className="font-mono">Order: {order.id}</span>
                      <span className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                        isReleased
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {isReleased ? '✓ Completed' : 'Funds in Trust'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={order.collectibleImage}
                        alt={order.collectibleTitle}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {order.collectibleTitle}
                        </h4>
                        <span className="font-mono text-sm font-bold text-[#1b5e20] dark:text-[#c5a059]">
                          {formatPrice(order.priceETB)}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Safe Hub: {order.selectedHub}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#382214] rounded-xl p-3 text-xs space-y-1.5 mb-4 border border-slate-200 dark:border-[#5a3a24]">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Inspection Code:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
                          {order.inspectionCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isReleased ? (
                    <button
                      onClick={() => {
                        completeEscrowInspection(order.id);
                        handleActionToast(`Inspection verified and payment finalized!`);
                      }}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify Inspection & Release Payment</span>
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Transaction Completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Profile & KYC */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Trader Identity & Profile
            </h3>
            {currentUser && (
              <button
                type="button"
                onClick={logout}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2d1c12] rounded-xl border border-slate-200 dark:border-[#473020]">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">City / Base in Ethiopia</span>
                <span className="text-[11px] text-slate-500">📍 {currentUser?.city || selectedCity || 'Addis Ababa'}</span>
              </div>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                {currentUser?.city || selectedCity || 'Addis Ababa'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2d1c12] rounded-xl border border-slate-200 dark:border-[#473020]">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Telegram Handle</span>
                <span className="text-[11px] text-slate-500">For direct trade alerts & notifications</span>
              </div>
              <span className="font-mono text-blue-500 dark:text-blue-400 font-bold">
                {currentUser?.telegramUsername || '@trader_ethiopia'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2d1c12] rounded-xl border border-slate-200 dark:border-[#473020]">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Mobile Number</span>
                <span className="text-[11px] text-slate-500">{currentUser?.phone || '+251 91 199 8877'}</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2d1c12] rounded-xl border border-slate-200 dark:border-[#473020]">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Safety Rating</span>
                <span className="text-[11px] text-slate-500">Based on verified safe transactions</span>
              </div>
              <span className="font-bold font-mono text-amber-500">★ 5.0 (100% Trust)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Subscription & Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-6 max-w-4xl">
          {/* Active Plan Overview Card */}
          <div className="bg-white dark:bg-[#251810] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#473020] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-cinzel text-slate-900 dark:text-white">
                      {activePlanDetails.name} ({activePlanDetails.nameAmharic})
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Monthly Subscription: <strong className="font-mono text-slate-900 dark:text-white">{activePlanDetails.priceETB === 0 ? 'Free Forever' : `${formatPrice(activePlanDetails.priceETB)} / month`}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPlansModalOpen(true)}
                className="px-4 py-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer transition-all self-start sm:self-auto"
              >
                {userPlan === 'free' ? 'Upgrade to Starter or Pro' : 'Change Subscription Plan'}
              </button>
            </div>

            {/* Quota & Feature Usage Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24]">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Classified Listings</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {userListings.length} / {activePlanDetails.maxListings === 'Unlimited' ? '∞ Unlimited' : `${activePlanDetails.maxListings} max`}
                </span>
                <span className="text-[9px] text-slate-500">Active ads</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24]">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Photos per Ad</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {activePlanDetails.maxPhotosPerListing} Photos
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400">High resolution</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24]">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Protection Fee Rate</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {activePlanDetails.commissionEscrowRate === 0 ? '0% Free' : `${activePlanDetails.commissionEscrowRate}%`}
                </span>
                <span className="text-[9px] text-slate-500">Platform fee</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24]">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Feed Visibility</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                  {activePlanDetails.visibilityBoost}
                </span>
                <span className="text-[9px] text-slate-500">Priority level</span>
              </div>
            </div>

            {/* Quick Switch Options Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24] space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Available Agoza Seller Plans:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${userPlan === 'free' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-[#5a3a24]'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Free Forever</span>
                    <span className="font-mono text-slate-500">0 Br</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">3 listings · 1 photo · standard</p>
                </div>

                <div className={`p-3 rounded-xl border ${userPlan === 'starter' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-[#5a3a24]'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Starter Plan</span>
                    <span className="font-mono font-bold text-[#1b5e20] dark:text-[#c5a059]">699 Br/mo</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">15 listings · 4 photos · 2x boost</p>
                </div>

                <div className={`p-3 rounded-xl border ${userPlan === 'pro' ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20' : 'border-slate-200 dark:border-[#5a3a24]'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Pro Merchant</span>
                    <span className="font-mono font-bold text-amber-500">1,499 Br/mo</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Unlimited · 10 photos · 0% fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
