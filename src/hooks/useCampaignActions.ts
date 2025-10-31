import { useCallback } from 'react';
import campaignService from '../services/campaignService';

interface UseCampaignActionsReturn {
  // eslint-disable-next-line no-unused-vars
  joinCampaign: (campaignId: string, userId: string) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  leaveCampaign: (campaignId: string, userId: string) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  getCampaignParticipants: (campaignId: string) => Promise<string[]>;
}

export const useCampaignActions = (): UseCampaignActionsReturn => {






  // Mock campaign participation functions (in real app would use user service)
  const joinCampaign = useCallback(async (_campaignId: string, _userId: string): Promise<boolean> => {
    try {
      return await campaignService.joinCampaign(_campaignId, _userId);
    } catch (error) {
      console.error('Error joining campaign:', error);
      return false;
    }
  }, []);

  const leaveCampaign = useCallback(async (_campaignId: string, _userId: string): Promise<boolean> => {
    try {
      return await campaignService.leaveCampaign(_campaignId, _userId);
    } catch (error) {
      console.error('Error leaving campaign:', error);
      return false;
    }
  }, []);

  const getCampaignParticipants = useCallback(async (_campaignId: string): Promise<string[]> => {
    try {
      return await campaignService.getCampaignParticipants(_campaignId);
    } catch (error) {
      console.error('Error fetching campaign participants:', error);
      return [];
    }
  }, []);

  return {
    joinCampaign,
    leaveCampaign,
    getCampaignParticipants
  };
};
