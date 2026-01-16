'use client';

import { useState, useEffect } from 'react';

interface HeroAnimationState {
  scale: number;
  opacity: number;
}

export function useHeroAnimation(): HeroAnimationState {
  const [animationState, setAnimationState] = useState<HeroAnimationState>({
    scale: 0,
    opacity: 0,
  });

  useEffect(() => {
    // Entry animation: fade in and scale up
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimationState({
        scale: eased * 1.5, // Scale from 0 to 1.5
        opacity: eased,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return animationState;
}
