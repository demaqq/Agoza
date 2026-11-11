import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CollectibleCard } from './CollectibleCard';
import { VerifiedBadge } from './VerifiedBadge';
import {
  ShieldCheck,
  Tag,
  ArrowLeftRight,
  Bookmark,
  Plus,
  Check,
} from 'lucide-react';

export const MyVaultView: React.FC = () => {
  const {
    collectibles,
    watchlist,
    tradeOffers,
    updateOfferStatus,
    escrowOrders,
    completeEscrowInspection,
    formatPrice,
    setIsListModalOpen,
    setActiveView,
    userListings,
    t,
  } = useMarketplace();

  const [activeVaultTab, setActiveVaultTab] = useState<'escrow' | 'offers' | 'saved' | 'my-listings'>('escrow');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const savedCollectibles = collectibles.filter((c) => watchlist.includes(c.id));

  const handleReleaseFunds = (orderId: string, title: string) => {
    completeEscrowInspection(orderId);
    setSuccessToast(`Inspection verified! Escrow funds released for "${title}".`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOfferAction = (offerId: string, action: 'accepted' | 'declined') => {
    updateOfferStatus(offerId, action);
    setSuccessToast(`Offer ${action} successfully.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {successToast && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="bg-[#131520] border border-[#232637] rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#8c6b2b] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#11131c] rounded-2xl flex items-center justify-center font-cinzel text-xl font-bold text-[#c5a059]">
                YC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-2xl font-bold text-[#f5f6f8]">
                  {t.myVaultTitle} (አጎዛ)
                </h1>
                <VerifiedBadge variant="profile" size="xs" label="Verified Member" />
              </div>
              <p className="text-xs text-[#8c92a6] mt-1">
                Addis Ababa, Bole Hub · Member since 2024 · 100% Verified Completion Rate
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsListModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Post New P2P Listing</span>
          </button>
        </div>

        {/* Tabbed Vault Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#202332] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveVaultTab('escrow')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeVaultTab === 'escrow'
                ? 'bg-[#c5a059] text-[#0c0d11]'
                : 'bg-[#181a24] text-[#8c92a6] hover:text-white border border-[#252837]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Deals ({escrowOrders.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveVaultTab('offers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeVaultTab === 'offers'
                ? 'bg-[#c5a059] text-[#0c0d11]'
                : 'bg-[#181a24] text-[#8c92a6] hover:text-white border border-[#252837]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{t.bargainsAndSwaps} ({tradeOffers.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveVaultTab('saved')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeVaultTab === 'saved'
                ? 'bg-[#c5a059] text-[#0c0d11]'
                : 'bg-[#181a24] text-[#8c92a6] hover:text-white border border-[#252837]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.savedWatchlist} ({savedCollectibles.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveVaultTab('my-listings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeVaultTab === 'my-listings'
                ? 'bg-[#c5a059] text-[#0c0d11]'
                : 'bg-[#181a24] text-[#8c92a6] hover:text-white border border-[#252837]'
            }`}
          >
            <span>{t.myListings} ({userListings.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content: 1. Verified Transactions */}
      {activeVaultTab === 'escrow' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9ba2b5]">
              Active Verified Handoffs
            </h2>
            <span className="text-xs text-[#6e758a]">Protected by Agoza Safe Safeguard</span>
          </div>

          {escrowOrders.length === 0 ? (
            <div className="text-center py-12 bg-[#12141d] rounded-2xl border border-[#212433] p-6 text-[#7d8498]">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No active verified orders at present.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escrowOrders.map((order) => {
                const isReleased = order.status === 'funds-released';
                return (
                  <div
                    key={order.id}
                    className="bg-[#141622] border border-[#262939] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8c92a6] mb-3 pb-3 border-b border-[#212434]">
                        <span className="font-mono">Order: {order.id}</span>
                        <span
                          className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                            isReleased
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {isReleased ? '✓ Funds Released to Seller' : 'Funds Safely in Trust'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={order.collectibleImage}
                          alt={order.collectibleTitle}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#f1f2f6] truncate">
                            {order.collectibleTitle}
                          </h4>
                          <span className="font-mono text-sm font-bold text-[#c5a059]">
                            {formatPrice(order.priceETB)}
                          </span>
                          <p className="text-[11px] text-[#7d8499] mt-0.5">
                            Seller: {order.sellerName}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#181b29] rounded-xl p-3 text-xs space-y-1.5 mb-4 border border-[#282c3f]">
                        <div className="flex items-center justify-between text-[#8c92a6]">
                          <span>Safe Hub:</span>
                          <span className="text-[#f1f2f6] font-medium">{order.selectedHub}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#8c92a6]">
                          <span>Inspection Code:</span>
                          <span className="font-mono text-emerald-400 font-bold tracking-wider">
                            {order.inspectionCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isReleased ? (
                      <button
                        onClick={() => handleReleaseFunds(order.id, order.collectibleTitle)}
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Inspect & Release Funds to Seller</span>
                      </button>
                    ) : (
                      <div className="text-center py-2 text-xs text-emerald-400 font-medium">
                        Transaction Completed & Archived
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: 2. Offers & Swaps */}
      {activeVaultTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9ba2b5]">
              Bargain Offers & Barter Proposals
            </h2>
            <span className="text-xs text-[#6e758a]">Direct Buyer-to-Seller Negotiations</span>
          </div>

          {tradeOffers.length === 0 ? (
            <div className="text-center py-12 bg-[#12141d] rounded-2xl border border-[#212433] p-6 text-[#7d8498]">
              <Tag className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No active bargaining offers or swap proposals.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tradeOffers.map((offer) => {
                const isPending = offer.status === 'pending';
                return (
                  <div
                    key={offer.id}
                    className="bg-[#141622] border border-[#262939] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={offer.buyerAvatar}
                        alt={offer.buyerName}
                        className="w-10 h-10 rounded-full object-cover border border-[#35394d]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#f1f2f6]">
                            {offer.buyerName}
                          </span>
                          <span className="text-[11px] text-[#7b8196]">· {offer.createdAt}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              offer.status === 'accepted'
                                ? 'bg-emerald-950 text-emerald-400'
                                : offer.status === 'declined'
                                ? 'bg-red-950 text-red-400'
                                : 'bg-[#c5a059]/20 text-[#c5a059]'
                            }`}
                          >
                            {offer.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-[#dce0ec] mt-1">
                          For: {offer.collectibleTitle}
                        </h4>

                        <div className="text-xs text-[#a5abbf] mt-1.5">
                          {offer.type === 'cash-offer' ? (
                            <span className="flex items-center gap-1.5 font-mono text-[#f5f6f8]">
                              <Tag className="w-3.5 h-3.5 text-[#c5a059]" />
                              Offered: {formatPrice(offer.offerAmountETB || 0)}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 font-mono text-emerald-300">
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              Swap Proposal: "{offer.offeredItemTitle}" +{' '}
                              {formatPrice(offer.cashAdjustmentETB || 0)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#7e859a] italic mt-1.5 max-w-lg">
                          "{offer.message}"
                        </p>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleOfferAction(offer.id, 'accepted')}
                          className="flex-1 sm:flex-initial py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleOfferAction(offer.id, 'declined')}
                          className="flex-1 sm:flex-initial py-2 px-3.5 bg-[#202332] hover:bg-[#2a2e40] text-[#a4abbe] text-xs font-medium rounded-xl border border-[#2d3144] transition-colors cursor-pointer"
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

      {/* Tab Content: 3. Saved Watchlist */}
      {activeVaultTab === 'saved' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9ba2b5]">
              Watched Items ({savedCollectibles.length})
            </h2>
            <button
              onClick={() => setActiveView('marketplace')}
              className="text-xs text-[#c5a059] hover:underline cursor-pointer"
            >
              Browse more treasures →
            </button>
          </div>

          {savedCollectibles.length === 0 ? (
            <div className="text-center py-12 bg-[#12141d] rounded-2xl border border-[#212433] p-6 text-[#7d8498]">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">You have not bookmarked any collectibles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCollectibles.map((col) => (
                <CollectibleCard key={col.id} collectible={col} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: 4. My Listings */}
      {activeVaultTab === 'my-listings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9ba2b5]">
              Your Published Listings ({userListings.length})
            </h2>
            <button
              onClick={() => setIsListModalOpen(true)}
              className="text-xs text-[#c5a059] hover:underline cursor-pointer"
            >
              + Add new listing
            </button>
          </div>

          {userListings.length === 0 ? (
            <div className="text-center py-12 bg-[#12141d] rounded-2xl border border-[#212433] p-6 text-[#7d8498]">
              <Plus className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs mb-3">You have not listed any collectibles yet.</p>
              <button
                onClick={() => setIsListModalOpen(true)}
                className="py-2 px-4 bg-[#c5a059] hover:bg-[#d6b068] text-[#0c0d11] font-bold text-xs rounded-xl"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((col) => (
                <CollectibleCard key={col.id} collectible={col} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
