import { useCallback } from 'react';
import { Campaign } from '../types/dashboard';
import campaignService from '../services/campaignService';

interface UseCampaignActionsOptions {
  // No options needed for current functionality
}

interface UseCampaignActionsReturn {
  joinCampaign: (campaignId: string, userId: string) => Promise<boolean>;
  leaveCampaign: (campaignId: string, userId: string) => Promise<boolean>;
  getCampaignParticipants: (campaignId: string) => Promise<string[]>;
}

export const useCampaignActions = (
  options: UseCampaignActionsOptions = {}
): UseCampaignActionsReturn => {






  // Mock campaign participation functions (in real app would use user service)
  const joinCampaign = useCallback(async (campaignId: string, userId: string): Promise<boolean> => {
    try {
      return await campaignService.joinCampaign(campaignId, userId);
    } catch (error) {
      console.error('Error joining campaign:', error);
      return false;
    }
  }, []);

  const leaveCampaign = useCallback(async (campaignId: string, userId: string): Promise<boolean> => {
    try {
      return await campaignService.leaveCampaign(campaignId, userId);
    } catch (error) {
      console.error('Error leaving campaign:', error);
      return false;
    }
  }, []);

  const getCampaignParticipants = useCallback(async (campaignId: string): Promise<string[]> => {
    try {
      return await campaignService.getCampaignParticipants(campaignId);
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