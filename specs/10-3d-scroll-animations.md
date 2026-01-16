# 10-3d-scroll-animations

> Epic: Scroll Animations
> Dependencies: 07-model-loading, 08-gsap-scroll-setup

---

## Goal

Animate 3D models based on scroll position.

## Requirements
- Model rotation synced with scroll
- Model position changes per section
- Scale animations on section enter/exit
- useFrame + scroll progress for smooth interpolation

## E2E Test

Write test in `e2e/3d-animations.spec.ts`:
- 3D element position changes on scroll
- Animation is smooth without lag

## Done when
- [ ] `npm run build` passes
- [ ] 3D models animate on scroll
- [ ] 60fps performance
