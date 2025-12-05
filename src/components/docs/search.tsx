"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DOCS_NAV } from "--/config/docs";

type NavItem = {
    title: string;
    href: string;
    category: string;
};

// Flatten the nav for searching
const allLinks: NavItem[] = DOCS_NAV.flatMap((section) =>
    section.items.map((item) => ({
        ...item,
        category: section.title,
    }))
);

export function DocsSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredLinks = query
        ? allLinks.filter((link) =>
            link.title.toLowerCase().includes(query.toLowerCase()) ||
            link.category.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search docs..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Results Dropdown */}
            {isOpen && query && (
                <div className="absolute top-full mt-2 left-0 w-80 rounded-xl border border-white/10 bg-[#12121a] shadow-2xl overflow-hidden z-50">
                    <div className="max-h-[300px] overflow-y-auto py-2">
                        {filteredLinks.length > 0 ? (
                            filteredLinks.map((link) => (
                                <Link
                                    key={link.href + link.title} // Ensure unique key
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                                        {link.title}
                                    </div>
                                    <div className="text-xs text-gray-500 group-hover:text-gray-400">
                                        {link.category}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No results found for "{query}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
