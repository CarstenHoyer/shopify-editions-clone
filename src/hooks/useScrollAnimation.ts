'use client';

import { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from '@/hooks/useGSAP';

export interface ScrollAnimationState {
  progress: number; // 0 to 1, overall scroll progress through element
  velocity: number; // Scroll velocity for momentum effects
  isInView: boolean;
  direction: 'up' | 'down' | null;
}

export interface UseScrollAnimationOptions {
  start?: string; // ScrollTrigger start position
  end?: string; // ScrollTrigger end position
  scrub?: boolean | number;
}

/**
 * Hook that provides scroll progress for a given trigger element.
 * Useful for syncing 3D animations with scroll position.
 */
export function useScrollAnimation(
  triggerRef: React.RefObject<HTMLElement | null>,
  options: UseScrollAnimationOptions = {}
) {
  const { start = 'top bottom', end = 'bottom top', scrub = true } = options;

  const [state, setState] = useState<ScrollAnimationState>({
    progress: 0,
    velocity: 0,
    isInView: false,
    direction: null,
  });

  const progressRef = useRef(0);
  const lastProgressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      scrub: typeof scrub === 'number' ? scrub : scrub ? 0.5 : false,
      onUpdate: (self) => {
        const newProgress = self.progress;
        const velocity = newProgress - lastProgressRef.current;
        lastProgressRef.current = newProgress;
        progressRef.current = newProgress;

        // Batch state updates with requestAnimationFrame for performance
        if (animationFrameRef.current === null) {
          animationFrameRef.current = requestAnimationFrame(() => {
            setState({
              progress: progressRef.current,
              velocity,
              isInView: self.isActive,
              direction: self.direction === 1 ? 'down' : 'up',
            });
            animationFrameRef.current = null;
          });
        }
      },
      onEnter: () => {
        setState((prev) => ({ ...prev, isInView: true }));
      },
      onLeave: () => {
        setState((prev) => ({ ...prev, isInView: false }));
      },
      onEnterBack: () => {
        setState((prev) => ({ ...prev, isInView: true }));
      },
      onLeaveBack: () => {
        setState((prev) => ({ ...prev, isInView: false }));
      },
    });

    return () => {
      trigger.kill();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [triggerRef, start, end, scrub]);

  return state;
}

/**
 * Interpolation helpers for smooth scroll-based animations
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map progress from one range to another with optional easing
 */
export function mapRange(
  progress: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clampOutput = true
): number {
  const mapped = ((progress - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  return clampOutput ? clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax)) : mapped;
}

/**
 * Easing functions for scroll animations
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * Hook for getting global scroll progress (entire page)
 */
export function useGlobalScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setProgress(scrollProgress);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial value

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
}
