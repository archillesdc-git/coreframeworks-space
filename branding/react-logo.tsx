// ArchillesDC React Logo Components
// Use these in your React/Next.js applications

import React from "react";

interface LogoProps {
    size?: number;
    className?: string;
}

// Icon Only Logo
export function ArchillesIcon({ size = 40, className = "" }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="archillesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#archillesGrad)" />
            <path
                d="M32 16 L18 48 L24 48 L27 40 L37 40 L40 48 L46 48 L32 16Z M32 24 L35.5 36 L28.5 36 L32 24Z"
                fill="white"
            />
        </svg>
    );
}

// Full Logo with Text
export function ArchillesLogo({ size = 40, className = "" }: LogoProps) {
    const textSize = size * 0.55;
    const width = size * 4;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <ArchillesIcon size={size} />
            <span
                style={{ fontSize: textSize }}
                className="font-bold"
            >
                <span className="text-white">Archilles</span>
                <span className="text-violet-400">DC</span>
            </span>
        </div>
    );
}

// Animated Logo with Glow
export function ArchillesLogoAnimated({ size = 40, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            <div className="relative">
                <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArchillesIcon size={size} className="relative" />
            </div>
            <span
                style={{ fontSize: size * 0.55 }}
                className="font-bold"
            >
                <span className="text-white">Archilles</span>
                <span className="text-violet-400 group-hover:text-violet-300 transition-colors">DC</span>
            </span>
        </div>
    );
}

// Minimal Icon (no gradient, single color)
export function ArchillesIconMinimal({ size = 40, className = "", color = "currentColor" }: LogoProps & { color?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="4" y="4" width="56" height="56" rx="12" fill={color} />
            <path
                d="M32 16 L18 48 L24 48 L27 40 L37 40 L40 48 L46 48 L32 16Z M32 24 L35.5 36 L28.5 36 L32 24Z"
                fill="white"
            />
        </svg>
    );
}

// CSS Variables for Brand Colors
export const brandColors = {
    violet: {
        50: "#f0f0ff",
        100: "#e0e0ff",
        200: "#c4b5fd",
        300: "#a78bfa",
        400: "#8b5cf6",
        500: "#7c3aed",
        600: "#6d28d9",
        700: "#5b21b6",
    },
    background: "#0a0a0f",
    surface: "#12121a",
    surfaceElevated: "#1a1a24",
    border: "#2a2a3a",
    textPrimary: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    accentCyan: "#22d3ee",
    accentEmerald: "#10b981",
    accentAmber: "#f59e0b",
    accentRose: "#f43f5e",
};

export default {
    ArchillesIcon,
    ArchillesLogo,
    ArchillesLogoAnimated,
    ArchillesIconMinimal,
    brandColors,
};
