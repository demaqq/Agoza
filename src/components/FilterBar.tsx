import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CollectibleCategory } from '../types';
import {
  RotateCcw,
  ArrowUpDown,
  Filter,
  Sparkles,
  MapPin,
  Palette,
  Smartphone,
  Laptop,
  Car,
  Home,
  Shirt,
  Armchair,
  Wheat,
  BookOpen,
  Briefcase,
  X,
  Layers,
} from 'lucide-react';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../data/categoriesData';
import { ETHIOPIAN_CITIES } from '../data/citiesData';
import { CustomDropdown } from './CustomDropdown';

const cityFilterOptions = [
  { value: 'all', label: 'All Ethiopia', sublabel: 'ሁሉም ከተሞች' },
  ...ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').map((c) => ({
    value: c.name,
    label: c.name,
    sublabel: `${c.amharic} (${c.region})`,
  })),
];

const conditionFilterOptions = [
  { value: 'all', label: 'All Conditions', sublabel: 'ሁሉም ሁኔታዎች' },
  { value: 'Brand New', label: 'Brand New', sublabel: 'Sealed / Unopened' },
  { value: 'Like New', label: 'Like New', sublabel: 'Mint / Barely used' },
  { value: 'Used - Excellent', label: 'Used - Excellent', sublabel: 'Minor signs' },
  { value: 'Used - Good', label: 'Used - Good', sublabel: 'Normal wear' },
  { value: 'Refurbished', label: 'Refurbished', sublabel: 'Certified restored' },
];

const sortFilterOptions = [
  { value: 'latest', label: 'Latest First', sublabel: 'አዲስ የተጨመሩ' },
  { value: 'price-asc', label: 'Price: Low to High', sublabel: 'ዝቅተኛ ዋጋ' },
  { value: 'price-desc', label: 'Price: High to Low', sublabel: 'ከፍተኛ ዋጋ' },
  { value: 'most-popular', label: 'Most Popular', sublabel: 'ተወዳጅ' },
];

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Palette,
  Smartphone,
  Laptop,
  Car,
  Home,
  Shirt,
  Armchair,
  Wheat,
  BookOpen,
  Briefcase,
};

