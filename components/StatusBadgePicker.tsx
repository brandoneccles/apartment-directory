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
        {/* Status Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`
                  px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    status === option.value
                      ? 'border-white bg-opacity-20'
                      : 'border-gray-700 hover:border-gray-600'
                  }
                `}
                style={{
                  backgroundColor: status === option.value ? option.color + '40' : 'transparent',
                  color: status === option.value ? option.color : '#9ca3af',
                }}
              >
                {status === option.value && <Check className="w-4 h-4 inline mr-1" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>

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

  // View mode
  return (
    <div className="space-y-4">
      {/* Status Display */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
        <div
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: currentStatus?.color + '20',
            color: currentStatus?.color,
            border: `2px solid ${currentStatus?.color}40`,
          }}
        >
          {currentStatus?.label || status}
        </div>
      </div>

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
