'use client';

/**
 * StatusBadgePicker - Component for selecting unit status and badges
 */

import type { UnitStatus, BadgeType } from '@/types';
import { STATUS_OPTIONS, AVAILABLE_BADGES } from '@/types';
import * as Icons from 'lucide-react';
import { Check } from 'lucide-react';

interface StatusBadgePickerProps {
  status: UnitStatus;
  badges: BadgeType[];
  isEditing: boolean;
  onStatusChange: (status: UnitStatus) => void;
  onBadgesChange: (badges: BadgeType[]) => void;
}

export default function StatusBadgePicker({
  status,
  badges,
  isEditing,
  onStatusChange,
  onBadgesChange,
}: StatusBadgePickerProps) {
  const currentStatus = STATUS_OPTIONS.find(s => s.value === status);

  const toggleBadge = (badgeType: BadgeType) => {
    if (badges.includes(badgeType)) {
      onBadgesChange(badges.filter(b => b !== badgeType));
    } else {
      onBadgesChange([...badges, badgeType]);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Badge Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Badges</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_BADGES.map(badge => {
              const IconComponent = (Icons[
                badge.icon.split('-').map((word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join('') as keyof typeof Icons
              ] as any) || Icons.Tag;

              const isSelected = badges.includes(badge.type);

              return (
                <button
                  key={badge.type}
                  onClick={() => toggleBadge(badge.type)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border-2
                    ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }
                  `}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {badge.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // View mode - only show badges if there are any
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Badges Display */}
      {badges.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Badges</label>
          <div className="flex flex-wrap gap-2">
            {badges.map(badgeType => {
              const badge = AVAILABLE_BADGES.find(b => b.type === badgeType);
              if (!badge) return null;

              const IconComponent = (Icons[
                badge.icon.split('-').map((word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join('') as keyof typeof Icons
              ] as any) || Icons.Tag;

              return (
                <div
                  key={badge.type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700"
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
