// Gradient color palette for badges and charts
export const CHART_COLORS = [
  '#26CAD3',  // Turquoise
  '#FFB81C',  // Amber
  '#2B8098',  // Teal
  '#5E366E',  // Purple
  '#EE6478',  // Red/70
  '#FEDD00',  // Yellow
  '#1EA2A9',  // Turquoise/120
  '#B5E3D8',  // Mint
  '#89A1B5',  // Blue/50
  '#D5E6EA'   // Teal 20
];

// Legacy GRADIENT_COLORS for backward compatibility
const GRADIENT_COLORS = CHART_COLORS;

// Centralized function to get color for any badge name (alphabetical order)
export const getBadgeColorAlphabetical = (badgeName: string): string => {
  // Get all possible badge names in alphabetical order
  const allBadgeNames = [
    'Collaboration',
    'Diversity',
    'Engagement',
    'Excellence',
    'Integrity',
    'Wellness'
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
    'Collaboration': 'COL',
    'Diversity': 'DIV',
    'Engagement': 'ENG',
    'Excellence': 'EXC',
    'Integrity': 'INT',
    'Wellness': 'WEL'
  };
  return shortMap[badgeName] || 'BADGE';
};
