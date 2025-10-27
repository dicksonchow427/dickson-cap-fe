import { useState, useCallback } from 'react';
import recognitionService from '../services/recognitionService';

interface UseRecognitionActionsOptions {
  currentUserId?: string;
  onLikeToggle?: (recognitionId: string, isLiked: boolean) => void;
  onRecognitionCreated?: () => void;
}

interface UseRecognitionActionsReturn {
  liking: { [key: string]: boolean };
  creating: boolean;
  toggleLike: (recognitionId: string) => Promise<boolean>;
  createRecognition: (giverId: string, receiverId: string, badgeId: string, message: string, campaign: string) => Promise<boolean>;
}

export const useRecognitionActions = (
  options: UseRecognitionActionsOptions = {}
): UseRecognitionActionsReturn => {
  const { currentUserId, onLikeToggle, onRecognitionCreated } = options;
  
  const [liking, setLiking] = useState<{ [key: string]: boolean }>({});
  const [creating, setCreating] = useState<boolean>(false);

  const toggleLike = useCallback(async (recognitionId: string): Promise<boolean> => {
    if (!currentUserId || liking[recognitionId]) {
      return false;
    }

    setLiking(prev => ({ ...prev, [recognitionId]: true }));

    try {
      const success = await recognitionService.toggleLike(recognitionId, currentUserId);
      
      if (success && onLikeToggle) {
        // Call the callback to trigger refresh - the actual like status will be determined
        // when the recognitions are refreshed and transformed
        onLikeToggle(recognitionId, true);
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    } finally {
      setLiking(prev => ({ ...prev, [recognitionId]: false }));
    }
  }, [currentUserId, onLikeToggle, liking]);

  const createRecognition = useCallback(async (
    giverId: string,
    receiverId: string,
    badgeId: string,
    message: string,
    campaign: string
  ): Promise<boolean> => {
    if (creating) {
      return false;
    }

    setCreating(true);

    try {
      const success = await recognitionService.createRecognition(
        giverId,
        receiverId,
        badgeId,
        message,
        campaign
      );
      
      if (success && onRecognitionCreated) {
        onRecognitionCreated();
      }
      
      return success;
    } catch (error) {
      console.error('Error creating recognition:', error);
      return false;
    } finally {
      setCreating(false);
    }
  }, [creating, onRecognitionCreated]);

  return {
    liking,
    creating,
    toggleLike,
    createRecognition
  };
};