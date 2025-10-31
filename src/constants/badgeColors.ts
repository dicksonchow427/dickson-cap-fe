// Gradient color palette for badges (light to dark)
const GRADIENT_COLORS = [
  '#A1B3C4',  // Light blue-gray
  '#718EA6',  // Medium blue-gray
  '#426889',  // Dark blue-gray
  '#13426B',  // Dark blue
  '#0F3556',  // Darker blue
  '#0B2840',  // Darkest blue
  '#081A2B'   // Extra dark blue
];

// Centralized function to get color for any badge name (alphabetical order)
export const getBadgeColorAlphabetical = (badgeName: string): string => {
  // Get all possible badge names in alphabetical order
  const allBadgeNames = [
    'Analytical Thinking',
    'Effective Communication',
    'Intellectual Curiosity',
    'Resilience',
    'Risk Awareness',
    'Teamwork'
  ].sort((a, b) => a.localeCompare(b));
  
  // Find the index of this badge name in the alphabetical list
  const index = allBadgeNames.indexOf(badgeName);
  
  // Return the color based on alphabetical position
  return index >= 0 ? GRADIENT_COLORS[index % GRADIENT_COLORS.length] : GRADIENT_COLORS[0];
};

// Helper function to add colors to badges based on alphabetical order (matching distribution)
export const addColorsToBadgesAlphabetical = <T extends { name: string }>(badges: T[]): (T & { color: string })[] => {
  return badges.map(badge => ({
    ...badge,
    color: getBadgeColorAlphabetical(badge.name)
  }));
};

// Helper function to create gradient from a color
export const createGradientFromColor = (color: string): string => {
  return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
};

// Helper function to get short name for badge display
export const getShortName = (badgeName: string): string => {
  const shortMap: Record<string, string> = {
    'Analytical Thinking': 'AT',
    'Effective Communication': 'EC',
    'Intellectual Curiosity': 'IC',
    'Resilience': 'RES',
    'Risk Awareness': 'RA',
    'Teamwork': 'TW'
  };
  return shortMap[badgeName] || 'BADGE';
};
