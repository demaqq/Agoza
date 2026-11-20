import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CollectibleCategory } from '../types';
import { CATEGORIES_WITH_SUBCATEGORIES, CategoryDefinition, SubCategoryItem } from '../data/categoriesData';
import {
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
  Check,
  ChevronRight,
  Search,
  X,
  Layers,
} from 'lucide-react';

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

interface CustomCategorySubcategoryPickerProps {
  selectedCategory: CollectibleCategory;
  selectedSubcategory: string;
  onCategoryChange: (category: CollectibleCategory) => void;
  onSubcategoryChange: (subcategory: string) => void;
  className?: string;
  label?: string;
}

export const CustomCategorySubcategoryPicker: React.FC<CustomCategorySubcategoryPickerProps> = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  className = '',
  label = 'Category & Subcategory (የእቃው ዘርፍና ንዑስ ዘርፍ) *',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabCategory, setActiveTabCategory] = useState<CollectibleCategory>(selectedCategory || 'art-collectibles');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync active category tab when modal opens or selectedCategory changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setActiveTabCategory(selectedCategory);
    }
  }, [selectedCategory, isOpen]);

  // Handle ESC key and backdrop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentCategoryDef = useMemo(() => {
    return (
      CATEGORIES_WITH_SUBCATEGORIES.find((c) => c.id === selectedCategory) ||
      CATEGORIES_WITH_SUBCATEGORIES[1]
    );
  }, [selectedCategory]);

  const currentSubcategoryDef = useMemo(() => {
    return currentCategoryDef.subcategories.find((s) => s.id === selectedSubcategory);
  }, [currentCategoryDef, selectedSubcategory]);

  const activeCategoryTabDef = useMemo(() => {
    return (
      CATEGORIES_WITH_SUBCATEGORIES.find((c) => c.id === activeTabCategory) ||
      CATEGORIES_WITH_SUBCATEGORIES[1]
    );
  }, [activeTabCategory]);

  const CurrentIcon = CATEGORY_ICON_MAP[currentCategoryDef.iconName] || Sparkles;

  // Search filter across ALL categories & subcategories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const results: { category: CategoryDefinition; subcategory: SubCategoryItem }[] = [];

    CATEGORIES_WITH_SUBCATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      cat.subcategories.forEach((sub) => {
        const catMatch = cat.name.toLowerCase().includes(q) || cat.amharic.includes(q);
        const subMatch = sub.name.toLowerCase().includes(q) || sub.amharic.includes(q);
        if (catMatch || subMatch) {
          results.push({ category: cat, subcategory: sub });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const handleSelect = (catId: CollectibleCategory, subId: string) => {
    onCategoryChange(catId);
    onSubcategoryChange(subId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            Pro Selector
          </span>
        </label>
      )}

      {/* Trigger Card: Sleek, high-density, professional */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative w-full p-3.5 rounded-2xl bg-white dark:bg-[#151722] hover:bg-amber-50/40 dark:hover:bg-[#1a1d2d] border border-slate-200 dark:border-[#272a3b] hover:border-[#1b5e20] dark:hover:border-[#c5a059] text-left transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${currentCategoryDef.badgeColor} shadow-2xs group-hover:scale-105 transition-transform`}>
            <CurrentIcon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentCategoryDef.name}
              </span>
              <span className="text-xs font-serif text-amber-700 dark:text-[#c5a059]">
                ({currentCategoryDef.amharic})
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-600 dark:text-[#9fa6ba] truncate">
              <span className="font-semibold text-[#1b5e20] dark:text-[#c5a059] flex items-center gap-1 truncate">
                <Layers className="w-3 h-3 shrink-0" />
                {currentSubcategoryDef ? currentSubcategoryDef.name : 'General / All Subcategories'}
              </span>
              {currentSubcategoryDef && (
                <span className="text-[11px] opacity-75 font-serif hidden sm:inline">
                  · {currentSubcategoryDef.amharic}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#202334] group-hover:bg-[#1b5e20] group-hover:text-white dark:group-hover:bg-[#c5a059] dark:group-hover:text-[#0f1118] text-slate-700 dark:text-[#d3d7e4] text-xs font-bold border border-slate-200 dark:border-[#2e3247] transition-all flex items-center gap-1">
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* PRO DUAL-PANE MODAL DIALOG */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#262939] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Search */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#212433] bg-slate-50 dark:bg-[#0d0f17] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Marketplace Category & Subcategory Suite
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8d93a7]">
                      Select standard classification for instant search indexing and verified handoff in Ethiopia
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#251810] text-slate-600 dark:text-[#8e94a6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#2a2d3e] transition-colors cursor-pointer shrink-0"
                  aria-label="Close category selector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Instant search categories or items (e.g., 'iPhone', 'RAV4', 'Habesha Kemis', 'Mesob', 'Coffee')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#251810] text-slate-900 dark:text-white text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-[#292c3f] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059] shadow-2xs font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Search View OR Dual-Pane Explorer */}
            <div className="flex-1 overflow-hidden min-h-[380px] max-h-[550px] flex flex-col">
              {searchResults ? (
                /* Instant Search Results Grid */
                <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Matching Results ({searchResults.length})</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm font-semibold">No category matches for "{searchQuery}"</p>
                      <p className="text-xs mt-1">Try searching broader keywords like "Car", "Art", "Phone", or "Coffee"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchResults.map(({ category, subcategory }) => {
                        const Icon = CATEGORY_ICON_MAP[category.iconName] || Sparkles;
                        const isCurrent =
                          selectedCategory === category.id && selectedSubcategory === subcategory.id;

                        return (
                          <button
                            key={`${category.id}_${subcategory.id}`}
                            type="button"
                            onClick={() => handleSelect(category.id, subcategory.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isCurrent
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#1b5e20] dark:border-[#c5a059] shadow-xs'
                                : 'bg-slate-50 dark:bg-[#161825] border-slate-200 dark:border-[#262939] hover:bg-slate-100 dark:hover:bg-[#1d202f] hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${category.badgeColor}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block truncate">
                                  {category.name}
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                  {subcategory.name}
                                </span>
                                <span className="text-[10px] font-serif text-slate-400 block truncate">
                                  {subcategory.amharic}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c]'
                                  : 'border border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isCurrent ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Dual-Pane Master Detail Layout */
                <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                  {/* LEFT PANE: Primary Categories List */}
                  <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-[#212433] bg-slate-50/70 dark:bg-[#0f1119] overflow-y-auto p-2 sm:p-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                      Primary Categories (10)
                    </span>

                    {CATEGORIES_WITH_SUBCATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                      const Icon = CATEGORY_ICON_MAP[cat.iconName] || Sparkles;
                      const isSelectedCat = activeTabCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveTabCategory(cat.id)}
                          className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                            isSelectedCat
                              ? 'bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#0b0c10] font-bold shadow-xs'
                              : 'bg-transparent text-slate-700 dark:text-[#a8907f] hover:bg-slate-200/70 dark:hover:bg-[#181a26]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isSelectedCat ? 'text-white dark:text-[#0b0c10]' : 'text-amber-600 dark:text-amber-400'
                              }`}
                            />
                            <div className="min-w-0">
                              <span className="text-xs block truncate leading-tight">
                                {cat.name}
                              </span>
                              <span
                                className={`text-[10px] font-serif block truncate ${
                                  isSelectedCat ? 'text-emerald-100 dark:text-black/80' : 'text-slate-400'
                                }`}
                              >
                                {cat.amharic}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                                isSelectedCat
                                  ? 'bg-black/20 text-white dark:text-[#0b0c10]'
                                  : 'bg-slate-200/80 dark:bg-[#2d1c12] text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {cat.subcategories.length}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelectedCat ? 'opacity-100' : 'opacity-40'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* RIGHT PANE: Subcategories Matrix */}
                  <div className="flex-1 bg-white dark:bg-[#12141e] overflow-y-auto p-4 sm:p-6 space-y-4">
                    {/* Active Category Header */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#1e2130]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {activeCategoryTabDef.name} Subcategories
                          </h4>
                          <span className="text-xs font-serif text-amber-700 dark:text-[#c5a059]">
                            ({activeCategoryTabDef.amharic})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Choose the specific subcategory to maximize targeted buyer inquiries
                        </p>
                      </div>

                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1a1c29] text-slate-600 dark:text-slate-300">
                        {activeCategoryTabDef.subcategories.length} Available
                      </span>
                    </div>

                    {/* Subcategories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeCategoryTabDef.subcategories.map((sub) => {
                        const isThisSelected =
                          selectedCategory === activeCategoryTabDef.id &&
                          selectedSubcategory === sub.id;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelect(activeCategoryTabDef.id, sub.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                              isThisSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#1b5e20] dark:border-[#c5a059] shadow-xs ring-1 ring-[#1b5e20]/20 dark:ring-[#c5a059]/30'
                                : 'bg-slate-50/80 dark:bg-[#161825] border-slate-200 dark:border-[#382214] hover:bg-amber-50/50 dark:hover:bg-[#1d202f] hover:border-amber-300 dark:hover:border-amber-700/60'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1b5e20] dark:group-hover:text-[#c5a059] transition-colors block truncate">
                                {sub.name}
                              </span>
                              <span className="text-[11px] font-serif text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                                {sub.amharic}
                              </span>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isThisSelected
                                  ? 'bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#0b0c10]'
                                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1a1c29] group-hover:border-amber-400'
                              }`}
                            >
                              {isThisSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Summary */}
            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-[#212433] bg-slate-50 dark:bg-[#0d0f17] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs truncate min-w-0">
                <span className="text-slate-500 hidden sm:inline">Active Choice:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  <span className="text-[#1b5e20] dark:text-[#c5a059] font-semibold">{currentCategoryDef.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{currentSubcategoryDef?.name || 'General'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a1c29] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#0b0c10] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
