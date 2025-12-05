import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateStyleFiles(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const globalsCSS = `@import "tailwindcss";

/* ===========================================
   CSS Custom Properties (Design Tokens)
   =========================================== */

@theme {
  /* Typography */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, "SF Mono",
    Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Colors - Modern Premium Palette */
  --color-brand-50: oklch(0.97 0.01 250);
  --color-brand-100: oklch(0.93 0.02 250);
  --color-brand-200: oklch(0.87 0.04 250);
  --color-brand-300: oklch(0.78 0.08 250);
  --color-brand-400: oklch(0.68 0.12 250);
  --color-brand-500: oklch(0.55 0.18 250);
  --color-brand-600: oklch(0.48 0.2 250);
  --color-brand-700: oklch(0.4 0.18 250);
  --color-brand-800: oklch(0.33 0.14 250);
  --color-brand-900: oklch(0.27 0.1 250);
  --color-brand-950: oklch(0.18 0.06 250);

  /* Accent Colors */
  --color-accent-50: oklch(0.98 0.01 160);
  --color-accent-500: oklch(0.7 0.15 160);
  --color-accent-600: oklch(0.6 0.18 160);

  /* Surface Colors (Dark Mode Optimized) */
  --color-surface-0: oklch(0.13 0.01 250);
  --color-surface-50: oklch(0.16 0.01 250);
  --color-surface-100: oklch(0.2 0.01 250);
  --color-surface-200: oklch(0.25 0.01 250);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 20px rgb(139 92 246 / 0.3);

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===========================================
   Base Styles
   =========================================== */

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  @apply bg-surface-0 text-white;
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Selection */
::selection {
  @apply bg-brand-500/30;
}

/* Focus styles */
:focus-visible {
  @apply outline-none ring-2 ring-brand-500 ring-offset-2 ring-offset-surface-0;
}

/* ===========================================
   Custom Utilities
   =========================================== */

/* Glassmorphism */
.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}

.glass-dark {
  @apply bg-black/20 backdrop-blur-xl border border-white/5;
}

/* Gradient text */
.text-gradient {
  @apply bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500 bg-clip-text text-transparent;
}

/* Animated gradient background */
.bg-gradient-animated {
  background: linear-gradient(
    -45deg,
    oklch(0.55 0.18 250),
    oklch(0.48 0.2 280),
    oklch(0.6 0.18 200),
    oklch(0.55 0.15 160)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Glow effect */
.glow {
  box-shadow: var(--shadow-glow);
}

.glow-hover {
  transition: box-shadow var(--transition-base);
}

.glow-hover:hover {
  box-shadow: var(--shadow-glow);
}

/* Smooth enter animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in var(--transition-base) ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up var(--transition-slow) ease-out forwards;
}

.animate-fade-in-down {
  animation: fade-in-down var(--transition-slow) ease-out forwards;
}

.animate-scale-in {
  animation: scale-in var(--transition-base) ease-out forwards;
}

/* Stagger delays for lists */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }

/* ===========================================
   Component Base Styles
   =========================================== */

/* Cards */
.card {
  @apply glass rounded-xl p-6 transition-all duration-200;
}

.card-hover {
  @apply hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5;
}

/* Buttons base */
.btn {
  @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-50;
}

.btn-primary {
  @apply btn bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700;
}

.btn-secondary {
  @apply btn bg-white/10 text-white hover:bg-white/20 active:bg-white/5;
}

.btn-ghost {
  @apply btn bg-transparent text-white/70 hover:bg-white/10 hover:text-white;
}

.btn-outline {
  @apply btn border border-white/20 bg-transparent text-white hover:bg-white/10;
}

/* Inputs */
.input {
  @apply w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition-all duration-200 focus:border-brand-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500/20;
}

/* Labels */
.label {
  @apply text-sm font-medium text-white/70;
}

/* Links */
.link {
  @apply text-brand-400 underline-offset-4 transition-colors hover:text-brand-300 hover:underline;
}

/* ===========================================
   Scrollbar Styles
   =========================================== */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-surface-0;
}

::-webkit-scrollbar-thumb {
  @apply bg-white/20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-white/30;
}
`;

    await fs.writeFile(path.join(projectPath, "src", "styles", "globals.css"), globalsCSS);
}
