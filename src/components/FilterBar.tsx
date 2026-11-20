import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CollectibleCategory, ItemCondition } from '../types';
import { fmt } from '../i18n/translations';
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

const cityOptionsBase = [
  ...ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').map((c) => ({
    value: c.id, // ids are the plain city names used for matching (e.g. "Adama", not "Adama (Nazret)")
    label: c.name,
    sublabel: `${c.amharic} (${c.region})`,
  })),
];

const CONDITION_VALUES: ItemCondition[] = ['Brand New', 'Like New', 'Used - Excellent', 'Used - Good', 'Refurbished'];

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
    language,
  } = useMarketplace();

  const handleCategoryClick = (category: CollectibleCategory) => {
    setFilters((prev) => ({ ...prev, category, subcategory: 'all' }));
  };

  const handleSubcategoryClick = (subId: string) => {
    setFilters((prev) => ({ ...prev, subcategory: subId }));
  };

  const cityFilterOptions = [{ value: 'all', label: t.filters.allCities }, ...cityOptionsBase];
  const conditionFilterOptions = [
    { value: 'all', label: t.filters.allConditions },
    ...CONDITION_VALUES.map((c) => ({ value: c, label: t.conditions[c] })),
  ];
  const sortFilterOptions = [
    { value: 'latest', label: t.filters.sortLatest },
    { value: 'price-asc', label: t.filters.sortPriceAsc },
    { value: 'price-desc', label: t.filters.sortPriceDesc },
    { value: 'most-popular', label: t.filters.sortPopular },
  ];
  const categoryName = (id: CollectibleCategory) => t.categoryNames[id] || id;

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
    filters.maxPrice > 0 ||
    filters.category !== 'all' ||
    filters.subcategory !== 'all' ||
    filters.condition !== 'all' ||
    (filters.city && filters.city !== 'all' && filters.city !== 'All Ethiopia') ||
    filters.openToTradeOnly ||
    filters.verifiedSellersOnly ||
    Boolean(filters.searchQuery);

  return (
    <div className="bg-white dark:bg-[#1a1009] border-b border-slate-200 dark:border-[#2d1c12] py-2.5 sm:py-3 sticky top-18 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* TOP LEVEL: Primary Categories + Filter Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3">
          {/* Main Category Pills Track */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none scroll-smooth min-w-0 [mask-image:linear-gradient(to_right,black_92%,transparent)]">
            {/* All Categories Suite Trigger */}
            <button
              onClick={() => setIsMobileCategoriesOpen(true)}
              className="px-3 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 border bg-amber-50/90 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 shadow-2xs"
              title={t.filters.browseAll}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.filters.browseAll}</span>
            </button>

            {CATEGORIES_WITH_SUBCATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id;
              const Icon = CATEGORY_ICON_MAP[cat.iconName] || Sparkles;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  aria-pressed={isActive}
                  className={`group relative px-3.5 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#c5a059] dark:text-[#1e130c] dark:border-[#c5a059] shadow-sm ring-2 ring-[#1b5e20]/20 dark:ring-[#c5a059]/30 font-bold scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#251810] dark:text-[#a8907f] dark:hover:text-[#fbf5ef] dark:hover:bg-[#2d1c12] border-slate-200/90 dark:border-[#382214]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white dark:text-[#1e130c]'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <span>{categoryName(cat.id)}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white dark:bg-black/20 dark:text-[#1e130c]'
                          : 'bg-slate-200/80 text-slate-600 dark:bg-[#382214] dark:text-slate-400'
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
            <div className="min-w-[150px]">
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
            <div className="min-w-[150px]">
              <CustomDropdown
                value={filters.condition}
                onChange={(val) => setFilters((prev) => ({ ...prev, condition: val }))}
                options={conditionFilterOptions}
                size="sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="min-w-[150px]">
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
              aria-pressed={filters.openToTradeOnly}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.openToTradeOnly
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-600 dark:bg-[#251810] dark:text-[#a8907f] border-slate-200 dark:border-[#382214] hover:border-slate-300'
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
                <span className="hidden sm:inline">{t.filters.reset}</span>
              </button>
            )}
          </div>
        </div>

        {/* SUBCATEGORIES STRIP: Highly Polished, Sleek Ribbon with Native Ethio Context */}
        {activeCategoryDef && activeCategoryDef.subcategories.length > 0 && (
          <div className="bg-slate-50/90 dark:bg-[#1a1009]/90 border border-slate-200/80 dark:border-[#382214] rounded-2xl p-2.5 transition-all animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#1b5e20] dark:text-[#c5a059]" />
                  <span>{fmt(t.filters.subcategories, { name: categoryName(activeCategoryDef.id) })}</span>
                </span>
                {language !== 'am' && (
                  <span className="text-[11px] font-serif text-slate-500 dark:text-[#a8907f]">
                    ({activeCategoryDef.amharic})
                  </span>
                )}
              </div>

              {filters.subcategory && filters.subcategory !== 'all' && (
                <button
                  onClick={() => handleSubcategoryClick('all')}
                  className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>{fmt(t.filters.showAll, { name: categoryName(activeCategoryDef.id) })}</span>
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
                    : 'bg-white text-slate-700 dark:bg-[#251810] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d1c12] border-slate-200 dark:border-[#473020]'
                }`}
              >
                <span>{fmt(t.filters.showAll, { name: categoryName(activeCategoryDef.id) })}</span>
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
                        ? 'bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#1e130c] border-[#1b5e20] dark:border-[#c5a059] font-bold shadow-xs'
                        : 'bg-white text-slate-700 dark:bg-[#251810] dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#2d1c12] dark:hover:text-white border-slate-200 dark:border-[#473020]'
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
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#1e130c]'
                            : 'bg-slate-100 text-slate-500 dark:bg-[#382214] dark:text-slate-400'
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
