import Link from "next/link";
import React from "react";
import { DOCS_NAV } from "--/config/docs";
import { DocsSearch } from "--/components/docs/search";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                            <span className="font-bold text-white">A</span>
                        </div>
                        <span className="font-bold text-white">ArchillesDC</span>
                        <span className="text-xs text-gray-500 ml-2">Docs</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <DocsSearch />
                        </div>
                        <Link
                            href="https://github.com/archillesdc-git"
                            className="text-gray-400 hover:text-white transition-colors"
                            target="_blank"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex pt-16">
                {/* Sidebar */}
                <aside className="fixed top-16 left-0 bottom-0 w-64 overflow-y-auto border-r border-white/10 bg-[#0a0a0f] p-6 hidden lg:block">
                    <nav className="space-y-8">
                        {DOCS_NAV.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    {section.title}
                                </h4>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item.href}
                                                className="block rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-4xl mx-auto px-6 py-12 md:px-8">
                        {children}
                    </div>
                </main>

                {/* Table of Contents - Placeholder for now */}
                <aside className="hidden xl:block fixed top-16 right-0 bottom-0 w-64 overflow-y-auto border-l border-white/10 p-6">
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        On this page
                    </h4>
                    <div className="text-sm text-gray-500">
                        Overview
                    </div>
                </aside>
            </div>
        </div>
    );
}
