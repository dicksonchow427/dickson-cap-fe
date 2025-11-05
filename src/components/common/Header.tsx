import React from 'react';
import { twMerge } from 'tailwind-merge';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={twMerge(
      'w-full',
      className
    )}>
      <div className="w-full max-w-[1440px] mx-auto px-0">
        <div className="flex justify-between items-center py-2 sm:py-3 md:py-4 lg:py-5">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-[6px] sm:gap-[8px] md:gap-[10px] lg:gap-[12px]">

            {/* Title */}
            <h1 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-[Open Sans] font-semibold leading-[20px] sm:leading-[24px] md:leading-[27px] lg:leading-[30px] text-primary-foreground uppercase">
              Colleague RECOGNITION SYSTEM
            </h1>
          </div>

          {/* Right Section - Empty for future use */}
          <div className="flex flex-row items-center gap-4">
            {/* Content removed as requested */}
          </div>
        </div>
      </div>
    </header>);

};

export default Header;
