'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, ShaderMaterial, Color } from 'three';
import { useHover, useCursorChange } from '@/hooks/useHover';
import '@/lib/shaderUtils'; // Ensure HoverGlowMaterial is registered

export interface HoverableModelProps {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  autoRotate?: boolean;
  rotationSpeed?: number;
  glowColor?: string;
  baseColor?: string;
  glowIntensity?: number;
  transitionDuration?: number;
  onHover?: (isHovered: boolean) => void;
}

export function HoverableModel({
  url,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  autoRotate = true,
  rotationSpeed = 0.3,
  glowColor = '#95bf47',
  baseColor = '#ffffff',
  glowIntensity = 1.5,
  transitionDuration = 300,
  onHover,
}: HoverableModelProps) {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { scene } = useGLTF(url);

  const { hoverState, handlers } = useHover({ transitionDuration });

  // Change cursor when hovering
  useCursorChange(hoverState.isHovered);

  // Notify parent of hover state changes
  useEffect(() => {
    onHover?.(hoverState.isHovered);
  }, [hoverState.isHovered, onHover]);

  // Clone the scene and prepare materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  // Memoize colors
  const colors = useMemo(
    () => ({
      glow: new Color(glowColor),
      base: new Color(baseColor),
    }),
    [glowColor, baseColor]
  );

  // Update shader uniforms each frame
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
      groupRef.current.rotation.x += delta * rotationSpeed * 0.5;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHoverProgress.value = hoverState.hoverProgress;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      rotation={rotation}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        handlers.onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        handlers.onPointerOut();
      }}
      data-testid="hoverable-model"
    >
      <primitive object={clonedScene} />
      {/* Glow overlay mesh that follows the model */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <hoverGlowMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uHoverProgress={hoverState.hoverProgress}
          uTime={0}
          uGlowColor={colors.glow}
          uBaseColor={colors.base}
          uGlowIntensity={glowIntensity}
        />
      </mesh>
    </group>
  );
}

// Interactive hover mesh that can be used standalone
export interface HoverMeshProps {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  transitionDuration?: number;
  onHover?: (isHovered: boolean) => void;
}

export function HoverMesh({
  children,
  glowColor = '#95bf47',
  glowIntensity = 1.5,
  transitionDuration = 300,
  onHover,
}: HoverMeshProps) {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const { hoverState, handlers } = useHover({ transitionDuration });

  // Change cursor when hovering
  useCursorChange(hoverState.isHovered);

  // Notify parent of hover state changes
  useEffect(() => {
    onHover?.(hoverState.isHovered);
  }, [hoverState.isHovered, onHover]);

  // Memoize colors
  const colors = useMemo(
    () => ({
      glow: new Color(glowColor),
      base: new Color('#ffffff'),
    }),
    [glowColor]
  );

  // Update shader uniforms each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHoverProgress.value = hoverState.hoverProgress;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        handlers.onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        handlers.onPointerOut();
      }}
      data-testid="hover-mesh"
    >
      {children}
      {/* Hover glow overlay */}
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <hoverGlowMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uHoverProgress={hoverState.hoverProgress}
          uTime={0}
          uGlowColor={colors.glow}
          uBaseColor={colors.base}
          uGlowIntensity={glowIntensity}
        />
      </mesh>
    </group>
  );
}
