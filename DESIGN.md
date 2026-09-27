---
name: Cyber Lunar
colors:
  surface: '#0b1323'
  surface-dim: '#0b1323'
  surface-bright: '#31394b'
  surface-container-lowest: '#060e1e'
  surface-container-low: '#141b2c'
  surface-container: '#181f30'
  surface-container-high: '#222a3b'
  surface-container-highest: '#2d3546'
  on-surface: '#dbe2f9'
  on-surface-variant: '#bacac7'
  inverse-surface: '#dbe2f9'
  inverse-on-surface: '#293042'
  outline: '#849492'
  outline-variant: '#3b4a48'
  surface-tint: '#00ded2'
  primary: '#ffffff'
  on-primary: '#003734'
  primary-container: '#47fbef'
  on-primary-container: '#00716b'
  inverse-primary: '#006a64'
  secondary: '#b8c7e3'
  on-secondary: '#223146'
  secondary-container: '#39475e'
  on-secondary-container: '#a7b6d1'
  tertiary: '#ffffff'
  on-tertiary: '#1e3242'
  tertiary-container: '#d0e5fa'
  on-tertiary-container: '#526778'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#47fbef'
  primary-fixed-dim: '#00ded2'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#00504b'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#b8c7e3'
  on-secondary-fixed: '#0c1c30'
  on-secondary-fixed-variant: '#39475e'
  tertiary-fixed: '#d0e5fa'
  tertiary-fixed-dim: '#b4c9dd'
  on-tertiary-fixed: '#071d2d'
  on-tertiary-fixed-variant: '#35495a'
  background: '#0b1323'
  on-background: '#dbe2f9'
  surface-variant: '#2d3546'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system blends deep-space cybernetics with sophisticated tech ergonomics. Taking direct inspiration from high-contrast nocturnal interfaces, orbital aerospace instrumentation, and luminous bioluminescent circuitry, the interface evokes an aura of precision, advanced exploration, and calm authority.

The aesthetic philosophy converges on **Safe Futuristic Glassmorphism**:
- **Electric Cyan Glow:** Used selectively to indicate vitality, active states, key data beacons, and critical visual pathways.
- **Deep Space Foundations:** Surfaces leverage ultra-dark midnight navy tones rather than sterile pitch black, delivering a rich atmospheric depth.
- **Lunar Metallic Accents:** Cool titanium and silver tones lend crisp, physical definition to borders and auxiliary typography.
- **Ergonomic Enterprise Balance:** While visually rooted in a subtle cyberpunk atmosphere, typography and structural components maintain impeccable accessibility, legibility, and high-density information architecture suitable for mission-critical software.

## Colors

The palette is tuned specifically for high-contrast dark environments, establishing an atmospheric hierarchy that ranges from pitch voids to vibrant electric emissions.

### Functional Mapping & Hierarchy

- **Primary (`#4EFFF3`):** Electric neon cyan. Reserved strictly for primary callouts, dominant interactive controls, focal status indicators, and energetic optical glows. It commands the highest layer of human attention.
- **Secondary (`#1A293E`):** Dark slate steel blue. Functions as the foundational surface layer for elevated cards, modal sheets, toolbars, and segmented controls, providing clean separation from the canvas.
- **Tertiary (`#A3B8CC`):** Cool lunar metallic silver. Serves as the structural anchor for secondary labels, low-key icons, active borders, and refined divider strokes.
- **Neutral Canvas (`#0B1323`):** Deep space navy. The base layer across full-screen layouts. It absorbs backscatter while elevating ambient cyan refractions without causing optical fatigue.

### Surface Tiers & Token States
- **Canvas Base:** `#0B1323` (Background)
- **Surface Elevation 1 (Cards, panels):** `#0F192C` with `rgba(78, 255, 243, 0.08)` border strokes.
- **Surface Elevation 2 (Dropdowns, floating dialogs):** `#1A293E` with `rgba(163, 184, 204, 0.16)` border strokes.
- **Surface Elevation 3 (Active highlight overlays):** `rgba(78, 255, 243, 0.12)`.
- **Text Primary:** `#FFFFFF` (Peak legibility on dark layers).
- **Text Secondary / Muted:** `#A3B8CC`.
- **Accent Glow Emission:** `0 0 24px rgba(78, 255, 243, 0.35)`.

## Typography

The typography couples the technical personality of **Space Grotesk** with the utilitarian precision of **Inter**.

- **Display & Headlines (`Space Grotesk`):** Delivers a computational and geometric posture. Upper-tier headlines utilize slight negative tracking for impact, while medium and small headings adopt tracked uppercase formatting when denoting subsystems or telemetry tags.
- **Body (`Inter`):** Chosen for long-form data comprehension, tabular reading, and dense documentation. Its neutral character cushions the boldness of the headlines, ensuring effortless scanning in complex dashboards.
- **Labels & Micro-copy (`Space Grotesk`):** Explicitly tracked out (`0.06em` to `0.1em`) to replicate heads-up display readouts and technical apparatus markings.

## Layout & Spacing

This design system uses an **8px base spatial grid** combined with a flexible 12-column fluid structure for widescreen interfaces, shifting to an 8-column layout on tablets and a 4-column layout on mobile devices.

