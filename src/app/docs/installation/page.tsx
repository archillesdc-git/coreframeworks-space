import Link from "next/link";
import { CommandCopy } from "--/components/ui/command-copy";

export const metadata = {
    title: "Installation - ArchillesDC Docs",
    description: "Install ArchillesDC CLI and create your first project",
};

export default function InstallationPage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">Installation</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Get up and running with ArchillesDC in minutes.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Prerequisites</h2>
            <p className="text-gray-400 mb-4">Before you begin, ensure you have the following installed:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li><strong className="text-white">Node.js</strong> - v18.17 or later</li>
                <li><strong className="text-white">npm, pnpm, yarn, or bun</strong> - Any package manager</li>
                <li><strong className="text-white">Git</strong> - For version control (optional)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Create a New Project</h2>
            <p className="text-gray-400 mb-4">The fastest way to get started is using our CLI:</p>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using npx (Recommended)</h3>
            <div className="mb-8">
                <CommandCopy command="npx create-archillesdc-app my-app" />
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using pnpm</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">pnpm create archillesdc-app my-app</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using yarn</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">yarn create archillesdc-app my-app</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using bun</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">bun create archillesdc-app my-app</pre>
            </div>

            <h2 id="interactive-setup" className="scroll-mt-20 text-2xl font-bold mt-12 mb-6 text-white">Interactive Setup</h2>
            <p className="text-gray-400 mb-4">When you run the CLI, you'll be guided through several options:</p>

            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Option</th>
                            <th className="px-4 py-3 font-medium">Choices</th>
                            <th className="px-4 py-3 font-medium">Default</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Template</td>
                            <td className="px-4 py-3">Full System, Admin, Dashboard, Barebones</td>
                            <td className="px-4 py-3">Full System</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Database</td>
                            <td className="px-4 py-3">SQLite, PostgreSQL, MySQL</td>
                            <td className="px-4 py-3">SQLite</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Auth Provider</td>
                            <td className="px-4 py-3">Discord, GitHub, Google, Credentials, None</td>
                            <td className="px-4 py-3">Discord</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Components</td>
                            <td className="px-4 py-3">UI Essentials, Feedback, Navigation, etc.</td>
                            <td className="px-4 py-3">All</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium text-white">Package Manager</td>
                            <td className="px-4 py-3">npm, pnpm, yarn, bun</td>
                            <td className="px-4 py-3">npm</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Quick Mode</h2>
            <p className="text-gray-400 mb-4">Skip all prompts and use defaults:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">npx create-archillesdc-app my-app -y</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">With Options</h2>
            <p className="text-gray-400 mb-4">Specify options directly:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`npx create-archillesdc-app my-app \\
  --template admin \\
  --db postgresql \\
  --auth github \\
  --pm pnpm`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">CLI Options</h2>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Option</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-y, --yes</td><td className="px-4 py-3">Skip prompts, use defaults</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-t, --template</td><td className="px-4 py-3">Template type</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--db</td><td className="px-4 py-3">Database provider</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--auth</td><td className="px-4 py-3">Authentication provider</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--pm</td><td className="px-4 py-3">Package manager</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-examples</td><td className="px-4 py-3">Skip example code</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-install</td><td className="px-4 py-3">Skip dependency installation</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">After Installation</h2>
            <p className="text-gray-400 mb-4">Once your project is created:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Navigate to your project
cd my-app

# Set up environment variables
cp .env.example .env
# Edit .env with your secrets

# Push database schema
npm run db:push

# Start the development server
npm run dev`}</pre>
            </div>

            <p className="text-gray-400">Your app is now running at <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">http://localhost:3000</code>!</p>

            <div className="mt-12 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-6 not-prose">
                <div>
                    <h4 className="font-semibold text-white">Next step</h4>
                    <p className="text-sm text-gray-400">
                        Follow the quickstart guide to build your first feature
                    </p>
                </div>
                <Link
                    href="/docs/quickstart"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-6 font-medium text-white hover:bg-violet-700 transition-colors"
                >
                    Quickstart →
                </Link>
            </div>
        </article>
    );
}
