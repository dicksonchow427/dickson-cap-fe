import React from 'react';
import { Badge } from '../../types/dashboard';
import BadgeComponent from './Badge';

interface BadgesGridProps {
  badges: Badge[];
}

const BadgesGrid: React.FC<BadgesGridProps> = ({
  badges,
}) => {
  return (
    <div id="badges-grid-container" className="bg-white rounded-lg shadow-sm p-6" data-testid="badges-grid-wrapper">
      <h3 id="badges-grid-title" className="text-base font-semibold text-gray-800 mb-5" data-testid="badges-grid-title">
        My Badges
      </h3>
      <hr className="border-gray-200 mb-5" />

      {badges.length > 0 ? (
        <div id="badges-grid-layout" className="grid grid-cols-2 gap-4" data-testid="badges-grid-layout">
          {badges.map((badge) => (
            <BadgeComponent
              key={badge.id}
              badge={badge}
            />
          ))}
        </div>
      ) : (
        <div id="no-badges-message" className="text-center py-8" data-testid="no-badges-indicator">
          <p className="text-sm text-gray-500">No badges earned yet</p>
        </div>
      )}
    </div>
  );
};

export default BadgesGrid;
