import { useState, useEffect, useCallback } from 'react';
import { Recognition, TabType, RecognitionFormData } from '../types/dashboard';
import recognitionService from '../services/recognitionService';

interface UseRecognitionsOptions {
  currentUserId?: string;
  autoLoad?: boolean;
}

interface UseRecognitionsReturn {
  recognitions: Recognition[];
  loading: boolean;
  error: string | null;
  refreshRecognitions: () => Promise<void>;
  createRecognition: (formData: RecognitionFormData) => Promise<void>;
  getRecognitionsByTab: (tab: TabType) => Promise<Recognition[]>;
  filterRecognitionsByDepartment: (department: string) => Promise<Recognition[]>;
  getTrendData: () => Promise<{ month: string; received: number; given: number; }[]>;
  getDistributionData: () => Promise<{ name: string; value: number; color: string; }[]>;
  getAvailableBadges: () => Promise<{ id: string; name: string; type: 'Values' | 'Campaign' }[]>;
}

export const useRecognitions = (
  options: UseRecognitionsOptions = {}
): UseRecognitionsReturn => {
  const { currentUserId, autoLoad = true } = options;
  
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecognitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await recognitionService.getTransformedRecognitions(currentUserId);
      setRecognitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recognitions');
      console.error('Error loading recognitions:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const refreshRecognitions = useCallback(async () => {
    await loadRecognitions();
  }, [loadRecognitions]);

  // Create new recognition
  const createRecognition = useCallback(async (formData: RecognitionFormData) => {
    if (!currentUserId) {
      throw new Error('Current user ID is required');
    }

    setLoading(true);
    setError(null);
    
    try {
      await recognitionService.createRecognition(formData, currentUserId);
      // Refresh the recognitions list to include the new recognition
      await loadRecognitions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recognition';
      setError(errorMessage);
      throw err; // Re-throw to allow modal to handle the error
    } finally {
      setLoading(false);
    }
  }, [currentUserId, loadRecognitions]);

  const getRecognitionsByTab = useCallback(async (tab: TabType): Promise<Recognition[]> => {
    try {
      return await recognitionService.getRecognitionsByTab(tab, currentUserId);
    } catch (err) {
      console.error('Error filtering recognitions by tab:', err);
      return [];
    }
  }, [currentUserId]);

  const filterRecognitionsByDepartment = useCallback(async (department: string): Promise<Recognition[]> => {
    if (department === 'Everyone') {
      return recognitions;
    }
    
    try {
      // Load users to get department information
      const response = await fetch('/data/users.json');
      const users = await response.json();
      
      // Create a map of user ID to department
      const userDepartmentMap = new Map();
      users.forEach((user: any) => {
        userDepartmentMap.set(user.id, user.department_division);
      });
      
      // Filter recognitions by department
      return recognitions.filter(recognition => {
        const giverDepartment = userDepartmentMap.get(recognition.giverId);
        const receiverDepartment = userDepartmentMap.get(recognition.receiverId);
        
        // Include recognition if either giver or receiver is in the selected department
        return giverDepartment === department || receiverDepartment === department;
      });
    } catch (error) {
      console.error('Error filtering recognitions by department:', error);
      return recognitions; // Return all recognitions if filtering fails
    }
  }, [recognitions]);

  const getTrendData = useCallback(async () => {
    if (!currentUserId) {
      return [];
    }
    
    try {
      return await recognitionService.getRecognitionTrendData(currentUserId);
    } catch (err) {
      console.error('Error generating trend data:', err);
      return [];
    }
  }, [currentUserId]);

  const getDistributionData = useCallback(async () => {
    try {
      return await recognitionService.getBadgeDistributionData();
    } catch (err) {
      console.error('Error generating distribution data:', err);
      return [];
    }
  }, []);

  // Get available badges for recognition creation
  const getAvailableBadges = useCallback(async () => {
    try {
      return await recognitionService.getAvailableBadges();
    } catch (err) {
      console.error('Error fetching available badges:', err);
      return [
        { id: 'badges_000001', name: 'Integrity', type: 'Values' as const },
        { id: 'badges_000002', name: 'Diversity', type: 'Values' as const },
        { id: 'badges_000003', name: 'Excellence', type: 'Values' as const },
        { id: 'badges_000004', name: 'Collaboration', type: 'Values' as const },
        { id: 'badges_000005', name: 'Engagement', type: 'Values' as const },
        { id: 'badges_2025001', name: 'Fitness God', type: 'Campaign' as const },
        { id: 'badges_202502', name: 'Green God', type: 'Campaign' as const }
      ];
    }
  }, []);

  // Auto-load recognitions on mount
  useEffect(() => {
    if (autoLoad) {
      loadRecognitions();
    }
  }, [autoLoad, loadRecognitions]);

  return {
    recognitions,
    loading,
    error,
    refreshRecognitions,
    createRecognition,
    getRecognitionsByTab,
    filterRecognitionsByDepartment,
    getTrendData,
    getDistributionData,
    getAvailableBadges
  };
};