export const FilterBar: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    collectibles,
    setIsMobileCategoriesOpen,
    t,
  } = useMarketplace();

  const handleCategoryClick = (category: CollectibleCategory) => {
    setFilters((prev) => ({ ...prev, category, subcategory: 'all' }));
  };

  const handleSubcategoryClick = (subId: string) => {
    setFilters((prev) => ({ ...prev, subcategory: subId }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, condition: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const activeCategoryDef = CATEGORIES_WITH_SUBCATEGORIES.find(
    (c) => c.id === filters.category
  );

  const activeSubcategoryDef = activeCategoryDef?.subcategories.find(
    (s) => s.id === filters.subcategory
  );

  // Compute category item counts for live badge feedback
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: collectibles.length };
    for (const item of collectibles) {
      counts[item.category] = (counts[item.category] || 0) + 1;
      if (item.subcategory) {
        counts[`sub_${item.subcategory}`] = (counts[`sub_${item.subcategory}`] || 0) + 1;
      }
    }
    return counts;
  }, [collectibles]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.subcategory !== 'all' ||
    filters.condition !== 'all' ||
    (filters.city && filters.city !== 'all' && filters.city !== 'All Ethiopia') ||
    filters.openToTradeOnly ||
    Boolean(filters.searchQuery);

  return (
    <div className="bg-white dark:bg-[#10121a] border-b border-slate-200 dark:border-[#202330] py-2.5 sm:py-3 sticky top-18 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* TOP LEVEL: Primary Categories + Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Main Category Pills Track */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none scroll-smooth">
            {/* All Categories Suite Trigger */}
            <button
              onClick={() => setIsMobileCategoriesOpen(true)}
              className="px-3 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 border bg-amber-50/90 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 shadow-2xs"
              title="Explore all categories & subcategories"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Browse All</span>
            </button>

            {CATEGORIES_WITH_SUBCATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id;
              const Icon = CATEGORY_ICON_MAP[cat.iconName] || Sparkles;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group relative px-3.5 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#c5a059] dark:text-[#110d07] dark:border-[#c5a059] shadow-sm ring-2 ring-[#1b5e20]/20 dark:ring-[#c5a059]/30 font-bold scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#161824] dark:text-[#9ea4b8] dark:hover:text-[#f4f5f8] dark:hover:bg-[#1f2232] border-slate-200/90 dark:border-[#252839]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white dark:text-[#110d07]'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white dark:bg-black/20 dark:text-[#110d07]'
                          : 'bg-slate-200/80 text-slate-600 dark:bg-[#23273a] dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: City, Condition, Sort, Swaps, Reset */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Ethiopian City Dropdown */}
            <div className="min-w-[130px] max-w-[150px]">
              <CustomDropdown
                value={filters.city || 'all'}
                onChange={(val) => setFilters((prev) => ({ ...prev, city: val }))}
                options={cityFilterOptions}
                icon={MapPin}
                size="sm"
                searchable={true}
              />
            </div>

            {/* Condition Dropdown */}
            <div className="min-w-[130px] max-w-[145px]">
              <CustomDropdown
                value={filters.condition}
                onChange={(val) => setFilters((prev) => ({ ...prev, condition: val }))}
                options={conditionFilterOptions}
                size="sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="min-w-[130px] max-w-[145px]">
              <CustomDropdown
                value={filters.sortBy}
                onChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
                options={sortFilterOptions}
                icon={ArrowUpDown}
                size="sm"
              />
            </div>

            {/* Swaps Only Toggle */}
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  openToTradeOnly: !prev.openToTradeOnly,
                }))
              }
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.openToTradeOnly
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-600 dark:bg-[#161824] dark:text-[#888fa0] border-slate-200 dark:border-[#252839] hover:border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.openToSwaps || 'Swaps'}</span>
            </button>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                title={t.resetFilters}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* SUBCATEGORIES STRIP: Highly Polished, Sleek Ribbon with Native Ethio Context */}
        {activeCategoryDef && activeCategoryDef.subcategories.length > 0 && (
          <div className="bg-slate-50/90 dark:bg-[#141622]/90 border border-slate-200/80 dark:border-[#232637] rounded-2xl p-2.5 transition-all animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#c5a059]" />
                  <span>{activeCategoryDef.name} Subcategories</span>
                </span>
                <span className="text-[11px] font-serif text-slate-500 dark:text-[#9ea4b8]">
                  ({activeCategoryDef.amharic})
                </span>
              </div>

              {filters.subcategory && filters.subcategory !== 'all' && (
                <button
                  onClick={() => handleSubcategoryClick('all')}
                  className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>Show All {activeCategoryDef.name}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {/* All in Category Chip */}
              <button
                onClick={() => handleSubcategoryClick('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  !filters.subcategory || filters.subcategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 border-slate-900 dark:border-amber-400 font-bold shadow-xs'
                    : 'bg-white text-slate-700 dark:bg-[#1a1d2c] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222638] border-slate-200 dark:border-[#2b2f42]'
                }`}
              >
                <span>All {activeCategoryDef.name}</span>
                <span className="text-[10px] opacity-70 font-mono">
                  ({categoryCounts[activeCategoryDef.id] || 0})
                </span>
              </button>

              {/* Subcategory Chips */}
              {activeCategoryDef.subcategories.map((sub) => {
                const isSubActive = filters.subcategory === sub.id;
                const subCount = categoryCounts[`sub_${sub.id}`] || 0;

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategoryClick(sub.id)}
                    className={`group px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                      isSubActive
                        ? 'bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#0c0d11] border-[#1b5e20] dark:border-[#c5a059] font-bold shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-[#1a1d2c] dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#222638] dark:hover:text-white border-slate-200 dark:border-[#2b2f42]'
                    }`}
                    title={`${sub.name} (${sub.amharic})`}
                  >
                    <span>{sub.name}</span>
                    <span
                      className={`text-[10px] font-serif opacity-75 hidden sm:inline ${
                        isSubActive ? 'text-emerald-100 dark:text-amber-950' : 'text-slate-400'
                      }`}
                    >
                      · {sub.amharic}
                    </span>
                    {subCount > 0 && (
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                          isSubActive
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#0c0d11]'
                            : 'bg-slate-100 text-slate-500 dark:bg-[#24283b] dark:text-slate-400'
                        }`}
                      >
                        {subCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
