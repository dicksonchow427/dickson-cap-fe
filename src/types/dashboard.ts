export interface Recognition {
  id: string;
  giver: string;
  receiver: string;
  category: string;
  message: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  // Extended properties for real data
  giverId?: string;
  receiverId?: string;
  giverPhoto?: string;
  receiverPhoto?: string;
  datetime?: string;
  badges?: BadgeData; // Add badges property
}

// New interfaces for recognition.json structure
export interface RecognitionData {
  giver: string;
  giverId: string;
  giverPhoto: string;
  receiver: string;
  receiverId: string;
  receiverPhoto: string;
  campaign: string;
  likes: Like[];
  badges: BadgeData;
  message: string;
  datetime: string;
}

export interface Like {
  id: string;
}

export interface BadgeData {
  id: string;
  name: string;
  type: 'Values' | 'Campaign';
  photo: string;
}

// Recognition Form Data interface for modal
export interface RecognitionFormData {
  receiverId: string;
  receiverName: string;
  badgeId: string;
  badgeName: string;
  message: string;
  campaign?: string;
}

// Recognition Modal State interface
export interface RecognitionModalState {
  isOpen: boolean;
  selectedUser: User | null;
  selectedBadge: Badge | null;
  message: string;
  isLoading: boolean;
  errors: string[];
}

export interface Colleague {
  id: string;
  name: string;
  title: string;
  recognitions: number;
  avatar: string;
}

export interface Badge {
  id: string;
  name: string;
  type: 'Values' | 'Campaign';
  number: number;
  color?: string;
}

export interface User {
  name: string;
  id: string;
  photo: string;
  department_division: string;
  given_badges: Badge[];
  received_badges: Badge[];
  lastLogin?: string;
}


export type TabType = 'feed' | 'campaign';
export type FilterType = 'Everyone' | 'Your Own' | 'Department A' | 'Department B' | 'Department C' | 'Department D';

// Campaign interfaces
export interface Campaign {
  id: string;
  name: string;
  host: string;
  message: string;
  datetime: string;
  cover: string;
  status: 'Active' | 'Inactive';
  badges: CampaignBadge;
}

export interface CampaignData extends Campaign {
  // Additional properties for UI transformation if needed
}

export interface CampaignBadge {
  id: string;
  name: string;
  type: 'Values' | 'Campaign';
  photo: string;
}

export interface CampaignStats {
  totalParticipants: number;
  totalRecognitions: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface CampaignFilters {
  status?: 'Active' | 'Inactive' | 'All';
  type?: 'Values' | 'Campaign' | 'All';
  host?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  month: string;
  received: number;
  given: number;
}