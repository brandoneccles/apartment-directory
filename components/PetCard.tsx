'use client';

/**
 * PetCard - Display and edit a pet's information
 */

import { useState } from 'react';
import { Trash2, Dog, Cat, Bird, Fish, Rabbit, PawPrint } from 'lucide-react';
import type { Pet } from '@/types';

interface PetCardProps {
  pet: Pet;
  isEditing: boolean;
  onUpdate: (pet: Pet) => void;
  onDelete: (id: string) => void;
}

const PET_TYPES = [
  { value: 'dog', label: 'Dog', Icon: Dog },
  { value: 'cat', label: 'Cat', Icon: Cat },
  { value: 'bird', label: 'Bird', Icon: Bird },
  { value: 'fish', label: 'Fish', Icon: Fish },
  { value: 'rabbit', label: 'Rabbit', Icon: Rabbit },
  { value: 'other', label: 'Other', Icon: PawPrint },
] as const;

export default function PetCard({
  pet,
  isEditing,
  onUpdate,
  onDelete,
}: PetCardProps) {
  const [localPet, setLocalPet] = useState(pet);

  const handleFieldChange = <K extends keyof Pet>(field: K, value: Pet[K]) => {
    const updated = { ...localPet, [field]: value };
    setLocalPet(updated);
    onUpdate(updated);
  };

  const petTypeInfo = PET_TYPES.find(pt => pt.value === pet.type) || PET_TYPES[5];
  const Icon = petTypeInfo.Icon;

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
        {/* Type and Name */}
        <div className="flex gap-3">
          <div className="w-32">
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select
              value={localPet.type}
              onChange={e => handleFieldChange('type', e.target.value as Pet['type'])}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PET_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={localPet.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet's name"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Notes (optional)</label>
          <textarea
            value={localPet.notes || ''}
            onChange={e => handleFieldChange('notes', e.target.value || undefined)}
            placeholder="Breed, color, temperament..."
            rows={2}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(pet.id)}
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
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-green-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">{pet.name}</h4>
            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
              {petTypeInfo.label}
            </span>
          </div>

          {pet.notes && (
            <p className="mt-2 text-sm text-gray-400">{pet.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}
