# Design Reference - Shopify Editions Winter 2026

This document contains extracted design tokens and section breakdowns from the [Shopify Editions Winter '26](https://www.shopify.com/editions/winter2026) page.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | `#0a0a0a` | Main page background |
| Background Light | `#ffffff` | Card backgrounds, light sections |
| Foreground | `#ededed` | Primary text on dark |
| Foreground Dark | `#171717` | Primary text on light |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| Shopify Green | `#95bf47` | Primary brand accent |
| Green Dark | `#5e8e3e` | Hover states, darker accents |
| Green Light | `#b4d455` | Highlights |

### Section Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| Red | `#e31b23` | Marketing/critical sections |
| Blue | `#0066cc` | Info sections |
| Yellow | `#ffd000` | Warning/highlight sections |
| Purple | `#5c4dff` | Magic/AI features |
| Teal | `#00a3bf` | Operations sections |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Gray 900 | `#1a1a1a` | Dark backgrounds |
| Gray 800 | `#2d2d2d` | Card backgrounds dark |
| Gray 700 | `#404040` | Borders dark |
| Gray 600 | `#525252` | Muted text dark |
| Gray 400 | `#a3a3a3` | Subdued text |
| Gray 200 | `#e5e5e5` | Borders light |
| Gray 100 | `#f5f5f5` | Background light |

---

## Typography

### Font Family

```css
/* Primary - Shopify Sans (with fallbacks) */
font-family: "Shopify Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace */
font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Monaco, Consolas, monospace;
```

### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Display | `72px` / `4.5rem` | 1.1 | Hero headlines |
| H1 | `48px` / `3rem` | 1.2 | Section titles |
| H2 | `36px` / `2.25rem` | 1.25 | Subsection titles |
| H3 | `24px` / `1.5rem` | 1.3 | Card titles |
| H4 | `20px` / `1.25rem` | 1.4 | Small headings |
| Body Large | `18px` / `1.125rem` | 1.6 | Lead paragraphs |
| Body | `16px` / `1rem` | 1.6 | Body text |
| Body Small | `14px` / `0.875rem` | 1.5 | Secondary text |
| Caption | `12px` / `0.75rem` | 1.4 | Labels, captions |

### Font Weights

| Name | Weight |
|------|--------|
| Regular | `400` |
| Medium | `500` |
| Semibold | `600` |
| Bold | `700` |

---

## Spacing & Layout

### Spacing Scale

| Name | Value |
|------|-------|
| 0 | `0` |
| 1 | `4px` / `0.25rem` |
| 2 | `8px` / `0.5rem` |
| 3 | `12px` / `0.75rem` |
| 4 | `16px` / `1rem` |
| 5 | `20px` / `1.25rem` |
| 6 | `24px` / `1.5rem` |
| 8 | `32px` / `2rem` |
| 10 | `40px` / `2.5rem` |
| 12 | `48px` / `3rem` |
| 16 | `64px` / `4rem` |
| 20 | `80px` / `5rem` |
| 24 | `96px` / `6rem` |

### Container Widths

| Name | Max Width |
|------|-----------|
| sm | `640px` |
| md | `768px` |
| lg | `1024px` |
| xl | `1280px` |
| 2xl | `1536px` |

### Grid

- 12-column grid system
- Gutter: `24px` (desktop), `16px` (mobile)
- Section padding: `80px` vertical (desktop), `48px` (mobile)

---

## Page Sections

### 1. Hero Section
- Full viewport height
- 3D animated scene (central focus)
- Edition title: "Winter '26"
- Tagline text
- Scroll indicator

### 2. Sidekick (AI Assistant)
- AI productivity assistant features
- Skills carousel with rotatable content blocks
- Interactive demo elements
- Video previews with play buttons

### 3. Agentic Commerce
- AI commerce storefronts
- 3D product visualization
- Automated store management features

### 4. Online Store
- Store optimization tools
- Theme improvements (Horizon theme)
- Design customization features

### 5. Retail / POS
- Point of sale hardware
- In-person selling features
- Hardware product imagery

### 6. Marketing
- Growth and campaign features
- Email/SMS marketing tools
- Social media integration

### 7. Checkout
- Payment and transaction options
- Checkout customization
- Shop Pay features

### 8. Operations
- Inventory management
- Workflow automation
- Order management

### 9. Shop App
- Storefront personalization
- Customer-facing app features

### 10. B2B / Wholesale
- Business-to-business functionality
- Wholesale pricing
- Company accounts

### 11. Finance / Capital
- Shopify Capital features
- Payment processing
- Financial tools

### 12. Shipping & Logistics
- Shipping solutions
- Fulfillment options
- Delivery tracking

### 13. Developer Platform
- Commerce agents
- APIs and SDKs
- Developer tools

### 14. Footer
- Navigation links
- Social media
- Legal links

---

## 3D Models Needed

Based on the page analysis, the following 3D models/scenes are required:

### Hero Scene
1. **Main Logo/Badge** - Shopify "S" or Editions badge (animated, glowing)
2. **Abstract Geometric Shapes** - Floating cubes, spheres, or abstract forms
3. **Particle System** - Background ambient particles

### Section-Specific Models
4. **AI/Sidekick Icon** - Robot or AI assistant representation
5. **Shopping Cart** - 3D cart with products
6. **Mobile Device** - Phone/tablet mockup
7. **POS Terminal** - Cash register/card reader
8. **Package/Box** - Shipping box
9. **Chart/Graph** - Data visualization element
10. **Code Block** - Developer-themed 3D element

### Common Assets
11. **Product Boxes** - Generic product packaging
12. **Currency/Coins** - Finance section
13. **Globe** - International/shipping features

---

## Animation Notes

### Scroll-Based Animations
- Sections pin during scroll
- 3D models rotate/transform on scroll
- Parallax effects on background elements
- Text fade-in on scroll

### Transitions
- Custom shader transitions between sections
- Color gradient morphing
- Smooth easing (ease-out-cubic typical)

### Performance Targets
- 60fps minimum
- Lazy load 3D models
- Progressive enhancement for low-end devices

---

## Breakpoints

| Name | Min Width |
|------|-----------|
| sm | `640px` |
| md | `768px` |
| lg | `1024px` |
| xl | `1280px` |
| 2xl | `1536px` |

---

## Sources

- [Shopify Editions Winter '26](https://www.shopify.com/editions/winter2026)
- [Shopify Polaris Design System](https://polaris-react.shopify.com/design/colors)
- [Shopify Brand Colors](https://mobbin.com/colors/brand/shopify)
