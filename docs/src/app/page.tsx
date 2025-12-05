import Link from "next/link";

const NAV_ITEMS = [
    { label: "Docs", href: "/docs" },
    { label: "Quickstart", href: "/docs/quickstart" },
    { label: "CLI", href: "/docs/cli" },
    { label: "GitHub", href: "https://github.com/archillesdc/core-framework", external: true },
];

const FEATURES = [
    {
        icon: "⚡",
        title: "Next.js 15",
        description: "App Router, Server Components, and the latest React features",
    },
    {
        icon: "🎨",
        title: "Tailwind CSS v4",
        description: "Utility-first CSS with design tokens and modern theming",
    },
    {
        icon: "🗃️",
        title: "Prisma ORM",
        description: "Type-safe database access with migrations and seeding",
    },
    {
        icon: "🔌",
        title: "tRPC",
        description: "End-to-end type-safe APIs without code generation",
    },
    {
        icon: "🔐",
        title: "NextAuth.js",
        description: "Multi-provider authentication with roles and permissions",
    },
    {
        icon: "📦",
        title: "Pre-built Components",
        description: "Beautiful, accessible UI components ready to use",
    },
];

const TEMPLATES = [
    { icon: "🏢", name: "Full System", description: "Complete app with everything" },
    { icon: "⚙️", name: "Admin", description: "Admin panel with data tables" },
    { icon: "📊", name: "Dashboard", description: "User dashboard with widgets" },
    { icon: "📦", name: "Barebones", description: "Minimal setup to start fresh" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]">
                                <span className="text-lg font-bold text-white">A</span>
                            </div>
                            <span className="text-lg font-bold text-white">ArchillesDC</span>
                        </Link>

                        <div className="flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
                                    {...(item.external ? { target: "_blank", rel: "noopener" } : {})}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--color-primary-500)]/10 blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--color-accent-cyan)]/10 blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 mb-8">
                        <span className="text-xs font-medium text-[var(--color-primary-400)]">v1.0.0</span>
                        <span className="text-xs text-[var(--color-text-muted)]">•</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">Production Ready</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-white to-[var(--color-text-secondary)] bg-clip-text text-transparent">
                            Build Full-Stack Apps
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-accent-cyan)] bg-clip-text text-transparent">
                            In Minutes
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)] mb-10">
                        A powerful CLI and framework that scaffolds production-ready Next.js applications
                        with authentication, database, APIs, and pre-styled components.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-12">
                        <Link
                            href="/docs/quickstart"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] px-8 font-semibold text-white shadow-lg shadow-[var(--color-primary-500)]/25 hover:shadow-[var(--color-primary-500)]/40 transition-all hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/docs"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 font-semibold text-white hover:bg-[var(--color-surface-elevated)] transition-all"
                        >
                            Documentation
                        </Link>
                    </div>

                    {/* Install Command */}
                    <div className="inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
                        <span className="text-[var(--color-text-muted)]">$</span>
                        <code className="font-mono text-[var(--color-text-primary)]">
                            npx create-archillesdc-app my-app
                        </code>
                        <button className="ml-2 text-[var(--color-text-muted)] hover:text-white transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 border-t border-[var(--color-border)]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                            A complete toolkit for building modern web applications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 hover:bg-[var(--color-surface-elevated)] transition-all"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="py-24 bg-[var(--color-surface)]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Template</h2>
                        <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                            Start with a pre-configured template that matches your project needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEMPLATES.map((template) => (
                            <div
                                key={template.name}
                                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 text-center hover:border-[var(--color-primary-500)]/50 transition-all"
                            >
                                <div className="text-4xl mb-3">{template.icon}</div>
                                <h3 className="font-semibold mb-1">{template.name}</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="py-24 border-t border-[var(--color-border)]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Powerful Generators</h2>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                Generate pages, CRUD operations, APIs, and components with a single command.
                                Everything is type-safe and follows best practices.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Generate full CRUD with Prisma + tRPC",
                                    "Auto-create pages with loading states",
                                    "Pre-styled form and list components",
                                    "Type-safe API routers",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-500)]/20 text-[var(--color-primary-400)]">
                                            ✓
                                        </span>
                                        <span className="text-[var(--color-text-secondary)]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <pre className="text-sm">
                                {`# Generate a complete CRUD module
$ archillesdc generate crud products \\
    -f "name:string,price:number"

✔ Adding Prisma model...
✔ Generating tRPC router...
✔ Generating components...
✔ Generating page...

Generated:
  └─ prisma/schema.prisma
  └─ src/server/api/routers/products.ts
  └─ src/components/products/
  └─ src/app/(dashboard)/products/`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-background)]">
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        Create your first project in under a minute
                    </p>
                    <div className="inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 mb-8">
                        <span className="text-[var(--color-text-muted)]">$</span>
                        <code className="font-mono text-lg">npx create-archillesdc-app my-app</code>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/docs/quickstart"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-primary-500)] px-8 font-semibold text-white hover:bg-[var(--color-primary-600)] transition-all"
                        >
                            Read the Docs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border)] py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-500)]">
                                <span className="font-bold text-white">A</span>
                            </div>
                            <span className="font-semibold">ArchillesDC</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Built with ❤️ for developers who love great DX
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
