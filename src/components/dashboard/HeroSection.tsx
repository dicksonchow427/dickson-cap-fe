import React, { useState } from 'react';
import Header from '../common/Header';

interface HeroSectionProps {
  title?: string;
  backgroundImage?: string;
  userName?: string;
  // eslint-disable-next-line no-unused-vars
  onAdminToggle?: (_newAdminMode: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Welcome",
  backgroundImage = "/images/img_corpday2022websiteweb_top_banner_1.png",
  userName,
  onAdminToggle
}) => {
  const [adminMode, setAdminMode] = useState(false);

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAdminMode = e.target.checked;
    setAdminMode(newAdminMode);
    onAdminToggle?.(newAdminMode);
  };
  return (
    <section 
      id="hero-section"
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      data-testid="hero-section-banner"
    >
      <div id="hero-overlay" className="w-full bg-black bg-opacity-50" data-testid="hero-background-overlay">
        <div id="hero-content-container" className="max-w-7xl mx-auto px-4 py-4" data-testid="hero-content-wrapper">
          <div id="hero-content-layout" className="space-y-8" data-testid="hero-layout-container">
            <Header className="" />
            <div id="hero-title-section" className="flex items-center gap-4" data-testid="hero-title-wrapper">
              <h1 id="hero-main-title" className="text-4xl font-normal text-white" data-testid="hero-welcome-title">
                {userName ? `Welcome ${userName}` : title}
              </h1>
              
              {/* Admin/User Mode Toggle */}
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg">
                <span className={`text-sm font-medium ${!adminMode ? 'text-white' : 'text-gray-300'}`}>
                  User
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminMode}
                    onChange={handleToggleChange}
                    className="sr-only peer"
                    aria-label="Toggle admin mode"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                <span className={`text-sm font-medium ${adminMode ? 'text-white' : 'text-gray-300'}`}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;