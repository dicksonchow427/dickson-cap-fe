import React from 'react';
import { Badge as BadgeType } from '../../types/dashboard';
import { getBadgeColorAlphabetical, createGradientFromColor } from '../../constants/badgeColors';

interface BadgeProps {
  badge: BadgeType;
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  // Use color from badge data if available (alphabetical assignment), otherwise fallback to alphabetical color
  const badgeColor = (badge as any).color || getBadgeColorAlphabetical(badge.name);
  
  // Create gradient from the assigned color
  const badgeGradient = createGradientFromColor(badgeColor);

  // Icon mapping for different badge types
  const getBadgeIcon = (badgeName: string) => {
    const iconMap: Record<string, string> = {
      'Integrity': '⚖️',
      'Diversity': '🌈',
      'Excellence': '⭐',
      'Collaboration': '🤝',
      'Engagement': '💡',
      'Fitness God': '💪',
      'Green God': '🌱'
    };
    return iconMap[badgeName] || '🏆';
  };

  // Short name for display
  const getShortName = (badgeName: string) => {
    const shortMap: Record<string, string> = {
      'Integrity': 'INT',
      'Diversity': 'DIV',
      'Excellence': 'EXC',
      'Collaboration': 'COL',
      'Engagement': 'ENG',
      'Fitness God': 'FIT',
      'Green God': 'GRN'
    };
    return shortMap[badgeName] || badgeName.substring(0, 3).toUpperCase();
  };

  return (
    <div key={badge.id} id={`badge-item-${badge.id}`} className="relative flex flex-col items-center group" data-testid={`badge-grid-item-${badge.id}`}>
      {/* Badge Circle with gradient and icon */}
      <div 
        id={`badge-circle-${badge.id}`}
        className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
        style={{ 
          background: badgeGradient,
          border: `2px solid ${badgeColor}20`
        }}
        data-testid={`badge-circle-background-${badge.id}`}
      >
        {/* Icon */}
        <div className="text-lg mb-0.5">{getBadgeIcon(badge.name)}</div>
        {/* Short name */}
        <div className="text-base font-bold text-white drop-shadow-sm">{getShortName(badge.name)}</div>
        
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