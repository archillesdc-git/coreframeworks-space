# ArchillesDC Brand Guidelines

## Brand Overview

**ArchillesDC** is a powerful, modern CLI and framework for building production-ready full-stack web applications. Our brand reflects innovation, reliability, and developer-first design.

---

## Logo

### Primary Logo
The ArchillesDC logo consists of two elements:
1. **Icon** - A stylized "A" within a rounded square with a gradient
2. **Wordmark** - "Archilles" in white/black + "DC" in purple

### Logo Versions
- `logo.svg` - Icon only (square)
- `logo-full.svg` - Icon + wordmark (dark background)
- `logo-full-light.svg` - Icon + wordmark (light background)
- `favicon.svg` - Small icon for favicons

### Clear Space
Maintain clear space around the logo equal to the height of the "A" in the icon.

### Minimum Size
- Icon only: 24px × 24px
- Full logo: 120px wide

### Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't change the colors
- ❌ Don't add effects like drop shadows
- ❌ Don't place on busy backgrounds
- ❌ Don't rotate the logo

---

## Colors

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Violet 500** | `#8B5CF6` | rgb(139, 92, 246) | Primary actions, links |
| **Violet 600** | `#7C3AED` | rgb(124, 58, 237) | Hover states |
| **Violet 700** | `#6D28D9` | rgb(109, 40, 217) | Active states |
| **Violet 400** | `#A78BFA` | rgb(167, 139, 250) | Accents, highlights |

### Background Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Background** | `#0A0A0F` | rgb(10, 10, 15) | Main background |
| **Surface** | `#12121A` | rgb(18, 18, 26) | Cards, panels |
| **Elevated** | `#1A1A24` | rgb(26, 26, 36) | Hover states |
| **Border** | `#2A2A3A` | rgb(42, 42, 58) | Borders, dividers |

### Text Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Primary** | `#FAFAFA` | rgb(250, 250, 250) | Headings, important text |
| **Secondary** | `#A1A1AA` | rgb(161, 161, 170) | Body text |
| **Muted** | `#71717A` | rgb(113, 113, 122) | Hints, labels |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Cyan** | `#22D3EE` | Info, links |
| **Emerald** | `#10B981` | Success |
| **Amber** | `#F59E0B` | Warning |
| **Rose** | `#F43F5E` | Error, danger |

### Gradients

```css
/* Primary Gradient */
background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);

/* Hero Gradient */
background: linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%);

/* Glow Effect */
box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
```

---

## Typography

### Font Family

**Primary:** Inter
```css
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

**Monospace:** JetBrains Mono
```css
font-family: "JetBrains Mono", "Fira Code", monospace;
```

### Font Weights
- **Regular (400)** - Body text
- **Medium (500)** - Buttons, labels
- **Semibold (600)** - Subheadings
- **Bold (700)** - Headings
- **Extrabold (800)** - Display text

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Display | 72px | 1.0 | Hero headlines |
| H1 | 48px | 1.1 | Page titles |
| H2 | 36px | 1.2 | Section headers |
| H3 | 24px | 1.3 | Subsections |
| H4 | 20px | 1.4 | Card titles |
| Body | 16px | 1.6 | Paragraphs |
| Small | 14px | 1.5 | Captions |
| Tiny | 12px | 1.4 | Labels |

---

## Iconography

### Style
- Use **outlined** icons (not filled)
- 24px default size
- 2px stroke width
- Rounded line caps

### Recommended Libraries
- [Lucide Icons](https://lucide.dev) (Primary)
- [Heroicons](https://heroicons.com)

---

## Voice & Tone

### Brand Personality
- **Innovative** - Cutting-edge technology
- **Reliable** - Production-ready, stable
- **Developer-first** - Great DX, intuitive
- **Friendly** - Approachable, helpful

### Writing Style
- Clear and concise
- Technical but accessible
- Use active voice
- Be helpful, not condescending

### Examples

✅ **Good:**
> "Create a new project in seconds with our CLI."
> "Build full-stack apps with type-safe APIs."

❌ **Avoid:**
> "The user should leverage our CLI solution."
> "Utilize our framework for maximum efficiency."

---

## UI Components

### Border Radius
- Small: 4px (inputs, badges)
- Medium: 8px (buttons, cards)
- Large: 12px (modals, panels)
- XL: 16px (hero cards)
- Full: 9999px (pills, avatars)

### Shadows
```css
/* Card shadow */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Elevated shadow */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Glow shadow */
box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
```

### Spacing Scale
4px increments: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

---

## Motion

### Transitions
```css
/* Default */
transition: all 0.15s ease;

/* Slow */
transition: all 0.3s ease;

/* Spring-like */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations
- Fade in: 0.3s
- Slide in: 0.2s
- Scale: 0.15s

---

## Social Media

### Profile Picture
Use `logo.svg` (icon only)

### Banner/Cover
- Dark background (#0A0A0F)
- Gradient accent
- Tagline: "Build Full-Stack Apps in Minutes"

### Hashtags
- #ArchillesDC
- #FullStackFramework
- #NextJS
- #TypeScript

---

## Downloads

All brand assets are available in the `/branding` folder:

```
branding/
├── logo.svg              # Icon (512x512)
├── favicon.svg           # Favicon (64x64)
├── logo-full.svg         # Full logo (dark bg)
├── logo-full-light.svg   # Full logo (light bg)
├── og-image.png          # Social preview (1200x630)
└── BRAND_GUIDELINES.md   # This file
```

---

## Contact

For brand-related questions:
- Email: brand@archillesdc.com
- Website: https://archillesdc.dev
