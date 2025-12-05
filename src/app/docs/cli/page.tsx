import Link from "next/link";
import { CommandCopy } from "--/components/ui/command-copy";

export const metadata = {
    title: "CLI Commands - ArchillesDC Docs",
    description: "Complete reference for ArchillesDC CLI commands",
};

export default function CliPage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">CLI Commands</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Complete reference for all ArchillesDC CLI commands.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Create Command</h2>
            <p className="text-gray-400 mb-4">Create a new ArchillesDC project:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`archillesdc create [project-name] [options]
# or
npx create-archillesdc-app [project-name] [options]`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Options</h3>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Option</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                            <th className="px-4 py-3 font-medium">Default</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-y, --yes</td><td className="px-4 py-3">Skip prompts, use defaults</td><td className="px-4 py-3 text-gray-500">-</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-t, --template</td><td className="px-4 py-3">Template type</td><td className="px-4 py-3 text-gray-500">full-system</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--db</td><td className="px-4 py-3">Database provider</td><td className="px-4 py-3 text-gray-500">sqlite</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--auth</td><td className="px-4 py-3">Auth provider</td><td className="px-4 py-3 text-gray-500">discord</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--pm</td><td className="px-4 py-3">Package manager</td><td className="px-4 py-3 text-gray-500">npm</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-examples</td><td className="px-4 py-3">Skip example code</td><td className="px-4 py-3 text-gray-500">-</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-install</td><td className="px-4 py-3">Skip installing deps</td><td className="px-4 py-3 text-gray-500">-</td></tr>
                    </tbody>
                </table>
            </div>

            <hr className="my-12 border-white/10" />

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Generate Command</h2>
            <p className="text-gray-400 mb-4">Generate code within an existing project. Alias: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">g</code></p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`archillesdc generate <type> <name> [options]
archillesdc g <type> <name> [options]`}</pre>
            </div>

            <h3 id="generate-page" className="text-xl font-semibold mt-8 mb-4 text-white">generate page</h3>
            <p className="text-gray-400 mb-4">Generate a new page with layout:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">archillesdc generate page &lt;name&gt; [options]</pre>
            </div>

            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Option</th><th className="px-4 py-3 font-medium">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-r, --route</td><td className="px-4 py-3">Custom route path</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-p, --protected</td><td className="px-4 py-3">Add authentication guard</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-a, --admin</td><td className="px-4 py-3">Add admin role guard</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="text-white font-medium mb-2">Examples:</p>
            <div className="space-y-4 mb-8">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Basic page</p>
                    <CommandCopy command="archillesdc g page dashboard" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Protected page</p>
                    <CommandCopy command="archillesdc g page settings --protected" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Admin-only page</p>
                    <CommandCopy command="archillesdc g page users --admin" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Custom route</p>
                    <CommandCopy command="archillesdc g page UserProfile --route user/profile" />
                </div>
            </div>

            <p className="text-white font-medium mb-2">Creates:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`src/app/(dashboard)/<route>/
