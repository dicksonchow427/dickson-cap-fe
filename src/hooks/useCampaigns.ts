import { useState, useEffect, useCallback } from 'react';
import { Campaign, CampaignFilters, CampaignStats } from '../types/dashboard';
import campaignService from '../services/campaignService';

interface UseCampaignsOptions {
  autoLoad?: boolean;
  initialFilters?: CampaignFilters;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  activeCampaigns: Campaign[];
  campaignStats: CampaignStats | null;
  refreshCampaigns: () => Promise<void>;
  getCampaignById: (id: string) => Promise<Campaign | null>;
  getCampaignsByType: (type: 'Values' | 'Campaign') => Promise<Campaign[]>;
  getFilteredCampaigns: (filters: CampaignFilters) => Promise<Campaign[]>;
  getCampaignsForTab: (tab: 'feed' | 'campaign') => Promise<Campaign[]>;
  getCampaignDistributionData: () => Promise<{ name: string; value: number; color: string; }[]>;
}

export const useCampaigns = (
  options: UseCampaignsOptions = {}
): UseCampaignsReturn => {
  const { autoLoad = true, initialFilters } = options;
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allCampaigns, activeCampaignsList, stats] = await Promise.all([
        campaignService.getAllCampaigns(),
        campaignService.getActiveCampaigns(),
        campaignService.getCampaignStats()
      ]);
      
      setCampaigns(allCampaigns);
      setActiveCampaigns(activeCampaignsList);
      setCampaignStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCampaigns = useCallback(async () => {
    await loadCampaigns();
  }, [loadCampaigns]);

  const getCampaignById = useCallback(async (id: string): Promise<Campaign | null> => {
    try {
      return await campaignService.getCampaignById(id);
    } catch (err) {
      console.error('Error fetching campaign by ID:', err);
      return null;
    }
  }, []);

  const getCampaignsByType = useCallback(async (type: 'Values' | 'Campaign'): Promise<Campaign[]> => {
    try {
      return await campaignService.getCampaignsByType(type);
    } catch (err) {
      console.error('Error filtering campaigns by type:', err);
      return [];
    }
  }, []);

  const getFilteredCampaigns = useCallback(async (filters: CampaignFilters): Promise<Campaign[]> => {
    try {
      return await campaignService.getFilteredCampaigns(filters);
    } catch (err) {
      console.error('Error filtering campaigns:', err);
      return [];
    }
  }, []);

  const getCampaignsForTab = useCallback(async (tab: 'feed' | 'campaign'): Promise<Campaign[]> => {
    try {
      return await campaignService.getCampaignsForTab(tab);
    } catch (err) {
      console.error('Error getting campaigns for tab:', err);
      return [];
    }
  }, []);

  const getCampaignDistributionData = useCallback(async () => {
    try {
      return await campaignService.getCampaignDistributionData();
    } catch (err) {
      console.error('Error generating campaign distribution data:', err);
      return [];
    }
  }, []);

  // Auto-load campaigns on mount
  useEffect(() => {
    if (autoLoad) {
      loadCampaigns();
    }
  }, [autoLoad, loadCampaigns]);

  // Apply initial filters if provided
  useEffect(() => {
    if (initialFilters && campaigns.length > 0) {
      getFilteredCampaigns(initialFilters).then(filtered => {
        setCampaigns(filtered);
      });
    }
  }, [initialFilters, campaigns.length, getFilteredCampaigns]);

  return {
    campaigns,
    loading,
    error,
    activeCampaigns,
    campaignStats,
    refreshCampaigns,
    getCampaignById,
    getCampaignsByType,
    getFilteredCampaigns,
    getCampaignsForTab,
    getCampaignDistributionData
  };
};