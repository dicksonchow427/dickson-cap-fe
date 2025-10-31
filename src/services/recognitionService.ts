import { RecognitionData, Recognition, RecognitionFormData } from '../types/dashboard';
import { userService } from './userService';
import { campaignService } from './campaignService';
import { persistenceService } from './persistenceService';
import { getBadgeColorAlphabetical } from '../constants/badgeColors';

class RecognitionService {
  private recognitionsData: RecognitionData[] = [];

  // Initialize and load recognition data
  async loadRecognitions(): Promise<RecognitionData[]> {
    try {
      // Try to load from persisted data first
      this.recognitionsData = await persistenceService.readFromFile('recognition.json');
      return this.recognitionsData;
    } catch (error) {
      console.error('Error loading recognitions:', error);
      throw error;
    }
  }

  // Get all recognitions
  async getAllRecognitions(): Promise<RecognitionData[]> {
    if (this.recognitionsData.length === 0) {
      await this.loadRecognitions();
    }
    return this.recognitionsData;
  }




  // Transform datetime to "time ago" format
  private getTimeAgo(datetime: string): string {
    const now = new Date();
    const past = new Date(datetime);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }

  // Transform RecognitionData to Recognition for UI components
  transformToRecognition(recognitionData: RecognitionData, index: number, currentUserId?: string): Recognition {
    const likesCount = recognitionData.likes.filter(like => like.id && like.id.trim() !== '').length;
    const isLiked = currentUserId ? recognitionData.likes.some(like => like.id === currentUserId) : false;

    return {
      id: (index + 1).toString(),
      giver: recognitionData.giver,
      receiver: recognitionData.receiver,
      category: recognitionData.badges.name,
      message: recognitionData.message,
      timeAgo: this.getTimeAgo(recognitionData.datetime),
      likes: likesCount,
      isLiked: isLiked,
      giverId: recognitionData.giverId,
      receiverId: recognitionData.receiverId,
      giverPhoto: recognitionData.giverPhoto,
      receiverPhoto: recognitionData.receiverPhoto,
      datetime: recognitionData.datetime,
      badges: recognitionData.badges // Add the badges object
    };
  }

