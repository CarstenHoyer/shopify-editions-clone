# 06-page-sections

> Epic: Core 3D Scene
> Dependencies: 05-hero-section, 04-design-extraction

---

## Goal

Create all page sections according to Shopify Editions layout.

## Requirements
- Section component with consistent styling
- Each section: background, title, content, 3D element
- Sections: Sidekick, Agentic, Online, Retail, Marketing, Checkout
- Placeholder 3D geometry per section
- Correct spacing between sections

## E2E Test

Write test in `e2e/sections.spec.ts`:
- All section titles visible when scrolling
- At least 6 sections render

## Done when
- [ ] `npm run build` passes
- [ ] Can scroll through all sections
- [ ] Each section has unique 3D placeholder
