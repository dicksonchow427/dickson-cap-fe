import fs from 'fs';
import path from 'path';

class PersistenceService {
  private dataDir: string;

  constructor() {
    // In a browser environment, we can't directly write to files
    // This service will simulate persistence by storing in localStorage
    // In a real app, this would make API calls to a backend
    this.dataDir = '/data';
  }

  // Simulate writing to JSON file by storing in localStorage
  async writeToFile(filename: string, data: any): Promise<boolean> {
    try {
      // In browser environment, store in localStorage with a key
      const storageKey = `persisted_${filename.replace('.json', '')}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      
      return true;
    } catch (error) {
      console.error(`❌ Error persisting data to ${filename}:`, error);
      return false;
    }
  }

  // Simulate reading from JSON file by checking localStorage first, then falling back to fetch
  async readFromFile(filename: string): Promise<any> {
    try {
      const storageKey = `persisted_${filename.replace('.json', '')}`;
      const persistedData = localStorage.getItem(storageKey);
      
      if (persistedData) {
        return JSON.parse(persistedData);
      }
      
      // Fallback to fetching from public directory
      const response = await fetch(`${this.dataDir}/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Error reading data from ${filename}:`, error);
      throw error;
    }
  }







}

export const persistenceService = new PersistenceService();
export default persistenceService;
