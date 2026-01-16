'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import TransitionPlane from './TransitionPlane';

interface TransitionCanvasProps {
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export default function TransitionCanvas({
  colorFrom = '#1a1a1a',
  colorTo = '#95bf47',
  className = '',
}: TransitionCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Set up scroll-based transition progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isInView = false;

    // IntersectionObserver for view detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1] }
    );

    observer.observe(container);

    // Scroll handler for progress calculation
    const handleScroll = () => {
      if (!container || !isInView) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element enters bottom, 1 when it leaves top
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const totalTravel = windowHeight + elementHeight;
      const traveled = windowHeight - elementTop;
      const scrollProgress = Math.max(0, Math.min(1, traveled / totalTravel));

      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      data-testid="transition-canvas"
      data-transition-progress={progress.toFixed(2)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <TransitionPlane
            progress={progress}
            colorFrom={colorFrom}
            colorTo={colorTo}
            width={12}
            height={8}
            position={[0, 0, -2]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
