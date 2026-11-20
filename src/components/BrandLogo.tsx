import { RESORT_LOGO_SRC } from '../data/resortData';

interface BrandLogoProps {
  variant?: 'header' | 'intro' | 'footer';
  className?: string;
}

export function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  if (variant === 'intro') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-[#F9F6F0] px-7 py-5 shadow-[0_0_50px_rgba(201,162,39,0.22)] border border-[#C9A227]/55 ${className}`}
      >
        <img
          src={RESORT_LOGO_SRC}
          alt="Home Sweet Home Resort"
          referrerPolicy="no-referrer"
          className="h-20 sm:h-24 w-auto object-contain select-none"
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`inline-flex items-center rounded-full bg-[#F9F6F0] px-5 py-2.5 shadow-sm border border-[#C9A227]/45 ${className}`}
      >
        <img
          src={RESORT_LOGO_SRC}
          alt="Home Sweet Home Resort"
          referrerPolicy="no-referrer"
          className="h-11 w-auto object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[#F9F6F0] px-3 py-1 border border-[#C9A227]/45 shadow-sm transition-transform duration-200 ${className}`}
    >
      <img
        src={RESORT_LOGO_SRC}
        alt="Home Sweet Home Resort logo"
        referrerPolicy="no-referrer"
        className="h-7 sm:h-8 w-auto object-contain select-none"
      />
    </div>
  );
}
