// Badge image mapping utility
// Maps badge names to their corresponding image files

export interface BadgeImageInfo {
  imagePath: string;
  altText: string;
}

// Mapping of badge names to their image files
// Badge names now match the actual image file names
const badgeImageMap: Record<string, BadgeImageInfo> = {
  'Analytical Thinking': {
    imagePath: '/images/badges/Analytical Thinking.png',
    altText: 'Analytical Thinking Badge'
  },
  'Teamwork': {
    imagePath: '/images/badges/Teamwork.png',
    altText: 'Teamwork Badge'
  },
  'Intellectual Curiosity': {
    imagePath: '/images/badges/Intellectual Curiosity.png',
    altText: 'Intellectual Curiosity Badge'
  },
  'Effective Communication': {
    imagePath: '/images/badges/Effective Communication.png',
    altText: 'Effective Communication Badge'
  },
  'Resilience': {
    imagePath: '/images/badges/Resilience.png',
    altText: 'Resilience Badge'
  },
  'Risk Awareness': {
    imagePath: '/images/badges/Risk Awareness.png',
    altText: 'Risk Awareness Badge'
  }
};

/**
 * Get badge image information for a given badge name
 * @param badgeName - The name of the badge
 * @returns BadgeImageInfo object with image path and alt text
 */
export const getBadgeImage = (badgeName: string): BadgeImageInfo => {
  const badgeInfo = badgeImageMap[badgeName];

  if (!badgeInfo) {
    // Fallback for unknown badges
    return {
      imagePath: '/images/badges/Teamwork.png', // Default fallback image
      altText: `${badgeName} Badge`
    };
  }

  return badgeInfo;
};

/**
 * Get all available badge names
 * @returns Array of badge names
 */
export const getAvailableBadgeNames = (): string[] => {
  return Object.keys(badgeImageMap);
};

/**
 * Check if a badge has an image available
 * @param badgeName - The name of the badge
 * @returns boolean indicating if image is available
 */
export const hasBadgeImage = (badgeName: string): boolean => {
  return badgeName in badgeImageMap;
};
