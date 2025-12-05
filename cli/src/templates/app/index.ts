import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateAppFiles(options: ProjectOptions): Promise<void> {
    const { projectPath, projectName, includeExampleCode, authProvider } = options;

    await Promise.all([
        generateRootLayout(projectPath, projectName),
        generateHomePage(projectPath, includeExampleCode),
        generateLoginPage(projectPath, authProvider),
        generateRegisterPage(projectPath, authProvider),
        generateDashboardLayout(projectPath),
        generateDashboardPage(projectPath, includeExampleCode),
        generateErrorPage(projectPath),
        generateNotFoundPage(projectPath),
        generateLoadingPage(projectPath),
    ]);
}

async function generateRootLayout(projectPath: string, projectName: string): Promise<void> {
    const content = `import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "${projectName}",
    template: \`%s | ${projectName}\`,
  },
  description: "Built with the ArchillesDC stack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={\`\${geistSans.variable} \${geistMono.variable}\`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface-0 font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "layout.tsx"), content);
}

async function generateHomePage(projectPath: string, includeExampleCode: boolean): Promise<void> {
    const content = `import Link from "next/link";
import { auth } from "@/server/auth";
${includeExampleCode ? `import { api, HydrateClient } from "@/trpc/server";` : ""}

export default async function HomePage() {
  const session = await auth();
  ${includeExampleCode ? `const hello = await api.post.hello({ text: "from tRPC" });` : ""}

  return (
    ${includeExampleCode ? "<HydrateClient>" : "<>"}
      <main className="relative min-h-screen overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-0 via-brand-950/50 to-surface-0" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo/Brand */}
            <div className="mb-8 animate-fade-in-down">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-sm text-white/70">
                  Full-Stack Framework
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl animate-fade-in-up">
              <span className="text-gradient">Build Amazing Apps</span>
              <br />
              <span className="text-white">Faster Than Ever</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-lg text-white/60 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              A production-ready full-stack template with Next.js, Tailwind CSS,
              Prisma, tRPC, and authentication built-in.
            </p>

            ${includeExampleCode ? `{/* tRPC Demo */}
            <p className="mb-8 text-brand-400 animate-fade-in-up stagger-2">
              {hello.greeting}
            </p>` : ""}

            {/* Auth Status & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              {session ? (
                <>
                  <span className="text-white/70">
                    Welcome, <span className="text-white font-medium">{session.user?.name}</span>
                  </span>
                  <Link href="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                  <Link href="/api/auth/signout" className="btn-secondary">
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-primary">
                    Get Started
                  </Link>
                  <Link
                    href="https://github.com"
                    target="_blank"
                    className="btn-secondary"
                  >
                    View on GitHub
                  </Link>
                </>
              )}
            </div>

            {/* Feature Cards */}
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <FeatureCard
                title="Type-Safe APIs"
                description="End-to-end typesafety with tRPC and Zod validation."
                delay="stagger-3"
              />
              <FeatureCard
                title="Authentication"
                description="NextAuth.js integration with multiple providers."
                delay="stagger-4"
              />
              <FeatureCard
                title="Database Ready"
                description="Prisma ORM with migrations and type-safe queries."
                delay="stagger-5"
              />
            </div>
          </div>
        </div>
      </main>
    ${includeExampleCode ? "</HydrateClient>" : "</>"}
  );
}

function FeatureCard({
  title,
  description,
  delay,
}: {
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div className={\`card card-hover animate-fade-in-up \${delay}\`}>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "page.tsx"), content);
}

async function generateLoginPage(projectPath: string, authProvider: string): Promise<void> {
    const isCredentials = authProvider === "credentials";

    const content = `import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/server/auth";
${isCredentials ? `import { LoginForm } from "@/components/forms/login-form";` : ""}

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-0 via-brand-950/30 to-surface-0" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60">Sign in to your account to continue</p>
          </div>

${isCredentials ? `
          <LoginForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface-100 px-2 text-white/40">or</span>
            </div>
          </div>
` : ""}

          {/* OAuth Providers */}
          <div className="space-y-3">
${getOAuthButton(authProvider)}
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{" "}
            <Link href="/register" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "(auth)", "login", "page.tsx"), content);
}

