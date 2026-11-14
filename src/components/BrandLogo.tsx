import { RESORT_LOGO_SRC } from '../data/resortData';

interface BrandLogoProps {
  variant?: 'header' | 'intro' | 'footer';
  className?: string;
}

export function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  if (variant === 'intro') {
    return (
      <img
        src={RESORT_LOGO_SRC}
        alt="Home Sweet Home Resort"
        referrerPolicy="no-referrer"
        className={`h-24 w-auto object-contain mix-blend-multiply select-none ${className}`}
      />
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center rounded-xl bg-[#F8F5EF] px-3 py-2 shadow-sm border border-[#C5A46D]/25 ${className}`}>
        <img
          src={RESORT_LOGO_SRC}
          alt="Home Sweet Home Resort"
          referrerPolicy="no-referrer"
          className="h-12 w-auto object-contain mix-blend-multiply select-none"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-300 dark:bg-[#F8F5EF] dark:px-2 dark:py-0.5 dark:border dark:border-[#C5A46D]/30 ${className}`}
    >
      <img
        src={RESORT_LOGO_SRC}
        alt="Home Sweet Home Resort logo"
        referrerPolicy="no-referrer"
        className="h-9 sm:h-10 w-auto object-contain mix-blend-multiply select-none"
      />
    </div>
  );
}
