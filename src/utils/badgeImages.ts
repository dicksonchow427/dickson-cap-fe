// Badge image mapping utility
// Maps badge names to their corresponding image files

export interface BadgeImageInfo {
  imagePath: string;
  altText: string;
}

// Mapping of badge names to their image files
// Badge names now match the actual image file names
const badgeImageMap: Record<string, BadgeImageInfo> = {
  'Integrity': {
    imagePath: '/images/badges/Integrity.png',
    altText: 'Integrity Badge'
  },
  'Diversity': {
    imagePath: '/images/badges/Diversity.png',
    altText: 'Diversity Badge'
  },
  'Excellence': {
    imagePath: '/images/badges/Excellence.png',
    altText: 'Excellence Badge'
  },
  'Collaboration': {
    imagePath: '/images/badges/Collaboration.png',
    altText: 'Collaboration Badge'
  },
  'Engagement': {
    imagePath: '/images/badges/Engagement.png',
    altText: 'Engagement Badge'
  },
  'Wellness': {
    imagePath: '/images/badges/Wellness.png',
    altText: 'Wellness Badge'
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
      imagePath: '/images/badges/Wellness.png', // Default fallback image
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
