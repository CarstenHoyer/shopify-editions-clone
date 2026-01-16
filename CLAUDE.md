# CLAUDE.md - shopify-editions-clone

## Project

Pixel-perfect recreation of the Shopify Editions Winter 2026 landing page (https://www.shopify.com/editions/winter2026) using Next.js and react-three-fiber. Focus on WebGL 3D models, scroll animations, and custom shader transitions.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **3D/WebGL:** react-three-fiber, @react-three/drei
- **Shaders:** Custom GLSL shaders
- **Styling:** Tailwind CSS
- **Animations:** GSAP and/or Framer Motion
- **Deploy:** Vercel

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/
│   ├── canvas/          # R3F canvas components
│   ├── sections/        # Page sections
│   └── ui/              # UI components
├── shaders/             # GLSL shader files
├── hooks/               # Custom React hooks
└── lib/                 # Utilities

public/
├── models/              # 3D models (.glb, .gltf)
├── textures/            # Texture maps
└── images/              # Static images
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Key Implementation Notes

### React Three Fiber
- Use `<Canvas>` from @react-three/fiber for 3D scenes
- Use @react-three/drei helpers (useGLTF, Environment, etc.)
- Optimize with `<Suspense>` for model loading

### Scroll Animations
- Use GSAP ScrollTrigger for scroll-based animations
- Pin sections during scroll when needed
- Ensure smooth 60fps performance

### Custom Shaders
- Write GLSL shaders for transition effects
- Use `shaderMaterial` from @react-three/drei
- Keep shaders performant for all devices

### Performance
- Lazy load 3D models
- Use `useGLTF.preload()` for critical models
- Compress textures (WebP, basis)
- Use instancing for repeated geometries

## Security Rules

CRITICAL - NEVER do:
- rm -rf / or sudo rm
- curl | bash or wget | bash
- Expose credentials in code
- Commit .env files
- Hardcode API keys

SECRETS HANDLING:
- .env files NEVER in repo
- Use process.env.VAR_NAME
- .gitignore MUST contain .env*

## Workflow

1. Read spec/PRD carefully
2. Implement step by step
3. Test in browser frequently
4. Ensure responsive design
5. Output `<promise>DONE</promise>` when complete
