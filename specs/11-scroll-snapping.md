# 11-scroll-snapping

> Epic: Scroll Animations
> Dependencies: 09-section-transitions

---

## Goal

Implement section-based scroll snapping.

## Requirements
- CSS scroll-snap or GSAP snap
- Snap to section start on scroll stop
- Smooth snap animation
- Keyboard navigation (Page Up/Down)

## E2E Test

Write test in `e2e/snap.spec.ts`:
- Scroll stops on section boundary
- PageDown goes to next section

## Done when
- [ ] `npm run build` passes
- [ ] Scroll snaps to sections
- [ ] Keyboard nav works
