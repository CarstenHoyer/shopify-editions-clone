'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Debug mode - can be toggled via environment variable or localStorage
const getDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check localStorage first for runtime toggle
  const localStorageDebug = localStorage.getItem('gsap-debug');
  if (localStorageDebug !== null) {
    return localStorageDebug === 'true';
  }

  // Fall back to environment variable
  return process.env.NEXT_PUBLIC_GSAP_DEBUG === 'true';
};

export interface UseGSAPOptions {
  scope?: React.RefObject<HTMLElement | null>;
  dependencies?: unknown[];
}

export interface ScrollTriggerConfig {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  toggleActions?: string;
  anticipatePin?: number;
}

/**
 * useGSAP hook for React integration with GSAP and ScrollTrigger
 *
 * @param callback - Function containing GSAP animations
 * @param options - Configuration options including scope and dependencies
 * @returns Object with contextSafe function and ScrollTrigger utilities
 */
export function useGSAP(
  callback?: (context: gsap.Context) => void,
  options: UseGSAPOptions = {}
) {
  const { scope, dependencies = [] } = options;
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Create GSAP context with optional scope
    const ctx = gsap.context((self) => {
      if (callback) {
        callback(self);
      }
    }, scope?.current || undefined);

    contextRef.current = ctx;

    // Cleanup on unmount
    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // contextSafe wraps functions to ensure they run within the GSAP context
  const contextSafe = useCallback(
    <T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T): T => {
      return ((...args: Parameters<T>) => {
        if (contextRef.current) {
          return contextRef.current.add(() => fn(...args));
        }
        return fn(...args);
      }) as T;
    },
    []
  );

  return { contextSafe, context: contextRef };
}

/**
 * Create a ScrollTrigger animation with sensible defaults
 */
export function createScrollTrigger(config: ScrollTriggerConfig): ScrollTrigger {
  const debugMode = getDebugMode();

  return ScrollTrigger.create({
    ...config,
    markers: config.markers ?? debugMode,
  });
}

/**
 * Utility to toggle debug markers at runtime
 * Call from browser console: window.toggleGSAPDebug()
 */
export function toggleGSAPDebug(): void {
  if (typeof window === 'undefined') return;

  const current = localStorage.getItem('gsap-debug') === 'true';
  localStorage.setItem('gsap-debug', (!current).toString());

  console.log(`GSAP debug markers: ${!current ? 'enabled' : 'disabled'}`);
  console.log('Refresh the page to see changes.');
}

// Expose toggle function globally for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { toggleGSAPDebug: typeof toggleGSAPDebug }).toggleGSAPDebug = toggleGSAPDebug;
}

/**
 * Get ScrollTrigger instance for advanced usage
 */
export { ScrollTrigger };

/**
 * Export gsap for direct usage when needed
 */
export { gsap };
