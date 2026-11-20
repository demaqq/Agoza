import { fmt } from '../i18n/translations';
import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Sparkles,
  MapPin,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
  Tag,
  RotateCcw,
  Gift,
} from 'lucide-react';
import {
  CoffeeBeansIcon,
  CoffeeSackIcon,
  JebenaIcon,
  MesobIcon,
} from './EthiopianIcons';
import { BunaBlessingToken } from './BunaBlessingToken';

import { CollectibleCategory } from '../types';

const BUDGET_OPTIONS = [
  { value: 0, label: 'Any Budget (ያልተገደበ)' },
  { value: 15000, label: 'Under 15,000 Br' },
  { value: 35000, label: 'Under 35,000 Br' },
  { value: 75000, label: 'Under 75,000 Br' },
  { value: 150000, label: 'Under 150,000 Br' },
  { value: 500000, label: 'Under 500,000 Br' },
];

const CUSTOMER_INTERESTS: {
  id: CollectibleCategory;
  label: string;
  amharic: string;
  icon: React.ElementType;
}[] = [
  { id: 'phones-tablets', label: 'Phones & Gadgets', amharic: 'ስልኮች', icon: Zap },
  { id: 'electronics-laptops', label: 'Laptops & Tech', amharic: 'ላፕቶፕ', icon: Sparkles },
  { id: 'vehicles-cars', label: 'Cars & Auto', amharic: 'መኪና', icon: Tag },
  { id: 'agriculture-food', label: 'Coffee & Agro', amharic: 'ቡና እና ጆንያ', icon: CoffeeBeansIcon },
  { id: 'fashion-clothes', label: 'Fashion & Sneakers', amharic: 'ፋሽንና ጫማ', icon: MesobIcon },
  { id: 'home-furniture', label: 'Home & Living', amharic: 'የቤት እቃዎች', icon: JebenaIcon },
];

