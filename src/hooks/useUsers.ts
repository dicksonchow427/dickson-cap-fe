import { useState, useEffect, useCallback } from 'react';
import { User, Colleague } from '../types/dashboard';
import userService from '../services/userService';

interface UseUsersReturn {
  users: User[];
  colleagues: Colleague[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  // Actions
  refreshUsers: () => Promise<void>;
  incrementBadge: (userId: string, badgeId: string, type: 'given' | 'received') => Promise<boolean>;
}

export const useUsers = (currentUserId?: string): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, colleaguesData] = await Promise.all([
        userService.getAllUsers(),
        userService.getColleagues()
      ]);

      setUsers(usersData);
      setColleagues(colleaguesData);

      // Set current user if ID provided
      if (currentUserId) {
        const user = await userService.getUserById(currentUserId);
        setCurrentUser(user);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh all data
  const refreshUsers = useCallback(async () => {
    await loadData();
  }, [loadData]);





  // Increment badge count
  const incrementBadge = useCallback(async (userId: string, badgeId: string, type: 'given' | 'received'): Promise<boolean> => {
    try {
      setError(null);
      const success = await userService.incrementBadge(userId, badgeId, type);

      if (success) {
        // Refresh specific user data
        const updatedUser = await userService.getUserById(userId);
        if (updatedUser) {
          setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));

          if (currentUserId === userId) {
            setCurrentUser(updatedUser);
          }

          // Refresh colleagues list
          const colleaguesData = await userService.getColleagues();
          setColleagues(colleaguesData);
        }
      }

      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update badge');
      return false;
    }
  }, [currentUserId]);


  return {
    users,
    colleagues,
    currentUser,
    loading,
    error,
    refreshUsers,
    incrementBadge
  };
};

export default useUsers;