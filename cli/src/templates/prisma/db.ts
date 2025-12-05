import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateDbConnection(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const content = `import { env } from "@/env";
import { PrismaClient } from "../../generated/prisma";

/**
 * Create a new Prisma client instance with appropriate logging
 */
const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

/**
 * Global variable to hold the Prisma client in development
 * This prevents multiple instances during hot reloading
 */
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

/**
 * Export the database client
 * Uses global instance in development to prevent connection issues
 */
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
`;

    await fs.writeFile(path.join(projectPath, "src", "server", "db.ts"), content);
}
