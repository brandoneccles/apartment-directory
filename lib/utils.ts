/**
 * Utility functions for the Apartment Directory application
 */

import type { Unit, FilterState, Person } from '@/types';

/**
 * Check if a unit has been "met" (has any stored information)
 */
export function isUnitMet(unit: Unit): boolean {
  return (
    unit.adults.length > 0 ||
    unit.children.length > 0 ||
    unit.pets.length > 0 ||
    unit.notes.trim().length > 0
  );
}

/**
 * Check if a unit matches the current filter state
 */
export function unitMatchesFilters(unit: Unit, filters: FilterState): boolean {
  // Status filter
  if (filters.status.length > 0 && !filters.status.includes(unit.status)) {
    return false;
  }

  // Has pets filter
  if (filters.hasPets !== null) {
    const hasPets = unit.pets.length > 0;
    if (filters.hasPets !== hasPets) {
      return false;
    }
  }

  // Has kids filter
  if (filters.hasKids !== null) {
    const hasKids = unit.children.length > 0;
    if (filters.hasKids !== hasKids) {
      return false;
    }
  }

  // Badge filter
  if (filters.badges.length > 0) {
    const hasMatchingBadge = filters.badges.some(badge => unit.badges.includes(badge));
    if (!hasMatchingBadge) {
      return false;
    }
  }

  // Met/Not met filter
  const met = isUnitMet(unit);
  if (filters.metStatus === 'met' && !met) {
    return false;
  }
  if (filters.metStatus === 'not-met' && met) {
    return false;
  }

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    const matchesUnit = unit.unitNumber.toLowerCase().includes(query);
    const matchesNotes = unit.notes.toLowerCase().includes(query);
    const matchesPerson = [...unit.adults, ...unit.children].some(
      person => person.name.toLowerCase().includes(query)
    );
    const matchesPet = unit.pets.some(
      pet => pet.name.toLowerCase().includes(query)
    );

    if (!matchesUnit && !matchesNotes && !matchesPerson && !matchesPet) {
      return false;
    }
  }

  return true;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate age from birthday
 */
export function calculateAge(birthday: string | undefined): number | null {
  if (!birthday) return null;

  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  } catch {
    return null;
  }
}

/**
 * Get all people from a unit
 */
export function getAllPeople(unit: Unit): Person[] {
  return [...unit.adults, ...unit.children];
}

/**
 * Count total occupants in a unit
 */
export function countOccupants(unit: Unit): number {
  return unit.adults.length + unit.children.length;
}

/**
 * Get color for status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    vacant: '#6b7280',
    occupied: '#3b82f6',
    friendly: '#10b981',
    acquaintance: '#f59e0b',
    friend: '#8b5cf6',
    avoid: '#ef4444',
  };
  return colors[status] || colors.occupied;
}

/**
 * Combine CSS class names (simple version of clsx/classnames)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
