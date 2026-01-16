import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Color shift shader material uniforms
export interface ColorShiftUniforms {
  uTime: number;
  uScrollProgress: number;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uIntensity: number;
}

// Default uniforms for color shift shader
export const colorShiftDefaults: ColorShiftUniforms = {
  uTime: 0,
  uScrollProgress: 0,
  uColorA: new THREE.Color('#95bf47'), // Shopify green
  uColorB: new THREE.Color('#5c3d8c'), // Purple
  uIntensity: 1.0,
};

// Vertex shader (inline for reliability)
export const colorShiftVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader (inline for reliability)
export const colorShiftFragmentShader = `
uniform float uTime;
uniform float uScrollProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Create animated gradient based on time and UV coordinates
  float wave = sin(vUv.x * 6.28318 + uTime * 2.0) * 0.5 + 0.5;
  float gradient = mix(wave, vUv.y, 0.5);

  // Add scroll-based influence
  float scrollInfluence = uScrollProgress * 0.3;
  gradient = gradient + scrollInfluence;

  // Mix between colors based on gradient
  vec3 color = mix(uColorA, uColorB, gradient);

  // Add subtle pulsing based on time
  float pulse = sin(uTime * 3.0) * 0.1 + 0.9;
  color *= pulse * uIntensity;

  gl_FragColor = vec4(color, 1.0);
}
`;

// Create the ColorShift shader material using drei's shaderMaterial
export const ColorShiftMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uColorA: new THREE.Color('#95bf47'),
    uColorB: new THREE.Color('#5c3d8c'),
    uIntensity: 1.0,
  },
  colorShiftVertexShader,
  colorShiftFragmentShader
);

// Extend Three.js with our custom material
extend({ ColorShiftMaterial });

// Hover glow shader material uniforms
export interface HoverGlowUniforms {
  uHoverProgress: number;
  uTime: number;
  uGlowColor: THREE.Color;
  uBaseColor: THREE.Color;
  uGlowIntensity: number;
}

// Default uniforms for hover glow shader
export const hoverGlowDefaults: HoverGlowUniforms = {
  uHoverProgress: 0,
  uTime: 0,
  uGlowColor: new THREE.Color('#95bf47'), // Shopify green
  uBaseColor: new THREE.Color('#ffffff'),
  uGlowIntensity: 1.5,
};

// Hover glow vertex shader
export const hoverGlowVertexShader = `
uniform float uHoverProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Subtle vertex displacement on hover for a "breathing" effect
  vec3 pos = position;
  float displacement = sin(uTime * 3.0 + position.y * 2.0) * 0.02 * uHoverProgress;
  pos += normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// Hover glow fragment shader
export const hoverGlowFragmentShader = `
uniform float uHoverProgress;
uniform float uTime;
uniform vec3 uGlowColor;
uniform vec3 uBaseColor;
uniform float uGlowIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Calculate fresnel/rim lighting effect for glow
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
  fresnel = pow(fresnel, 2.0);

  // Animated glow pulsing
  float pulse = sin(uTime * 4.0) * 0.15 + 0.85;

  // Combine base color with glow
  vec3 glowEffect = uGlowColor * fresnel * uGlowIntensity * pulse;

  // Interpolate based on hover progress for smooth transition
  vec3 finalColor = mix(uBaseColor, uBaseColor + glowEffect, uHoverProgress);

  // Add subtle edge glow when hovered
  float edgeGlow = fresnel * uHoverProgress * 0.5;
  finalColor += uGlowColor * edgeGlow;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Create the HoverGlow shader material using drei's shaderMaterial
export const HoverGlowMaterial = shaderMaterial(
  {
    uHoverProgress: 0,
    uTime: 0,
    uGlowColor: new THREE.Color('#95bf47'),
    uBaseColor: new THREE.Color('#ffffff'),
    uGlowIntensity: 1.5,
  },
  hoverGlowVertexShader,
  hoverGlowFragmentShader
);

// Extend Three.js with hover glow material
extend({ HoverGlowMaterial });

// Type for shader uniform values
type UniformValue = number | THREE.Color | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 | THREE.Matrix3 | THREE.Matrix4 | THREE.Texture | boolean;

// Utility to create custom shader materials with ease
export function createShaderMaterial(
  uniforms: Record<string, UniformValue>,
  vertexShader: string,
  fragmentShader: string
) {
  return shaderMaterial(uniforms, vertexShader, fragmentShader);
}

// Helper to interpolate between colors smoothly
export function lerpColor(
  colorA: THREE.Color,
  colorB: THREE.Color,
  t: number
): THREE.Color {
  const result = new THREE.Color();
  result.r = colorA.r + (colorB.r - colorA.r) * t;
  result.g = colorA.g + (colorB.g - colorA.g) * t;
  result.b = colorA.b + (colorB.b - colorA.b) * t;
  return result;
}
