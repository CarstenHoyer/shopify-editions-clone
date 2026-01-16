'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Color, ShaderMaterial } from 'three';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';
import { lerp, easing } from '@/hooks/useScrollAnimation';
import { useHover, useCursorChange } from '@/hooks/useHover';
import '@/lib/shaderUtils'; // Ensure HoverGlowMaterial is registered

// Ref type for imperative handle
export interface HeroModelRef {
  clearHover: () => void;
}

// Receive scroll state from parent via props (set in HeroCanvas)
interface HeroModelProps {
  scrollProgress?: number;
  onHoverChange?: (isHovered: boolean) => void;
  modelRef?: React.RefObject<HeroModelRef | null>;
}

export function HeroModel({ scrollProgress = 0, onHoverChange, modelRef }: HeroModelProps) {
  const groupRef = useRef<Group>(null);
  const glowMaterialRef = useRef<ShaderMaterial>(null);
  const { scene } = useGLTF('/models/cube.glb');

  const { scale: entryScale, opacity } = useHeroAnimation();

  // Hover state management
  const { hoverState, handlers, setHovered } = useHover({ transitionDuration: 300 });
  useCursorChange(hoverState.isHovered);

  // Notify parent of hover changes for coordination with other scene elements
  useEffect(() => {
    onHoverChange?.(hoverState.isHovered);
  }, [hoverState.isHovered, onHoverChange]);

  // Expose clearHover method via ref for parent coordination
  useEffect(() => {
    if (modelRef) {
      (modelRef as React.MutableRefObject<HeroModelRef | null>).current = {
        clearHover: () => setHovered(false),
      };
    }
    return () => {
      if (modelRef) {
        (modelRef as React.MutableRefObject<HeroModelRef | null>).current = null;
      }
    };
  }, [modelRef, setHovered]);

  // Memoize glow color
  const glowColor = useMemo(() => new Color('#95bf47'), []);
  const baseColor = useMemo(() => new Color('#ffffff'), []);

  // Track base rotation separately from scroll-influenced rotation
  const baseRotationY = useRef(0);
  const baseRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const targetScale = useRef(1);
  const targetPositionY = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Base ambient rotation (speed up slightly on hover)
    const hoverRotationBoost = 1 + hoverState.hoverProgress * 0.5;
    baseRotationY.current += delta * 0.2 * hoverRotationBoost;
    baseRotationX.current += delta * 0.1 * hoverRotationBoost;

    // Scroll-influenced rotation: as user scrolls, model spins faster
    const scrollInfluence = easing.easeOutCubic(scrollProgress);
    targetRotationY.current = baseRotationY.current + scrollInfluence * Math.PI * 2;
    targetRotationX.current = baseRotationX.current + scrollInfluence * Math.PI * 0.5;

    // Scale: combine entry animation with scroll-based shrinking on exit
    // Add subtle scale bump on hover
    const hoverScaleBump = 1 + hoverState.hoverProgress * 0.05;
    const exitScale = 1 - scrollInfluence * 0.6; // Shrink to 40% as user scrolls away
    targetScale.current = entryScale * Math.max(0.4, exitScale) * hoverScaleBump;

    // Position: move up slightly as user scrolls
    targetPositionY.current = scrollInfluence * 2;

    // Apply smooth interpolation for 60fps
    const lerpFactor = 1 - Math.pow(0.001, delta);

    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetRotationY.current, lerpFactor);
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetRotationX.current, lerpFactor);
    groupRef.current.position.y = lerp(groupRef.current.position.y, targetPositionY.current, lerpFactor);

    const currentScale = groupRef.current.scale.x;
    const newScale = lerp(currentScale, targetScale.current, lerpFactor);
    groupRef.current.scale.setScalar(newScale);

    // Update hover glow shader uniforms
    if (glowMaterialRef.current) {
      glowMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      glowMaterialRef.current.uniforms.uHoverProgress.value = hoverState.hoverProgress;
    }
  });

  return (
    <>
      {/* Invisible hit-test mesh for reliable hover detection
          OUTSIDE the animated group so it doesn't get scaled down during entry animation
          Using colorWrite=false so the mesh is invisible but still intercepts raycasts
          Positioned at z=0 with a large enough area to reliably intercept mouse at canvas center */}
      <mesh
        renderOrder={-1}
        onPointerOver={(e) => {
          e.stopPropagation(); // Prevent event from reaching background plane
          console.log('[HitTestMesh] onPointerOver');
          handlers.onPointerOver();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          console.log('[HitTestMesh] onPointerOut');
          handlers.onPointerOut();
        }}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
      <group
        ref={groupRef}
        scale={entryScale}
        data-testid="hero-model"
      >
        <primitive object={scene} />
        {/* Add a subtle glow effect with a larger, semi-transparent sphere */}
        <mesh scale={1.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#95bf47"
            transparent
            opacity={opacity * 0.1 * (1 - scrollProgress * 0.5)}
          />
        </mesh>
        {/* Hover glow effect using custom shader */}
        <mesh scale={1.6} data-testid="hover-glow-mesh">
          <sphereGeometry args={[1, 32, 32]} />
          <hoverGlowMaterial
            ref={glowMaterialRef}
            transparent
            depthWrite={false}
            uHoverProgress={hoverState.hoverProgress}
            uTime={0}
            uGlowColor={glowColor}
            uBaseColor={baseColor}
            uGlowIntensity={1.5}
          />
        </mesh>
      </group>
    </>
  );
}

// Preload the model
useGLTF.preload('/models/cube.glb');
