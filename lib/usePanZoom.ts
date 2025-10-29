/**
 * Custom hook for SVG pan and zoom functionality
 * Handles mouse/touch interactions for panning and zooming
 */

import { useRef, useState, useCallback, useEffect } from 'react';

interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

interface UsePanZoomOptions {
  minScale?: number;
  maxScale?: number;
  scaleSensitivity?: number;
  initialScale?: number;
}

export function usePanZoom(options: UsePanZoomOptions = {}) {
  const {
    minScale = 0.5,
    maxScale = 4,
    scaleSensitivity = 0.001,
    initialScale = 1,
  } = options;

  const [transform, setTransform] = useState<PanZoomState>({
    x: 0,
    y: 0,
    scale: initialScale,
  });

  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const startTransform = useRef({ x: 0, y: 0 });

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      setTransform(prev => {
        const delta = -e.deltaY * scaleSensitivity;
        let newScale = prev.scale * (1 + delta);

        // Clamp scale
        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        if (newScale === prev.scale) return prev;

        // Calculate mouse position relative to the SVG
        const rect = (e.target as Element).getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate new position to zoom towards mouse cursor
        const scaleDiff = newScale - prev.scale;
        const newX = prev.x - (mouseX - prev.x) * (scaleDiff / prev.scale);
        const newY = prev.y - (mouseY - prev.y) * (scaleDiff / prev.scale);

        return {
          x: newX,
          y: newY,
          scale: newScale,
        };
      });
    },
    [minScale, maxScale, scaleSensitivity]
  );

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only pan with left mouse button
    if (e.button !== 0) return;

    // Don't pan if clicking on a unit
    const target = e.target as HTMLElement;
    if (target.classList.contains('unit') || target.closest('.unit')) {
      return;
    }

    isPanning.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => {
      startTransform.current = { x: prev.x, y: prev.y };
      return prev;
    });

    e.preventDefault();
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning.current) return;

    const dx = e.clientX - startPoint.current.x;
    const dy = e.clientY - startPoint.current.y;

    setTransform(prev => ({
      ...prev,
      x: startTransform.current.x + dx,
      y: startTransform.current.y + dy,
    }));
  }, []);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;

    // Don't pan if touching a unit
    const target = e.target as HTMLElement;
    if (target.classList.contains('unit') || target.closest('.unit')) {
      return;
    }

    isPanning.current = true;
    const touch = e.touches[0];
    startPoint.current = { x: touch.clientX, y: touch.clientY };
    setTransform(prev => {
      startTransform.current = { x: prev.x, y: prev.y };
      return prev;
    });
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPanning.current || e.touches.length !== 1) return;

    e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - startPoint.current.x;
    const dy = touch.clientY - startPoint.current.y;

    setTransform(prev => ({
      ...prev,
      x: startTransform.current.x + dx,
      y: startTransform.current.y + dy,
    }));
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Reset transform
  const reset = useCallback(() => {
    setTransform({
      x: 0,
      y: 0,
      scale: initialScale,
    });
  }, [initialScale]);

  // Zoom in
  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(maxScale, prev.scale * 1.2),
    }));
  }, [maxScale]);

  // Zoom out
  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(minScale, prev.scale / 1.2),
    }));
  }, [minScale]);

  return {
    transform,
    handlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    reset,
    zoomIn,
    zoomOut,
  };
}
