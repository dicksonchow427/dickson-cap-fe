class PersistenceService {
  private dataDir: string;
  // Storage version for cache versioning
  // Increment this when you need to invalidate old cached data
  private readonly STORAGE_VERSION = 'v1';

  constructor() {
    // In a browser environment, we can't directly write to files
    // This service will simulate persistence by storing in localStorage
    // In a real app, this would make API calls to a backend
    this.dataDir = '/data';
  }

  // Simulate writing to JSON file by storing in localStorage
  async writeToFile(filename: string, data: unknown): Promise<boolean> {
    try {
      // Check if localStorage is available (not available in private browsing mode)
      if (typeof Storage === 'undefined' || !localStorage) {
        console.warn('localStorage is not available. Data will not be persisted.');
        return false;
      }

      // In browser environment, store in localStorage with a versioned key
      const storageKey = `persisted_${filename.replace('.json', '')}_${this.STORAGE_VERSION}`;
      localStorage.setItem(storageKey, JSON.stringify(data));

      return true;
    } catch (error) {
      // Handle QuotaExceededError and other storage errors
      if (error instanceof DOMException && (error.code === 22 || error.code === 1014 || error.name === 'QuotaExceededError')) {
        console.error('localStorage quota exceeded. Clearing old data may help.');
      }
      console.error(`Error persisting data to ${filename}:`, error);
      return false;
    }
  }

  // Simulate reading from JSON file by checking localStorage first, then falling back to fetch
  async readFromFile<T = unknown>(filename: string): Promise<T> {
    try {
      // Check if localStorage is available
      if (typeof Storage !== 'undefined' && localStorage) {
        const storageKey = `persisted_${filename.replace('.json', '')}_${this.STORAGE_VERSION}`;
        const persistedData = localStorage.getItem(storageKey);

        if (persistedData) {
          return JSON.parse(persistedData) as T;
        }
      }

      // Fallback to fetching from public directory
      const response = await fetch(`${this.dataDir}/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
      }

      const data = await response.json() as T;
      return data;
    } catch (error) {
      console.error(`Error reading data from ${filename}:`, error);
      throw error;
    }
  }







}

export const persistenceService = new PersistenceService();
export default persistenceService;
