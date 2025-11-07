'use client';

/**
 * UnitDrawer - Side panel for viewing and editing unit details
 * Individual edit mode per item - no global save/cancel
 */

import { useState } from 'react';
import { X, Plus, Trash2, Calendar, Instagram, Edit2 } from 'lucide-react';
import type { Unit, Person, Pet, UnitStatus, BadgeType } from '@/types';
import { generateId, formatDate, calculateAge } from '@/lib/utils';
import { AVATAR_OPTIONS } from '@/types';
import StatusBadgePicker from './StatusBadgePicker';

interface UnitDrawerProps {
  unit: Unit | null;
  onClose: () => void;
  onUpdate: (unit: Unit) => void;
}

interface EditingState {
  type: 'adult' | 'child' | 'pet' | null;
  id: string | null;
}

export default function UnitDrawer({ unit, onClose, onUpdate }: UnitDrawerProps) {
  const [editing, setEditing] = useState<EditingState>({ type: null, id: null });

  if (!unit) return null;

  const startEditing = (type: 'adult' | 'child' | 'pet', id: string) => {
    setEditing({ type, id });
  };

  const stopEditing = () => {
    setEditing({ type: null, id: null });
  };

  const updatePerson = (listType: 'adults' | 'children', updated: Person) => {
    onUpdate({
      ...unit,
      [listType]: unit[listType].map(p => (p.id === updated.id ? updated : p))
    });
  };

  const deletePerson = (listType: 'adults' | 'children', id: string) => {
    onUpdate({
      ...unit,
      [listType]: unit[listType].filter(p => p.id !== id)
    });
    if (editing.id === id) stopEditing();
  };

  const addAdult = () => {
    const newAdult: Person = {
      id: generateId('person'),
      name: '',
      avatar: '🧑',
    };
    onUpdate({
      ...unit,
      adults: [...unit.adults, newAdult]
    });
    startEditing('adult', newAdult.id);
  };

  const addChild = () => {
    const newChild: Person = {
      id: generateId('person'),
      name: '',
      avatar: '🧒',
      role: 'child',
    };
    onUpdate({
      ...unit,
      children: [...unit.children, newChild]
    });
    startEditing('child', newChild.id);
  };

  const addPet = () => {
    const newPet: Pet = {
      id: generateId('pet'),
      name: '',
      type: 'dog',
    };
    onUpdate({
      ...unit,
      pets: [...unit.pets, newPet]
    });
    startEditing('pet', newPet.id);
  };

  const updatePet = (updated: Pet) => {
    onUpdate({
      ...unit,
      pets: unit.pets.map(p => (p.id === updated.id ? updated : p))
    });
  };

  const deletePet = (id: string) => {
    onUpdate({
      ...unit,
      pets: unit.pets.filter(p => p.id !== id)
    });
    if (editing.id === id) stopEditing();
  };

  const updateNotes = (notes: string) => {
    onUpdate({ ...unit, notes });
  };

  const updateStatus = (status: UnitStatus) => {
    onUpdate({ ...unit, status });
  };

  const updateBadges = (badges: BadgeType[]) => {
    onUpdate({ ...unit, badges });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Unit {unit.unitNumber}
            </h2>
            <p className="text-sm text-gray-400">
              Building {unit.building} · Floor {unit.floor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status and Badges */}
          <StatusBadgePicker
            status={unit.status}
            badges={unit.badges}
            isEditing={true}
            onStatusChange={updateStatus}
            onBadgesChange={updateBadges}
          />

          {/* Adults Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">👨</span> Adults
              </h3>
              <button
                onClick={addAdult}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {unit.adults.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-4 bg-gray-800/30 rounded-lg border border-gray-800">
                  No adults added yet
                </div>
              ) : (
                unit.adults.map(person => (
                  <PersonListItem
                    key={person.id}
                    person={person}
                    isEditing={editing.type === 'adult' && editing.id === person.id}
                    onEdit={() => startEditing('adult', person.id)}
                    onSave={stopEditing}
                    onUpdate={updated => updatePerson('adults', updated)}
                    onDelete={() => deletePerson('adults', person.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Children Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">👧</span> Children
              </h3>
              <button
                onClick={addChild}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {unit.children.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-4 bg-gray-800/30 rounded-lg border border-gray-800">
                  No children added yet
                </div>
              ) : (
                unit.children.map(person => (
                  <PersonListItem
                    key={person.id}
                    person={person}
                    isEditing={editing.type === 'child' && editing.id === person.id}
                    onEdit={() => startEditing('child', person.id)}
                    onSave={stopEditing}
                    onUpdate={updated => updatePerson('children', updated)}
                    onDelete={() => deletePerson('children', person.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Pets Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">🐕</span> Pets
              </h3>
              <button
                onClick={addPet}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {unit.pets.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-4 bg-gray-800/30 rounded-lg border border-gray-800">
                  No pets added yet
                </div>
              ) : (
                unit.pets.map(pet => (
                  <PetListItem
                    key={pet.id}
                    pet={pet}
                    isEditing={editing.type === 'pet' && editing.id === pet.id}
                    onEdit={() => startEditing('pet', pet.id)}
                    onSave={stopEditing}
                    onUpdate={updatePet}
                    onDelete={() => deletePet(pet.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">📝</span> Notes
            </h3>
            <textarea
              value={unit.notes}
              onChange={e => updateNotes(e.target.value)}
              placeholder="Add notes about this household..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// PersonListItem Component
interface PersonListItemProps {
  person: Person;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (person: Person) => void;
  onDelete: () => void;
}

function PersonListItem({ person, isEditing, onEdit, onSave, onUpdate, onDelete }: PersonListItemProps) {
  const [local, setLocal] = useState(person);

  const handleChange = <K extends keyof Person>(field: K, value: Person[K]) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    onUpdate(updated);
  };

  const age = calculateAge(person.birthday);

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border-2 border-blue-600/50 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Name and Avatar */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={local.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                  autoFocus
                />
              </div>
              <div className="w-24">
                <label className="block text-xs text-gray-400 mb-1">Icon</label>
                <select
                  value={local.avatar || '🧑'}
                  onChange={e => handleChange('avatar', e.target.value)}
                  className="w-full px-2 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {AVATAR_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Role / Relationship</label>
              <input
                type="text"
                value={local.role || ''}
                onChange={e => handleChange('role', e.target.value || undefined)}
                placeholder="e.g., dad, mom, roommate, friend"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Birthday</label>
              <input
                type="date"
                value={local.birthday || ''}
                onChange={e => handleChange('birthday', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Instagram</label>
              <input
                type="text"
                value={local.instagram || ''}
                onChange={e => handleChange('instagram', e.target.value || undefined)}
                placeholder="@username"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl flex-shrink-0">{person.avatar || '👤'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {person.name || <span className="text-gray-500 italic">Unnamed</span>}
            </span>
            {person.role && (
              <span className="text-xs text-gray-400 truncate">• {person.role}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
            {person.birthday && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(person.birthday)}
                {age !== null && ` (${age})`}
              </span>
            )}
            {person.instagram && (
              <span className="flex items-center gap-1">
                <Instagram className="w-3 h-3" />
                {person.instagram}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors text-sm opacity-0 group-hover:opacity-100"
      >
        <Edit2 className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>
  );
}

// PetListItem Component
interface PetListItemProps {
  pet: Pet;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (pet: Pet) => void;
  onDelete: () => void;
}

function PetListItem({ pet, isEditing, onEdit, onSave, onUpdate, onDelete }: PetListItemProps) {
  const [local, setLocal] = useState(pet);

  const handleChange = <K extends keyof Pet>(field: K, value: Pet[K]) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    onUpdate(updated);
  };

  const petEmoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐾';

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border-2 border-blue-600/50 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Name and Type */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={local.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pet name"
                  autoFocus
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <select
                  value={local.type}
                  onChange={e => handleChange('type', e.target.value as 'dog' | 'cat' | 'other')}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dog">🐕 Dog</option>
                  <option value="cat">🐈 Cat</option>
                  <option value="other">🐾 Other</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <input
                type="text"
                value={local.notes || ''}
                onChange={e => handleChange('notes', e.target.value || undefined)}
                placeholder="Any additional info..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl flex-shrink-0">{petEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {pet.name || <span className="text-gray-500 italic">Unnamed</span>}
            </span>
            <span className="text-xs text-gray-400 capitalize">• {pet.type}</span>
          </div>
          {pet.notes && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">{pet.notes}</div>
          )}
        </div>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors text-sm opacity-0 group-hover:opacity-100"
      >
        <Edit2 className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>
  );
}
