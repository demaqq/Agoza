import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Search,
  X,
  ArrowRight,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { CollectibleCategory } from '../types';
import { CATEGORIES_WITH_SUBCATEGORIES } from '../data/categoriesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCH_TERMS = [
  'Samsung Galaxy S24',
  'iPhone 15 Pro Max',
  'MacBook Pro M3',
  'Toyota Vitz',
  'Yirgacheffe Buna',
  'Habesha Kemis',
  'Sony WH-1000XM5',
  'Solid Hardwood Dining',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const {
    collectibles,
    filters,
    setFilters,
    setSelectedCollectible,
    formatPrice,
    setActiveView,
  } = useMarketplace();

  const [query, setQuery] = useState(filters.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<CollectibleCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open and sync state
  useEffect(() => {
    if (isOpen) {
      setQuery(filters.searchQuery || '');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, filters.searchQuery, onClose]);

  // Live matching items
  const matchingItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collectibles.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = (
        item.title +
        ' ' +
        item.description +
        ' ' +
        (item.brand || '') +
        ' ' +
        (item.model || '') +
        ' ' +
        item.condition +
        ' ' +
        item.origin +
        ' ' +
        item.seller.name +
        ' ' +
        (item.seller.city || '') +
        ' ' +
        (item.seller.location || '')
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [collectibles, query, selectedCategory]);

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    setFilters((prev) => ({ ...prev, searchQuery: term, category: selectedCategory }));
    setActiveView('marketplace');
    onClose();
    setTimeout(() => {
      const el = document.getElementById('marketplace-feed-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: query.trim(),
      category: selectedCategory,
    }));
    setActiveView('marketplace');
    onClose();
    setTimeout(() => {
      const el = document.getElementById('marketplace-feed-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleItemClick = (item: typeof collectibles[0]) => {
    setSelectedCollectible(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#fffdf7] dark:bg-[#1e130c] rounded-3xl shadow-2xl border border-amber-200/80 dark:border-[#382214] overflow-hidden flex flex-col max-h-[88vh] mt-8 sm:mt-14 animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header & Input */}
        <form
          onSubmit={handleExecuteSearch}
          className="p-3 sm:p-4 border-b border-amber-200/80 dark:border-[#382214] flex items-center gap-2.5 bg-white dark:bg-[#251810]"
        >
          <div className="p-2 text-amber-700 dark:text-[#d4a373] shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, laptops, cars, coffee, fashion, home..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-[#fbf5ef] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#342115] rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Cancel
          </button>
        </form>

        {/* Quick Category Tabs in Search Modal */}
        <div className="px-4 py-2 border-b border-amber-100 dark:border-[#2d1b10] flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-[#fbf9f4] dark:bg-[#1a1009] shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                : 'bg-white dark:bg-[#251810] text-slate-600 dark:text-[#b89f8b] border border-slate-200 dark:border-[#3d2516]'
            }`}
          >
            All Items
          </button>
          {CATEGORIES_WITH_SUBCATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold shrink-0 cursor-pointer transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                  : 'bg-white dark:bg-[#251810] text-slate-600 dark:text-[#b89f8b] border border-slate-200 dark:border-[#3d2516]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Area: Suggestions vs Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Trending Suggestions when search query is empty */}
          {!query.trim() && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-[#d4a373] uppercase tracking-wider mb-2.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Popular Searches in Ethiopia</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTerm(term)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#251810] border border-amber-200 dark:border-[#422919] text-slate-800 dark:text-[#f3ddc9] hover:border-[#1b5e20] dark:hover:border-[#d4a373] hover:bg-amber-50 dark:hover:bg-[#2e1d13] transition-all cursor-pointer font-medium flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results count header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#a8907f] pt-1">
            <span>
              {matchingItems.length} {matchingItems.length === 1 ? 'result' : 'results'} found
              {query.trim() ? ` for "${query}"` : ''}
            </span>
            {matchingItems.length > 0 && query.trim() && (
              <button
                type="button"
                onClick={() => handleExecuteSearch()}
                className="text-[#1b5e20] dark:text-[#d4a373] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View all in feed</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Matching Items List */}
          <div className="space-y-2">
            {matchingItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="p-2.5 rounded-2xl bg-white dark:bg-[#251810] border border-slate-200/90 dark:border-[#3d2719] hover:border-[#1b5e20] dark:hover:border-[#d4a373] hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1a1009] shrink-0 border border-slate-200/60 dark:border-[#382214]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#d4a373] truncate">
                      {item.category.replace('-', ' & ')}
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.condition}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#fbf5ef] truncate group-hover:text-[#1b5e20] dark:group-hover:text-[#d4a373] transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-[#b89f8b]">
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="w-3 h-3 text-amber-600 dark:text-[#d4a373]" />
                      <span>{item.seller.city || item.origin}</span>
                    </span>
                    <span>·</span>
                    <span>{item.seller.name}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-extrabold text-[#1b5e20] dark:text-[#d4a373]">
                    {formatPrice(item.priceETB)}
                  </div>
                  {item.openToTrade && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Swap
                    </span>
                  )}
                </div>
              </div>
            ))}

            {matchingItems.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 space-y-2">
                <Search className="w-8 h-8 mx-auto opacity-40 text-amber-600" />
                <p className="text-xs font-medium">No verified listings match &ldquo;{query}&rdquo;</p>
                <p className="text-[11px]">Try checking spelling or browsing popular categories</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        {matchingItems.length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-[#1a1009] border-t border-amber-100 dark:border-[#2d1b10] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-[#a8907f] text-[11px]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#382214] font-mono text-[10px]">Enter</kbd> to search
            </span>
            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              className="px-4 py-1.5 rounded-xl bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold cursor-pointer transition-colors"
            >
              Show All Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
