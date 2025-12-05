import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ArchillesDC - Full-Stack Framework Documentation",
    description: "Build modern web applications with Next.js, Tailwind CSS, Prisma, tRPC, and NextAuth.js",
    keywords: ["Next.js", "React", "TypeScript", "Prisma", "tRPC", "NextAuth", "Full-Stack"],
    authors: [{ name: "ArchillesDC" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
