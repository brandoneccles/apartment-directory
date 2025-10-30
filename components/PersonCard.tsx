'use client';

/**
 * PersonCard - Display and edit a person's information
 */

import { useState } from 'react';
import { Trash2, Instagram, Calendar, User } from 'lucide-react';
import type { Person } from '@/types';
import { formatDate, calculateAge } from '@/lib/utils';
import { ROLE_OPTIONS, AVATAR_OPTIONS } from '@/types';
import * as Icons from 'lucide-react';

interface PersonCardProps {
  person: Person;
  isEditing: boolean;
  onUpdate: (person: Person) => void;
  onDelete: (id: string) => void;
}

export default function PersonCard({
  person,
  isEditing,
  onUpdate,
  onDelete,
}: PersonCardProps) {
  const [localPerson, setLocalPerson] = useState(person);

  const handleFieldChange = <K extends keyof Person>(field: K, value: Person[K]) => {
    const updated = { ...localPerson, [field]: value };
    setLocalPerson(updated);
    onUpdate(updated);
  };

  const age = calculateAge(person.birthday);
  const avatarEmoji = person.avatar || '👤'; // Default to a generic person icon

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
        {/* Name and Avatar */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={localPerson.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs text-gray-400 mb-1">Icon</label>
            <select
              value={localPerson.avatar || '👤'}
              onChange={e => handleFieldChange('avatar', e.target.value)}
              className="w-full px-2 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AVATAR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.value} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Role / Relationship (optional)</label>
          <input
            type="text"
            value={localPerson.role || ''}
            onChange={e => handleFieldChange('role', e.target.value || undefined)}
            placeholder="e.g., sister, mom, roommate, friend"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Birthday (optional)</label>
          <input
            type="date"
            value={localPerson.birthday || ''}
            onChange={e => handleFieldChange('birthday', e.target.value || undefined)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Instagram (optional)</label>
          <input
            type="text"
            value={localPerson.instagram || ''}
            onChange={e => handleFieldChange('instagram', e.target.value || undefined)}
            placeholder="@username"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(person.id)}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    );
  }

  // View mode
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 text-2xl">
          {avatarEmoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">{person.name}</h4>
            {person.role && (
              <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                {person.role}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="mt-2 space-y-1">
            {person.birthday && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDate(person.birthday)}
                  {age !== null && ` · ${age} years old`}
                </span>
              </div>
            )}
            {person.instagram && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Instagram className="w-3.5 h-3.5" />
                <a
                  href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  {person.instagram}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
