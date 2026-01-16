# 07-model-loading

> Epic: Core 3D Scene
> Dependencies: 03-asset-structure, 06-page-sections

---

## Goal

Implement 3D model loading with useGLTF and Suspense.

## Requirements
- useGLTF hook to load .glb files
- Suspense fallback with loading spinner
- useGLTF.preload() for critical models
- Error boundary for failed loads
- Models placed in respective sections

## E2E Test

Write test in `e2e/models.spec.ts`:
- No "failed to load" errors
- Loading state shows before model loaded

## Done when
- [ ] `npm run build` passes
- [ ] Models load without errors
- [ ] Loading state works
