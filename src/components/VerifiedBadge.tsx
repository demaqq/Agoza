import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Check } from 'lucide-react';

export interface VerifiedBadgeProps {
  variant?: 'listing' | 'seller' | 'profile' | 'compact' | 'inspection';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  variant = 'listing',
  size = 'sm',
  label,
  className = '',
  showIcon = true,
}) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] sm:text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  if (variant === 'seller') {
    return (
      <span
        className={`inline-flex items-center rounded-lg font-bold border transition-colors bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/60 shadow-2xs ${sizeClasses[size]} ${className}`}
        title="Authenticated & Verified Seller"
      >
        {showIcon && <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 dark:text-emerald-400 shrink-0`} />}
        <span>{label || 'Verified Seller'}</span>
      </span>
    );
  }

  if (variant === 'profile') {
    return (
      <span
        className={`inline-flex items-center rounded-xl font-bold border shadow-xs transition-colors bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border-amber-400/60 dark:border-amber-500/50 text-slate-900 dark:text-amber-300 ${sizeClasses[size]} ${className}`}
        title="Authenticated Identity & Verified Trader Profile"
      >
        {showIcon && (
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
          </div>
        )}
        <span>{label || 'Verified Trader'}</span>
      </span>
    );
  }

  if (variant === 'inspection') {
    return (
      <span
        className={`inline-flex items-center rounded-lg font-medium border bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 ${sizeClasses[size]} ${className}`}
        title="Physical Item In-Person Inspection Authenticated"
      >
        {showIcon && <Award className={`${iconSizes[size]} text-blue-600 dark:text-blue-400 shrink-0`} />}
        <span>{label || 'Physical Inspection Verified'}</span>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center rounded-md font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/50 ${sizeClasses[size]} ${className}`}
        title="Verified Authenticated Listing"
      >
        {showIcon && <Check className={`${iconSizes[size]} stroke-[3] text-emerald-600 dark:text-emerald-400 shrink-0`} />}
        <span>{label || 'Verified'}</span>
      </span>
    );
  }

  // Default: 'listing' authenticated badge
  return (
    <span
      className={`inline-flex items-center rounded-lg font-bold border transition-colors bg-emerald-600 text-white dark:bg-[#1b5e20] dark:text-emerald-100 border-emerald-500 dark:border-emerald-600/80 shadow-xs ${sizeClasses[size]} ${className}`}
      title="Authenticated & Verified Listing"
    >
      {showIcon && <ShieldCheck className={`${iconSizes[size]} text-white dark:text-amber-300 shrink-0`} />}
      <span>{label || 'Verified Authenticated'}</span>
    </span>
  );
};
