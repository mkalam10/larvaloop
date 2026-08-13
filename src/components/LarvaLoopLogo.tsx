import React from 'react';
import brandLogoImg from '../assets/images/larvaloop_brand_logo_1786627201813.jpg';

interface LarvaLoopLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  variant?: 'default' | 'header' | 'dark';
}

export const LarvaLoopLogo: React.FC<LarvaLoopLogoProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const isHeader = variant === 'header';

  if (isHeader) {
    return (
      <div
        className={`flex items-center bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl border border-white/40 shadow-sm ${className}`}
      >
        <img
          src={brandLogoImg}
          alt="LarvaLoop Logo"
          className="h-7 w-auto object-contain rounded-md"
        />
      </div>
    );
  }

  const heightSizes = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src={brandLogoImg}
        alt="LarvaLoop Eco-Protein & Fertilizer Logo"
        className={`${heightSizes[size]} w-auto object-contain drop-shadow-sm`}
      />
    </div>
  );
};