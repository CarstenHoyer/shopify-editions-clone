# 01-project-setup

> Epic: Foundation & Setup
> Dependencies: None

---

## Goal

Set up Next.js project with React Three Fiber, Tailwind and Playwright for test loop.

## Requirements
- Next.js 14+ with App Router and TypeScript
- Tailwind CSS configured
- React Three Fiber + @react-three/drei installed
- GSAP with ScrollTrigger installed
- Playwright installed and configured
- Asset directories: public/models, public/textures, public/images

## E2E Test

Write test in `e2e/smoke.spec.ts`:
- App loads without errors
- Canvas element exists on page

## Done when
- [ ] `npm run dev` starts on port 3000
- [ ] `npm run build` passes
- [ ] `npx playwright test` passes
- [ ] 3D Canvas renders (empty scene is ok)
