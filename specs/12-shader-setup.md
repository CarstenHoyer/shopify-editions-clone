# 12-shader-setup

> Epic: Custom Shaders
> Dependencies: 02-r3f-canvas-setup

---

## Goal

Set up infrastructure for custom GLSL shaders.

## Requirements
- shaderMaterial from @react-three/drei
- Shader file loading (raw imports or inline)
- Uniform updates via useFrame
- Example shader that works

## E2E Test

Write test in `e2e/shaders.spec.ts`:
- Page loads without WebGL errors
- Shader element renders

## Done when
- [ ] `npm run build` passes
- [ ] Custom shader renders (color shift test)
- [ ] Uniforms update per frame
