# 17-performance-optimization

> Epic: Polish & Performance
> Dependencies: 10-3d-scroll-animations, 13-transition-shaders

---

## Goal

Optimize performance for smooth 60fps.

## Requirements
- Lazy load 3D models outside viewport
- Texture compression (WebP, basis)
- Model instancing where possible
- Reduce draw calls
- GPU memory management

## E2E Test

Write test in `e2e/performance.spec.ts`:
- Lighthouse performance score > 70
- No jank on scroll (visual test)

## Done when
- [ ] `npm run build` passes
- [ ] 60fps on desktop
- [ ] Acceptable performance on mobile
