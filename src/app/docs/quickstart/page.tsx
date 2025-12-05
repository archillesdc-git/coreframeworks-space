import Link from "next/link";
import { CommandCopy } from "--/components/ui/command-copy";

export const metadata = {
    title: "Quickstart - ArchillesDC Docs",
    description: "Build your first feature with ArchillesDC in 5 minutes",
};

export default function QuickstartPage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">Quickstart</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Build your first full-stack feature in under 5 minutes.
            </p>

            <div className="mb-8 rounded-xl border-l-4 border-violet-500 bg-[#12121a] p-4 not-prose">
                <p className="text-sm text-gray-400">
                    <strong className="text-white">Prerequisites:</strong> Make sure you've completed the{" "}
                    <Link href="/docs/installation" className="text-violet-400 hover:text-violet-300 underline decoration-violet-400/30 underline-offset-2">installation</Link> steps.
                </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 1: Create Your Project</h2>
            <div className="mb-8">
                <CommandCopy command="npx create-archillesdc-app my-blog -y" />
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 2: Set Up Environment</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`cd my-blog
cp .env.example .env`}</pre>
            </div>

            <p className="text-gray-400 mb-4">Edit your <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">.env</code> file:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-super-secret-key"

# Get from Discord Developer Portal
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 3: Initialize Database</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">npm run db:push</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 4: Generate a Feature</h2>
            <p className="text-gray-400 mb-4">Let's create a complete "Posts" feature with CRUD:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">npx archillesdc generate crud posts -f "title:string,content:text,published:boolean"</pre>
            </div>

            <p className="text-gray-400 mb-4">This generates:</p>
            <ul className="list-none space-y-2 text-gray-300 mb-8 ml-4">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✅</span> Prisma model with fields</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✅</span> tRPC router with CRUD operations</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✅</span> List and Form components</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✅</span> Management page at <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">/posts</code></li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 5: Add Router to Root</h2>
            <p className="text-gray-400 mb-4">Open <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">src/server/api/root.ts</code> and add:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { postsRouter } from "./routers/posts";

export const appRouter = createTRPCRouter({
  post: postRouter,
  posts: postsRouter,  // Add this line
});`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 6: Update Database</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">npm run db:push</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 7: Start Dev Server</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">npm run dev</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Step 8: Test Your Feature</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li>Open <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">http://localhost:3000</code></li>
                <li>Sign in with Discord</li>
                <li>Navigate to <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">/posts</code></li>
                <li>Create, edit, and delete posts!</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">🎉 Congratulations!</h2>
            <p className="text-gray-400 mb-4">You've built a full-stack feature with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li><strong className="text-white">Type-safe database queries</strong> (Prisma)</li>
                <li><strong className="text-white">Type-safe API</strong> (tRPC)</li>
                <li><strong className="text-white">Authentication</strong> (NextAuth.js)</li>
                <li><strong className="text-white">Pre-styled components</strong> (Tailwind)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 not-prose">
                <Link
                    href="/docs/concepts/structure"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">📁 Project Structure</h3>
                    <p className="text-sm text-gray-400">
                        Understand how the project is organized
                    </p>
                </Link>
                <Link
                    href="/docs/modules/auth"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">🔐 Auth Module</h3>
                    <p className="text-sm text-gray-400">
                        Learn about roles, guards, and permissions
                    </p>
                </Link>
                <Link
                    href="/docs/cli"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">⚡ CLI Commands</h3>
                    <p className="text-sm text-gray-400">
                        Explore all generator commands
                    </p>
                </Link>
                <Link
                    href="/docs/modules/ui"
                    className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/50 transition-all group"
                >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">🎨 UI Components</h3>
                    <p className="text-sm text-gray-400">
                        Browse all pre-built components
                    </p>
                </Link>
            </div>
        </article>
    );
}