function getOAuthButton(authProvider: string): string {
    if (authProvider === "none") {
        return `            <p className="text-center text-white/40 text-sm py-4">
              Configure an auth provider to enable sign in
            </p>`;
    }

    const providers: Record<string, { icon: string; name: string }> = {
        discord: {
            icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>`,
            name: "Discord",
        },
        github: {
            icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>`,
            name: "GitHub",
        },
        google: {
            icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>`,
            name: "Google",
        },
        credentials: {
            icon: "",
            name: "",
        },
    };

    if (authProvider === "credentials") {
        return "";
    }

    const provider = providers[authProvider] || providers.discord;

    return `            <form
              action={async () => {
                "use server";
                await signIn("${authProvider}", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="btn-secondary w-full"
              >
                ${provider.icon}
                Continue with ${provider.name}
              </button>
            </form>`;
}

async function generateRegisterPage(projectPath: string, authProvider: string): Promise<void> {
    const isCredentials = authProvider === "credentials";

    const content = `import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
${isCredentials ? `import { RegisterForm } from "@/components/forms/register-form";` : ""}

export const metadata = {
  title: "Sign Up",
};

export default async function RegisterPage() {
  const session = await auth();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-0 via-brand-950/30 to-surface-0" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/60">Get started with your new account</p>
          </div>

${isCredentials ? `
          <RegisterForm />
` : `
          <p className="text-center text-white/60 py-8">
            Sign up using one of the options on the login page.
          </p>
`}

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "(auth)", "register", "page.tsx"), content);
}

async function generateDashboardLayout(projectPath: string): Promise<void> {
    const content = `import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col">
        <Header user={session.user} />
        <main className="flex-1 p-6 bg-surface-0">
          {children}
        </main>
      </div>
    </div>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "(dashboard)", "layout.tsx"), content);
}

async function generateDashboardPage(projectPath: string, includeExampleCode: boolean): Promise<void> {
    const content = `${includeExampleCode ? `import { api } from "@/trpc/server";
import { CreatePostForm } from "@/app/_components/create-post-form";
import { PostList } from "@/app/_components/post-list";` : ""}

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
${includeExampleCode ? `
  // Prefetch posts for hydration
  await api.post.getAll.prefetch();
` : ""}

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-1">
          Welcome to your dashboard. Here's an overview of your activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Posts" value="0" change="+0%" />
        <StatCard title="Published" value="0" change="+0%" />
        <StatCard title="Drafts" value="0" change="+0%" />
        <StatCard title="Views" value="0" change="+0%" />
      </div>

${includeExampleCode ? `
      {/* Create Post */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Create New Post</h2>
        <CreatePostForm />
      </div>

      {/* Posts List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Your Posts</h2>
        <PostList />
      </div>
` : `
      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <p className="text-white/60">Add your dashboard content here.</p>
      </div>
`}
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  const isPositive = change.startsWith("+");
  
  return (
    <div className="card">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className={\`text-sm mt-1 \${isPositive ? "text-green-400" : "text-red-400"}\`}>
        {change} from last month
      </p>
    </div>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "(dashboard)", "page.tsx"), content);
}

async function generateErrorPage(projectPath: string): Promise<void> {
    const content = `"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong!
        </h1>
        <p className="text-white/60 mb-6 max-w-md">
          An unexpected error occurred. Please try again later or contact
          support if the problem persists.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-white/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "error.tsx"), content);
}

async function generateNotFoundPage(projectPath: string): Promise<void> {
    const content = `import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/60 mb-6 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </main>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "not-found.tsx"), content);
}

async function generateLoadingPage(projectPath: string): Promise<void> {
    const content = `export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
`;

    await fs.writeFile(path.join(projectPath, "src", "app", "loading.tsx"), content);
}