├── page.tsx       # Page component
└── loading.tsx    # Loading state`}</pre>
            </div>

            <h3 id="generate-crud" className="text-xl font-semibold mt-8 mb-4 text-white">generate crud</h3>
            <p className="text-gray-400 mb-4">Generate full CRUD with model, API, components, and page:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">archillesdc generate crud &lt;name&gt; [options]</pre>
            </div>

            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Option</th><th className="px-4 py-3 font-medium">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-f, --fields</td><td className="px-4 py-3">Model fields (e.g., "name:string,price:number")</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-page</td><td className="px-4 py-3">Skip page generation</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">--no-api</td><td className="px-4 py-3">Skip API generation</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="text-white font-medium mb-2">Field Types:</p>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Prisma</th><th className="px-4 py-3 font-medium">Example</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">string</td><td className="px-4 py-3">String</td><td className="px-4 py-3 font-mono text-sm">name:string</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">number</td><td className="px-4 py-3">Int</td><td className="px-4 py-3 font-mono text-sm">quantity:number</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">float</td><td className="px-4 py-3">Float</td><td className="px-4 py-3 font-mono text-sm">price:float</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">boolean</td><td className="px-4 py-3">Boolean</td><td className="px-4 py-3 font-mono text-sm">active:boolean</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">date</td><td className="px-4 py-3">DateTime</td><td className="px-4 py-3 font-mono text-sm">publishedAt:date</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">text</td><td className="px-4 py-3">String @db.Text</td><td className="px-4 py-3 font-mono text-sm">content:text</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">json</td><td className="px-4 py-3">Json</td><td className="px-4 py-3 font-mono text-sm">metadata:json</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="text-white font-medium mb-2">Examples:</p>
            <div className="space-y-4 mb-8">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Product CRUD</p>
                    <CommandCopy command='archillesdc g crud products -f "name:string,price:float,inStock:boolean"' />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Blog post CRUD</p>
                    <CommandCopy command='archillesdc g crud posts -f "title:string,content:text,published:boolean"' />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">User profile (API only)</p>
                    <CommandCopy command='archillesdc g crud profiles -f "bio:text,avatar:string" --no-page' />
                </div>
            </div>

            <p className="text-white font-medium mb-2">Creates:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`prisma/schema.prisma          # Adds model
src/server/api/routers/<name>.ts   # tRPC router
src/components/<name>/
├── <name>-list.tsx            # List component
├── <name>-form.tsx            # Form component
└── index.ts                   # Exports
src/app/(dashboard)/<names>/
└── page.tsx                   # Management page`}</pre>
            </div>

            <h3 id="generate-api" className="text-xl font-semibold mt-8 mb-4 text-white">generate api</h3>
            <p className="text-gray-400 mb-4">Generate a tRPC router with CRUD operations:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">archillesdc generate api &lt;name&gt; [options]</pre>
            </div>

            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Option</th><th className="px-4 py-3 font-medium">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-f, --fields</td><td className="px-4 py-3">Fields for input validation</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="text-white font-medium mb-2">Example:</p>
            <div className="mb-8">
                <CommandCopy command='archillesdc g api orders -f "customerId:string,total:number,status:string"' />
            </div>

            <h3 id="generate-module" className="text-xl font-semibold mt-8 mb-4 text-white">generate module</h3>
            <p className="text-gray-400 mb-4">Generate a complete feature module (same as CRUD):</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">archillesdc generate module &lt;name&gt; [options]</pre>
            </div>
            <p className="text-white font-medium mb-2">Example:</p>
            <div className="mb-8">
                <CommandCopy command='archillesdc g module inventory -f "sku:string,quantity:number,location:string"' />
            </div>

            <h3 id="generate-component" className="text-xl font-semibold mt-8 mb-4 text-white">generate component</h3>
            <p className="text-gray-400 mb-4">Generate a React component:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">archillesdc generate component &lt;name&gt; [options]</pre>
            </div>

            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Option</th><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 font-medium">Default</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">-t, --type</td><td className="px-4 py-3">Component type (ui, layout, form)</td><td className="px-4 py-3 text-gray-500">ui</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="text-white font-medium mb-2">Examples:</p>
            <div className="space-y-4 mb-8">
                <div>
                    <p className="text-xs text-gray-500 mb-1">UI Component</p>
                    <CommandCopy command="archillesdc g component DataCard -t ui" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Layout Component</p>
                    <CommandCopy command="archillesdc g component PageHeader -t layout" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Form Component</p>
                    <CommandCopy command="archillesdc g component ContactForm -t form" />
                </div>
            </div>

            <hr className="my-12 border-white/10" />

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">After Generating</h2>
            <p className="text-gray-400 mb-4">Don't forget to:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li>Update <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">src/server/api/root.ts</code> to include new routers</li>
                <li>Run <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">npm run db:push</code> for new models</li>
                <li>Add navigation links to your sidebar</li>
            </ol>

            <div className="mt-12 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-6 not-prose">
                <div>
                    <h4 className="font-semibold text-white">Need more help?</h4>
                    <p className="text-sm text-gray-400">
                        Check out the troubleshooting guide
                    </p>
                </div>
                <Link
                    href="/docs/troubleshooting"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-6 font-medium text-white hover:bg-violet-700 transition-colors"
                >
                    Troubleshooting →
                </Link>
            </div>
        </article>
    );
}
