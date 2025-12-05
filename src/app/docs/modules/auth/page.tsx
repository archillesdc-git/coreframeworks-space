export const metadata = {
    title: "Auth Module - ArchillesDC Docs",
    description: "Complete authentication guide with roles and permissions",
};

export default function AuthModulePage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">Auth Module</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Built-in authentication with OAuth providers, credentials, roles, and permissions.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Overview</h2>
            <p className="text-gray-400 mb-4">The Auth Module provides:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li><strong className="text-white">Multiple OAuth providers</strong> (Discord, GitHub, Google)</li>
                <li><strong className="text-white">Email/Password authentication</strong></li>
                <li><strong className="text-white">Role-based access control</strong> (RBAC)</li>
                <li><strong className="text-white">Session management</strong></li>
                <li><strong className="text-white">Middleware and route guards</strong></li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Configuration</h2>
            <p className="text-gray-400 mb-4">Auth is configured in <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">src/server/auth/config.ts</code>:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import { db } from "@/server/db";

export const authConfig = {
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
  },
};`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">User Roles</h2>
            <p className="text-gray-400 mb-4">Four built-in roles with hierarchy:</p>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Level</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">user</td><td className="px-4 py-3">1</td><td className="px-4 py-3">Default role for new users</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">moderator</td><td className="px-4 py-3">2</td><td className="px-4 py-3">Can moderate content</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">admin</td><td className="px-4 py-3">3</td><td className="px-4 py-3">Full admin access</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">superadmin</td><td className="px-4 py-3">4</td><td className="px-4 py-3">Complete system access</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Getting the Session</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Server Components</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { auth } from "@/server/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    return <p>Please sign in</p>;
  }

  return <p>Hello, {session.user.name}!</p>;
}`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Client Components</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`"use client";
import { useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  return <p>Logged in as {session.user.email}</p>;
}`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Protecting Routes</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using RoleGuard Component</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { RoleGuard } from "@/components/auth/role-guard";

export default async function AdminPage() {
  return (
    <RoleGuard requiredRole="admin" fallbackUrl="/dashboard">
      <AdminPanel />
    </RoleGuard>
  );
}`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Using Middleware</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`// middleware.ts
import { authMiddleware } from "@/lib/auth-middleware";

export default authMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Protected tRPC Routes</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { protectedProcedure, adminProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Requires authentication
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.userId },
    });
  }),

  // Requires admin role
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Server Actions</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { signIn, signOut } from "@/server/auth";

// Sign in with provider
export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/dashboard" });
}

// Sign out
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Helper Functions</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { getCurrentUser, requireAuth, requireRole } from "@/server/auth";

// Get current user or null
const user = await getCurrentUser();

// Throw if not authenticated
const userId = await requireAuth();

// Check if user has role
const isAdmin = await requireRole("admin");`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Environment Variables</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Required
AUTH_SECRET="your-secret-key"

# Discord (optional)
AUTH_DISCORD_ID="your-client-id"
AUTH_DISCORD_SECRET="your-client-secret"

# GitHub (optional)
AUTH_GITHUB_ID="your-client-id"
AUTH_GITHUB_SECRET="your-client-secret"

# Google (optional)
AUTH_GOOGLE_ID="your-client-id"
AUTH_GOOGLE_SECRET="your-client-secret"`}</pre>
            </div>
        </article>
    );
}
