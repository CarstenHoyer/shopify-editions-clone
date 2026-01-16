'use client';

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Transition shader material uniforms interface
export interface TransitionUniforms {
  uProgress: number;
  uTime: number;
  uColorFrom: THREE.Color;
  uColorTo: THREE.Color;
  uNoiseScale: number;
  uEdgeSoftness: number;
}

// Vertex shader (inline for reliability)
const transitionVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader (inline for reliability)
const transitionFragmentShader = `
uniform float uProgress;
uniform float uTime;
uniform vec3 uColorFrom;
uniform vec3 uColorTo;
uniform float uNoiseScale;
uniform float uEdgeSoftness;

varying vec2 vUv;

// Simplex noise functions
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion for more interesting noise patterns
float fbm(vec2 uv, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(uv * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  // Create animated noise pattern
  vec2 noiseCoord = vUv * uNoiseScale;
  float noise = fbm(noiseCoord + uTime * 0.1, 4);

  // Normalize noise to 0-1 range
  noise = noise * 0.5 + 0.5;

  // Add directional wipe effect combined with noise
  float wipeDirection = vUv.y; // Bottom to top wipe
  float combinedPattern = mix(wipeDirection, noise, 0.6);

  // Create smooth transition threshold
  float threshold = uProgress;

  // Calculate transition edge with softness
  float edge = smoothstep(threshold - uEdgeSoftness, threshold + uEdgeSoftness, combinedPattern);

  // Add glow effect at the transition edge
  float glowWidth = 0.1;
  float distToEdge = abs(combinedPattern - threshold);
  float glow = exp(-distToEdge * distToEdge / (glowWidth * glowWidth * 0.5)) * 0.3;

  // Mix colors based on edge
  vec3 color = mix(uColorTo, uColorFrom, edge);

  // Add glow with a bright accent color
  vec3 glowColor = mix(uColorFrom, uColorTo, 0.5) * 1.5;
  color += glowColor * glow * (1.0 - abs(uProgress - 0.5) * 2.0);

  // Add subtle pulsing at the edge
  float pulse = sin(uTime * 4.0) * 0.05 + 0.95;
  color *= pulse;

  gl_FragColor = vec4(color, 1.0);
}
`;

// Create the Transition shader material
const TransitionMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTime: 0,
    uColorFrom: new THREE.Color('#1a1a1a'),
    uColorTo: new THREE.Color('#95bf47'),
    uNoiseScale: 3.0,
    uEdgeSoftness: 0.15,
  },
  transitionVertexShader,
  transitionFragmentShader
);

// Extend Three.js with our custom material
extend({ TransitionMaterial });

// Type declarations are in src/types/three-fiber.d.ts

interface TransitionPlaneProps {
  progress: number;
  colorFrom?: string;
  colorTo?: string;
  noiseScale?: number;
  edgeSoftness?: number;
  width?: number;
  height?: number;
  position?: [number, number, number];
}

export default function TransitionPlane({
  progress,
  colorFrom = '#1a1a1a',
  colorTo = '#95bf47',
  noiseScale = 3.0,
  edgeSoftness = 0.15,
  width = 10,
  height = 10,
  position = [0, 0, -2],
}: TransitionPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial & TransitionUniforms>(null);

  const colors = useMemo(
    () => ({
      from: new THREE.Color(colorFrom),
      to: new THREE.Color(colorTo),
    }),
    [colorFrom, colorTo]
  );

  // Update uniforms every frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uProgress = progress;
    }
  });

  return (
    <mesh position={position} data-testid="transition-plane">
      <planeGeometry args={[width, height, 1, 1]} />
      <transitionMaterial
        ref={materialRef}
        uProgress={progress}
        uTime={0}
        uColorFrom={colors.from}
        uColorTo={colors.to}
        uNoiseScale={noiseScale}
        uEdgeSoftness={edgeSoftness}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
