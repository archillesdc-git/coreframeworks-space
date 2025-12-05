import Link from "next/link";
import { CommandCopy } from "--/components/ui/command-copy";
import { auth } from "--/server/auth";

const FEATURES = [
  {
    icon: "⚡",
    title: "Next.js 15",
    description: "App Router, Server Components, and the latest React 19 features for blazing fast apps.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: "🎨",
    title: "Tailwind CSS v4",
    description: "Utility-first CSS with design tokens, modern theming, and beautiful defaults.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: "🗃️",
    title: "Prisma ORM",
    description: "Type-safe database access with migrations, seeding, and studio for easy management.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: "🔌",
    title: "tRPC",
    description: "End-to-end type-safe APIs without code generation. Full TypeScript inference.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: "🔐",
    title: "NextAuth.js v5",
    description: "Multi-provider authentication with sessions, roles, and permissions built-in.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "📦",
    title: "Pre-built Components",
    description: "Beautiful, accessible UI components ready to use. Buttons, Cards, Modals, and more.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const TEMPLATES = [
  { icon: "🏢", name: "Full System", description: "Complete app with everything", color: "bg-violet-500/20 border-violet-500/30" },
  { icon: "⚙️", name: "Admin", description: "Admin panel with data tables", color: "bg-cyan-500/20 border-cyan-500/30" },
  { icon: "📊", name: "Dashboard", description: "User dashboard with widgets", color: "bg-emerald-500/20 border-emerald-500/30" },
  { icon: "📦", name: "Barebones", description: "Minimal setup to start fresh", color: "bg-amber-500/20 border-amber-500/30" },
];

const STATS = [
  { value: "10+", label: "Components" },
  { value: "4", label: "Templates" },
  { value: "5", label: "Auth Providers" },
  { value: "3", label: "Databases" },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <span className="text-xl font-bold">A</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ArchillesDC
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="https://github.com/archillesdc" className="text-sm text-gray-400 hover:text-white transition-colors">
              GitHub
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="h-10 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-medium flex items-center hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="h-10 px-5 rounded-lg bg-white/10 border border-white/10 text-sm font-medium flex items-center hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-400">v1.0.0 — Production Ready</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
              Build Full-Stack
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Apps in Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12">
            A powerful CLI and framework that scaffolds production-ready Next.js applications
            with authentication, database, APIs, and beautiful pre-styled components.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/docs/quickstart"
              className="group h-14 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold flex items-center gap-2 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all"
            >
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="h-14 px-8 rounded-xl bg-white/5 border border-white/10 font-semibold flex items-center hover:bg-white/10 transition-all"
            >
              Read Documentation
            </Link>
          </div>

          {/* Install Command */}
          <CommandCopy command="npx create-archillesdc-app my-app" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A complete toolkit for building modern web applications with the best developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 text-2xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Template</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Start with a pre-configured template that matches your project needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.name}
                className={`p-6 rounded-2xl border ${template.color} text-center hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-5xl mb-4">{template.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-400">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Powerful
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> Generators</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Generate pages, CRUD operations, APIs, and components with a single command.
                Everything is type-safe and follows best practices.
              </p>
              <ul className="space-y-4">
                {[
                  "Generate full CRUD with Prisma + tRPC",
                  "Auto-create pages with loading states",
                  "Pre-styled form and list components",
                  "Type-safe API routers with validation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-sm">
                      ✓
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-[#12121a] border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-gray-500">Terminal</span>
                </div>
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>
                    {`$ archillesdc generate crud products \\
    -f "name:string,price:number"

`}<span className="text-emerald-400">✔</span>{` Adding Prisma model...
`}<span className="text-emerald-400">✔</span>{` Generating tRPC router...
`}<span className="text-emerald-400">✔</span>{` Generating components...
`}<span className="text-emerald-400">✔</span>{` Generating page...

`}<span className="text-gray-500">Generated:</span>{`
  └─ prisma/schema.prisma
  └─ src/server/api/routers/products.ts
  └─ src/components/products/
  └─ src/app/(dashboard)/products/`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Create your first project in under a minute
            </p>
            <CommandCopy
              command="npx create-archillesdc-app my-app"
              className="mb-8 bg-[#0a0a0f]"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs/quickstart"
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold flex items-center hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Start Building
              </Link>
              <Link
                href="/docs"
                className="h-12 px-8 rounded-xl bg-white/10 border border-white/10 font-semibold flex items-center hover:bg-white/20 transition-all"
              >
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-sm">A</span>
            </div>
            <span className="font-semibold">ArchillesDC</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with ❤️ for developers who love great DX
          </p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="https://github.com/archillesdc" className="text-sm text-gray-400 hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
