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
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden bg-white border-2"
        style={{ borderColor: badge.color || '#e5e7eb' }}
        data-testid={`badge-circle-background-${badge.id}`}
      >
        {/* Badge Image */}
        <img
          src={badgeImageInfo.imagePath}
          alt={badgeImageInfo.altText}
          className="w-16 h-16 object-contain"
          onError={(e) => {
            // Fallback to a default image if the badge image fails to load
            e.currentTarget.src = '/images/badges/Wellness.png';
          }}
        />

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
      </div>

      {/* Count indicator with modern styling */}
      <div
        id={`badge-count-indicator-${badge.id}`}
        className="absolute -top-1 -right-1 text-white text-base font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white"
        style={{ backgroundColor: badge.color || '#13426B' }}
        data-testid={`badge-count-indicator-${badge.id}`}
      >
        {badge.number}
      </div>

      {/* Badge name caption */}
      <div className="mt-3 text-center">
        <span className="text-gray-700 font-medium text-sm">{badge.name}</span>
      </div>
    </div>
  );
};

export default Badge;
