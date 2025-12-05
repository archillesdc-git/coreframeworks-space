import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateAuthFiles(options: ProjectOptions): Promise<void> {
  const { projectPath, authProvider } = options;

  await Promise.all([
    generateAuthConfig(projectPath, authProvider),
    generateAuthIndex(projectPath),
    generateAuthRoute(projectPath),
    generateAuthMiddleware(projectPath),
    generateRoleGuard(projectPath),
    generateAuthActions(projectPath, authProvider),
    generateAuthTypes(projectPath),
  ]);
}

async function generateAuthConfig(projectPath: string, authProvider: string): Promise<void> {
  const content = `import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
${getProviderImports(authProvider)}

import { db } from "@/server/db";
import type { UserRole } from "@/types/auth";

/**
 * Module augmentation for NextAuth types
 * Adds custom properties to session and user objects
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    emailVerified: Date | null;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole;
    emailVerified: Date | null;
  }
}

/**
 * NextAuth.js configuration
 * Handles authentication, sessions, and callbacks
 */
export const authConfig = {
  providers: [
${getProviderConfig(authProvider)}
  ],
  
  adapter: PrismaAdapter(db),
  
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/onboarding",
  },

  callbacks: {
    /**
     * Called when a session is checked
     * Adds user ID and role to session
     */
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role || "user",
        emailVerified: user.emailVerified,
      },
    }),

    /**
     * Controls if a user is allowed to sign in
     * Add custom logic here (e.g., check if email is verified)
     */
    signIn: async ({ user, account, profile }) => {
      // Allow sign in by default
      // Add custom checks here:
      // - Check if user is banned
      // - Check if email domain is allowed
      // - Check if account is active
      return true;
    },

    /**
     * Called when a redirect happens
     * Customize redirect behavior after sign in/out
     */
    redirect: async ({ url, baseUrl }) => {
      // Allow relative URLs
      if (url.startsWith("/")) return \`\${baseUrl}\${url}\`;
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    /**
     * Called when a new user is created
     */
    createUser: async ({ user }) => {
      console.log("[Auth] New user created:", user.email);
      // Add custom logic:
      // - Send welcome email
      // - Create default settings
      // - Track analytics
    },

    /**
     * Called when a user signs in
     */
    signIn: async ({ user, account, isNewUser }) => {
      console.log("[Auth] User signed in:", user.email, isNewUser ? "(new)" : "");
    },

    /**
     * Called when a user signs out
     */
    signOut: async ({ session, token }) => {
      console.log("[Auth] User signed out");
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

/**
 * Helper to check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
    superadmin: 4,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
`;

  await fs.writeFile(path.join(projectPath, "src", "server", "auth", "config.ts"), content);
}

function getProviderImports(authProvider: string): string {
  switch (authProvider) {
    case "discord":
      return `import Discord from "next-auth/providers/discord";`;
    case "github":
      return `import GitHub from "next-auth/providers/github";`;
    case "google":
      return `import Google from "next-auth/providers/google";`;
    case "credentials":
      return `import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";`;
    default:
      return `// Add your auth provider imports here`;
  }
}

function getProviderConfig(authProvider: string): string {
  switch (authProvider) {
    case "discord":
      return `    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),`;
    case "github":
      return `    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),`;
    case "google":
      return `    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),`;
    case "credentials":
      return `    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email("Invalid email"),
            password: z.string().min(8, "Password must be at least 8 characters"),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials format");
        }

        const { email, password } = parsedCredentials.data;
        
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),`;
    default:
      return `    // Add your auth providers here
    // Example:
    // Discord({ clientId: "...", clientSecret: "..." }),`;
  }
}

async function generateAuthIndex(projectPath: string): Promise<void> {
  const content = `import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig, hasRole } from "./config";
import type { UserRole } from "@/types/auth";

// Initialize NextAuth
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

/**
 * Cached auth function for React Server Components
 * Prevents multiple auth checks in the same request
 */
const auth = cache(uncachedAuth);

/**
 * Get current user session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Check if current user has required role
 */
export async function requireRole(role: UserRole): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  return hasRole(session.user.role, role);
}

/**
 * Get user ID or throw if not authenticated
 * Use in protected routes/actions
 */
export async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export { auth, handlers, signIn, signOut, hasRole };
`;

  await fs.writeFile(path.join(projectPath, "src", "server", "auth", "index.ts"), content);
}

async function generateAuthRoute(projectPath: string): Promise<void> {
  const content = `import { handlers } from "@/server/auth";

export const { GET, POST } = handlers;
`;

  await fs.writeFile(
    path.join(projectPath, "src", "app", "api", "auth", "[...nextauth]", "route.ts"),
    content
  );
}

