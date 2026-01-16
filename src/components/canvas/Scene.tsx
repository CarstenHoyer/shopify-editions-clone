'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { LoadingSpinner } from './ModelLoader';
import { ModelErrorBoundary, ErrorFallbackMesh } from './ModelErrorBoundary';
import ShaderPlane from './ShaderPlane';

function PlaceholderCube() {
  const { scene } = useGLTF('/models/cube.glb');
  return <primitive object={scene} />;
}

// Preload the model for better performance
useGLTF.preload('/models/cube.glb');

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.domElement.classList.add('webgl');
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={<LoadingSpinner />}>
        <ModelErrorBoundary fallback={<ErrorFallbackMesh />}>
          <PlaceholderCube />
        </ModelErrorBoundary>
        {/* Shader plane for demonstrating custom shaders */}
        <ShaderPlane
          position={[0, 0, -2]}
          width={6}
          height={4}
          colorA="#95bf47"
          colorB="#5c3d8c"
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
