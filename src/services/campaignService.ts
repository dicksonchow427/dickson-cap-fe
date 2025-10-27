import { Campaign, CampaignData, CampaignStats, CampaignFilters } from '../types/dashboard';
import { persistenceService } from './persistenceService';
import { getBadgeColorAlphabetical } from '../constants/badgeColors';

class CampaignService {
  private campaigns: Campaign[] = [];
  private isLoaded = false;

  // Load campaigns from JSON file
  async loadCampaigns(): Promise<Campaign[]> {
    if (this.isLoaded && this.campaigns.length > 0) {
      return this.campaigns;
    }

    try {
      // Try to load from persisted data first
      this.campaigns = await persistenceService.readFromFile('campaign.json');
      this.isLoaded = true;
      return this.campaigns;
    } catch (error) {
      console.error('Error loading campaigns:', error);
      throw new Error('Failed to load campaign data');
    }
  }

  // Get all campaigns
  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.loadCampaigns();
  }

  // Get campaign by ID
  async getCampaignById(id: string): Promise<Campaign | null> {
    let campaigns = await this.loadCampaigns();
    return campaigns.find(campaign => campaign.id === id) || null;
  }

  // Get active campaigns
  async getActiveCampaigns(): Promise<Campaign[]> {
    let campaigns = await this.loadCampaigns();
    return campaigns.filter(campaign => campaign.status === 'Active');
  }

  // Get campaigns by type
  async getCampaignsByType(type: 'Values' | 'Campaign'): Promise<Campaign[]> {
    let campaigns = await this.loadCampaigns();
    return campaigns.filter(campaign => campaign.badges.type === type);
  }

  // Get campaigns with filters
  async getFilteredCampaigns(filters: CampaignFilters = {}): Promise<Campaign[]> {
    let campaigns = await this.loadCampaigns();

    // Apply status filter
    if (filters.status && filters.status !== 'All') {
      campaigns = campaigns.filter(campaign => campaign.status === filters.status);
    }

    // Apply type filter
    if (filters.type && filters.type !== 'All') {
      campaigns = campaigns.filter(campaign => campaign.badges.type === filters.type);
    }

    // Apply host filter
    if (filters.host) {
      campaigns = campaigns.filter(campaign => 
        campaign.host.toLowerCase().includes(filters.host!.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      campaigns = campaigns.filter(campaign => {
        const campaignDate = new Date(campaign.datetime);
        return campaignDate >= filters.dateRange!.start && 
               campaignDate <= filters.dateRange!.end;
      });
    }

    return campaigns;
  }

  // Get campaigns for specific tab
  async getCampaignsForTab(tab: 'feed' | 'campaign'): Promise<Campaign[]> {
    let campaigns = await this.loadCampaigns();
    
    if (tab === 'campaign') {
      // For campaign tab, return all campaigns sorted by datetime (most recent first)
      return campaigns.sort((a, b) => 
        new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
    } else {
      // For feed tab, return only active campaigns
      return campaigns.filter(campaign => campaign.status === 'Active');
    }
  }

  // Get campaign statistics
  async getCampaignStats(): Promise<CampaignStats> {
    let campaigns = await this.loadCampaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'Inactive').length;

    return {
      totalParticipants: campaigns.length * 25, // Mock data
      totalRecognitions: campaigns.length * 150, // Mock data
      activeCampaigns,
      completedCampaigns
    };
  }

  // Transform datetime to "time ago" format
  private getTimeAgo(datetime: string): string {
    const now = new Date();
    const past = new Date(datetime);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }

  // Transform Campaign to CampaignData for UI components
  transformToCampaignData(campaign: Campaign): CampaignData {
    return {
      ...campaign,
      // Add any additional UI-specific transformations here
      datetime: this.getTimeAgo(campaign.datetime)
    };
  }

  // Get transformed campaigns for UI
  async getTransformedCampaigns(): Promise<CampaignData[]> {
    let campaigns = await this.getAllCampaigns();
    return campaigns.map(campaign => this.transformToCampaignData(campaign));
  }




  // Generate distribution data for campaigns
  async getCampaignDistributionData(): Promise<{ name: string; value: number; color: string; }[]> {
    let campaigns = await this.loadCampaigns();
    
    // Count campaigns by badge type
    const typeCount: { [key: string]: number } = {};
    campaigns.forEach(campaign => {
      const typeName = campaign.badges.type;
      typeCount[typeName] = (typeCount[typeName] || 0) + 1;
    });

    // Sort by name (alphabetical) and assign gradient colors in light-to-dark order
    const sortedTypes = Object.entries(typeCount)
      .sort(([a], [b]) => a.localeCompare(b)); // Sort by name alphabetically
    
    return sortedTypes.map(([name, value]) => ({
      name: name === 'Values' ? 'Values Campaigns' : 'Special Campaigns',
      value,
      color: getBadgeColorAlphabetical(name)
    }));
  }

  // Get badge with color
  getBadgeWithColor(badgeName: string): { color: string } {
    return {
      color: getBadgeColorAlphabetical(badgeName)
    };
  }

  // Join a campaign
  async joinCampaign(campaignId: string, userId: string): Promise<boolean> {
    try {
      // In a real app, this would update the user's campaign participation in the database
      // For now, we'll just return true to simulate success
      return true;
    } catch (error) {
      console.error('Error joining campaign:', error);
      return false;
    }
  }

  // Leave a campaign
  async leaveCampaign(campaignId: string, userId: string): Promise<boolean> {
    try {
      // In a real app, this would update the user's campaign participation in the database
      // For now, we'll just return true to simulate success
      return true;
    } catch (error) {
      console.error('Error leaving campaign:', error);
      return false;
    }
  }

  // Get campaign participants
  async getCampaignParticipants(campaignId: string): Promise<string[]> {
    try {
      // In a real app, this would fetch from the database
      // For now, return an empty array
      return [];
    } catch (error) {
      console.error('Error getting campaign participants:', error);
      return [];
    }
  }

  // Save campaigns (for demonstration - in real app would make API call)
  async saveCampaigns(): Promise<boolean> {
    try {
      // In a real application, this would make an API call to save data
      return true;
    } catch (error) {
      console.error('Error saving campaigns:', error);
      return false;
    }
  }
}

export const campaignService = new CampaignService();
export default campaignService;