async function generateAuthMiddleware(projectPath: string): Promise<void> {
  const content = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/server/auth";

/**
 * Authentication middleware
 * Protects routes and handles redirects
 */

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/settings", "/admin"];

// Routes that are only for non-authenticated users
const authRoutes = ["/login", "/register", "/forgot-password"];

// Admin-only routes
const adminRoutes = ["/admin"];

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role || "user";

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth-only (login, register)
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access
  if (isAdminRoute && userRole !== "admin" && userRole !== "superadmin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - static files
     * - _next (Next.js internals)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
`;

  await fs.writeFile(path.join(projectPath, "src", "lib", "auth-middleware.ts"), content);
}

async function generateRoleGuard(projectPath: string): Promise<void> {
  const content = `import { redirect } from "next/navigation";
import { auth, hasRole } from "@/server/auth";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackUrl?: string;
}

/**
 * Server Component to protect pages based on authentication and role
 * 
 * @example
 * // Require authentication only
 * <RoleGuard>
 *   <ProtectedContent />
 * </RoleGuard>
 * 
 * @example
 * // Require admin role
 * <RoleGuard requiredRole="admin" fallbackUrl="/dashboard">
 *   <AdminContent />
 * </RoleGuard>
 */
export async function RoleGuard({
  children,
  requiredRole = "user",
  fallbackUrl = "/login",
}: RoleGuardProps) {
  const session = await auth();

  // Not authenticated
  if (!session?.user) {
    redirect(fallbackUrl);
  }

  // Check role hierarchy
  if (!hasRole(session.user.role, requiredRole)) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}

/**
 * HOC to protect pages based on role
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: UserRole = "user",
  fallbackUrl: string = "/login"
) {
  return async function GuardedComponent(props: P) {
    const session = await auth();

    if (!session?.user) {
      redirect(fallbackUrl);
    }

    if (!hasRole(session.user.role, requiredRole)) {
      redirect("/unauthorized");
    }

    return <Component {...props} />;
  };
}
`;

  // Also create the auth components directory if it doesn't exist
  await fs.ensureDir(path.join(projectPath, "src", "components", "auth"));

  await fs.writeFile(path.join(projectPath, "src", "components", "auth", "role-guard.tsx"), content);
}

async function generateAuthActions(projectPath: string, authProvider: string): Promise<void> {
  const isCredentials = authProvider === "credentials";

  const content = `"use server";

import { signIn, signOut } from "@/server/auth";
import { redirect } from "next/navigation";
${isCredentials ? `import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";` : ""}

/**
 * Server Actions for Authentication
 * These are secure server-side functions for handling auth
 */

/**
 * Sign in with OAuth provider
 */
export async function signInWithProvider(provider: string, redirectTo?: string) {
  await signIn(provider, { redirectTo: redirectTo || "/dashboard" });
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

${isCredentials ? `
/**
 * User registration schema
 */
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Register a new user
 */
export async function registerUser(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate input
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid input",
      };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    await db.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[Auth] Registration error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithCredentials(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("[Auth] Sign in error:", error);
    return {
      success: false,
      error: "Invalid email or password",
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }

    // TODO: Generate reset token and send email
    // const token = crypto.randomUUID();
    // await db.passwordResetToken.create({ ... });
    // await sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error("[Auth] Password reset error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return { success: false, error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("[Auth] Password update error:", error);
    return { success: false, error: "Failed to update password" };
  }
}
` : `
/**
 * OAuth-only auth - no credentials functions needed
 * Add these if you enable credentials auth later
 */
`}
`;

  await fs.writeFile(path.join(projectPath, "src", "server", "auth", "actions.ts"), content);
}

async function generateAuthTypes(projectPath: string): Promise<void> {
  const content = `/**
 * Authentication Types
 */

/**
 * User roles with hierarchy
 * superadmin > admin > moderator > user
 */
export type UserRole = "user" | "moderator" | "admin" | "superadmin";

/**
 * Permission types
 */
export type Permission = 
  | "read:users"
  | "write:users"
  | "delete:users"
  | "read:posts"
  | "write:posts"
  | "delete:posts"
  | "manage:settings"
  | "manage:roles";

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: ["read:posts"],
  moderator: ["read:posts", "write:posts", "read:users"],
  admin: [
    "read:users",
    "write:users",
    "read:posts",
    "write:posts",
    "delete:posts",
    "manage:settings",
  ],
  superadmin: [
    "read:users",
    "write:users",
    "delete:users",
    "read:posts",
    "write:posts",
    "delete:posts",
    "manage:settings",
    "manage:roles",
  ],
};

/**
 * Check if role has permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Auth session user
 */
export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
}

/**
 * Auth session
 */
export interface AuthSession {
  user: AuthUser;
  expires: string;
}
`;

  await fs.ensureDir(path.join(projectPath, "src", "types"));
  await fs.writeFile(path.join(projectPath, "src", "types", "auth.ts"), content);
}