export const CustomerWiseBar: React.FC = () => {
  const {
    filters,
    setFilters,
    collectibles,
    currentUser,
    selectedCity,
    formatPrice,
    t,
  } = useMarketplace();
  const w = t.wise;
  const myCity = currentUser?.city || selectedCity || 'Addis Ababa';

  const [isCustomerWiseActive, setIsCustomerWiseActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [selectedMaxBudget, setSelectedMaxBudget] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState<CollectibleCategory[]>([]);
  const onlyVerifiedSellers = filters.verifiedSellersOnly;
  const setOnlyVerifiedSellers = (v: boolean) => setFilters((prev) => ({ ...prev, verifiedSellersOnly: v }));

  // When customer-wise mode is activated, apply personal preferences
  useEffect(() => {
    if (isCustomerWiseActive) {
      setFilters((prev) => ({
        ...prev,
        city: myCity,
        maxPrice: selectedMaxBudget > 0 ? selectedMaxBudget : 0,
        category: selectedInterests.length === 1 ? selectedInterests[0] : 'all',
      }));
    }
  }, [isCustomerWiseActive, selectedMaxBudget, selectedInterests, myCity, setFilters]);

  const toggleInterest = (catId: CollectibleCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleResetPreferences = () => {
    setIsCustomerWiseActive(false);
    setSelectedMaxBudget(0);
    setSelectedInterests([]);
    setFilters((prev) => ({
      ...prev,
      verifiedSellersOnly: false,
      city: 'all',
      maxPrice: 0,
      category: 'all',
      subcategory: 'all',
      openToTradeOnly: false,
    }));
  };

  // Compute how many items match the customer's current preference
  const matchingCustomerItems = collectibles.filter((c) => {
    if (selectedMaxBudget > 0 && c.priceETB > selectedMaxBudget) return false;
    if (
      isCustomerWiseActive &&
      filters.city &&
      filters.city !== 'all' &&
      filters.city !== 'All Ethiopia' &&
      !c.seller.location.toLowerCase().includes(filters.city.toLowerCase())
    ) {
      return false;
    }
    if (selectedInterests.length > 0 && !selectedInterests.includes(c.category)) {
      return false;
    }
    if (onlyVerifiedSellers && !c.seller.verifiedKyc) return false;
    return true;
  }).length;

  return (
    <div className="bg-[#fffdf5] dark:bg-[#251810] border-y border-amber-200/90 dark:border-[#4a3221] transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Main Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Customer Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-[#382317] border border-amber-300 dark:border-[#5a3a24] text-amber-800 dark:text-[#d4a373] flex items-center justify-center shrink-0 shadow-2xs">
              <CoffeeBeansIcon className="w-5 h-5 text-amber-700 dark:text-[#d4a373]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#fbf5ef] flex items-center gap-1.5">
                  <span>{w.title}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-[#3d2719] text-amber-900 dark:text-[#e4c4a8] font-bold border border-amber-200 dark:border-[#523522]">
                  {fmt(w.matches, { count: matchingCustomerItems })}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-[#c4a996] leading-tight hidden sm:block">
                {w.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Controls & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Customer Mode Activation Switch */}
            <button
              type="button"
              onClick={() => {
                const nextState = !isCustomerWiseActive;
                setIsCustomerWiseActive(nextState);
                if (nextState && !isDrawerOpen) setIsDrawerOpen(true);
              }}
              aria-pressed={isCustomerWiseActive}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                isCustomerWiseActive
                  ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c] dark:border-[#d4a373]'
                  : 'bg-white text-slate-700 border-slate-200 dark:bg-[#2e1d14] dark:text-[#d7beaa] dark:border-[#4a3221] hover:border-amber-400'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isCustomerWiseActive ? `${w.tailored} ✓` : w.tailorForMe}</span>
            </button>

            {/* Customer City Chip */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#2e1d14] border border-slate-200 dark:border-[#4a3221] text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4a373]" />
              <span className="text-slate-500 dark:text-[#9e8471] text-[11px]">{w.myCity}</span>
              <span className="font-bold text-slate-900 dark:text-white">{myCity}</span>
            </div>

            {/* Customer Loyalty Coffee Beans Pill */}
            <button
              type="button"
              onClick={() => setIsRewardsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-[#342318] dark:hover:bg-[#422919] border border-amber-300 dark:border-[#523522] text-xs font-bold text-amber-900 dark:text-[#d4a373] transition-colors cursor-pointer"
              title={fmt(w.beans, { count: 195 })}
            >
              <CoffeeBeansIcon className="w-3.5 h-3.5" />
              <span>{fmt(w.beans, { count: 195 })}</span>
              <Gift className="w-3 h-3 text-amber-700 dark:text-[#e0b487]" />
            </button>

            {/* Expand / Collapse Preferences Drawer */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-expanded={isDrawerOpen}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#2e1d14] text-slate-700 dark:text-[#d7beaa] border border-slate-200 dark:border-[#4a3221] hover:bg-amber-50 dark:hover:bg-[#392419] transition-colors cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-[#d4a373]" />
              <span>{w.preferences}</span>
              {isDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Button */}
            {(isCustomerWiseActive || selectedMaxBudget > 0 || selectedInterests.length > 0) && (
              <button
                type="button"
                onClick={handleResetPreferences}
                className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-[#9e8471] dark:hover:text-rose-400 transition-colors"
                title={w.reset}
                aria-label={w.reset}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Preferences Drawer */}
        {isDrawerOpen && (
          <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-[#3d2719] space-y-3 animate-fadeIn">
            {/* Row 1: Budget Cap & Verified Protection */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Budget Cap Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-[#d7beaa]">
                  {w.budgetCap}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedMaxBudget(opt.value);
                        setIsCustomerWiseActive(true);
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: opt.value > 0 ? opt.value : 0,
                        }));
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer border ${
                        selectedMaxBudget === opt.value
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c] dark:border-[#d4a373] font-bold shadow-2xs'
                          : 'bg-white dark:bg-[#1f140e] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4a3221] hover:border-amber-400'
                      }`}
                    >
                      {opt.value === 0 ? w.anyBudget : fmt(w.under, { price: formatPrice(opt.value) })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Sellers Guarantee Toggle */}
              <button
                type="button"
                onClick={() => setOnlyVerifiedSellers(!onlyVerifiedSellers)}
                aria-pressed={onlyVerifiedSellers}
                className={`px-3 py-1 text-xs rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  onlyVerifiedSellers
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-[#1f140e] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4a3221]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{w.verifiedOnly}</span>
                {onlyVerifiedSellers && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>

            {/* Row 2: Customer Category Interests (With Coffee, Jonia & Artisan Motifs) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-[#d7beaa] shrink-0">
                {w.interests}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CUSTOMER_INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = selectedInterests.includes(interest.id);

                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => {
                        toggleInterest(interest.id);
                        setIsCustomerWiseActive(true);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c] dark:border-[#d4a373] font-bold shadow-2xs'
                          : 'bg-white dark:bg-[#1f140e] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4a3221] hover:border-amber-400'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-[#1e130c]' : 'text-amber-700 dark:text-[#d4a373]'}`} />
                      <span>{t.categoryNames[interest.id] || interest.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Guarantee Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-amber-50/70 dark:bg-[#1c120b] border border-amber-200 dark:border-[#382316] text-[11px] text-slate-600 dark:text-[#b89f8b]">
              <div className="flex items-center gap-2">
                <CoffeeSackIcon className="w-4 h-4 text-amber-700 dark:text-[#d4a373] shrink-0" />
                <span>
                  <strong>{w.safeTitle}</strong> {w.safeBody}
                </span>
              </div>
              <span className="font-mono text-amber-800 dark:text-[#d4a373] font-bold">
                {w.guarantee}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Customer Loyalty Coffee Beans Rewards Modal */}
      <BunaBlessingToken
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        sellerName="Agoza Marketplace Merchant"
        itemTitle="Verified Customer Trade"
      />
    </div>
  );
};
