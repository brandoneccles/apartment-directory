'use client';

/**
 * UnitDrawer - Side panel for viewing and editing unit details
 * Displays household information with view/edit modes
 */

import { useState, useEffect } from 'react';
import { X, Edit2, Save, XCircle, Plus } from 'lucide-react';
import type { Unit, Person, Pet } from '@/types';
import { generateId } from '@/lib/utils';
import PersonCard from './PersonCard';
import PetCard from './PetCard';
import StatusBadgePicker from './StatusBadgePicker';

interface UnitDrawerProps {
  unit: Unit | null;
  onClose: () => void;
  onUpdate: (unit: Unit) => void;
}

export default function UnitDrawer({ unit, onClose, onUpdate }: UnitDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUnit, setEditedUnit] = useState<Unit | null>(null);

  // Debug: Log when editedUnit changes
  useEffect(() => {
    if (editedUnit) {
      console.log('editedUnit updated - adults:', editedUnit.adults.length, 'children:', editedUnit.children.length, 'pets:', editedUnit.pets.length);
    }
  }, [editedUnit]);

  if (!unit) return null;

  const currentUnit = isEditing && editedUnit ? editedUnit : unit;

  const handleEdit = () => {
    setEditedUnit({ ...unit });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedUnit) {
      onUpdate(editedUnit);
    }
    setIsEditing(false);
    setEditedUnit(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUnit(null);
  };

  const updateField = <K extends keyof Unit>(field: K, value: Unit[K]) => {
    console.log('updateField called with:', field, value);
    setEditedUnit(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      console.log('State updated, new value:', updated[field]);
      return updated;
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Unit {currentUnit.unitNumber}
            </h2>
            <p className="text-sm text-gray-400">
              Building {currentUnit.building} · Floor {currentUnit.floor}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status and Badges */}
          <StatusBadgePicker
            status={currentUnit.status}
            badges={currentUnit.badges}
            isEditing={isEditing}
            onStatusChange={status => updateField('status', status)}
            onBadgesChange={badges => updateField('badges', badges)}
          />

          {/* Adults */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Adults</h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Add Adult clicked!', currentUnit.adults.length);
                    const newAdult: Person = {
                      id: generateId('person'),
                      name: '',
                      role: undefined,
                      birthday: undefined,
                      instagram: undefined,
                      avatar: '🧑', // Default to neutral adult
                    };
                    console.log('Creating new adult:', newAdult);
                    updateField('adults', [...currentUnit.adults, newAdult]);
                    console.log('After updateField, adults:', currentUnit.adults.length);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Adult
                </button>
              )}
            </div>
            {currentUnit.adults.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-800/50 rounded-lg">
                No adults added yet
              </div>
            ) : (
              currentUnit.adults.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  isEditing={isEditing}
                  onUpdate={updated => {
                    updateField(
                      'adults',
                      currentUnit.adults.map(p => (p.id === updated.id ? updated : p))
                    );
                  }}
                  onDelete={id => {
                    updateField(
                      'adults',
                      currentUnit.adults.filter(p => p.id !== id)
                    );
                  }}
                />
              ))
            )}
          </div>

          {/* Children */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Children</h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Add Child clicked!');
                    const newChild: Person = {
                      id: generateId('person'),
                      name: '',
                      role: 'child',
                      birthday: undefined,
                      instagram: undefined,
                      avatar: '🧒',
                    };
                    updateField('children', [...currentUnit.children, newChild]);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Child
                </button>
              )}
            </div>
            {currentUnit.children.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-800/50 rounded-lg">
                No children added yet
              </div>
            ) : (
              currentUnit.children.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  isEditing={isEditing}
                  onUpdate={updated => {
                    updateField(
                      'children',
                      currentUnit.children.map(p => (p.id === updated.id ? updated : p))
                    );
                  }}
                  onDelete={id => {
                    updateField(
                      'children',
                      currentUnit.children.filter(p => p.id !== id)
                    );
                  }}
                />
              ))
            )}
          </div>

          {/* Pets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Pets</h3>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Add Pet clicked!');
                    const newPet: Pet = {
                      id: generateId('pet'),
                      type: 'dog',
                      name: '',
                      notes: undefined,
                    };
                    updateField('pets', [...currentUnit.pets, newPet]);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Pet
                </button>
              )}
            </div>
            {currentUnit.pets.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-800/50 rounded-lg">
                No pets added yet
              </div>
            ) : (
              currentUnit.pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isEditing={isEditing}
                  onUpdate={updated => {
                    updateField(
                      'pets',
                      currentUnit.pets.map(p => (p.id === updated.id ? updated : p))
                    );
                  }}
                  onDelete={id => {
                    updateField(
                      'pets',
                      currentUnit.pets.filter(p => p.id !== id)
                    );
                  }}
                />
              ))
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Notes</h3>
            {isEditing ? (
              <textarea
                value={currentUnit.notes}
                onChange={e => updateField('notes', e.target.value)}
                placeholder="Add notes about this household..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : currentUnit.notes ? (
              <p className="text-gray-300 whitespace-pre-wrap p-4 bg-gray-800/50 rounded-lg">
                {currentUnit.notes}
              </p>
            ) : (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-800/50 rounded-lg">
                No notes added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
