export const metadata = {
    title: "Auth Module - ArchillesDC Docs",
    description: "Complete authentication guide with roles and permissions",
};

export default function AuthModulePage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">Auth Module</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Built-in authentication with OAuth providers, credentials, roles, and permissions.
            </p>

            <h2>Overview</h2>
            <p>The Auth Module provides:</p>
            <ul>
                <li>Multiple OAuth providers (Discord, GitHub, Google)</li>
                <li>Email/Password authentication</li>
                <li>Role-based access control (RBAC)</li>
                <li>Session management</li>
                <li>Middleware and route guards</li>
            </ul>

            <h2>Configuration</h2>
            <p>Auth is configured in <code>src/server/auth/config.ts</code>:</p>
            <pre>{`import { PrismaAdapter } from "@auth/prisma-adapter";
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

            <h2>User Roles</h2>
            <p>Four built-in roles with hierarchy:</p>
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Level</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>user</code></td><td>1</td><td>Default role for new users</td></tr>
                    <tr><td><code>moderator</code></td><td>2</td><td>Can moderate content</td></tr>
                    <tr><td><code>admin</code></td><td>3</td><td>Full admin access</td></tr>
                    <tr><td><code>superadmin</code></td><td>4</td><td>Complete system access</td></tr>
                </tbody>
            </table>

            <h2>Getting the Session</h2>

            <h3>Server Components</h3>
            <pre>{`import { auth } from "@/server/auth";

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    return <p>Please sign in</p>;
  }

  return <p>Hello, {session.user.name}!</p>;
}`}</pre>

            <h3>Client Components</h3>
            <pre>{`"use client";
import { useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  return <p>Logged in as {session.user.email}</p>;
}`}</pre>

            <h2>Protecting Routes</h2>

            <h3>Using RoleGuard Component</h3>
            <pre>{`import { RoleGuard } from "@/components/auth/role-guard";

export default async function AdminPage() {
  return (
    <RoleGuard requiredRole="admin" fallbackUrl="/dashboard">
      <AdminPanel />
    </RoleGuard>
  );
}`}</pre>

            <h3>Using Middleware</h3>
            <pre>{`// middleware.ts
import { authMiddleware } from "@/lib/auth-middleware";

export default authMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}</pre>

            <h2>Protected tRPC Routes</h2>
            <pre>{`import { protectedProcedure, adminProcedure } from "@/server/api/trpc";

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

            <h2>Server Actions</h2>
            <pre>{`import { signIn, signOut } from "@/server/auth";

// Sign in with provider
export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/dashboard" });
}

// Sign out
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}`}</pre>

            <h2>Helper Functions</h2>
            <pre>{`import { getCurrentUser, requireAuth, requireRole } from "@/server/auth";

// Get current user or null
const user = await getCurrentUser();

// Throw if not authenticated
const userId = await requireAuth();

// Check if user has role
const isAdmin = await requireRole("admin");`}</pre>

            <h2>Environment Variables</h2>
            <pre>{`# Required
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
        </article>
    );
}
