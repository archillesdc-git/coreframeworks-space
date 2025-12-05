import Link from "next/link";

export const metadata = {
    title: "CLI Commands - ArchillesDC Docs",
    description: "Complete reference for ArchillesDC CLI commands",
};

export default function CliPage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">CLI Commands</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Complete reference for all ArchillesDC CLI commands.
            </p>

            <h2>Create Command</h2>
            <p>Create a new ArchillesDC project:</p>
            <pre>{`archillesdc create [project-name] [options]
# or
npx create-archillesdc-app [project-name] [options]`}</pre>

            <h3>Options</h3>
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                        <th>Default</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>-y, --yes</code></td><td>Skip prompts, use defaults</td><td>-</td></tr>
                    <tr><td><code>-t, --template</code></td><td>Template type</td><td>full-system</td></tr>
                    <tr><td><code>--db</code></td><td>Database provider</td><td>sqlite</td></tr>
                    <tr><td><code>--auth</code></td><td>Auth provider</td><td>discord</td></tr>
                    <tr><td><code>--pm</code></td><td>Package manager</td><td>npm</td></tr>
                    <tr><td><code>--no-examples</code></td><td>Skip example code</td><td>-</td></tr>
                    <tr><td><code>--no-install</code></td><td>Skip installing deps</td><td>-</td></tr>
                </tbody>
            </table>

            <hr className="my-12 border-[var(--color-border)]" />

            <h2>Generate Command</h2>
            <p>Generate code within an existing project. Alias: <code>g</code></p>
            <pre>{`archillesdc generate <type> <name> [options]
archillesdc g <type> <name> [options]`}</pre>

            <h3 id="generate-page">generate page</h3>
            <p>Generate a new page with layout:</p>
            <pre>{`archillesdc generate page <name> [options]`}</pre>
            <table>
                <thead>
                    <tr><th>Option</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>-r, --route</code></td><td>Custom route path</td></tr>
                    <tr><td><code>-p, --protected</code></td><td>Add authentication guard</td></tr>
                    <tr><td><code>-a, --admin</code></td><td>Add admin role guard</td></tr>
                </tbody>
            </table>
            <p><strong>Examples:</strong></p>
            <pre>{`# Basic page
archillesdc g page dashboard

# Protected page
archillesdc g page settings --protected

# Admin-only page
archillesdc g page users --admin

# Custom route
archillesdc g page UserProfile --route user/profile`}</pre>

            <p><strong>Creates:</strong></p>
            <pre>{`src/app/(dashboard)/<route>/
├── page.tsx       # Page component
└── loading.tsx    # Loading state`}</pre>

            <h3 id="generate-crud">generate crud</h3>
            <p>Generate full CRUD with model, API, components, and page:</p>
            <pre>{`archillesdc generate crud <name> [options]`}</pre>
            <table>
                <thead>
                    <tr><th>Option</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>-f, --fields</code></td><td>Model fields (e.g., "name:string,price:number")</td></tr>
                    <tr><td><code>--no-page</code></td><td>Skip page generation</td></tr>
                    <tr><td><code>--no-api</code></td><td>Skip API generation</td></tr>
                </tbody>
            </table>
            <p><strong>Field Types:</strong></p>
            <table>
                <thead>
                    <tr><th>Type</th><th>Prisma</th><th>Example</th></tr>
                </thead>
                <tbody>
                    <tr><td>string</td><td>String</td><td>name:string</td></tr>
                    <tr><td>number</td><td>Int</td><td>quantity:number</td></tr>
                    <tr><td>float</td><td>Float</td><td>price:float</td></tr>
                    <tr><td>boolean</td><td>Boolean</td><td>active:boolean</td></tr>
                    <tr><td>date</td><td>DateTime</td><td>publishedAt:date</td></tr>
                    <tr><td>text</td><td>String @db.Text</td><td>content:text</td></tr>
                    <tr><td>json</td><td>Json</td><td>metadata:json</td></tr>
                </tbody>
            </table>
            <p><strong>Examples:</strong></p>
            <pre>{`# Product CRUD
archillesdc g crud products -f "name:string,price:float,inStock:boolean"

# Blog post CRUD
archillesdc g crud posts -f "title:string,content:text,published:boolean"

# User profile (API only)
archillesdc g crud profiles -f "bio:text,avatar:string" --no-page`}</pre>

            <p><strong>Creates:</strong></p>
            <pre>{`prisma/schema.prisma          # Adds model
src/server/api/routers/<name>.ts   # tRPC router
src/components/<name>/
├── <name>-list.tsx            # List component
├── <name>-form.tsx            # Form component
└── index.ts                   # Exports
src/app/(dashboard)/<names>/
└── page.tsx                   # Management page`}</pre>

            <h3 id="generate-api">generate api</h3>
            <p>Generate a tRPC router with CRUD operations:</p>
            <pre>{`archillesdc generate api <name> [options]`}</pre>
            <table>
                <thead>
                    <tr><th>Option</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>-f, --fields</code></td><td>Fields for input validation</td></tr>
                </tbody>
            </table>
            <p><strong>Example:</strong></p>
            <pre>{`archillesdc g api orders -f "customerId:string,total:number,status:string"`}</pre>

            <h3 id="generate-module">generate module</h3>
            <p>Generate a complete feature module (same as CRUD):</p>
            <pre>{`archillesdc generate module <name> [options]`}</pre>
            <p><strong>Example:</strong></p>
            <pre>{`archillesdc g module inventory -f "sku:string,quantity:number,location:string"`}</pre>

            <h3 id="generate-component">generate component</h3>
            <p>Generate a React component:</p>
            <pre>{`archillesdc generate component <name> [options]`}</pre>
            <table>
                <thead>
                    <tr><th>Option</th><th>Description</th><th>Default</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>-t, --type</code></td><td>Component type (ui, layout, form)</td><td>ui</td></tr>
                </tbody>
            </table>
            <p><strong>Examples:</strong></p>
            <pre>{`archillesdc g component DataCard -t ui
archillesdc g component PageHeader -t layout
archillesdc g component ContactForm -t form`}</pre>

            <hr className="my-12 border-[var(--color-border)]" />

            <h2>After Generating</h2>
            <p>Don't forget to:</p>
            <ol>
                <li>Update <code>src/server/api/root.ts</code> to include new routers</li>
                <li>Run <code>npm run db:push</code> for new models</li>
                <li>Add navigation links to your sidebar</li>
            </ol>

            <div className="not-prose mt-12 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div>
                    <h4 className="font-semibold text-white">Need more help?</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Check out the troubleshooting guide
                    </p>
                </div>
                <Link
                    href="/docs/troubleshooting"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-primary-500)] px-6 font-medium text-white hover:bg-[var(--color-primary-600)] transition-colors"
                >
                    Troubleshooting →
                </Link>
            </div>
        </article>
    );
}
