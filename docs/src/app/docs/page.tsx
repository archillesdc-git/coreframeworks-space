import Link from "next/link";

export const metadata = {
    title: "Introduction - ArchillesDC Docs",
    description: "Get started with ArchillesDC, a powerful full-stack framework",
};

export default function DocsPage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">Introduction</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                ArchillesDC is a powerful CLI and framework for building production-ready
                full-stack web applications with Next.js, Tailwind CSS, Prisma, tRPC, and NextAuth.js.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <Link
                    href="/docs/installation"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">📦 Installation</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Install the CLI and create your first project
                    </p>
                </Link>
                <Link
                    href="/docs/quickstart"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">🚀 Quickstart</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Build your first app in under 5 minutes
                    </p>
                </Link>
            </div>

            <h2>What's Included?</h2>

            <h3>🔧 Tech Stack</h3>
            <table>
                <thead>
                    <tr>
                        <th>Technology</th>
                        <th>Version</th>
                        <th>Purpose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Next.js</strong></td>
                        <td>15.x</td>
                        <td>React framework with App Router</td>
                    </tr>
                    <tr>
                        <td><strong>Tailwind CSS</strong></td>
                        <td>v4</td>
                        <td>Utility-first CSS framework</td>
                    </tr>
                    <tr>
                        <td><strong>Prisma</strong></td>
                        <td>5.x</td>
                        <td>Type-safe ORM for databases</td>
                    </tr>
                    <tr>
                        <td><strong>tRPC</strong></td>
                        <td>11.x</td>
                        <td>End-to-end type-safe APIs</td>
                    </tr>
                    <tr>
                        <td><strong>NextAuth.js</strong></td>
                        <td>5.x</td>
                        <td>Authentication with multiple providers</td>
                    </tr>
                </tbody>
            </table>

            <h3>📁 Project Structure</h3>
            <pre>{`my-app/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js pages
│   │   ├── (auth)/         # Auth pages
│   │   ├── (dashboard)/    # Protected pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   └── forms/          # Form components
│   ├── server/             # Server-side code
│   │   ├── api/            # tRPC routers
│   │   ├── auth/           # Auth config
│   │   └── db.ts           # Database client
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── utils/              # Helper functions
│   └── types/              # TypeScript types
└── package.json`}</pre>

            <h3>✨ Features</h3>
            <ul>
                <li><strong>4 Templates</strong> - Full System, Admin, Dashboard, Barebones</li>
                <li><strong>Multiple Auth Providers</strong> - Discord, GitHub, Google, Credentials</li>
                <li><strong>Database Support</strong> - SQLite, PostgreSQL, MySQL</li>
                <li><strong>Pre-built Components</strong> - Button, Input, Card, Toast, Modal, Table, and more</li>
                <li><strong>Code Generators</strong> - Generate pages, CRUD, APIs, and components</li>
                <li><strong>Role-based Access</strong> - User, Moderator, Admin, Superadmin</li>
                <li><strong>Error Handling</strong> - Structured logging and error boundaries</li>
            </ul>

            <h2>Quick Example</h2>
            <pre>{`# Create a new project
npx create-archillesdc-app my-app

# Navigate to project
cd my-app

# Set up environment
cp .env.example .env

# Push database schema
npm run db:push

# Start development server
npm run dev`}</pre>

            <div className="not-prose mt-12 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div>
                    <h4 className="font-semibold text-white">Ready to start?</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Follow the installation guide to get started
                    </p>
                </div>
                <Link
                    href="/docs/installation"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-primary-500)] px-6 font-medium text-white hover:bg-[var(--color-primary-600)] transition-colors"
                >
                    Installation →
                </Link>
            </div>
        </article>
    );
}
