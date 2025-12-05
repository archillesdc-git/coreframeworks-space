# Design System Reference

Complete design system documentation for ArchillesDC projects.

## Color Palette

### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#0a0a0f` | Main background |
| `--color-surface` | `#12121a` | Cards, panels |
| `--color-surface-elevated` | `#1a1a24` | Elevated surfaces |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#2a2a3a` | Default borders |
| `--color-border-light` | `#3a3a4a` | Lighter borders |

### Primary Colors (Purple)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-50` | `#f0f0ff` | Very light |
| `--color-primary-100` | `#e0e0ff` | Light |
| `--color-primary-200` | `#c4b5fd` | Lighter |
| `--color-primary-300` | `#a78bfa` | Light accent |
| `--color-primary-400` | `#8b5cf6` | Accent |
| `--color-primary-500` | `#7c3aed` | **Primary** |
| `--color-primary-600` | `#6d28d9` | Hover |
| `--color-primary-700` | `#5b21b6` | Active/Dark |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-cyan` | `#22d3ee` | Info, links |
| `--color-accent-emerald` | `#10b981` | Success |
| `--color-accent-amber` | `#f59e0b` | Warning |
| `--color-accent-rose` | `#f43f5e` | Error, danger |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#fafafa` | Primary text |
| `--color-text-secondary` | `#a1a1aa` | Secondary text |
| `--color-text-muted` | `#71717a` | Muted text |

## Typography

### Font Families

```css
--font-sans: "Inter", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

### Font Sizes

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem | Labels |
| `text-sm` | 0.875rem (14px) | 1.25rem | Body small |
| `text-base` | 1rem (16px) | 1.5rem | **Body** |
| `text-lg` | 1.125rem (18px) | 1.75rem | Large body |
| `text-xl` | 1.25rem (20px) | 1.75rem | H4 |
| `text-2xl` | 1.5rem (24px) | 2rem | H3 |
| `text-3xl` | 1.875rem (30px) | 2.25rem | H2 |
| `text-4xl` | 2.25rem (36px) | 2.5rem | H1 |
| `text-5xl` | 3rem (48px) | 1 | Display |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, buttons |
| `font-semibold` | 600 | Subheadings |
| `font-bold` | 700 | Headings |
| `font-extrabold` | 800 | Display |

## Spacing

### Scale

| Class | Value | Pixels |
|-------|-------|--------|
| `0` | 0 | 0px |
| `0.5` | 0.125rem | 2px |
| `1` | 0.25rem | 4px |
| `1.5` | 0.375rem | 6px |
| `2` | 0.5rem | 8px |
| `2.5` | 0.625rem | 10px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |

## Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 0.125rem | Small elements |
| `rounded` | 0.25rem | Default |
| `rounded-md` | 0.375rem | Buttons |
| `rounded-lg` | 0.5rem | Cards |
| `rounded-xl` | 0.75rem | Large cards |
| `rounded-2xl` | 1rem | Panels |
| `rounded-full` | 9999px | Pills, avatars |

## Shadows

```css
/* Card shadow */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Elevated shadow */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Glow effect */
shadow-glow: 0 0 20px rgba(124, 58, 237, 0.3);
```

## Component Styles

### Button

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.15s;
}

/* Sizes */
.btn-sm { height: 2rem; padding: 0 0.75rem; font-size: 0.875rem; }
.btn-md { height: 2.5rem; padding: 0 1rem; font-size: 0.875rem; }
.btn-lg { height: 3rem; padding: 0 1.5rem; font-size: 1rem; }

/* Variants */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
}
.btn-primary:hover {
  background: var(--color-primary-600);
}

.btn-secondary {
  background: var(--color-surface-elevated);
  color: white;
}

.btn-outline {
  border: 1px solid var(--color-border);
  background: transparent;
}

.btn-ghost {
  background: transparent;
}
.btn-ghost:hover {
  background: var(--color-surface);
}

.btn-danger {
  background: var(--color-accent-rose);
  color: white;
}
```

### Input

```css
.input {
  width: 100%;
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color 0.15s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.input-error {
  border-color: var(--color-accent-rose);
}
```

### Card

```css
.card {
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 1.5rem;
}

.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.badge-error { background: rgba(244, 63, 94, 0.2); color: #fb7185; }
.badge-info { background: rgba(34, 211, 238, 0.2); color: #22d3ee; }
```

## Animations

### Keyframes

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
  50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.5); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Animation Classes

```css
.animate-fade-in { animation: fade-in 0.5s ease-out; }
.animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
.animate-spin { animation: spin 1s linear infinite; }
```

## Layout

### Container

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.container-sm { max-width: 42rem; }   /* 672px */
.container-md { max-width: 56rem; }   /* 896px */
.container-lg { max-width: 72rem; }   /* 1152px */
.container-xl { max-width: 80rem; }   /* 1280px */
```

### Sidebar

```css
.sidebar {
  width: 16rem; /* 256px */
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
}

.sidebar-collapsed {
  width: 4rem; /* 64px */
}
```

### Header

```css
.header {
  height: 4rem; /* 64px */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  z-index: 50;
}
```

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

## Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

## Dark Mode

The design system is dark-mode first. All colors are optimized for dark backgrounds.

### Color Hierarchy

1. **Background** (`#0a0a0f`) - Main page background
2. **Surface** (`#12121a`) - Cards, panels, inputs
3. **Elevated** (`#1a1a24`) - Hover states, dropdowns
4. **Border** (`#2a2a3a` / `#3a3a4a`) - Separators

### Text Hierarchy

1. **Primary** (`#fafafa`) - Headings, important text
2. **Secondary** (`#a1a1aa`) - Body text
3. **Muted** (`#71717a`) - Labels, hints

## Usage with Tailwind

```tsx
// Using design tokens
<div className="bg-[var(--color-surface)] border-[var(--color-border)]">
  <h1 className="text-[var(--color-text-primary)]">Title</h1>
  <p className="text-[var(--color-text-secondary)]">Description</p>
</div>

// Using cn() utility
import { cn } from "@/utils/cn";

<button className={cn(
  "px-4 py-2 rounded-lg font-medium",
  "bg-[var(--color-primary-500)] text-white",
  "hover:bg-[var(--color-primary-600)]",
  "disabled:opacity-50"
)}>
  Button
</button>
```
