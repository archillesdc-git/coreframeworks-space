import Link from "next/link";

const DOCS_NAV = [
    {
        title: "Getting Started",
        items: [
            { title: "Introduction", href: "/docs" },
            { title: "Installation", href: "/docs/installation" },
            { title: "Quickstart", href: "/docs/quickstart" },
        ],
    },
    {
        title: "Concepts",
        items: [
            { title: "Project Structure", href: "/docs/concepts/structure" },
            { title: "Authentication", href: "/docs/concepts/auth" },
            { title: "Database", href: "/docs/concepts/database" },
            { title: "API (tRPC)", href: "/docs/concepts/api" },
        ],
    },
    {
        title: "Modules",
        items: [
            { title: "Auth Module", href: "/docs/modules/auth" },
            { title: "Database Module", href: "/docs/modules/database" },
            { title: "UI Module", href: "/docs/modules/ui" },
            { title: "API Module", href: "/docs/modules/api" },
        ],
    },
    {
        title: "Templates",
        items: [
            { title: "Full System", href: "/docs/templates/full-system" },
            { title: "Admin Dashboard", href: "/docs/templates/admin" },
            { title: "Dashboard", href: "/docs/templates/dashboard" },
            { title: "Barebones", href: "/docs/templates/barebones" },
        ],
    },
    {
        title: "CLI Reference",
        items: [
            { title: "Commands", href: "/docs/cli" },
            { title: "Generate Page", href: "/docs/cli/generate-page" },
            { title: "Generate CRUD", href: "/docs/cli/generate-crud" },
            { title: "Generate API", href: "/docs/cli/generate-api" },
        ],
    },
    {
        title: "Help",
        items: [
            { title: "Troubleshooting", href: "/docs/troubleshooting" },
            { title: "FAQ", href: "/docs/faq" },
        ],
    },
];

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl">
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]">
                            <span className="font-bold text-white">A</span>
                        </div>
                        <span className="font-bold text-white">ArchillesDC</span>
                        <span className="text-xs text-[var(--color-text-muted)] ml-2">Docs</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search docs..."
                                className="h-9 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-4 text-sm text-white placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:outline-none"
                            />
                            <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
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
                        <Link
                            href="https://github.com/archillesdc/core-framework"
                            className="text-[var(--color-text-secondary)] hover:text-white"
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
                <aside className="fixed top-16 left-0 bottom-0 w-64 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-background)] p-6">
                    <nav className="space-y-8">
                        {DOCS_NAV.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                    {section.title}
                                </h4>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="block rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-white transition-colors"
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
                <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-4xl mx-auto px-8 py-12">
                        {children}
                    </div>
                </main>

                {/* Table of Contents */}
                <aside className="hidden xl:block fixed top-16 right-0 bottom-0 w-64 overflow-y-auto border-l border-[var(--color-border)] p-6">
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        On this page
                    </h4>
                    <div className="text-sm text-[var(--color-text-muted)]">
                        {/* TOC will be generated dynamically */}
                    </div>
                </aside>
            </div>
        </div>
    );
}
