# 05-hero-section

> Epic: Core 3D Scene
> Dependencies: 02-r3f-canvas-setup, 04-design-extraction

---

## Goal

Build hero section with 3D model and initial animation.

## Requirements
- Hero takes full viewport height
- Title and subtitle text overlay
- 3D model centered behind text
- Entry animation for model (fade in + scale)
- Background color/gradient per reference

## E2E Test

Write test in `e2e/hero.spec.ts`:
- Hero section visible
- Title text exists
- Canvas exists within hero

## Done when
- [ ] `npm run build` passes
- [ ] Hero fills viewport
- [ ] 3D model visible (placeholder ok)
