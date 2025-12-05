import Link from "next/link";
import { CommandCopy } from "--/components/ui/command-copy";

export const metadata = {
    title: "Introduction - ArchillesDC Docs",
    description: "Get started with ArchillesDC, a powerful full-stack framework",
};

export default function DocsPage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">Introduction</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                ArchillesDC is a powerful CLI and framework for building production-ready
                full-stack web applications with Next.js, Tailwind CSS, Prisma, tRPC, and NextAuth.js.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 not-prose">
                <Link
                    href="/docs/installation"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">📦 Installation</h3>
                    <p className="text-sm text-gray-400">
                        Install the CLI and create your first project
                    </p>
                </Link>
                <Link
                    href="/docs/quickstart"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">🚀 Quickstart</h3>
                    <p className="text-sm text-gray-400">
                        Build your first app in under 5 minutes
                    </p>
                </Link>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">What's Included?</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">🔧 Tech Stack</h3>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Technology</th>
                            <th className="px-4 py-3 font-medium">Version</th>
                            <th className="px-4 py-3 font-medium">Purpose</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Next.js</td>
                            <td className="px-4 py-3">15.x</td>
                            <td className="px-4 py-3">React framework with App Router</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Tailwind CSS</td>
                            <td className="px-4 py-3">v4</td>
                            <td className="px-4 py-3">Utility-first CSS framework</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Prisma</td>
                            <td className="px-4 py-3">5.x</td>
                            <td className="px-4 py-3">Type-safe ORM for databases</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">tRPC</td>
                            <td className="px-4 py-3">11.x</td>
                            <td className="px-4 py-3">End-to-end type-safe APIs</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">NextAuth.js</td>
                            <td className="px-4 py-3">5.x</td>
                            <td className="px-4 py-3">Authentication with multiple providers</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">📁 Project Structure</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">{`my-app/
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
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">✨ Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li><strong className="text-white">4 Templates</strong> - Full System, Admin, Dashboard, Barebones</li>
                <li><strong className="text-white">Multiple Auth Providers</strong> - Discord, GitHub, Google, Credentials</li>
                <li><strong className="text-white">Database Support</strong> - SQLite, PostgreSQL, MySQL</li>
                <li><strong className="text-white">Pre-built Components</strong> - Button, Input, Card, Toast, Modal, Table, and more</li>
                <li><strong className="text-white">Code Generators</strong> - Generate pages, CRUD, APIs, and components</li>
                <li><strong className="text-white">Role-based Access</strong> - User, Moderator, Admin, Superadmin</li>
                <li><strong className="text-white">Error Handling</strong> - Structured logging and error boundaries</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Quick Example</h2>
            <div className="mb-4">
                <p className="text-gray-400 mb-2">Create a new project:</p>
                <CommandCopy command="npx create-archillesdc-app my-app" />
            </div>

            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-12 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">{`# Navigate to project
cd my-app

# Set up environment
cp .env.example .env

# Push database schema
npm run db:push

# Start development server
npm run dev`}</pre>
            </div>

            <div className="mt-12 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-6 not-prose">
                <div>
                    <h4 className="font-semibold text-white">Ready to start?</h4>
                    <p className="text-sm text-gray-400">
                        Follow the installation guide to get started
                    </p>
                </div>
                <Link
                    href="/docs/installation"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-6 font-medium text-white hover:bg-violet-700 transition-colors"
                >
                    Installation →
                </Link>
            </div>
        </article>
    );
}
