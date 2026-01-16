'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh } from 'three';

export interface ModelLoaderProps {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function ModelLoader({
  url,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  autoRotate = true,
  rotationSpeed = 0.3,
}: ModelLoaderProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(url);

  // Clone the scene to avoid issues with reusing the same model
  const clonedScene = scene.clone();

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
      groupRef.current.rotation.x += delta * rotationSpeed * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      rotation={rotation}
      position={position}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Loading fallback component for 3D scenes
export function LoadingSpinner() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.5, 0.1, 16, 32]} />
      <meshBasicMaterial color="#95bf47" wireframe />
    </mesh>
  );
}

// HTML loading spinner for use outside Canvas
export function HtmlLoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      data-testid="model-loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-shopify-green border-t-transparent" />
    </div>
  );
}
