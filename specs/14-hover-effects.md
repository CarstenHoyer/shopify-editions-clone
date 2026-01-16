# 14-hover-effects

> Epic: Custom Shaders
> Dependencies: 07-model-loading, 12-shader-setup

---

## Goal

Implement interactive hover effects on 3D elements.

## Requirements
- Raycasting for mouse hover detection
- Hover state shader (glow, outline, or distortion)
- Smooth transition in/out
- Cursor change on hoverable elements

## E2E Test

Write test in `e2e/hover.spec.ts`:
- Cursor changes over 3D element
- Hover state activates (visual change)

## Done when
- [ ] `npm run build` passes
- [ ] Hover effect visible on 3D models
- [ ] Smooth transition
