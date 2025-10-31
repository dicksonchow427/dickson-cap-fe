import React from 'react';
import Header from '../common/Header';

interface HeroSectionProps {
  title?: string;
  backgroundImage?: string;
  userName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Welcome",
  backgroundImage = "/images/img_corpday2022websiteweb_top_banner_1.png",
  userName
}) => {
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
            <div id="hero-title-section" className="" data-testid="hero-title-wrapper">
              <h1 id="hero-main-title" className="text-4xl font-normal text-white" data-testid="hero-welcome-title">
                {userName ? `Welcome ${userName}` : title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;