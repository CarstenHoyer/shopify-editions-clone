'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface HoverState {
  isHovered: boolean;
  hoverProgress: number; // 0-1 for smooth transitions
}

export interface UseHoverOptions {
  transitionDuration?: number; // ms
}

/**
 * Hook for managing hover state with smooth transitions
 * Uses requestAnimationFrame for smooth animation
 */
export function useHover(options: UseHoverOptions = {}): {
  hoverState: HoverState;
  handlers: {
    onPointerOver: () => void;
    onPointerOut: () => void;
  };
  setHovered: (hovered: boolean) => void;
} {
  const { transitionDuration = 300 } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(0);

  // Log state changes
  useEffect(() => {
    console.log('[useHover] isHovered state changed to:', isHovered);
  }, [isHovered]);

  const animationRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  // Animate hover progress smoothly
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      if (Math.abs(target - current) > 0.001) {
        // Smooth interpolation based on transition duration
        const speed = deltaTime / transitionDuration;
        const direction = target > current ? 1 : -1;
        const step = Math.min(Math.abs(target - current), speed) * direction;

        currentProgressRef.current = Math.max(0, Math.min(1, current + step));
        setHoverProgress(currentProgressRef.current);

        animationRef.current = requestAnimationFrame(animate);
      } else {
        currentProgressRef.current = target;
        setHoverProgress(target);
        animationRef.current = null;
        lastTimeRef.current = null;
      }
    };

    if (animationRef.current === null &&
        Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.001) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, transitionDuration]);

  const setHovered = useCallback((hovered: boolean) => {
    console.log('[useHover.setHovered] called with:', hovered, '- calling setIsHovered');
    setIsHovered(hovered);
    targetProgressRef.current = hovered ? 1 : 0;

    // Start animation if not already running
    if (animationRef.current === null) {
      lastTimeRef.current = null;
      animationRef.current = requestAnimationFrame((time) => {
        lastTimeRef.current = time;
        const animate = (t: number) => {
          const deltaTime = t - (lastTimeRef.current || t);
          lastTimeRef.current = t;

          const target = targetProgressRef.current;
          const current = currentProgressRef.current;

          if (Math.abs(target - current) > 0.001) {
            const speed = deltaTime / transitionDuration;
            const direction = target > current ? 1 : -1;
            const step = Math.min(Math.abs(target - current), speed) * direction;

            currentProgressRef.current = Math.max(0, Math.min(1, current + step));
            setHoverProgress(currentProgressRef.current);

            animationRef.current = requestAnimationFrame(animate);
          } else {
            currentProgressRef.current = target;
            setHoverProgress(target);
            animationRef.current = null;
            lastTimeRef.current = null;
          }
        };
        animate(time);
      });
    }
  }, [transitionDuration]);

  const onPointerOver = useCallback(() => {
    console.log('[useHover] onPointerOver called, setting hover to true');
    setHovered(true);
  }, [setHovered]);
  const onPointerOut = useCallback(() => {
    console.log('[useHover] onPointerOut called, setting hover to false');
    setHovered(false);
  }, [setHovered]);

  return {
    hoverState: { isHovered, hoverProgress },
    handlers: { onPointerOver, onPointerOut },
    setHovered,
  };
}

/**
 * Hook to change cursor when hovering over 3D elements
 */
export function useCursorChange(isHovered: boolean, cursor: string = 'pointer') {
  useEffect(() => {
    console.log('[useCursorChange] isHovered:', isHovered, '-> setting cursor to', isHovered ? cursor : 'default');
    if (isHovered) {
      document.body.style.cursor = cursor;
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isHovered, cursor]);
}
