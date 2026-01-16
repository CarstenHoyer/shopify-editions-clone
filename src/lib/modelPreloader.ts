import { useGLTF } from '@react-three/drei';

// List of all models used in the application
export const MODELS = {
  hero: '/models/cube.glb',
  // Add more models here as they are added to the project
  // sidekick: '/models/sidekick.glb',
  // agentic: '/models/agentic.glb',
  // online: '/models/online.glb',
  // retail: '/models/retail.glb',
  // marketing: '/models/marketing.glb',
  // checkout: '/models/checkout.glb',
} as const;

export type ModelKey = keyof typeof MODELS;

// Preload all critical models
export function preloadAllModels() {
  Object.values(MODELS).forEach((url) => {
    useGLTF.preload(url);
  });
}

// Preload specific models
export function preloadModels(keys: ModelKey[]) {
  keys.forEach((key) => {
    const url = MODELS[key];
    if (url) {
      useGLTF.preload(url);
    }
  });
}

// Preload a single model by URL
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
