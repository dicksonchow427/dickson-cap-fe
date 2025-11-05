import { useState, useEffect, useCallback } from 'react';
import { Recognition, TabType, RecognitionFormData } from '../types/dashboard';
import recognitionService from '../services/recognitionService';

interface UsePaginatedRecognitionsOptions {
  currentUserId?: string;
  pageSize?: number;
  autoLoad?: boolean;
  departmentFilter?: string;
  personFilter?: string;
  activeTab?: TabType;
}

interface UsePaginatedRecognitionsReturn {
  recognitions: Recognition[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line no-unused-vars
  goToPage: (pageNumber: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refreshRecognitions: () => Promise<void>;
  reloadWithFilters: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  createRecognition: (data: RecognitionFormData) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  getRecognitionsByTab: (tabType: TabType) => Promise<Recognition[]>;
  // eslint-disable-next-line no-unused-vars
  filterRecognitionsByDepartment: (dept: string) => Promise<Recognition[]>;
  getTrendData: () => Promise<{ month: string; received: number; given: number; }[]>;
  getDistributionData: () => Promise<{ name: string; value: number; color: string; }[]>;
  getAvailableBadges: () => Promise<{ id: string; name: string; type: 'Values' | 'Campaign' }[]>;
}

export const usePaginatedRecognitions = (
  options: UsePaginatedRecognitionsOptions = {}
): UsePaginatedRecognitionsReturn => {
  const { currentUserId, pageSize = 10, autoLoad = true, departmentFilter = 'Everyone', personFilter, activeTab } = options;

  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('feed');

  const loadRecognitions = useCallback(async (page: number = 1, tab: TabType = 'feed') => {
    setLoading(true);
    setError(null);

    try {
      const result = await recognitionService.getPaginatedRecognitions(
        currentUserId,
        page,
        pageSize,
        tab,
        departmentFilter,
        personFilter
      );

      setRecognitions(result.recognitions);
      setCurrentPage(page);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setCurrentTab(tab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recognitions');
      console.error('Error loading recognitions:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, pageSize, departmentFilter, personFilter]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const tabToUse = activeTab ?? currentTab;
      loadRecognitions(page, tabToUse);
    }
  }, [loadRecognitions, totalPages, currentPage, currentTab, activeTab]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const refreshRecognitions = useCallback(async () => {
    const tabToUse = activeTab ?? currentTab;
    await loadRecognitions(currentPage, tabToUse);
  }, [loadRecognitions, currentPage, currentTab, activeTab]);

  const reloadWithFilters = useCallback(async () => {
    const tabToUse = activeTab ?? currentTab;
    await loadRecognitions(1, tabToUse); // Reset to page 1 when filters change
  }, [loadRecognitions, currentTab, activeTab]);

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
      await loadRecognitions(1, currentTab); // Go to first page to show new recognition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recognition';
      setError(errorMessage);
      throw err; // Re-throw to allow modal to handle the error
    } finally {
      setLoading(false);
    }
  }, [currentUserId, loadRecognitions, currentTab]);

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
      // Load users to get division information
      const response = await fetch('/data/users.json');
      const users = await response.json();

      // Create a map of user ID to division
      const userDivisionMap = new Map();
      users.forEach((user: { id: string; department_division: string }) => {
        userDivisionMap.set(user.id, user.department_division);
      });

      // Filter recognitions by division
      return recognitions.filter(recognition => {
        const giverDivision = userDivisionMap.get(recognition.giverId);
        const receiverDivision = userDivisionMap.get(recognition.receiverId);

        // Include recognition if either giver or receiver is in the selected division
        return giverDivision === department || receiverDivision === department;
      });
    } catch (error) {
      console.error('Error filtering recognitions by division:', error);
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
      return await recognitionService.getBadgeReceivedData(currentUserId);
    } catch (err) {
      console.error('Error generating distribution data:', err);
      return [];
    }
  }, [currentUserId]);

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
        { id: 'badges_202502', name: 'Wellness', type: 'Campaign' as const }
      ];
    }
  }, []);

  // Auto-load recognitions on mount and when filters/tab change
  useEffect(() => {
    if (!autoLoad) return;
    const tabToUse = activeTab ?? currentTab;
    loadRecognitions(1, tabToUse);
  }, [autoLoad, loadRecognitions, departmentFilter, personFilter, currentTab, activeTab]);

  return {
    recognitions,
    currentPage,
    totalPages,
    totalCount,
    loading,
    error,
    goToPage,
    nextPage,
    previousPage,
    refreshRecognitions,
    reloadWithFilters,
    createRecognition,
    getRecognitionsByTab,
    filterRecognitionsByDepartment,
    getTrendData,
    getDistributionData,
    getAvailableBadges
  };
};
