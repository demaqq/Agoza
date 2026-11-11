import React from 'react';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'standard' | 'attached' | 'badge' | 'full';
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'standard',
  subtitle,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Attached/Full Variant
  if (variant === 'attached' || variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#12141f]/95 border border-[#1b5e20]/30 dark:border-[#c5a059]/40 shadow-sm backdrop-blur-md transition-colors ${className}`}>
        <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl overflow-hidden shadow-xs border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center`}>
          <img
            src={agozaLogoImg}
            alt="Agoza"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
        </div>

        <div className="flex flex-col leading-none text-left">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-cinzel font-bold tracking-wider text-slate-900 dark:text-white ${textSizes[size]}`}>
              Agoza
            </span>
            <span className="font-serif text-xs font-bold text-[#1b5e20] dark:text-[#c5a059]">
              አጎዛ
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] tracking-wide text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard Variant (used in Header, Cards, and Footer)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl overflow-hidden shadow-xs border border-amber-400/30 dark:border-[#c5a059]/40 bg-amber-50 dark:bg-[#181a26] flex items-center justify-center`}>
        <img
          src={agozaLogoImg}
          alt="Agoza"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none text-left">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-cinzel font-bold tracking-wider text-slate-900 dark:text-white ${textSizes[size]}`}>
              Agoza
            </span>
            <span className="font-serif text-xs font-bold text-[#1b5e20] dark:text-[#c5a059]">
              አጎዛ
            </span>
          </div>
          {subtitle && (
            <span className="text-[9px] tracking-wide text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
