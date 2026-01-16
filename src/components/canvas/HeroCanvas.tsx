'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { HeroModel, HeroModelRef } from './HeroModel';
import { LoadingSpinner } from './ModelLoader';
import { ModelErrorBoundary, ErrorFallbackMesh } from './ModelErrorBoundary';

// Component for the background pointer catch plane
function BackgroundPointerPlane({ onPointerOver }: { onPointerOver: () => void }) {
  return (
    <mesh
      position={[0, 0, -5]}
      onPointerOver={() => {
        console.log('[BackgroundPlane] onPointerOver');
        onPointerOver();
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial colorWrite={false} depthWrite={false} />
    </mesh>
  );
}

interface HeroCanvasProps {
  scrollProgress?: number;
}

export default function HeroCanvas({ scrollProgress: externalScrollProgress }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroModelRef = useRef<HeroModelRef | null>(null);

  // Track if model is hovered to manage cursor
  const [isModelHovered, setIsModelHovered] = useState(false);

  // Reset cursor when pointer misses all objects in the scene
  const handlePointerMissed = useCallback(() => {
    // Tell the model to clear its hover state
    heroModelRef.current?.clearHover();
  }, []);

  // Callback when model hover state changes
  const handleModelHoverChange = useCallback((isHovered: boolean) => {
    setIsModelHovered(isHovered);
  }, []);

  // Sync external scroll progress if provided
  const effectiveScrollProgress = externalScrollProgress ?? scrollProgress;

  // Track scroll progress for the hero section
  useEffect(() => {
    // If external scroll progress is provided, don't set up our own listener
    if (externalScrollProgress !== undefined) {
      return;
    }

    // Otherwise, calculate based on scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Hero section scroll progress: 0 at top, 1 when scrolled past viewport
      let progress = Math.min(1, Math.max(0, scrollY / windowHeight));

      // Clamp to boundary values when very close (within 5%)
      // This handles snap settling jitter from scroll snapping
      if (progress > 0.95) progress = 1;
      if (progress < 0.05) progress = 0;

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [externalScrollProgress]);

  // Also reset cursor when pointer leaves the canvas container
  const handlePointerLeave = useCallback(() => {
    document.body.style.cursor = 'default';
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      data-scroll-progress={effectiveScrollProgress.toFixed(2)}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.domElement.classList.add('webgl');
        }}
        onPointerMissed={handlePointerMissed}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        {/* Background plane to catch pointer events when not over the model */}
        <BackgroundPointerPlane onPointerOver={handlePointerMissed} />
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary fallback={<ErrorFallbackMesh />}>
            <HeroModel
              scrollProgress={effectiveScrollProgress}
              onHoverChange={handleModelHoverChange}
              modelRef={heroModelRef}
            />
          </ModelErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}
