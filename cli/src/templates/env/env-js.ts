import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateEnvJs(options: ProjectOptions): Promise<void> {
    const { projectPath, authProvider } = options;

    const content = `import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These variables are only available on the server
   */
  server: {
    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    
    // Node environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Authentication
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1, "AUTH_SECRET is required in production")
        : z.string().optional(),
${getAuthEnvSchema(authProvider)}
  },

  /**
   * Client-side environment variables schema
   * Prefix with NEXT_PUBLIC_ to expose to the client
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  /**
   * Runtime environment variables
   * Destructure process.env for edge runtime compatibility
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
${getAuthEnvRuntime(authProvider)}
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation during build with SKIP_ENV_VALIDATION=1
   * Useful for Docker builds
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined
   */
  emptyStringAsUndefined: true,
});
`;

    await fs.writeFile(path.join(projectPath, "src", "env.js"), content);
}

function getAuthEnvSchema(authProvider: string): string {
    switch (authProvider) {
        case "discord":
            return `
    // Discord OAuth
    AUTH_DISCORD_ID: z.string().min(1, "AUTH_DISCORD_ID is required"),
    AUTH_DISCORD_SECRET: z.string().min(1, "AUTH_DISCORD_SECRET is required"),`;
        case "github":
            return `
    // GitHub OAuth
    AUTH_GITHUB_ID: z.string().min(1, "AUTH_GITHUB_ID is required"),
    AUTH_GITHUB_SECRET: z.string().min(1, "AUTH_GITHUB_SECRET is required"),`;
        case "google":
            return `
    // Google OAuth
    AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID is required"),
    AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET is required"),`;
        case "credentials":
            return `
    // Credentials auth - no additional secrets needed`;
        default:
            return "";
    }
}

function getAuthEnvRuntime(authProvider: string): string {
    switch (authProvider) {
        case "discord":
            return `    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,`;
        case "github":
            return `    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,`;
        case "google":
            return `    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,`;
        default:
            return "";
    }
}
