import Link from "next/link";

export const metadata = {
    title: "Installation - ArchillesDC Docs",
    description: "Install ArchillesDC CLI and create your first project",
};

export default function InstallationPage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">Installation</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Get up and running with ArchillesDC in minutes.
            </p>

            <h2>Prerequisites</h2>
            <p>Before you begin, ensure you have the following installed:</p>
            <ul>
                <li><strong>Node.js</strong> - v18.17 or later</li>
                <li><strong>npm, pnpm, yarn, or bun</strong> - Any package manager</li>
                <li><strong>Git</strong> - For version control (optional)</li>
            </ul>

            <h2>Create a New Project</h2>
            <p>The fastest way to get started is using our CLI:</p>

            <h3>Using npx (Recommended)</h3>
            <pre>{`npx create-archillesdc-app my-app`}</pre>

            <h3>Using pnpm</h3>
            <pre>{`pnpm create archillesdc-app my-app`}</pre>

            <h3>Using yarn</h3>
            <pre>{`yarn create archillesdc-app my-app`}</pre>

            <h3>Using bun</h3>
            <pre>{`bun create archillesdc-app my-app`}</pre>

            <h2>Interactive Setup</h2>
            <p>When you run the CLI, you'll be guided through several options:</p>

            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Choices</th>
                        <th>Default</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Template</strong></td>
                        <td>Full System, Admin, Dashboard, Barebones</td>
                        <td>Full System</td>
                    </tr>
                    <tr>
                        <td><strong>Database</strong></td>
                        <td>SQLite, PostgreSQL, MySQL</td>
                        <td>SQLite</td>
                    </tr>
                    <tr>
                        <td><strong>Auth Provider</strong></td>
                        <td>Discord, GitHub, Google, Credentials, None</td>
                        <td>Discord</td>
                    </tr>
                    <tr>
                        <td><strong>Components</strong></td>
                        <td>UI Essentials, Feedback, Navigation, etc.</td>
                        <td>All</td>
                    </tr>
                    <tr>
                        <td><strong>Package Manager</strong></td>
                        <td>npm, pnpm, yarn, bun</td>
                        <td>npm</td>
                    </tr>
                </tbody>
            </table>

            <h2>Quick Mode</h2>
            <p>Skip all prompts and use defaults:</p>
            <pre>{`npx create-archillesdc-app my-app -y`}</pre>

            <h2>With Options</h2>
            <p>Specify options directly:</p>
            <pre>{`npx create-archillesdc-app my-app \\
  --template admin \\
  --db postgresql \\
  --auth github \\
  --pm pnpm`}</pre>

            <h2>CLI Options</h2>
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>-y, --yes</code></td><td>Skip prompts, use defaults</td></tr>
                    <tr><td><code>-t, --template</code></td><td>Template type</td></tr>
                    <tr><td><code>--db</code></td><td>Database provider</td></tr>
                    <tr><td><code>--auth</code></td><td>Authentication provider</td></tr>
                    <tr><td><code>--pm</code></td><td>Package manager</td></tr>
                    <tr><td><code>--no-examples</code></td><td>Skip example code</td></tr>
                    <tr><td><code>--no-install</code></td><td>Skip dependency installation</td></tr>
                </tbody>
            </table>

            <h2>After Installation</h2>
            <p>Once your project is created:</p>
            <pre>{`# Navigate to your project
cd my-app

# Set up environment variables
cp .env.example .env
# Edit .env with your secrets

# Push database schema
npm run db:push

# Start the development server
npm run dev`}</pre>

            <p>Your app is now running at <code>http://localhost:3000</code>!</p>

            <div className="not-prose mt-12 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div>
                    <h4 className="font-semibold text-white">Next step</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Follow the quickstart guide to build your first feature
                    </p>
                </div>
                <Link
                    href="/docs/quickstart"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-primary-500)] px-6 font-medium text-white hover:bg-[var(--color-primary-600)] transition-colors"
                >
                    Quickstart →
                </Link>
            </div>
        </article>
    );
}
