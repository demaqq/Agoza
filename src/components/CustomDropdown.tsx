import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ElementType;
  badge?: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select option...',
  className = '',
  icon: IconComponent,
  size = 'md',
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, searchable]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs',
    md: 'py-2.5 px-3.5 text-xs',
    lg: 'py-3 px-4 text-sm',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-[#d7beaa] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button: Medium Roasted Coffee in Dark Mode */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-[#251911] hover:bg-slate-100 dark:hover:bg-[#2e1f16] border ${
          isOpen
            ? 'border-[#1b5e20] dark:border-[#d4a373] ring-2 ring-[#1b5e20]/15 dark:ring-[#d4a373]/25'
            : 'border-slate-200 dark:border-[#473021]'
        } rounded-xl ${sizeClasses[size]} text-left font-medium text-slate-900 dark:text-[#fbf5ef] flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {IconComponent && <IconComponent className="w-4 h-4 text-amber-600 dark:text-[#d4a373] shrink-0" />}
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-[#1b5e20] dark:text-[#d4a373] shrink-0" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.sublabel && (
            <span className="text-[11px] text-slate-400 dark:text-[#b89f8b] font-serif truncate hidden sm:inline">
              ({selectedOption.sublabel})
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-[#b89f8b] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-600 dark:text-[#d4a373]' : ''
          }`}
        />
      </button>

      {/* Custom Dropdown Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-72 overflow-y-auto bg-white dark:bg-[#261a12] border border-slate-200 dark:border-[#4d3424] rounded-2xl shadow-2xl py-1.5 backdrop-blur-md animate-fadeIn">
          {searchable && (
            <div className="p-2 border-b border-slate-100 dark:border-[#382519] sticky top-0 bg-white/95 dark:bg-[#261a12]/95 backdrop-blur-xs">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#a18875] absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Filter options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#1e130c] text-slate-900 dark:text-[#fbf5ef] text-xs pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-[#422d1f] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#d4a373]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 dark:text-[#a18875]">
              No options match "{searchQuery}"
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-[#382619] text-[#1b5e20] dark:text-[#d4a373] font-bold'
                      : 'text-slate-700 dark:text-[#d7beaa] hover:bg-slate-100/80 dark:hover:bg-[#312015] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {OptionIcon && (
                      <OptionIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#1b5e20] dark:text-[#d4a373]' : 'text-slate-400 dark:text-[#9c8472]'}`} />
                    )}
                    <div className="truncate">
                      <span className="block truncate">{option.label}</span>
                      {option.sublabel && (
                        <span className="text-[10px] text-slate-400 dark:text-[#a18875] font-serif block">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {option.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#362316] text-slate-500 dark:text-[#c4a996]">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#1b5e20] dark:bg-[#d4a373] text-white dark:text-[#1e130c] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
