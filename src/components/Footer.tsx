import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setActiveView, setIsPlansModalOpen, t } = useMarketplace();

  return (
    <footer className="bg-[#fefce8] dark:bg-[#170e08] border-t border-amber-200/90 dark:border-[#382212] text-xs text-slate-600 dark:text-[#b8a391] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-amber-200/70 dark:border-[#2e1b0e]">
          <div>
            <div className="mb-2">
              <Logo size="sm" showText={true} />
            </div>
            <p className="text-xs text-slate-600 dark:text-[#c4b19f] max-w-sm">
              {t.appTagline} · Smartphones, electronics, vehicles, fashion, real estate, and verified peer-to-peer e-commerce across Ethiopia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700 dark:text-[#ddccbe]">
            <button
              onClick={() => setActiveView('marketplace')}
              className="hover:text-[#1b5e20] dark:hover:text-white transition-colors cursor-pointer"
            >
              All Items
            </button>
            <button
              onClick={() => setIsPlansModalOpen(true)}
              className="hover:text-amber-800 dark:hover:text-amber-300 font-semibold text-amber-700 dark:text-[#d4a373] transition-colors cursor-pointer"
            >
              Plans (Starter 699 Br / Pro 1,499 Br)
            </button>
            <button
              onClick={() => setActiveView('user-dashboard')}
              className="hover:text-[#1b5e20] dark:hover:text-white transition-colors cursor-pointer"
            >
              {t.navUserDashboard}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-slate-500 dark:text-[#998675]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#d4a373]" />
            <span>Verified Protected Handoffs · Safe Exchange Stations in Addis Ababa & Regional Hubs · Telebirr & CBE Escrow</span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} Agoza (አጎዛ) P2P E-Commerce Marketplace. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
