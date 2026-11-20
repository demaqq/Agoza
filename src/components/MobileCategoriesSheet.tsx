import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CollectibleCategory } from '../types';
import {
  Smartphone,
  Laptop,
  Car,
  Home,
  Shirt,
  Armchair,
  Wheat,
  Briefcase,
  X,
  Sparkles,
  Palette,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  Check,
} from 'lucide-react';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../data/categoriesData';

const iconMap: Record<string, React.ElementType> = {
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

export const MobileCategoriesSheet: React.FC = () => {
  const {
    isMobileCategoriesOpen,
    setIsMobileCategoriesOpen,
    filters,
    setFilters,
  } = useMarketplace();

  const [selectedCatId, setSelectedCatId] = useState<CollectibleCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileCategoriesOpen(false);
      }
    };
    if (isMobileCategoriesOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Pre-select active category if one is active
      if (filters.category && filters.category !== 'all') {
        setSelectedCatId(filters.category);
      }
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileCategoriesOpen, setIsMobileCategoriesOpen, filters.category]);

  if (!isMobileCategoriesOpen) return null;

  const handleSelect = (catId: CollectibleCategory, subId: string = 'all') => {
    setFilters((prev) => ({ ...prev, category: catId, subcategory: subId }));
    setIsMobileCategoriesOpen(false);
    setSelectedCatId(null);
    setSearchQuery('');
  };

  const activeCategoryDef = CATEGORIES_WITH_SUBCATEGORIES.find((c) => c.id === selectedCatId);

  // Instant search results
  const searchResults = searchQuery.trim()
    ? CATEGORIES_WITH_SUBCATEGORIES.filter((c) => c.id !== 'all').flatMap((c) =>
        c.subcategories
          .filter(
            (s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.amharic.includes(searchQuery) ||
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((sub) => ({ cat: c, sub }))
      )
    : null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end flex-col"
      onClick={() => {
        setIsMobileCategoriesOpen(false);
        setSelectedCatId(null);
      }}
    >
      <div
        className="w-full bg-white dark:bg-[#1e130c] border-t border-slate-200 dark:border-[#382214] rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-[#473020] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-[#212433]">
          <div className="flex items-center gap-2">
            {selectedCatId && !searchQuery ? (
              <button
                type="button"
                onClick={() => setSelectedCatId(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#251810] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Categories</span>
              </button>
            ) : (
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
                  <span>Marketplace Categories</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Select category or explore verified subcategories
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsMobileCategoriesOpen(false);
              setSelectedCatId(null);
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#181a26] text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0e1017] border-b border-slate-100 dark:border-[#1d202d]">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all categories & subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 dark:border-[#272a3c] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {searchResults ? (
            /* Search Results */
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Found {searchResults.length} matches
              </span>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No categories matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map(({ cat, sub }) => (
                  <button
                    key={`${cat.id}_${sub.id}`}
                    type="button"
                    onClick={() => handleSelect(cat.id, sub.id)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#382214] bg-slate-50 dark:bg-[#161825] text-left flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                        {cat.name}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {sub.name}
                      </span>
                      <span className="text-[10px] font-serif text-slate-400">
                        {sub.amharic}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))
              )}
            </div>
          ) : selectedCatId && activeCategoryDef ? (
            /* Subcategories Drill-down View */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1f2231]">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeCategoryDef.name}
                  </h4>
                  <span className="text-xs font-serif text-amber-700 dark:text-[#c5a059]">
                    {activeCategoryDef.amharic}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(activeCategoryDef.id, 'all')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black text-xs font-bold shadow-xs cursor-pointer"
                >
                  All {activeCategoryDef.name}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {activeCategoryDef.subcategories.map((sub) => {
                  const isSelectedSub =
                    filters.category === activeCategoryDef.id && filters.subcategory === sub.id;

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelect(activeCategoryDef.id, sub.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                        isSelectedSub
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#1b5e20] dark:border-[#c5a059] shadow-xs'
                          : 'bg-slate-50 dark:bg-[#161825] border-slate-200 dark:border-[#382214]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {sub.name}
                        </span>
                        <span className="text-[11px] font-serif text-slate-500 dark:text-slate-400 block mt-0.5">
                          {sub.amharic}
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isSelectedSub
                            ? 'bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-black'
                            : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelectedSub ? <Check className="w-3 h-3 stroke-[3]" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Primary Categories Grid */
            <div className="grid grid-cols-2 gap-2.5">
              {/* All Treasures */}
              <button
                type="button"
                onClick={() => handleSelect('all', 'all')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 ${
                  filters.category === 'all'
                    ? 'border-[#1b5e20] dark:border-[#c5a059] bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-[#382214] bg-slate-50 dark:bg-[#151724]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    All Treasures
                  </span>
                  <span className="text-[10px] font-serif text-slate-400 block">
                    ሁሉም ቅርሶች
                  </span>
                </div>
              </button>

              {/* Other Primary Categories */}
              {CATEGORIES_WITH_SUBCATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const Icon = iconMap[cat.iconName] || Sparkles;
                const isSelected = filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all ${
                      isSelected
                        ? 'border-[#1b5e20] dark:border-[#c5a059] bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-[#1b5e20]/20'
                        : 'border-slate-200 dark:border-[#382214] bg-slate-50 dark:bg-[#151724] hover:bg-slate-100 dark:hover:bg-[#251810]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cat.badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-serif text-amber-700 dark:text-[#c5a059] block truncate">
                          {cat.amharic}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
