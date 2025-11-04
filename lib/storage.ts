/**
 * localStorage wrapper for persisting household data
 * Falls back to in-memory storage if localStorage is unavailable
 */

import type { HouseholdData } from '@/types';

const STORAGE_KEY = 'apartment-directory-data';
const STORAGE_VERSION = '1.1.0'; // Bumped to force reload with new floor data

// In-memory fallback for SSR or when localStorage is unavailable
let memoryStorage: HouseholdData | null = null;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load household data from localStorage or return seed data
 */
export async function loadHouseholdData(): Promise<HouseholdData> {
  // Try localStorage first
  if (isLocalStorageAvailable()) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as HouseholdData;
        // Validate version compatibility
        if (data.version === STORAGE_VERSION) {
          return data;
        }
        console.warn('Storage version mismatch, loading seed data');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Check memory fallback
  if (memoryStorage) {
    return memoryStorage;
  }

  // Load seed data as fallback
  try {
    const response = await fetch('/households.json');
    if (!response.ok) {
      throw new Error('Failed to fetch seed data');
    }
    const seedData = await response.json() as HouseholdData;
    return seedData;
  } catch (error) {
    console.error('Error loading seed data:', error);
    // Return minimal valid data structure
    return {
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
      units: [],
    };
  }
}

/**
 * Save household data to localStorage
 */
export function saveHouseholdData(data: HouseholdData): boolean {
  // Update timestamp
  const dataToSave = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  // Try localStorage
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Fallback to memory
  memoryStorage = dataToSave;
  return false; // Indicate that persistence is not permanent
}

/**
 * Clear all stored data (useful for reset functionality)
 */
export function clearStoredData(): void {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
  memoryStorage = null;
}

/**
 * Export data as JSON string for download
 */
export function exportData(data: HouseholdData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON string
 * @returns Parsed data or null if invalid
 */
export function importData(jsonString: string): HouseholdData | null {
  try {
    const data = JSON.parse(jsonString) as HouseholdData;

    // Basic validation
    if (!data.units || !Array.isArray(data.units)) {
      throw new Error('Invalid data format: missing units array');
    }

    // Add version if missing
    if (!data.version) {
      data.version = STORAGE_VERSION;
    }

    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    return null;
  }
}

/**
 * Download data as a JSON file
 */
export function downloadData(data: HouseholdData, filename = 'apartment-directory-backup.json'): void {
  if (typeof window === 'undefined') return;

  const jsonString = exportData(data);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
