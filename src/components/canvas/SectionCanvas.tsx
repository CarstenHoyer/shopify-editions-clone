'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { LoadingSpinner } from './ModelLoader';
import { ModelErrorBoundary, ErrorFallbackMesh } from './ModelErrorBoundary';
import { lerp, mapRange, easing } from '@/hooks/useScrollAnimation';

// Scroll progress context to pass scroll values into the Canvas
interface ScrollState {
  progress: number;
  isInView: boolean;
}

interface PlaceholderGeometryProps {
  type: 'torus' | 'sphere' | 'cone' | 'cylinder' | 'octahedron' | 'dodecahedron';
  color: string;
  rotationSpeed?: number;
  scrollState: ScrollState;
  animationConfig?: ScrollAnimationConfig;
}

interface ScrollAnimationConfig {
  rotationMultiplier?: number;
  positionY?: { start: number; end: number };
  positionX?: { start: number; end: number };
  scale?: { start: number; end: number };
}

function PlaceholderGeometry({
  type,
  color,
  rotationSpeed = 0.3,
  scrollState,
  animationConfig,
}: PlaceholderGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  const targetRotationY = useRef(0);
  const targetPositionY = useRef(0);
  const targetPositionX = useRef(0);
  const targetScale = useRef(1);
  const baseRotationY = useRef(0);

  const config = {
    rotationMultiplier: animationConfig?.rotationMultiplier ?? 2,
    positionY: animationConfig?.positionY ?? { start: 1, end: -1 },
    positionX: animationConfig?.positionX ?? { start: 0, end: 0 },
    scale: animationConfig?.scale ?? { start: 0.5, end: 1.2 },
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Update base rotation continuously for ambient motion
    baseRotationY.current += delta * rotationSpeed;

    // Calculate scroll-based targets
    const easedProgress = easing.easeInOutCubic(scrollState.progress);

    // Scroll-synced rotation: add to base rotation based on scroll
    targetRotationY.current = baseRotationY.current + easedProgress * Math.PI * config.rotationMultiplier;

    // Scroll-based position changes
    targetPositionY.current = mapRange(
      scrollState.progress,
      0, 1,
      config.positionY.start,
      config.positionY.end
    );

    targetPositionX.current = mapRange(
      scrollState.progress,
      0, 1,
      config.positionX.start,
      config.positionX.end
    );

    // Scale animation with entry/exit effect
    // Scale up when entering (0-0.5), stay full, scale down when leaving (0.8-1)
    let scaleProgress: number;
    if (scrollState.progress < 0.3) {
      scaleProgress = mapRange(scrollState.progress, 0, 0.3, 0, 1);
    } else if (scrollState.progress > 0.7) {
      scaleProgress = mapRange(scrollState.progress, 0.7, 1, 1, 0);
    } else {
      scaleProgress = 1;
    }
    targetScale.current = lerp(config.scale.start, config.scale.end, easing.easeOutCubic(scaleProgress));

    // Apply smooth interpolation for buttery 60fps animation
    const lerpFactor = 1 - Math.pow(0.001, delta);

    meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, targetRotationY.current, lerpFactor);
    meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, easedProgress * 0.5, lerpFactor);
    meshRef.current.position.y = lerp(meshRef.current.position.y, targetPositionY.current, lerpFactor);
    meshRef.current.position.x = lerp(meshRef.current.position.x, targetPositionX.current, lerpFactor);

    const currentScale = meshRef.current.scale.x;
    const newScale = lerp(currentScale, targetScale.current, lerpFactor);
    meshRef.current.scale.setScalar(newScale);
  });

  const renderGeometry = () => {
    switch (type) {
      case 'torus':
        return <torusGeometry args={[1, 0.4, 32, 64]} />;
      case 'sphere':
        return <sphereGeometry args={[1.2, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.8, 0.8, 2, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1.3]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1.2]} />;
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh ref={meshRef} data-testid="animated-mesh">
      {renderGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

interface SectionModelProps {
  modelUrl: string;
  scale?: number;
  rotationSpeed?: number;
  scrollState: ScrollState;
  animationConfig?: ScrollAnimationConfig;
}

function SectionModel({
  modelUrl,
  scale = 1,
  rotationSpeed = 0.3,
  scrollState,
  animationConfig,
}: SectionModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  const baseRotationY = useRef(0);
  const targetRotationY = useRef(0);
  const targetPositionY = useRef(0);
  const targetScale = useRef(scale);

  const config = {
    rotationMultiplier: animationConfig?.rotationMultiplier ?? 2,
    positionY: animationConfig?.positionY ?? { start: 1, end: -1 },
    scale: animationConfig?.scale ?? { start: scale * 0.5, end: scale * 1.2 },
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Update base rotation continuously
    baseRotationY.current += delta * rotationSpeed;

    // Calculate scroll-based targets
    const easedProgress = easing.easeInOutCubic(scrollState.progress);

    targetRotationY.current = baseRotationY.current + easedProgress * Math.PI * config.rotationMultiplier;

    targetPositionY.current = mapRange(
      scrollState.progress,
      0, 1,
      config.positionY.start,
      config.positionY.end
    );

    // Scale animation
    let scaleProgress: number;
    if (scrollState.progress < 0.3) {
      scaleProgress = mapRange(scrollState.progress, 0, 0.3, 0, 1);
    } else if (scrollState.progress > 0.7) {
      scaleProgress = mapRange(scrollState.progress, 0.7, 1, 1, 0);
    } else {
      scaleProgress = 1;
    }
    targetScale.current = lerp(config.scale.start, config.scale.end, easing.easeOutCubic(scaleProgress));

    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.001, delta);

    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetRotationY.current, lerpFactor);
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, easedProgress * 0.3, lerpFactor);
    groupRef.current.position.y = lerp(groupRef.current.position.y, targetPositionY.current, lerpFactor);

    const currentScale = groupRef.current.scale.x;
    const newScale = lerp(currentScale, targetScale.current, lerpFactor);
    groupRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

interface SectionCanvasProps {
  geometryType?: PlaceholderGeometryProps['type'];
  modelUrl?: string;
  modelScale?: number;
  color: string;
  className?: string;
  animationConfig?: ScrollAnimationConfig;
}

export default function SectionCanvas({
  geometryType,
  modelUrl,
  modelScale = 1,
  color,
  className = '',
  animationConfig,
}: SectionCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    isInView: false,
  });

  // Set up scroll-based animation using IntersectionObserver and scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isInView = false;

    // IntersectionObserver for view detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (!isInView) {
            setScrollState((prev) => ({ ...prev, isInView: false }));
          }
        });
      },
      { threshold: [0, 0.1, 0.5, 0.9, 1] }
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

      // Progress starts when top of element reaches bottom of viewport
      // Progress ends when bottom of element leaves top of viewport
      const totalTravel = windowHeight + elementHeight;
      const traveled = windowHeight - elementTop;
      const progress = Math.max(0, Math.min(1, traveled / totalTravel));

      setScrollState({
        progress,
        isInView: true,
      });
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
      className={`h-[400px] w-full ${className}`}
      data-testid="section-canvas"
      data-scroll-progress={scrollState.progress.toFixed(2)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color={color} />
        <Suspense fallback={<LoadingSpinner />}>
          <ModelErrorBoundary fallback={<ErrorFallbackMesh />}>
            {modelUrl ? (
              <SectionModel
                modelUrl={modelUrl}
                scale={modelScale}
                scrollState={scrollState}
                animationConfig={animationConfig}
              />
            ) : geometryType ? (
              <PlaceholderGeometry
                type={geometryType}
                color={color}
                scrollState={scrollState}
                animationConfig={animationConfig}
              />
            ) : null}
          </ModelErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}