  // Get transformed recognitions for UI
  async getTransformedRecognitions(currentUserId?: string): Promise<Recognition[]> {
    const recognitions = await this.getAllRecognitions();
    // Sort by datetime, most recent first
    const sortedRecognitions = recognitions.sort((a, b) =>
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

    return sortedRecognitions.map((rec, index) =>
      this.transformToRecognition(rec, index, currentUserId)
    );
  }

  // Filter recognitions by tab type
  async getRecognitionsByTab(tab: 'feed' | 'campaign', currentUserId?: string): Promise<Recognition[]> {
    const allRecognitions = await this.getTransformedRecognitions(currentUserId);

    if (tab === 'feed') {
      return allRecognitions; // Return all for feed
    } else {
      // Filter only Campaign type badges for campaign tab
      return allRecognitions.filter(rec => {
        // Need to check original data for badge type
        const originalIndex = parseInt(rec.id) - 1;
        const originalData = this.recognitionsData[originalIndex];
        return originalData?.badges.type === 'Campaign';
      });
    }
  }

  // Get paginated recognitions with filtering support
  async getPaginatedRecognitions(
    currentUserId?: string,
    page: number = 1,
    pageSize: number = 10,
    tab: 'feed' | 'campaign' = 'feed',
    departmentFilter: string = 'Everyone',
    personFilter?: string
  ): Promise<{ recognitions: Recognition[]; totalCount: number; totalPages: number }> {
    let allRecognitions = await this.getRecognitionsByTab(tab, currentUserId);

    // Apply department filtering
    if (departmentFilter !== 'Everyone') {
      if (departmentFilter === 'Your Own') {
        // Filter to show only recognitions where current user is giver or receiver
        allRecognitions = allRecognitions.filter(recognition =>
          recognition.giverId === currentUserId || recognition.receiverId === currentUserId
        );
      } else {
        try {
          // Load users to get department information
          const response = await fetch('/data/users.json');
          const users = await response.json();

          // Create a map of user ID to department
          const userDepartmentMap = new Map();
          users.forEach((user: { id: string; department_division: string }) => {
            userDepartmentMap.set(user.id, user.department_division);
          });

          // Filter recognitions by department
          allRecognitions = allRecognitions.filter(recognition => {
            const giverDepartment = userDepartmentMap.get(recognition.giverId);
            const receiverDepartment = userDepartmentMap.get(recognition.receiverId);

            // Include recognition if either giver or receiver is in the selected department
            return giverDepartment === departmentFilter || receiverDepartment === departmentFilter;
          });
        } catch (error) {
          console.error('Error filtering recognitions by department:', error);
          // Continue with all recognitions if filtering fails
        }
      }
    }

    // Apply person filtering
    if (personFilter) {
      allRecognitions = allRecognitions.filter(recognition =>
        recognition.giver === personFilter || recognition.receiver === personFilter
      );
    }

    const totalCount = allRecognitions.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecognitions = allRecognitions.slice(startIndex, endIndex);

    return {
      recognitions: paginatedRecognitions,
      totalCount,
      totalPages
    };
  }

  // Add/remove like (now persists to localStorage)
  async toggleLike(recognitionId: string, userId: string): Promise<boolean> {
    try {
      const recognitions = await this.getAllRecognitions();
      const index = parseInt(recognitionId, 10) - 1;

      // Validate index is within bounds
      if (isNaN(index) || index < 0 || index >= recognitions.length) {
        console.error('Invalid recognition ID:', recognitionId);
        return false;
      }

      const recognition = recognitions[index];

      if (!recognition) {
        console.error('Recognition not found:', recognitionId);
        return false;
      }

      const likeIndex = recognition.likes.findIndex(like => like.id === userId);

      if (likeIndex > -1) {
        // Remove like
        recognition.likes.splice(likeIndex, 1);
      } else {
        // Add like
        recognition.likes.push({ id: userId });
      }

      // Persist the updated data
      await persistenceService.writeToFile('recognition.json', recognitions);

      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  // Create new recognition with full implementation
  async createRecognition(
    formData: RecognitionFormData,
    currentUserId: string
  ): Promise<RecognitionData> {
    try {
      // Get current user and receiver data
      const [giver, receiver] = await Promise.all([
        userService.getUserById(currentUserId),
        userService.getUserById(formData.receiverId)
      ]);

      if (!giver || !receiver) {
        throw new Error('User not found');
      }

      // Find badge data from campaigns
      const campaigns = await campaignService.getAllCampaigns();
      const badgeInfo = campaigns.find(c => c.badges.id === formData.badgeId);

      if (!badgeInfo) {
        throw new Error('Badge not found');
      }

      // Create recognition data object
      const newRecognition: RecognitionData = {
        giver: giver.name,
        giverId: giver.id,
        giverPhoto: giver.photo,
        receiver: receiver.name,
        receiverId: receiver.id,
        receiverPhoto: receiver.photo,
        campaign: formData.campaign || badgeInfo.badges.type,
        likes: [],
        badges: {
          id: badgeInfo.badges.id,
          name: badgeInfo.badges.name,
          type: badgeInfo.badges.type,
          photo: badgeInfo.badges.photo
        },
        message: formData.message,
        datetime: new Date().toISOString().replace('T', ' ').split('.')[0]
      };

      // Add to local data and persist
      this.recognitionsData.unshift(newRecognition);
      await persistenceService.writeToFile('recognition.json', this.recognitionsData);

      // Update user badge counts (these will also be persisted)
      const [giverBadgeSuccess, receiverBadgeSuccess] = await Promise.all([
        userService.incrementBadge(currentUserId, formData.badgeId, 'given'),
        userService.incrementBadge(formData.receiverId, formData.badgeId, 'received')
      ]);

      // Check if badge increments were successful
      if (!giverBadgeSuccess) {
        console.warn(`Failed to increment given badge for user ${currentUserId}`);
      }
      if (!receiverBadgeSuccess) {
        console.warn(`Failed to increment received badge for user ${formData.receiverId}`);
      }

      // If both badge increments failed, throw an error
      if (!giverBadgeSuccess && !receiverBadgeSuccess) {
        throw new Error('Failed to update badge counts for both users');
      }

      return newRecognition;
    } catch (error) {
      console.error('Error creating recognition:', error);
      throw new Error('Failed to create recognition. Please try again.');
    }
  }

  // Generate trend data from recognitions
  async getRecognitionTrendData(userId: string): Promise<{ month: string; received: number; given: number; }[]> {
    const recognitions = await this.getAllRecognitions();

    // Generate data for last 8 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    return months.map((month) => {
      // Mock data based on actual recognitions
      const baseReceived = recognitions.filter(r => r.receiverId === userId).length * 2;
      const baseGiven = recognitions.filter(r => r.giverId === userId).length * 3;

      return {
        month,
        received: baseReceived + Math.floor(Math.random() * 10),
        given: baseGiven + Math.floor(Math.random() * 8)
      };
    });
  }

  // Generate distribution data from badges
  async getBadgeDistributionData(): Promise<{ name: string; value: number; color: string; }[]> {
    const recognitions = await this.getAllRecognitions();

    // Count badge types
    const badgeCount: { [key: string]: number } = {};
    recognitions.forEach(rec => {
      const badgeName = rec.badges.name;
      badgeCount[badgeName] = (badgeCount[badgeName] || 0) + 1;
    });

    // Sort badges by name (alphabetical) and assign gradient colors in light-to-dark order
    const sortedBadges = Object.entries(badgeCount)
      .sort(([a], [b]) => a.localeCompare(b)); // Sort by name alphabetically

    return sortedBadges.map(([name, value]) => ({
      name,
      value,
      color: getBadgeColorAlphabetical(name)
    }));
  }

  // Get available badge options for recognition creation
  async getAvailableBadges(): Promise<{ id: string; name: string; type: 'Values' | 'Campaign' }[]> {
    try {
      const campaigns = await campaignService.getAllCampaigns();
      return campaigns.map(campaign => ({
        id: campaign.badges.id,
        name: campaign.badges.name,
        type: campaign.badges.type
      }));
    } catch (error) {
      console.error('Error getting available badges:', error);
      return [
        { id: 'badges_000001', name: 'Analytical Thinking', type: 'Values' },
        { id: 'badges_000002', name: 'Teamwork', type: 'Values' },
        { id: 'badges_000003', name: 'Intellectual Curiosity', type: 'Values' },
        { id: 'badges_000004', name: 'Effective Communication', type: 'Values' },
        { id: 'badges_000005', name: 'Resilience', type: 'Values' },
        { id: 'badges_202502', name: 'Risk Awareness', type: 'Campaign' }
      ];
    }
  }

  // Save recognitions (mock - in real app would be API call)
  async saveRecognitions(): Promise<boolean> {
    // In a real application, this would make an API call to save data
    return true;
  }
}

const recognitionService = new RecognitionService();
export default recognitionService;
