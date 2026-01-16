# 02-r3f-canvas-setup

> Epic: Foundation & Setup
> Dependencies: 01-project-setup

---

## Goal

Create basic R3F Canvas with camera, lights and OrbitControls for debugging.

## Requirements
- Canvas component that wraps the entire viewport
- PerspectiveCamera with good default position
- Ambient + directional light setup
- OrbitControls (can be removed later)
- Suspense wrapper for async loading

## E2E Test

Write test in `e2e/canvas.spec.ts`:
- Canvas element with class "webgl" exists
- No console errors on load

## Done when
- [ ] `npm run build` passes
- [ ] Canvas fills viewport
- [ ] Can rotate scene with OrbitControls
