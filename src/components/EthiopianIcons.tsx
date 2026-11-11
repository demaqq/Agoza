import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// 1. Roasted Coffee Beans (የተቆላ ቡና)
export const CoffeeBeansIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Bean 1 */}
    <g transform="rotate(-25 10 10)">
      <path
        d="M10 3.5C6.5 3.5 4 6.5 4 10.5C4 14.5 6.8 17.5 10 17.5C13.5 17.5 16 14.5 16 10.5C16 6.5 13.2 3.5 10 3.5Z"
        fill="currentColor"
      />
      <path
        d="M10 4C8.8 6.5 11.2 9.5 10 12C8.8 14.5 11.2 16.5 10 17"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </g>
    {/* Bean 2 */}
    <g transform="rotate(35 16 14)">
      <path
        d="M16 8C13.5 8 11.5 10.2 11.5 13.5C11.5 16.8 13.8 19 16 19C18.5 19 20.5 16.8 20.5 13.5C20.5 10.2 18.2 8 16 8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M16 8.5C15 10.5 17 12.8 16 15C15 17 16.8 18.5 16 18.5"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </g>
  </svg>
);

// 2. Coffee Sack / Burlap Sac (ጆንያ - Jonia)
export const CoffeeSackIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Tied gathered top of burlap sack */}
    <path
      d="M8.5 4.5C8.5 3.5 9.5 2.5 12 2.5C14.5 2.5 15.5 3.5 15.5 4.5C14 5 13 5.5 12 5.5C11 5.5 10 5 8.5 4.5Z"
      fill="currentColor"
      opacity="0.85"
    />
    {/* Tie cord */}
    <rect x="9" y="5" width="6" height="1.8" rx="0.9" fill="#c5a059" />
    {/* Sack body */}
    <path
      d="M6 7C5 10 4.5 14 5 18C5.5 20.5 7.5 21.5 12 21.5C16.5 21.5 18.5 20.5 19 18C19.5 14 19 10 18 7C15.5 7.8 14 8 12 8C10 8 8.5 7.8 6 7Z"
      fill="currentColor"
    />
    {/* Stitched seam lines */}
    <path
      d="M12 9V20"
      stroke="#c5a059"
      strokeWidth="1.2"
      strokeDasharray="1.5 1.5"
      strokeLinecap="round"
      opacity="0.75"
    />
    {/* Bean stamp on the burlap sack */}
    <ellipse cx="12" cy="14.5" rx="2.5" ry="3.5" fill="#2d190e" opacity="0.6" />
    <path
      d="M12 11.8C11.3 13.2 12.7 15 12 17.2"
      stroke="#fff"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

// 3. Traditional Clay Jebena (የሸክላ ጀበና)
export const JebenaIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Top opening / lid stopper */}
    <ellipse cx="12" cy="3" rx="2" ry="1" fill="currentColor" />
    <path d="M11 3.5V6H13V3.5H11Z" fill="currentColor" />
    {/* Slender neck */}
    <path d="M10.5 6C10.5 7.5 9.5 9 8.5 10H15.5C14.5 9 13.5 7.5 13.5 6H10.5Z" fill="currentColor" />
    {/* Round spherical pot base */}
    <circle cx="12" cy="15" r="5.5" fill="currentColor" />
    {/* Spout */}
    <path
      d="M16 13C17.5 11.5 19.5 9 20.5 6.5C19.5 6.5 18.5 7 17 8C16 8.7 15.5 10 15 11.5"
      fill="currentColor"
    />
    {/* Loop Handle */}
    <path
      d="M8.5 8.5C6 9 5 11.5 5 14C5 15.5 6 17 8 17.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Ring base (Mat) */}
    <ellipse cx="12" cy="20.5" rx="3.5" ry="1.2" fill="#c5a059" opacity="0.9" />
  </svg>
);

// 4. Traditional Mesob (ባህላዊ መሶብ)
export const MesobIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Top Crown Knob */}
    <circle cx="12" cy="2.5" r="1.5" fill="#c5a059" />
    {/* Conical Woven Lid */}
    <path
      d="M12 4L5 13C7.5 13.5 9.5 13.8 12 13.8C14.5 13.8 16.5 13.5 19 13L12 4Z"
      fill="currentColor"
    />
    {/* Decorative colorful stripes on lid */}
    <path d="M7.5 10.5C9 11 10.5 11.2 12 11.2C13.5 11.2 15 11 16.5 10.5" stroke="#c5a059" strokeWidth="1" />
    <path d="M9.5 7.5C10.5 7.8 11.2 8 12 8C12.8 8 13.5 7.8 14.5 7.5" stroke="#e11d48" strokeWidth="1" />
    {/* Base Table */}
    <path
      d="M6 14C6 14 7 19 8.5 21H15.5C17 19 18 14 18 14C15.5 14.8 13.8 15 12 15C10.2 15 8.5 14.8 6 14Z"
      fill="currentColor"
      opacity="0.9"
    />
    <ellipse cx="12" cy="21" rx="4" ry="1" fill="#c5a059" />
  </svg>
);

// 5. Historic Coptic Cross (የኢትዮጵያ መስቀል)
export const CopticCrossIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Central cross */}
    <path
      d="M12 2V22M6 8H18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
    />
    {/* Top crosslet */}
    <path d="M10 4H14" stroke="currentColor" strokeWidth="1.5" />
    {/* Left arm crosslet */}
    <path d="M7 6V10" stroke="currentColor" strokeWidth="1.5" />
    {/* Right arm crosslet */}
    <path d="M17 6V10" stroke="currentColor" strokeWidth="1.5" />
    {/* Intersecting ornamental filigree ring */}
    <circle cx="12" cy="8" r="3.2" stroke="#c5a059" strokeWidth="1.2" fill="none" />
    {/* Lower handle base / shaft details */}
    <path d="M9 16H15M10 19H14" stroke="#c5a059" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