### Layout Mechanics
- **Desktop (1200px+):** 12-column grid, `margin: 2rem`, `gutter: 1.5rem`. Max container limit of `1440px` to maintain optimal line lengths.
- **Tablet (768px - 1199px):** 8-column grid, `margin: 1.5rem`, `gutter: 1rem`. Sidebars collapse into glass slide-overs.
- **Mobile (Below 768px):** 4-column grid, `margin: 1rem`, `gutter: 1rem`. Multi-column card sets re-stack vertically into single-column flows.
- **Component Padding:** Built using strict multiples of `space-sm` (`8px`) and `space-md` (`16px`) to ensure modular mathematical alignment across panels.

## Elevation & Depth

Visual depth is achieved through layered glassmorphism, luminescent cyan borders, and diffused light fields rather than opaque drop shadows.

### Atmospheric Tiering
1. **Base Layer (Surface 0):** Flat `#0B1323`. Pure background context with zero elevation.
2. **Glass Floor (Surface 1):** Background `rgba(15, 25, 44, 0.7)` supported by a `backdrop-filter: blur(12px)`. Enclosed by a 1px border of `rgba(163, 184, 204, 0.12)`.
3. **Elevated Instrument (Surface 2):** Background `rgba(26, 41, 62, 0.75)` with `backdrop-filter: blur(16px)`. Bordered by `rgba(78, 255, 243, 0.2)` with a slight inner top highlight `inset 0 1px 0 rgba(255, 255, 255, 0.1)`.
4. **Active Luminescence (Hover & Focus States):** Border brightens to `rgba(78, 255, 243, 0.8)` with an outer ambient cyan aura: `box-shadow: 0 0 20px -2px rgba(78, 255, 243, 0.25)`.
5. **Overlays & Modals (Surface 3):** Background `#1A293E` with deep ambient isolation: `box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 1px rgba(78, 255, 243, 0.4)`.

## Shapes

The design system maintains a balanced **Rounded (`2`)** curvature strategy (`0.5rem` / `8px` default radius):

- **Buttons, Inputs, Badges:** `0.5rem` (`8px`). Strikes an equilibrium between technological sharpness and contemporary touch-friendly ergonomics.
- **Cards, Modules, Flyout Panels:** `1rem` (`16px`). Softens large structural surfaces and preserves optical harmony with inner elements.
- **Pills, Toggles, Micro Indicators:** `9999px` (Full circle/pill) for status dots, tags, and switch thumbs.

## Components

### Buttons
- **Primary:** Solid `#4EFFF3` background with `#0B1323` bold Space Grotesk text. On hover, triggers a luminous radial aura (`box-shadow: 0 0 20px rgba(78, 255, 243, 0.45)`) and slight upward translation (`-1px`).
- **Secondary:** Semi-transparent base `rgba(26, 41, 62, 0.6)` with a 1px border in `#A3B8CC` at 30% opacity and `#FFFFFF` text. On hover, the border shifts to `#4EFFF3` and the text adopts the primary cyan tone.
- **Ghost/Tertiary:** Zero background, `#A3B8CC` text, turning to `#4EFFF3` with a `rgba(78, 255, 243, 0.08)` background on hover.

### Inputs & Form Fields
- **Container:** Dark navy base (`rgba(11, 19, 35, 0.8)`) with a 1px metallic frame (`rgba(163, 184, 204, 0.2)`). Height: `44px`.
- **Text:** Crisp white (`#FFFFFF`) in `Inter 14px`, with placeholder text tinted in `#A3B8CC` at 50% opacity.
- **Active/Focus:** Border turns `#4EFFF3` with a soft outer glow (`box-shadow: 0 0 12px rgba(78, 255, 243, 0.2)`).

### Cards & Panels
- **Structure:** `backdrop-filter: blur(16px)`, background `rgba(15, 25, 44, 0.85)`, and border `1px solid rgba(163, 184, 204, 0.12)`.
- **Corner Accent Option:** Cards may optionally feature an electric cyan corner index or subtle top stroke gradient (`linear-gradient(90deg, #4EFFF3 0%, transparent 40%)`) to reinforce the lunar cyber aesthetic.

### Chips & Badges
- **Status Badges:** Pill-shaped, composed of `rgba(78, 255, 243, 0.1)` background, `#4EFFF3` uppercase Space Grotesk text, and an accompanying 6px pulsating dot indicator.
- **Filter Chips:** 8px radius, dark slate fill, bordered by `rgba(163, 184, 204, 0.25)`. When selected, the background turns `rgba(78, 255, 243, 0.15)` with an electric cyan border.

### Checkboxes & Radios
- **Frame:** 18px box or circle with a 1.5px border of `#A3B8CC`.
- **Checked State:** Fill turns `#4EFFF3`, inside icon colored deep `#0B1323`, reinforced by an electric cyan glow.

### Lists & Data Tables
- **Rows:** Separated by 1px hairline rules in `rgba(163, 184, 204, 0.08)`.
- **Row Hover:** Transitions smoothly to `rgba(78, 255, 243, 0.04)` with a bright 2px `#4EFFF3` indicator bar pinned to the left edge.