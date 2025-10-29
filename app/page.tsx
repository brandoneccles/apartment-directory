'use client';

/**
 * Main page - Apartment Directory application
 * Orchestrates all components and manages application state
 */

import { useEffect, useState } from 'react';
import MapViewer from '@/components/MapViewer';
import BuildingSelector from '@/components/BuildingSelector';
import UnitDrawer from '@/components/UnitDrawer';
import FilterBar from '@/components/FilterBar';
import type { BuildingId, FloorNumber, Unit, FilterState, HouseholdData } from '@/types';
import { loadHouseholdData, saveHouseholdData, downloadData } from '@/lib/storage';
import { unitMatchesFilters } from '@/lib/utils';

export default function Home() {
  // View state
  const [building, setBuilding] = useState<BuildingId>('G');
  const [floor, setFloor] = useState<FloorNumber>(3);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Data state
  const [data, setData] = useState<HouseholdData>({
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    units: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    hasPets: null,
    hasKids: null,
    badges: [],
    metStatus: 'all',
    searchQuery: '',
  });

  // Load data on mount
  useEffect(() => {
    loadHouseholdData()
      .then(loadedData => {
        setData(loadedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      });
  }, []);

  // Save data whenever it changes (with debounce would be better in production)
  useEffect(() => {
    if (!isLoading && data.units.length > 0) {
      saveHouseholdData(data);
    }
  }, [data, isLoading]);

  // Get units for current building and floor
  const currentFloorUnits = data.units.filter(
    unit => unit.building === building && unit.floor === floor
  );

  // Apply filters
  const filteredUnits = currentFloorUnits.filter(unit =>
    unitMatchesFilters(unit, filters)
  );
  const highlightedUnitIds = filteredUnits.map(u => u.id);

  // Handlers
  const handleUnitUpdate = (updatedUnit: Unit) => {
    setData(prevData => ({
      ...prevData,
      units: prevData.units.map(u => (u.id === updatedUnit.id ? updatedUnit : u)),
    }));
    setSelectedUnit(updatedUnit);
  };

  const handleExport = () => {
    downloadData(data);
  };

  const handleImport = () => {
    // Placeholder for V1 - will be implemented in future
    alert('Import functionality coming soon! For now, you can manually edit the JSON file.');
  };

  const handleUnitClick = (unit: Unit | null) => {
    setSelectedUnit(unit);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading apartment directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">Apartment Directory</h1>
        <p className="text-sm text-gray-400">
          Interactive floor plan with household information
        </p>
      </header>

      {/* Building/Floor Selector */}
      <BuildingSelector
        building={building}
        floor={floor}
        onBuildingChange={setBuilding}
        onFloorChange={setFloor}
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        matchingCount={filteredUnits.length}
        totalCount={currentFloorUnits.length}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map Viewer */}
        <MapViewer
          building={building}
          floor={floor}
          units={currentFloorUnits}
          selectedUnit={selectedUnit}
          highlightedUnits={
            filters.status.length > 0 ||
            filters.hasPets !== null ||
            filters.hasKids !== null ||
            filters.badges.length > 0 ||
            filters.metStatus !== 'all' ||
            filters.searchQuery.trim() !== ''
              ? highlightedUnitIds
              : []
          }
          onUnitClick={handleUnitClick}
        />

        {/* Unit Drawer */}
        {selectedUnit && (
          <UnitDrawer
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdate={handleUnitUpdate}
          />
        )}
      </div>
    </div>
  );
}
