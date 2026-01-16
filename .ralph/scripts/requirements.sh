#!/bin/bash
# Requirements installation script for shopify-editions-clone

set -e

echo "Installing dependencies for shopify-editions-clone..."

# Core Next.js dependencies (if not already initialized)
if [ ! -f "package.json" ]; then
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
fi

# React Three Fiber and related packages
npm install three @types/three
npm install @react-three/fiber @react-three/drei

# Animation libraries
npm install gsap @gsap/react
npm install framer-motion

# Additional utilities
npm install leva  # For debugging 3D scenes (dev only)
npm install postprocessing @react-three/postprocessing  # For shader effects

# Playwright for E2E testing
npm install -D @playwright/test
npx playwright install

echo "Dependencies installed successfully!"
