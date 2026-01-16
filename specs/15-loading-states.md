# 15-loading-states

> Epic: Polish & Performance
> Dependencies: 07-model-loading

---

## Goal

Implement loading states and preloading for better UX.

## Requirements
- Initial loading screen with progress
- useProgress hook from drei
- Preload critical assets
- Skeleton/placeholder during loading
- Fade in when content ready

## E2E Test

Write test in `e2e/loading.spec.ts`:
- Loading indicator shows initially
- Content shows after loading

## Done when
- [ ] `npm run build` passes
- [ ] Loading screen shows
- [ ] Smooth fade in after load
