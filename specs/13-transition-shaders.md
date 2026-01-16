# 13-transition-shaders

> Epic: Custom Shaders
> Dependencies: 12-shader-setup, 09-section-transitions

---

## Goal

Create shader-based transitions between sections.

## Requirements
- Transition shader (dissolve, wipe, or noise-based)
- Scroll progress as uniform input
- Smooth blend between section states
- Postprocessing effects if relevant

## E2E Test

Write test in `e2e/shader-transitions.spec.ts`:
- Transition effect visible on scroll
- No flicker or glitch

## Done when
- [ ] `npm run build` passes
- [ ] Shader transition visible between sections
- [ ] Performance ok (60fps)
