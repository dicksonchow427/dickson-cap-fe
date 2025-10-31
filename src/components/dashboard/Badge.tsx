import React from 'react';
import { Badge as BadgeType } from '../../types/dashboard';
import { getBadgeImage } from '../../utils/badgeImages';

interface BadgeProps {
  badge: BadgeType;
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  const badgeImageInfo = getBadgeImage(badge.name);

  return (
    <div key={badge.id} id={`badge-item-${badge.id}`} className="relative flex flex-col items-center group" data-testid={`badge-grid-item-${badge.id}`}>
      {/* Badge Circle with image */}
      <div 
        id={`badge-circle-${badge.id}`}
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden bg-white border-2 border-gray-200"
        data-testid={`badge-circle-background-${badge.id}`}
      >
        {/* Badge Image */}
        <img 
          src={badgeImageInfo.imagePath}
          alt={badgeImageInfo.altText}
          className="w-16 h-16 object-contain"
          onError={(e) => {
            // Fallback to a default image if the badge image fails to load
            e.currentTarget.src = '/images/badges/Teamwork.png';
          }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
      </div>
      
      {/* Count indicator with modern styling */}
      <div 
        id={`badge-count-indicator-${badge.id}`} 
        className="absolute -top-1 -right-1 bg-gradient-to-r from-[#13426B] to-[#1e4a6b] text-white text-base font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-md border-2 border-white" 
        data-testid={`badge-count-indicator-${badge.id}`}
      >
        {badge.number}
      </div>
      
      {/* Badge name tooltip */}
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-base rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {badge.name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default Badge;