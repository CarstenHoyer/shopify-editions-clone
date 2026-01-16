'use client';

import { useEffect, ReactNode, createContext, useContext } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import { useScrollSnap, SECTION_IDS, SectionId } from '@/hooks/useScrollSnap';

interface ScrollContextValue {
  currentSection: number;
  goToSection: (index: number) => void;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
  sectionIds: readonly SectionId[];
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollContext(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider');
  }
  return context;
}

interface ScrollProviderProps {
  children: ReactNode;
}

/**
 * ScrollProvider initializes GSAP ScrollTrigger and provides
 * smooth scrolling configuration for the entire application.
 */
export default function ScrollProvider({ children }: ScrollProviderProps) {
  // Initialize scroll snapping
  const { currentSection, goToSection, goToNextSection, goToPreviousSection } =
    useScrollSnap({
      enabled: true,
      snapDuration: 0.8,
      snapDelay: 0.15,
    });

  useEffect(() => {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Refresh ScrollTrigger when images and content load
    ScrollTrigger.refresh();

    // Log that ScrollTrigger is initialized (for verification)
    console.log('[ScrollProvider] GSAP ScrollTrigger initialized with scroll snapping');

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = gsap.delayedCall(0.2, () => {
      ScrollTrigger.refresh();
    });

    window.addEventListener('resize', () => {
      handleResize.restart(true);
    });

    return () => {
      handleResize.kill();
    };
  }, []);

  const contextValue: ScrollContextValue = {
    currentSection,
    goToSection,
    goToNextSection,
    goToPreviousSection,
    sectionIds: SECTION_IDS,
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}
