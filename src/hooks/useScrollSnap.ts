'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Section IDs for navigation
export const SECTION_IDS = [
  'hero',
  'sidekick',
  'agentic',
  'online',
  'retail',
  'marketing',
  'checkout',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

interface UseScrollSnapOptions {
  enabled?: boolean;
  snapDuration?: number;
  snapDelay?: number;
}

interface UseScrollSnapReturn {
  currentSection: number;
  goToSection: (index: number) => void;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
}

/**
 * Check if snapping should be disabled via query parameter
 * Used primarily for E2E testing
 */
function isSnapDisabledByQueryParam(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('nosnap') === 'true';
}

/**
 * useScrollSnap hook provides section-based scroll snapping
 * using GSAP ScrollTrigger and keyboard navigation support.
 */
export function useScrollSnap(
  options: UseScrollSnapOptions = {}
): UseScrollSnapReturn {
  const { enabled = true, snapDuration = 0.8, snapDelay = 0.1 } = options;

  // Check for nosnap query parameter (for E2E testing)
  const isDisabledByParam = typeof window !== 'undefined' && isSnapDisabledByQueryParam();
  const effectiveEnabled = enabled && !isDisabledByParam;
  const currentSectionRef = useRef(0);
  const isSnappingRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Go to a specific section by index
  const goToSection = useCallback(
    (index: number) => {
      if (!effectiveEnabled) return;
      if (index < 0 || index >= SECTION_IDS.length) return;
      if (isSnappingRef.current) return;

      const sectionId = SECTION_IDS[index];
      const element = document.getElementById(sectionId);

      if (!element) return;

      isSnappingRef.current = true;
      currentSectionRef.current = index;

      gsap.to(window, {
        scrollTo: {
          y: element,
          autoKill: false,
        },
        duration: snapDuration,
        ease: 'power3.inOut',
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    },
    [effectiveEnabled, snapDuration]
  );

  // Navigate to next section
  const goToNextSection = useCallback(() => {
    const nextIndex = Math.min(
      currentSectionRef.current + 1,
      SECTION_IDS.length - 1
    );
    goToSection(nextIndex);
  }, [goToSection]);

  // Navigate to previous section
  const goToPreviousSection = useCallback(() => {
    const prevIndex = Math.max(currentSectionRef.current - 1, 0);
    goToSection(prevIndex);
  }, [goToSection]);

  // Setup scroll snapping and keyboard navigation
  useEffect(() => {
    if (!effectiveEnabled) return;

    // Create ScrollTrigger for each section to track current section
    const triggers = SECTION_IDS.map((id, index) => {
      const element = document.getElementById(id);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          currentSectionRef.current = index;
        },
        onEnterBack: () => {
          currentSectionRef.current = index;
        },
      });
    }).filter(Boolean);

    // Snap to section when scroll stops
    const handleScrollEnd = () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      snapTimeoutRef.current = setTimeout(() => {
        if (isSnappingRef.current) return;

        // Find the section that is most visible in viewport
        const viewportHeight = window.innerHeight;
        const viewportCenter = window.scrollY + viewportHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        SECTION_IDS.forEach((id, index) => {
          const element = document.getElementById(id);
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const elementCenter = window.scrollY + rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        // Only snap if we're not already at the closest section
        if (closestIndex !== currentSectionRef.current) {
          goToSection(closestIndex);
        } else {
          // Snap to current section if not aligned
          const element = document.getElementById(SECTION_IDS[closestIndex]);
          if (element) {
            const rect = element.getBoundingClientRect();
            const threshold = viewportHeight * 0.1;

            if (Math.abs(rect.top) > threshold) {
              goToSection(closestIndex);
            }
          }
        }
      }, snapDelay * 1000);
    };

    // Keyboard navigation handler
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'PageDown':
        case 'ArrowDown':
          if (event.key === 'PageDown' || event.ctrlKey) {
            event.preventDefault();
            goToNextSection();
          }
          break;
        case 'PageUp':
        case 'ArrowUp':
          if (event.key === 'PageUp' || event.ctrlKey) {
            event.preventDefault();
            goToPreviousSection();
          }
          break;
        case 'Home':
          event.preventDefault();
          goToSection(0);
          break;
        case 'End':
          event.preventDefault();
          goToSection(SECTION_IDS.length - 1);
          break;
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
      window.removeEventListener('keydown', handleKeyDown);

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      triggers.forEach((trigger) => trigger?.kill());
    };
  }, [effectiveEnabled, snapDelay, goToSection, goToNextSection, goToPreviousSection]);

  return {
    currentSection: currentSectionRef.current,
    goToSection,
    goToNextSection,
    goToPreviousSection,
  };
}

export default useScrollSnap;
