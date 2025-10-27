import { User, Badge, Colleague } from '../types/dashboard';
import { persistenceService } from './persistenceService';
import { addColorsToBadgesAlphabetical } from '../constants/badgeColors';

        class UserService {
          private users: User[] = [];
          private isLoaded = false;

  // Load users from JSON file
  async loadUsers(): Promise<User[]> {
    if (this.isLoaded && this.users.length > 0) {
      return this.users;
    }

    try {
      // Try to load from persisted data first
      this.users = await persistenceService.readFromFile('users.json');
      this.isLoaded = true;
      return this.users;
    } catch (error) {
      console.error('Error loading users:', error);
      throw new Error('Failed to load user data');
    }
  }

          // Get all users
          async getAllUsers(): Promise<User[]> {
            return await this.loadUsers();
          }

          // Get user by ID
          async getUserById(id: string): Promise<User | null> {
            const users = await this.loadUsers();
            return users.find(user => user.id === id) || null;
          }

          // Get colleagues list sorted by total received badges
          async getColleagues(): Promise<Colleague[]> {
            const users = await this.loadUsers();
            
            return users.map(user => {
              const totalReceived = user.received_badges.reduce((sum, badge) => sum + badge.number, 0);
              return {
                id: user.id,
                name: user.name,
                title: `${totalReceived} Recognitions`,
                recognitions: totalReceived,
                avatar: `/images/${user.photo}`
              };
            }).sort((a, b) => b.recognitions - a.recognitions);
          }

          // Get users by department
          async getUsersByDepartment(department: string): Promise<User[]> {
            const users = await this.loadUsers();
            if (department === 'Everyone') {
              return users;
            }
            return users.filter(user => user.department_division === department);
          }


          // Get badges with colors for display
          getBadgesWithColors(badges: Badge[]): Badge[] {
            return addColorsToBadgesAlphabetical(badges);
          }



  // Increment badge count (now persists to localStorage)
  async incrementBadge(userId: string, badgeId: string, type: 'given' | 'received'): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) {
      return false;
    }

    const badgeArray = type === 'given' ? user.given_badges : user.received_badges;
    const badge = badgeArray.find(b => b.id === badgeId);
    
    if (badge) {
      badge.number += 1;
      
      // Persist the updated user data
      await persistenceService.writeToFile('users.json', this.users);
      
      return true;
    }

    return false;
  }



          // Save users (for demonstration - in real app would make API call)
          async saveUsers(): Promise<boolean> {
            try {
              // In a real application, this would make an API call to save data
              return true;
            } catch (error) {
              console.error('Error saving users:', error);
              return false;
            }
          }
        }

        export const userService = new UserService();
        export default userService;