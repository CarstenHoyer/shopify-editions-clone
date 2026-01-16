# Product Requirements Document: shopify-editions-clone

## Project Overview

**Name:** shopify-editions-clone
**Type:** Greenfield (Frontend Only)
**Description:** A pixel-perfect recreation of the Shopify Editions Winter 2026 landing page UI using Next.js and react-three-fiber. Focus is on recreating WebGL 3D models, scroll-triggered animations, custom shaders for transitions, and the overall visual experience.

## Design Reference

**Source:** https://www.shopify.com/editions/winter2026

Extract from this site:
- Visual assets (3D models, images, textures)
- Color scheme and typography
- Layout and spacing
- Animation timing and easing
- Shader effects

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| 3D/WebGL | react-three-fiber + @react-three/drei |
| Shaders | GLSL (custom shaders for transitions) |
| Styling | Tailwind CSS |
| Animations | GSAP / Framer Motion |
| Deploy | Vercel |

## Features

### Core Features
1. **3D WebGL Models** - Interactive 3D models rendered with react-three-fiber
2. **Scroll-triggered Animations** - GSAP/Framer Motion powered scroll animations
3. **Custom Shaders** - GLSL shaders for visual transitions and effects
4. **Responsive Layout** - Pixel-perfect recreation of original design
5. **Interactive Hover Effects** - 3D element interactions on hover
6. **Section Navigation** - Scroll snapping between sections
7. **Loading Animations** - Smooth loading states for 3D assets

### Single Page Application
- This is a single-page experience
- No page-to-page transitions needed
- All content loads on one scrollable page

## Asset Structure

```
public/
├── models/          # 3D models (.glb, .gltf)
├── textures/        # Texture maps
├── images/          # Static images
└── shaders/         # GLSL shader files (if external)
```

## Constraints

- Frontend only - no backend required
- All assets in public directory
- Must closely match original site's visual appearance
- Performance optimized for smooth 60fps animations

## Deployment

- **Platform:** Vercel
- **VM Provider:** Hetzner Cloud (hcloud)
- **VM Name:** ralph-sandbox
- **Region:** nbg1

## Success Criteria

1. Visual fidelity matches original Shopify Editions page
2. 3D models render correctly with proper lighting
3. Scroll animations are smooth and performant
4. Shader transitions work across modern browsers
5. Page loads within acceptable time with proper loading states
6. Responsive across desktop and mobile viewports
