'use client';

/**
 * MapViewer - Main component for displaying the interactive floor plan
 * Handles SVG rendering, pan/zoom, and unit selection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePanZoom } from '@/lib/usePanZoom';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { BuildingId, FloorNumber, Unit } from '@/types';
import { getStatusColor } from '@/lib/utils';

interface MapViewerProps {
  building: BuildingId;
  floor: FloorNumber;
  units: Unit[];
  selectedUnit: Unit | null;
  highlightedUnits: string[]; // Unit IDs to highlight (from filters)
  onUnitClick: (unit: Unit | null) => void;
}

export default function MapViewer({
  building,
  floor,
  units,
  selectedUnit,
  highlightedUnits,
  onUnitClick,
}: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const { transform, handlers, reset, zoomIn, zoomOut } = usePanZoom({
    minScale: 0.5,
    maxScale: 3,
    initialScale: 1,
  });

  // Load SVG file for current building/floor
  useEffect(() => {
    const fileName = `building-${building.toLowerCase()}-floor-${floor}.svg`;
    const svgPath = `/buildings/${fileName}`;

    fetch(svgPath)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${fileName}`);
        return res.text();
      })
      .then(setSvgContent)
      .catch(error => {
        console.error('Error loading SVG:', error);
        setSvgContent(`<svg viewBox="0 0 800 600"><text x="400" y="300" text-anchor="middle" fill="#ef4444">Error loading floor plan</text></svg>`);
      });
  }, [building, floor]);

  // Attach event listeners for pan/zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handlers.onWheel, { passive: false });
    container.addEventListener('mousedown', handlers.onMouseDown);
    container.addEventListener('mousemove', handlers.onMouseMove);
    container.addEventListener('mouseup', handlers.onMouseUp);
    container.addEventListener('mouseleave', handlers.onMouseUp);
    container.addEventListener('touchstart', handlers.onTouchStart, { passive: false });
    container.addEventListener('touchmove', handlers.onTouchMove, { passive: false });
    container.addEventListener('touchend', handlers.onTouchEnd);

    return () => {
      container.removeEventListener('wheel', handlers.onWheel);
      container.removeEventListener('mousedown', handlers.onMouseDown);
      container.removeEventListener('mousemove', handlers.onMouseMove);
      container.removeEventListener('mouseup', handlers.onMouseUp);
      container.removeEventListener('mouseleave', handlers.onMouseUp);
      container.removeEventListener('touchstart', handlers.onTouchStart);
      container.removeEventListener('touchmove', handlers.onTouchMove);
      container.removeEventListener('touchend', handlers.onTouchEnd);
    };
  }, [handlers]);

  // Store latest units and callback in refs so click handler always has fresh data
  const unitsRef = useRef(units);
  const onUnitClickRef = useRef(onUnitClick);

  useEffect(() => {
    unitsRef.current = units;
    onUnitClickRef.current = onUnitClick;
  }, [units, onUnitClick]);

  // Handle unit clicks - attach once when SVG loads
  useEffect(() => {
    if (!svgRef.current) return;

    const container = svgRef.current;
    const svgElement = container.querySelector('svg');
    if (!svgElement) return;

    const handleUnitClick = (e: Event) => {
      e.stopPropagation();
      const element = e.target as SVGElement;
      const svgId = element.id;

      console.log('Unit clicked:', svgId);

      // Use ref to get fresh units data
      const unit = unitsRef.current.find(u => u.svgId === svgId || u.id === svgId);
      if (unit) {
        console.log('Found unit:', unit.unitNumber);
        onUnitClickRef.current(unit);
      } else {
        console.log('No unit found for ID:', svgId);
      }
    };

    // Attach to SVG element directly so it persists through transforms
    svgElement.addEventListener('click', handleUnitClick);

    return () => {
      svgElement.removeEventListener('click', handleUnitClick);
    };
  }, [svgContent]); // Only re-attach when SVG content changes

  // Apply styling separately (doesn't affect click handlers)
  useEffect(() => {
    if (!svgRef.current) return;

    const container = svgRef.current;
    const svgElement = container.querySelector('svg');
    if (!svgElement) return;

    const unitElements = svgElement.querySelectorAll('.unit');

    unitElements.forEach(el => {
      const svgId = el.id;
      const unit = units.find(u => u.svgId === svgId || u.id === svgId);

      if (!unit) return;

      // Remove previous classes
      el.classList.remove('selected', 'highlighted', 'dimmed');

      // Apply selected state
      if (selectedUnit && selectedUnit.id === unit.id) {
        el.classList.add('selected');
      }

      // Apply filter highlighting
      if (highlightedUnits.length > 0) {
        if (highlightedUnits.includes(unit.id)) {
          el.classList.add('highlighted');
          // Color by status
          (el as SVGElement).style.fill = getStatusColor(unit.status);
        } else {
          el.classList.add('dimmed');
        }
      } else {
        // Default subtle status coloring
        const color = getStatusColor(unit.status);
        (el as SVGElement).style.fill = color;
        (el as SVGElement).style.opacity = '0.6';
      }
    });
  }, [units, selectedUnit, highlightedUnits]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950">
      {/* Pan/Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={zoomOut}
          className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* SVG Container */}
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <div
          ref={svgRef}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            transition: 'none',
          }}
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
        {Math.round(transform.scale * 100)}%
      </div>

      {/* Additional CSS for unit states */}
      <style jsx global>{`
        .unit.highlighted {
          stroke: #60a5fa;
          stroke-width: 3;
          opacity: 1 !important;
        }
        .unit.dimmed {
          opacity: 0.3 !important;
        }
        .unit.selected {
          stroke: #fbbf24;
          stroke-width: 4;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
