import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Users,
  ArrowLeft,
  User,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    collectibles,
    approveListing,
    flagListing,
    deleteListing,
    formatPrice,
    activityFeed,
    setActiveView,
    isAdmin,
  } = useMarketplace();

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The Admin Moderation Panel requires an authorized admin account.
        </p>
        <button
          onClick={() => setActiveView('marketplace')}
          className="px-5 py-2.5 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#0c0d11] font-bold text-xs rounded-xl cursor-pointer"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const [activeAdminTab, setActiveAdminTab] = useState<'moderation' | 'safety' | 'users'>('moderation');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const totalValueETB = collectibles.reduce((acc, c) => acc + c.priceETB, 0);
  const flaggedCount = collectibles.filter((c) => c.moderationStatus === 'flagged').length;

  const handleApprove = (id: string, title: string) => {
    approveListing(id);
    setActionNotice(`Approved "${title}" — Live on platform.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleFlagDrugOrHarm = (id: string, title: string) => {
    flagListing(id, 'Violation: Suspected prohibited drug or harmful merchandise.');
    setActionNotice(`Flagged "${title}" for safety review.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    deleteListing(id);
    setActionNotice(`Deleted "${title}" permanently.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#131520] border border-slate-200 dark:border-[#262939] shadow-xs">
        <button
          onClick={() => setActiveView('marketplace')}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#1b5e20] dark:hover:text-[#c5a059] px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1c2a] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Marketplace Feed</span>
        </button>

        <button
          onClick={() => setActiveView('user-dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a1c2a] transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Switch to My Ads Dashboard</span>
        </button>
      </div>

      {/* Toast */}
      {actionNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-600 text-amber-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-white hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Admin Title & Stat Banners */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Agoza National Marketplace Administration & Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Admin Governance Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enforce Ethiopian commerce safety, inspect flagged items, monitor verified transactions, and protect buyers from prohibited substances.
        </p>
      </div>

      {/* Overview Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Total Classified Ads
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {collectibles.length}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
            100% Verified Sellers
          </span>
        </div>

        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Safety Violations / Flagged
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {flaggedCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Zero Tolerance on Drugs
          </span>
        </div>

        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Total Marketplace Value
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#1b5e20] dark:text-[#c5a059] truncate block">
            {formatPrice(totalValueETB)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Catalog inventory
          </span>
        </div>

        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Verified Safe Hubs
          </span>
          <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            5 Hubs
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            99.8% Safety Record
          </span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-[#242738] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            activeAdminTab === 'moderation'
              ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#0c0d11]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Ads Moderation Queue ({collectibles.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('safety')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            activeAdminTab === 'safety'
              ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#0c0d11]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Drug & Harmful Item Filters
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            activeAdminTab === 'users'
              ? 'bg-slate-900 text-white dark:bg-[#c5a059] dark:text-[#0c0d11]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Trader KYC & Badges
        </button>
      </div>

      {/* Tab Content: Moderation Queue */}
      {activeAdminTab === 'moderation' && (
        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-[#212433] flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
              Classified Items Under Surveillance
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Real-time synchronization
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#202332]">
            {collectibles.map((item) => {
              const isFlagged = item.moderationStatus === 'flagged';
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/40 shadow-xs">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] font-serif text-amber-300 text-center font-bold">
                        አጎዛ
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          {item.category.replace('-', ' ')}
                        </span>
                        {isFlagged ? (
                          <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded font-bold">
                            ⚠️ Flagged for Safety
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                            ✓ Approved
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-mono font-bold text-[#1b5e20] dark:text-[#c5a059]">
                          {formatPrice(item.priceETB)}
                        </span>
                        <span>·</span>
                        <span>Seller: {item.seller.name}</span>
                        <span>·</span>
                        <span>{item.seller.location}</span>
                      </div>

                      {item.flagReason && (
                        <p className="text-[11px] text-red-500 dark:text-red-400 font-mono mt-1">
                          Reason: {item.flagReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isFlagged ? (
                      <button
                        onClick={() => handleApprove(item.id, item.title)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Clear & Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlagDrugOrHarm(item.id, item.title)}
                        className="py-1.5 px-3 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-lg border border-amber-300 dark:border-amber-800 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flag Violation</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Permanently remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Drug & Harmful Item Safety Policy */}
      {activeAdminTab === 'safety' && (
        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Agoza Prohibited Items & Narcotics Shield</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In strict accordance with the Federal Democratic Republic of Ethiopia Ministry of Trade and Police regulations, the following categories are unconditionally blocked by our keyword validation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
              <h4 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>1. Narcotics & Prescription Drugs</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Illegal drugs, cannabis/weed, tramadol, opioids, hallucinogens, prescription medications without pharmacy license, and chemical precursors.
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                Active Keywords: drug, weed, narcotic, cocaine, cannabis, tramadol, ዕጸ-ፋርስ
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
              <h4 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>2. Weapons, Ammunition & Hazardous Chemicals</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Firearms, rifles, pistols, military ammunition, explosive devices, poison, hazardous radioactive chemicals, and prohibited military uniforms.
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                Active Keywords: gun, weapon, ammo, bullet, explosive, poison, ብረት መሳሪያ, ቦምብ
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Users & Verification */}
      {activeAdminTab === 'users' && (
        <div className="bg-white dark:bg-[#141622] border border-slate-200 dark:border-[#262939] rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Merchant & Trader Verification Queue
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Dawit Mengistu', role: 'Automotive & Motors Merchant', kyc: true, score: '99.8%' },
              { name: 'Selamawit Tadesse', role: 'Smartphones & Electronics Trader', kyc: true, score: '99.5%' },
              { name: 'Bereket Alemayehu', role: 'Real Estate & Properties Broker', kyc: true, score: '99.9%' },
              { name: 'Kalkidan Assefa', role: 'Home & Traditional Artisan', kyc: true, score: '99.2%' },
            ].map((usr, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#171926] rounded-xl border border-slate-200 dark:border-[#262939]"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{usr.name}</span>
                  <span className="text-[11px] text-slate-500">{usr.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> KYC Verified
                  </span>
                  <span className="font-mono text-slate-500">Trust: {usr.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
