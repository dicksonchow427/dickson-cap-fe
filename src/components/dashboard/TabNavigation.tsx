import React from 'react';
import { TabType } from '../../types/dashboard';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div id="tab-navigation-container" className="flex space-x-4" data-testid="tab-navigation-wrapper">
      <button
        id="feed-tab-button"
        onClick={() => onTabChange('feed')}
        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg shadow-sm font-semibold text-base transition-colors ${
          activeTab === 'feed' ?'bg-[#13426B] text-white' :'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        data-testid="feed-tab-navigation-button"
      >
        <img 
          id="feed-tab-icon"
          src="/images/img_vector_white_a700.svg" 
          alt=""
          className="w-5 h-4"
          data-testid="feed-tab-icon-image"
        />
        <span id="feed-tab-text" data-testid="feed-tab-text-label">
          Feed
        </span>
      </button>
      
      <button
        id="campaign-tab-button"
        onClick={() => onTabChange('campaign')}
        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg shadow-sm font-semibold text-base transition-colors ${
          activeTab === 'campaign' ?'bg-[#13426B] text-white' :'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        data-testid="campaign-tab-navigation-button"
      >
        <img 
          id="campaign-tab-icon"
          src="/images/img_vector_blue_gray_800_01.svg" 
          alt=""
          className="w-4 h-4"
          data-testid="campaign-tab-icon-image"
        />
        <span id="campaign-tab-text" data-testid="campaign-tab-text-label">
          Campaign
        </span>
      </button>
    </div>
  );
};

export default TabNavigation;