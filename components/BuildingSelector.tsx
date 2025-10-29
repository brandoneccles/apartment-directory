'use client';

/**
 * BuildingSelector - UI for switching between buildings and floors
 */

import type { BuildingId, FloorNumber } from '@/types';
import { Building, Layers } from 'lucide-react';

interface BuildingSelectorProps {
  building: BuildingId;
  floor: FloorNumber;
  onBuildingChange: (building: BuildingId) => void;
  onFloorChange: (floor: FloorNumber) => void;
}

const BUILDINGS: BuildingId[] = ['G'];
const FLOORS: FloorNumber[] = [3];

export default function BuildingSelector({
  building,
  floor,
  onBuildingChange,
  onFloorChange,
}: BuildingSelectorProps) {
  return (
    <div className="flex items-center gap-6 px-6 py-4 bg-gray-900 border-b border-gray-800">
      {/* Building Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Building className="w-4 h-4" />
          <span className="text-sm font-medium">Building</span>
        </div>
        <div className="flex gap-2">
          {BUILDINGS.map(b => (
            <button
              key={b}
              onClick={() => onBuildingChange(b)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${
                  building === b
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">Floor</span>
        </div>
        <div className="flex gap-2">
          {FLOORS.map(f => (
            <button
              key={f}
              onClick={() => onFloorChange(f)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all min-w-[48px]
                ${
                  floor === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="ml-auto text-sm text-gray-400">
        <span className="font-mono">
          Building {building} · Floor {floor}
        </span>
      </div>
    </div>
  );
}
