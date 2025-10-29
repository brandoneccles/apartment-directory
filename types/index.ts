/**
 * Type definitions for the Apartment Directory application
 */

export type BuildingId = 'A' | 'B';
export type FloorNumber = 1 | 2 | 3 | 4;

export interface Person {
  id: string;
  name: string;
  role?: string; // e.g., "mom", "dad", "grandma", "roommate"
  birthday?: string; // ISO date string
  instagram?: string;
  avatar?: string; // Icon identifier or URL
}

export interface Pet {
  id: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'other';
  name: string;
  notes?: string;
}

export type UnitStatus =
  | 'vacant'
  | 'occupied'
  | 'friendly'
  | 'acquaintance'
  | 'friend'
  | 'avoid';

export type BadgeType =
  | 'dog-friendly'
  | 'cat-friendly'
  | 'has-kids'
  | 'quiet'
  | 'noisy'
  | 'party'
  | 'helpful'
  | 'gym-buddy';

export interface Badge {
  type: BadgeType;
  label: string;
  icon: string;
}

export interface Unit {
  id: string; // Unique identifier
  unitNumber: string; // Display number (e.g., "101", "2B")
  building: BuildingId;
  floor: FloorNumber;
  adults: Person[];
  children: Person[];
  pets: Pet[];
  notes: string;
  status: UnitStatus;
  badges: BadgeType[];
  svgId?: string; // ID of the SVG element for this unit (if different from id)
}

export interface HouseholdData {
  units: Unit[];
  version: string;
  lastUpdated: string;
}

// Filter types
export interface FilterState {
  status: UnitStatus[];
  hasPets: boolean | null;
  hasKids: boolean | null;
  badges: BadgeType[];
  metStatus: 'all' | 'met' | 'not-met';
  searchQuery: string;
}

// Available badge definitions
export const AVAILABLE_BADGES: Badge[] = [
  { type: 'dog-friendly', label: 'Dog Friendly', icon: 'dog' },
  { type: 'cat-friendly', label: 'Cat Friendly', icon: 'cat' },
  { type: 'has-kids', label: 'Has Kids', icon: 'baby' },
  { type: 'quiet', label: 'Quiet', icon: 'volume-x' },
  { type: 'noisy', label: 'Noisy', icon: 'volume-2' },
  { type: 'party', label: 'Party', icon: 'music' },
  { type: 'helpful', label: 'Helpful', icon: 'heart' },
  { type: 'gym-buddy', label: 'Gym Buddy', icon: 'dumbbell' },
];

// Status definitions
export const STATUS_OPTIONS: { value: UnitStatus; label: string; color: string }[] = [
  { value: 'vacant', label: 'Vacant', color: '#6b7280' },
  { value: 'occupied', label: 'Occupied', color: '#3b82f6' },
  { value: 'friendly', label: 'Friendly', color: '#10b981' },
  { value: 'acquaintance', label: 'Acquaintance', color: '#f59e0b' },
  { value: 'friend', label: 'Friend', color: '#8b5cf6' },
  { value: 'avoid', label: 'Avoid', color: '#ef4444' },
];

// Avatar options (using lucide-react icon names)
export const AVATAR_OPTIONS = [
  'user',
  'user-circle',
  'smile',
  'heart',
  'star',
  'crown',
  'coffee',
  'music',
  'book',
  'laptop',
  'bike',
  'plane',
];

// Role options
export const ROLE_OPTIONS = [
  'mom',
  'dad',
  'parent',
  'grandma',
  'grandpa',
  'aunt',
  'uncle',
  'roommate',
  'partner',
  'spouse',
  'child',
  'teen',
  'student',
];
