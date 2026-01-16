import * as THREE from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

// Extend Three Fiber's JSX intrinsic elements with our custom shader material
declare module '@react-three/fiber' {
  interface ThreeElements {
    colorShiftMaterial: ReactThreeFiber.MaterialNode<
      THREE.ShaderMaterial,
      {
        uTime?: number;
        uScrollProgress?: number;
        uColorA?: THREE.Color;
        uColorB?: THREE.Color;
        uIntensity?: number;
      }
    >;
    transitionMaterial: ReactThreeFiber.MaterialNode<
      THREE.ShaderMaterial,
      {
        uProgress?: number;
        uTime?: number;
        uColorFrom?: THREE.Color;
        uColorTo?: THREE.Color;
        uNoiseScale?: number;
        uEdgeSoftness?: number;
      }
    >;
    hoverGlowMaterial: ReactThreeFiber.MaterialNode<
      THREE.ShaderMaterial,
      {
        uHoverProgress?: number;
        uTime?: number;
        uGlowColor?: THREE.Color;
        uBaseColor?: THREE.Color;
        uGlowIntensity?: number;
      }
    >;
  }
}
