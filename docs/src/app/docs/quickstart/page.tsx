import Link from "next/link";

export const metadata = {
    title: "Quickstart - ArchillesDC Docs",
    description: "Build your first feature with ArchillesDC in 5 minutes",
};

export default function QuickstartPage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">Quickstart</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Build your first full-stack feature in under 5 minutes.
            </p>

            <div className="not-prose mb-8 rounded-xl border-l-4 border-[var(--color-primary-500)] bg-[var(--color-surface)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-white">Prerequisites:</strong> Make sure you've completed the{" "}
                    <Link href="/docs/installation" className="text-[var(--color-primary-400)]">installation</Link> steps.
                </p>
            </div>

            <h2>Step 1: Create Your Project</h2>
            <pre>{`npx create-archillesdc-app my-blog -y`}</pre>

            <h2>Step 2: Set Up Environment</h2>
            <pre>{`cd my-blog
cp .env.example .env`}</pre>

            <p>Edit your <code>.env</code> file:</p>
            <pre>{`# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-super-secret-key"

# Get from Discord Developer Portal
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"`}</pre>

            <h2>Step 3: Initialize Database</h2>
            <pre>{`npm run db:push`}</pre>

            <h2>Step 4: Generate a Feature</h2>
            <p>Let's create a complete "Posts" feature with CRUD:</p>
            <pre>{`npx archillesdc generate crud posts -f "title:string,content:text,published:boolean"`}</pre>

            <p>This generates:</p>
            <ul>
                <li>✅ Prisma model with fields</li>
                <li>✅ tRPC router with CRUD operations</li>
                <li>✅ List and Form components</li>
                <li>✅ Management page at <code>/posts</code></li>
            </ul>

            <h2>Step 5: Add Router to Root</h2>
            <p>Open <code>src/server/api/root.ts</code> and add:</p>
            <pre>{`import { postsRouter } from "./routers/posts";

export const appRouter = createTRPCRouter({
  post: postRouter,
  posts: postsRouter,  // Add this line
});`}</pre>

            <h2>Step 6: Update Database</h2>
            <pre>{`npm run db:push`}</pre>

            <h2>Step 7: Start Dev Server</h2>
            <pre>{`npm run dev`}</pre>

            <h2>Step 8: Test Your Feature</h2>
            <ol>
                <li>Open <code>http://localhost:3000</code></li>
                <li>Sign in with Discord</li>
                <li>Navigate to <code>/posts</code></li>
                <li>Create, edit, and delete posts!</li>
            </ol>

            <h2>🎉 Congratulations!</h2>
            <p>You've built a full-stack feature with:</p>
            <ul>
                <li>Type-safe database queries (Prisma)</li>
                <li>Type-safe API (tRPC)</li>
                <li>Authentication (NextAuth.js)</li>
                <li>Pre-styled components (Tailwind)</li>
            </ul>

            <h2>Next Steps</h2>
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Link
                    href="/docs/concepts/structure"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">📁 Project Structure</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Understand how the project is organized
                    </p>
                </Link>
                <Link
                    href="/docs/modules/auth"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">🔐 Auth Module</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Learn about roles, guards, and permissions
                    </p>
                </Link>
                <Link
                    href="/docs/cli"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">⚡ CLI Commands</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Explore all generator commands
                    </p>
                </Link>
                <Link
                    href="/docs/modules/ui"
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-primary-500)]/50 transition-all"
                >
                    <h3 className="font-semibold text-white mb-2">🎨 UI Components</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Browse all pre-built components
                    </p>
                </Link>
            </div>
        </article>
    );
}
