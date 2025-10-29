'use client';

/**
 * FilterBar - Filter controls and search for units
 */

import { useState } from 'react';
import { Search, X, Filter, Download, Upload } from 'lucide-react';
import type { FilterState, UnitStatus, BadgeType } from '@/types';
import { STATUS_OPTIONS, AVAILABLE_BADGES } from '@/types';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  matchingCount: number;
  totalCount: number;
  onExport: () => void;
  onImport: () => void;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  matchingCount,
  totalCount,
  onExport,
  onImport,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleStatus = (status: UnitStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilter('status', newStatuses);
  };

  const toggleBadge = (badge: BadgeType) => {
    const newBadges = filters.badges.includes(badge)
      ? filters.badges.filter(b => b !== badge)
      : [...filters.badges, badge];
    updateFilter('badges', newBadges);
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      hasPets: null,
      hasKids: null,
      badges: [],
      metStatus: 'all',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.hasPets !== null ||
    filters.hasKids !== null ||
    filters.badges.length > 0 ||
    filters.metStatus !== 'all' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      {/* Main Bar */}
      <div className="px-6 py-4 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={e => updateFilter('searchQuery', e.target.value)}
            placeholder="Search units, people, or pets..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
            ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && !showFilters && (
            <span className="px-1.5 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
              {filters.status.length + filters.badges.length + (filters.hasPets !== null ? 1 : 0) + (filters.hasKids !== null ? 1 : 0) + (filters.metStatus !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          {hasActiveFilters ? (
            <span>
              {matchingCount} of {totalCount} units
            </span>
          ) : (
            <span>{totalCount} units</span>
          )}
        </div>

        {/* Export/Import */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors"
            title="Export data"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onImport}
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed opacity-50"
            title="Import data (coming soon)"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="px-6 pb-4 space-y-4 border-t border-gray-800 pt-4">
          {/* Quick Filters */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              {/* Met Status */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateFilter('metStatus', filters.metStatus === 'met' ? 'all' : 'met')}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      filters.metStatus === 'met'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  Met
                </button>
                <button
                  onClick={() => updateFilter('metStatus', filters.metStatus === 'not-met' ? 'all' : 'not-met')}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      filters.metStatus === 'not-met'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  Not Met
                </button>
              </div>

              {/* Has Pets */}
              <button
                onClick={() => updateFilter('hasPets', filters.hasPets === true ? null : true)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    filters.hasPets === true
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }
                `}
              >
                Has Pets
              </button>

              {/* Has Kids */}
              <button
                onClick={() => updateFilter('hasKids', filters.hasKids === true ? null : true)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    filters.hasKids === true
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }
                `}
              >
                Has Kids
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-2
                    ${
                      filters.status.includes(option.value)
                        ? 'border-white'
                        : 'border-gray-700 hover:border-gray-600'
                    }
                  `}
                  style={{
                    backgroundColor: filters.status.includes(option.value) ? option.color + '40' : '#1f2937',
                    color: filters.status.includes(option.value) ? option.color : '#9ca3af',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase">Badges</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map(badge => (
                <button
                  key={badge.type}
                  onClick={() => toggleBadge(badge.type)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      filters.badges.includes(badge.type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
