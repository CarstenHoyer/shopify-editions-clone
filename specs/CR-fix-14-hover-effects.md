# CR: Fix E2E test failure from 14-hover-effects

**Problem:** Hover effect tests fail because cursor never changes to `pointer` when mouse moves over the canvas center. Tests expect `document.body.style.cursor` to be `'pointer'` but it remains `'default'`.

**Root cause:** R3F pointer events (onPointerOver/onPointerOut) only fire when the mouse ray intersects with an actual 3D mesh. The tests move the mouse to the canvas center, but:
1. The cube model geometry may not be positioned exactly at center or may be too small to reliably hit
2. The raycaster needs the mesh to be in the exact raycast path from camera through mouse position
3. There's no guarantee the model bounds cover the canvas center point

## Fix

### 1. Add a larger invisible hit-test mesh to HeroModel
In `src/components/canvas/HeroModel.tsx`, add an invisible mesh that covers a larger area to ensure reliable hover detection:

```tsx
{/* Invisible hit-test mesh for reliable hover detection */}
<mesh visible={false}>
  <boxGeometry args={[3, 3, 3]} />
  <meshBasicMaterial transparent opacity={0} />
</mesh>
```

This mesh should be inside the group that has the pointer event handlers.

### 2. Alternative: Use a plane facing the camera
If box doesn't work reliably, use a plane that always faces the camera:

```tsx
<mesh visible={false}>
  <planeGeometry args={[4, 4]} />
  <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
</mesh>
```

### 3. Ensure the hit-test area is large enough
The invisible mesh should be sized so that the canvas center (where tests move the mouse) reliably intersects with it. Given the camera is at `[0, 0, 5]` with fov 50, a 3x3 or 4x4 area at z=0 should be sufficient.

### 4. Update test waiting strategy (optional)
If timing issues persist, the tests may need to wait for the R3F render loop to process the pointer event:
- Increase wait time after mouse move from 500ms to 1000ms
- Or poll for cursor change with a retry loop

## Klart när
- [ ] E2E tests pass
- [ ] npm run build succeeds
