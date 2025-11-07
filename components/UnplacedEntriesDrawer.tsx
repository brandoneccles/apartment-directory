'use client';

/**
 * UnplacedEntriesDrawer - View and manage unplaced household entries
 * People/households where exact unit is unknown
 */

import { X, MapPin, User, Users } from 'lucide-react';
import type { Person, Pet } from '@/types';

interface UnplacedEntry {
  id: string;
  knownInfo: {
    floor: number | null;
    building: string;
    partialUnit: string | null;
  };
  adults: Person[];
  children: Person[];
  pets: Pet[];
  notes: string;
}

interface UnplacedEntriesDrawerProps {
  isOpen: boolean;
  entries: UnplacedEntry[];
  onClose: () => void;
  onPlaceEntry?: (entry: UnplacedEntry) => void;
}

export default function UnplacedEntriesDrawer({
  isOpen,
  entries,
  onClose,
  onPlaceEntry,
}: UnplacedEntriesDrawerProps) {
  if (!isOpen) return null;

  const getPeopleCount = (entry: UnplacedEntry) => {
    return entry.adults.length + entry.children.length;
  };

  const getLocationHint = (entry: UnplacedEntry) => {
    const parts: string[] = [];
    if (entry.knownInfo.partialUnit) {
      parts.push(entry.knownInfo.partialUnit);
    } else {
      if (entry.knownInfo.floor) {
        parts.push(`Floor ${entry.knownInfo.floor}`);
      }
      if (entry.knownInfo.building) {
        parts.push(`Building ${entry.knownInfo.building}`);
      }
    }
    return parts.length > 0 ? parts.join(' · ') : 'Unknown location';
  };

  const getPrimaryNames = (entry: UnplacedEntry) => {
    const names: string[] = [];
    entry.adults.forEach(adult => {
      if (adult.name) names.push(adult.name);
    });
    entry.children.forEach(child => {
      if (child.name) names.push(child.name);
    });

    if (names.length === 0) return 'Unknown household';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names[0]} & ${names.length - 1} others`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Unplaced Entries
            </h2>
            <p className="text-sm text-gray-400">
              {entries.length} household{entries.length !== 1 ? 's' : ''} with unknown units
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
        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                No Unplaced Entries
              </h3>
              <p className="text-sm text-gray-500">
                All your neighbors have been placed in their units!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <UnplacedEntryCard
                  key={entry.id}
                  entry={entry}
                  primaryNames={getPrimaryNames(entry)}
                  peopleCount={getPeopleCount(entry)}
                  locationHint={getLocationHint(entry)}
                  onPlace={() => onPlaceEntry?.(entry)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// UnplacedEntryCard Component
interface UnplacedEntryCardProps {
  entry: UnplacedEntry;
  primaryNames: string;
  peopleCount: number;
  locationHint: string;
  onPlace: () => void;
}

function UnplacedEntryCard({
  entry,
  primaryNames,
  peopleCount,
  locationHint,
  onPlace,
}: UnplacedEntryCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white truncate">
                {primaryNames}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                <Users className="w-3 h-3" />
                {peopleCount}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {locationHint}
            </div>
          </div>
          <div className="text-gray-400">
            {expanded ? '▼' : '▶'}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50 pt-3 space-y-3">
          {/* Adults */}
          {entry.adults.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Adults
              </div>
              <div className="space-y-1">
                {entry.adults.map(adult => (
                  <div key={adult.id} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{adult.avatar || '👤'}</span>
                    <span className="text-white">
                      {adult.name || <span className="text-gray-500 italic">Unnamed</span>}
                    </span>
                    {adult.role && (
                      <span className="text-xs text-gray-400">• {adult.role}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {entry.children.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Children
              </div>
              <div className="space-y-1">
                {entry.children.map(child => (
                  <div key={child.id} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{child.avatar || '👤'}</span>
                    <span className="text-white">
                      {child.name || <span className="text-gray-500 italic">Unnamed</span>}
                    </span>
                    {child.role && (
                      <span className="text-xs text-gray-400">• {child.role}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pets */}
          {entry.pets.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Pets
              </div>
              <div className="space-y-1">
                {entry.pets.map(pet => {
                  const petEmoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐾';
                  return (
                    <div key={pet.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{petEmoji}</span>
                      <span className="text-white">
                        {pet.name || <span className="text-gray-500 italic">Unnamed</span>}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">• {pet.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Notes
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {entry.notes}
              </p>
            </div>
          )}

          {/* Place Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlace();
            }}
            className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Place in Unit...
          </button>
        </div>
      )}
    </div>
  );
}

// Add React import for useState
import React from 'react';
