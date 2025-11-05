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
        className="flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
        data-testid={`badge-circle-background-${badge.id}`}
      >
        {/* Badge Image */}
        <img
          src={badgeImageInfo.imagePath}
          alt={badgeImageInfo.altText}
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Count indicator with modern styling */}
      <div
        id={`badge-count-indicator-${badge.id}`}
        className="absolute -top-1 -right-1 text-white text-base font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white"
        style={{ backgroundColor: badge.color }}
        data-testid={`badge-count-indicator-${badge.id}`}
      >
        {badge.number}
      </div>

      {/* Badge name caption */}
      <div className="mt-2 text-center">
        <span className="text-gray-700 font-medium text-sm">{badge.name}</span>
      </div>
    </div>
  );
};

export default Badge;
