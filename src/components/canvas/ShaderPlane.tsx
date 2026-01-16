'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ColorShiftMaterial } from '@/lib/shaderUtils';

// Import and register the material
import '@/lib/shaderUtils';

interface ShaderPlaneProps {
  width?: number;
  height?: number;
  scrollProgress?: number;
  colorA?: string;
  colorB?: string;
  intensity?: number;
  position?: [number, number, number];
}

export default function ShaderPlane({
  width = 4,
  height = 3,
  scrollProgress = 0,
  colorA = '#95bf47',
  colorB = '#5c3d8c',
  intensity = 1.0,
  position = [0, 0, 0],
}: ShaderPlaneProps) {
  const materialRef = useRef<typeof ColorShiftMaterial & {
    uTime: number;
    uScrollProgress: number;
    uColorA: THREE.Color;
    uColorB: THREE.Color;
    uIntensity: number;
  }>(null);

  // Update uniforms every frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uScrollProgress = scrollProgress;
    }
  });

  return (
    <mesh position={position} data-testid="shader-plane">
      <planeGeometry args={[width, height, 32, 32]} />
      <colorShiftMaterial
        ref={materialRef}
        uTime={0}
        uScrollProgress={scrollProgress}
        uColorA={new THREE.Color(colorA)}
        uColorB={new THREE.Color(colorB)}
        uIntensity={intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
