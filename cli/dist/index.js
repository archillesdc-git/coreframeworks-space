#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import chalk3 from "chalk";
import inquirer from "inquirer";
import ora3 from "ora";
import path23 from "path";
import fs23 from "fs-extra";
import validateProjectName from "validate-npm-package-name";

// src/create-project.ts
import path20 from "path";
import fs20 from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import { execSync } from "child_process";

// src/templates/index.ts
import fs19 from "fs-extra";
import path19 from "path";

// src/templates/base/package-json.ts
import fs from "fs-extra";
import path from "path";
async function generatePackageJson(options) {
  const { projectPath, projectName, database, authProvider, packageManager } = options;
  const packageJson = {
    name: projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      build: "next build",
      check: "next lint && tsc --noEmit",
      "db:generate": "prisma migrate dev",
      "db:migrate": "prisma migrate deploy",
      "db:push": "prisma db push",
      "db:studio": "prisma studio",
      "db:seed": "tsx prisma/seed.ts",
      dev: "next dev --turbo",
      "format:check": 'prettier --check "**/*.{ts,tsx,js,jsx,mdx}" --cache',
      "format:write": 'prettier --write "**/*.{ts,tsx,js,jsx,mdx}" --cache',
      postinstall: "prisma generate",
      lint: "next lint",
      "lint:fix": "next lint --fix",
      preview: "next build && next start",
      start: "next start",
      typecheck: "tsc --noEmit"
    },
    dependencies: {
      "@auth/prisma-adapter": "^2.7.2",
      "@prisma/client": "^6.6.0",
      "@t3-oss/env-nextjs": "^0.12.0",
      "@tanstack/react-query": "^5.69.0",
      "@trpc/client": "^11.0.0",
      "@trpc/react-query": "^11.0.0",
      "@trpc/server": "^11.0.0",
      clsx: "^2.1.1",
      "lucide-react": "^0.460.0",
      next: "^15.2.3",
      "next-auth": "5.0.0-beta.25",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "server-only": "^0.0.1",
      superjson: "^2.2.1",
      "tailwind-merge": "^2.5.4",
      zod: "^3.24.2"
    },
    devDependencies: {
      "@eslint/eslintrc": "^3.3.1",
      "@tailwindcss/postcss": "^4.0.15",
      "@types/node": "^20.14.10",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      eslint: "^9.23.0",
      "eslint-config-next": "^15.2.3",
      postcss: "^8.5.3",
      prettier: "^3.5.3",
      "prettier-plugin-tailwindcss": "^0.6.11",
      prisma: "^6.6.0",
      tailwindcss: "^4.0.15",
      tsx: "^4.19.2",
      typescript: "^5.8.2",
      "typescript-eslint": "^8.27.0"
    }
  };
  if (authProvider === "credentials") {
    packageJson.dependencies["bcryptjs"] = "^2.4.3";
    packageJson.devDependencies["@types/bcryptjs"] = "^2.4.6";
  }
  if (database === "postgresql") {
  } else if (database === "mysql") {
  }
  await fs.writeJSON(path.join(projectPath, "package.json"), packageJson, {
    spaces: 2
  });
}

// src/templates/base/tsconfig.ts
import fs2 from "fs-extra";
import path2 from "path";
async function generateTsConfig(options) {
  const { projectPath } = options;
  const tsconfig = {
    compilerOptions: {
      /* Base Options: */
      esModuleInterop: true,
      skipLibCheck: true,
      target: "es2022",
      allowJs: true,
      resolveJsonModule: true,
      moduleDetection: "force",
      isolatedModules: true,
      verbatimModuleSyntax: true,
      /* Strictness */
      strict: true,
      noUncheckedIndexedAccess: true,
      checkJs: true,
      /* Bundled projects */
      lib: ["dom", "dom.iterable", "ES2022"],
      noEmit: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "preserve",
      plugins: [{ name: "next" }],
      incremental: true,
      /* Path Aliases */
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"]
      }
    },
    include: [
      "next-env.d.ts",
      "**/*.ts",
      "**/*.tsx",
      "**/*.cjs",
      "**/*.js",
      ".next/types/**/*.ts"
    ],
    exclude: ["node_modules", "generated"]
  };
  await fs2.writeJSON(path2.join(projectPath, "tsconfig.json"), tsconfig, {
    spaces: 2
  });
}

// src/templates/base/next-config.ts
import fs3 from "fs-extra";
import path3 from "path";
async function generateNextConfig(options) {
  const { projectPath } = options;
  const content = `/**
 * Run \`build\` or \`dev\` with \`SKIP_ENV_VALIDATION\` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Output standalone build for containerized deployments
  // output: "standalone",

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default config;
`;
  await fs3.writeFile(path3.join(projectPath, "next.config.js"), content);
}

// src/templates/base/env-files.ts
import fs4 from "fs-extra";
import path4 from "path";
async function generateEnvFiles(options) {
  const { projectPath, database, authProvider } = options;
  const envExample = generateEnvExample(database, authProvider);
  const envLocal = generateEnvLocal(database, authProvider);
  await Promise.all([
    fs4.writeFile(path4.join(projectPath, ".env.example"), envExample),
    fs4.writeFile(path4.join(projectPath, ".env"), envLocal)
  ]);
}
function generateEnvExample(database, authProvider) {
  let content = `# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.

# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.

# ===========================================
# App Configuration
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# Database Configuration
# ===========================================
`;
  switch (database) {
    case "sqlite":
      content += `# SQLite (file-based, great for development)
DATABASE_URL="file:./db.sqlite"
`;
      break;
    case "postgresql":
      content += `# PostgreSQL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
`;
      break;
    case "mysql":
      content += `# MySQL
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/mydb"
`;
      break;
  }
  content += `
# ===========================================
# Authentication
# ===========================================
# You can generate a new secret on the command line with:
# npx auth secret
# https://next-auth.js.org/configuration/options#secret
AUTH_SECRET=""

`;
  switch (authProvider) {
    case "discord":
      content += `# Discord OAuth
# Create an app at https://discord.com/developers/applications
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""
`;
      break;
    case "github":
      content += `# GitHub OAuth
# Create an app at https://github.com/settings/developers
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
`;
      break;
    case "google":
      content += `# Google OAuth
# Create credentials at https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
`;
      break;
    case "credentials":
      content += `# Credentials (Email/Password)
# No additional OAuth secrets needed for credentials auth
`;
      break;
    case "none":
      content += `# No authentication configured
# Add your auth provider secrets here when you set up authentication
`;
      break;
  }
  content += `
# ===========================================
# Optional: Third-party Services
# ===========================================
# Add your API keys for external services here
# STRIPE_SECRET_KEY=""
# RESEND_API_KEY=""
# OPENAI_API_KEY=""
`;
  return content;
}
function generateEnvLocal(database, authProvider) {
  let content = `# Local development environment
# DO NOT commit this file to version control

NEXT_PUBLIC_APP_URL="http://localhost:3000"

`;
  switch (database) {
    case "sqlite":
      content += `DATABASE_URL="file:./db.sqlite"
`;
      break;
    case "postgresql":
      content += `DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
`;
      break;
    case "mysql":
      content += `DATABASE_URL="mysql://root:password@localhost:3306/mydb"
`;
      break;
  }
  content += `
# Generate with: npx auth secret
AUTH_SECRET="your-super-secret-key-here-change-in-production"

`;
  switch (authProvider) {
    case "discord":
      content += `AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"
`;
      break;
    case "github":
      content += `AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
`;
      break;
    case "google":
      content += `AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
`;
      break;
  }
  return content;
}

// src/templates/base/gitignore.ts
import fs5 from "fs-extra";
import path5 from "path";
async function generateGitIgnore(options) {
  const { projectPath } = options;
  const content = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# ===========================================
# Dependencies
# ===========================================
node_modules
/.pnp
.pnp.js
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# ===========================================
# Testing
# ===========================================
coverage
.nyc_output

# ===========================================
# Database
# ===========================================
*.sqlite
*.sqlite-journal
*.db
/prisma/*.sqlite
/prisma/*.sqlite-journal

# ===========================================
# Next.js
# ===========================================
.next
out
build
.swc

# ===========================================
# Environment & Secrets
# ===========================================
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem

# ===========================================
# Editor & IDE
# ===========================================
.idea
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
*.swp
*.swo
*~

# ===========================================
# OS Files
# ===========================================
.DS_Store
Thumbs.db
ehthumbs.db
Desktop.ini

# ===========================================
# Logs
# ===========================================
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-debug.log*

# ===========================================
# Build & Cache
# ===========================================
*.tsbuildinfo
.cache
.turbo
dist

# ===========================================
# Vercel
# ===========================================
.vercel

# ===========================================
# Generated Files
# ===========================================
/generated
next-env.d.ts

# ===========================================
# Misc
# ===========================================
*.pid
*.seed
*.pid.lock
`;
  await fs5.writeFile(path5.join(projectPath, ".gitignore"), content);
}

// src/templates/base/eslint-config.ts
import fs6 from "fs-extra";
import path6 from "path";
async function generateEslintConfig(options) {
  const { projectPath } = options;
  const content = `import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: [".next", "generated", "node_modules"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);
`;
  await fs6.writeFile(path6.join(projectPath, "eslint.config.js"), content);
}

// src/templates/base/prettier-config.ts
import fs7 from "fs-extra";
import path7 from "path";
async function generatePrettierConfig(options) {
  const { projectPath } = options;
  const content = `/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
};
`;
  await fs7.writeFile(path7.join(projectPath, "prettier.config.js"), content);
}

// src/templates/base/postcss-config.ts
import fs8 from "fs-extra";
import path8 from "path";
async function generatePostcssConfig(options) {
  const { projectPath } = options;
  const content = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`;
  await fs8.writeFile(path8.join(projectPath, "postcss.config.js"), content);
}

// src/templates/prisma/schema.ts
import fs9 from "fs-extra";
import path9 from "path";
async function generatePrismaSchema(options) {
  const { projectPath, database, template } = options;
  const content = `// ===========================================
// Prisma Schema for ${options.projectName}
// ===========================================
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "${database}"
  url      = env("DATABASE_URL")
}

// ===========================================
// User & Authentication Models
// ===========================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials auth
  role          String    @default("user") // user, moderator, admin, superadmin
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Settings
  settings      Json?     // User preferences/settings
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  ${template === "admin" || template === "full-system" ? `activities    Activity[]
  notifications Notification[]` : ""}

  @@index([email])
  @@index([role])
}

// NextAuth.js Required Models
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String? ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  access_token             String? ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String? ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  session_state            String?
  refresh_token_expires_in Int?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Password Reset Tokens
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())

  @@index([email])
}

// ===========================================
// Content Models
// ===========================================

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String?   ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  excerpt     String?
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  tags        Tag[]
  comments    Comment[]

  @@index([authorId])
  @@index([categoryId])
  @@index([published])
  @@index([slug])
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  color       String?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  posts       Post[]
  
  @@index([slug])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  
  // Timestamps
  createdAt DateTime @default(now())
  
  // Relations
  posts     Post[]
  
  @@index([slug])
}

model Comment {
  id        String   @id @default(cuid())
  content   String   ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  approved  Boolean  @default(false)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  
  // Self-referential for replies
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId  String?
  replies   Comment[] @relation("CommentReplies")

  @@index([authorId])
  @@index([postId])
  @@index([parentId])
}

${template === "admin" || template === "full-system" ? `
// ===========================================
// Admin & Activity Models
// ===========================================

model Activity {
  id          String   @id @default(cuid())
  action      String   // CREATE, UPDATE, DELETE, LOGIN, etc.
  entity      String   // User, Post, etc.
  entityId    String?
  description String?
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  
  // Timestamps
  createdAt   DateTime @default(now())
  
  // Relations
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId      String?

  @@index([userId])
  @@index([entity])
  @@index([createdAt])
}

model Notification {
  id        String   @id @default(cuid())
  type      String   // info, success, warning, error
  title     String
  message   String   ${database === "mysql" || database === "postgresql" ? "@db.Text" : ""}
  read      Boolean  @default(false)
  link      String?
  
  // Timestamps
  createdAt DateTime @default(now())
  readAt    DateTime?
  
  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String

  @@index([userId])
  @@index([read])
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  group     String   @default("general")
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([group])
}
` : ""}

// ===========================================
// Add your custom models below
// ===========================================
`;
  await fs9.writeFile(path9.join(projectPath, "prisma", "schema.prisma"), content);
  await generateSeedFile(projectPath, template);
}
async function generateSeedFile(projectPath, template) {
  const content = `import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * Run with: npm run db:seed
 */
async function main() {
  console.log("\u{1F331} Starting database seed...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "Technology",
        slug: "technology",
        description: "Tech news and updates",
        color: "#3B82F6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: {
        name: "Design",
        slug: "design",
        description: "Design trends and inspiration",
        color: "#EC4899",
      },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: {
        name: "Business",
        slug: "business",
        description: "Business and entrepreneurship",
        color: "#10B981",
      },
    }),
  ]);
  console.log("\u2705 Categories created:", categories.length);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "nextjs" },
      update: {},
      create: { name: "Next.js", slug: "nextjs" },
    }),
    prisma.tag.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react" },
    }),
    prisma.tag.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript" },
    }),
    prisma.tag.upsert({
      where: { slug: "prisma" },
      update: {},
      create: { name: "Prisma", slug: "prisma" },
    }),
  ]);
  console.log("\u2705 Tags created:", tags.length);

${template === "admin" || template === "full-system" ? `
  // Create default settings
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: "site_name" },
      update: {},
      create: {
        key: "site_name",
        value: JSON.stringify("My App"),
        group: "general",
      },
    }),
    prisma.setting.upsert({
      where: { key: "site_description" },
      update: {},
      create: {
        key: "site_description",
        value: JSON.stringify("A modern web application"),
        group: "general",
      },
    }),
    prisma.setting.upsert({
      where: { key: "allow_registration" },
      update: {},
      create: {
        key: "allow_registration",
        value: JSON.stringify(true),
        group: "auth",
      },
    }),
  ]);
  console.log("\u2705 Settings created:", settings.length);
` : ""}

  console.log("\u{1F331} Database seed completed!");
}

main()
  .catch((e) => {
    console.error("\u274C Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
  await fs9.writeFile(path9.join(projectPath, "prisma", "seed.ts"), content);
}

// src/templates/prisma/db.ts
import fs10 from "fs-extra";
import path10 from "path";
async function generateDbConnection(options) {
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
  await fs10.writeFile(path10.join(projectPath, "src", "server", "db.ts"), content);
}

// src/templates/env/env-js.ts
import fs11 from "fs-extra";
import path11 from "path";
async function generateEnvJs(options) {
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
  await fs11.writeFile(path11.join(projectPath, "src", "env.js"), content);
}
function getAuthEnvSchema(authProvider) {
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
function getAuthEnvRuntime(authProvider) {
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

// src/templates/auth/index.ts
import fs12 from "fs-extra";
import path12 from "path";
async function generateAuthFiles(options) {
  const { projectPath, authProvider } = options;
  await Promise.all([
    generateAuthConfig(projectPath, authProvider),
    generateAuthIndex(projectPath),
    generateAuthRoute(projectPath),
    generateAuthMiddleware(projectPath),
    generateRoleGuard(projectPath),
    generateAuthActions(projectPath, authProvider),
    generateAuthTypes(projectPath)
  ]);
}
async function generateAuthConfig(projectPath, authProvider) {
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
  await fs12.writeFile(path12.join(projectPath, "src", "server", "auth", "config.ts"), content);
}
function getProviderImports(authProvider) {
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
function getProviderConfig(authProvider) {
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
async function generateAuthIndex(projectPath) {
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
  await fs12.writeFile(path12.join(projectPath, "src", "server", "auth", "index.ts"), content);
}
async function generateAuthRoute(projectPath) {
  const content = `import { handlers } from "@/server/auth";

export const { GET, POST } = handlers;
`;
  await fs12.writeFile(
    path12.join(projectPath, "src", "app", "api", "auth", "[...nextauth]", "route.ts"),
    content
  );
}
async function generateAuthMiddleware(projectPath) {
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
  await fs12.writeFile(path12.join(projectPath, "src", "lib", "auth-middleware.ts"), content);
}
async function generateRoleGuard(projectPath) {
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
  await fs12.writeFile(path12.join(projectPath, "src", "components", "auth", "role-guard.tsx"), content);
  await fs12.ensureDir(path12.join(projectPath, "src", "components", "auth"));
}
async function generateAuthActions(projectPath, authProvider) {
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
  await fs12.writeFile(path12.join(projectPath, "src", "server", "auth", "actions.ts"), content);
}
async function generateAuthTypes(projectPath) {
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
  await fs12.ensureDir(path12.join(projectPath, "src", "types"));
  await fs12.writeFile(path12.join(projectPath, "src", "types", "auth.ts"), content);
}

// src/templates/trpc/index.ts
import fs13 from "fs-extra";
import path13 from "path";
async function generateTrpcFiles(options) {
  const { projectPath, includeExampleCode, template } = options;
  await Promise.all([
    generateTrpcSetup(projectPath),
    generateTrpcRoot(projectPath, includeExampleCode, template),
    generateTrpcReact(projectPath),
    generateTrpcServer(projectPath),
    generateQueryClient(projectPath),
    generateTrpcRoute(projectPath),
    generateCrudHelper(projectPath),
    ...includeExampleCode ? [
      generatePostRouter(projectPath),
      generateUserRouter(projectPath, template)
    ] : [],
    ...template === "admin" || template === "full-system" ? [
      generateAdminRouter(projectPath)
    ] : []
  ]);
}
async function generateTrpcSetup(projectPath) {
  const content = `/**
 * tRPC Server Configuration
 * 
 * This file contains the core tRPC setup including:
 * - Context creation
 * - Initialization with transformer
 * - Middleware definitions
 * - Procedure definitions (public, protected, admin)
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import type { UserRole } from "@/types/auth";

/**
 * Context Creation
 * Provides access to database, session, and request headers
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    db,
    session,
    userId: session?.user?.id,
    userRole: (session?.user?.role || "user") as UserRole,
    ...opts,
  };
};

/**
 * tRPC Initialization
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        code: error.code,
      },
    };
  },
});

/**
 * Server-side caller factory
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Router factory
 */
export const createTRPCRouter = t.router;

// ===========================================
// Middleware
// ===========================================

/**
 * Timing middleware - logs execution time
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // Artificial delay in dev to catch waterfalls
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  const duration = Date.now() - start;

  console.log(\`[tRPC] \${path} - \${duration}ms\`);

  return result;
});

/**
 * Logging middleware - logs all procedure calls
 */
const loggingMiddleware = t.middleware(async ({ path, type, next, input, ctx }) => {
  const start = Date.now();
  
  const result = await next();
  
  const duration = Date.now() - start;
  const userId = ctx.userId || "anonymous";
  
  console.log(\`[tRPC] \${type} \${path} by \${userId} - \${duration}ms\`);
  
  return result;
});

/**
 * Rate limiting middleware (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const rateLimitMiddleware = t.middleware(async ({ ctx, next, path }) => {
  const key = \`\${ctx.userId || ctx.headers.get("x-forwarded-for") || "anonymous"}:\${path}\`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const current = rateLimitMap.get(key);
  
  if (current) {
    if (now > current.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    } else if (current.count >= maxRequests) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded",
      });
    } else {
      current.count++;
    }
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
  }

  return next();
});

// ===========================================
// Procedures
// ===========================================

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure
  .use(timingMiddleware);

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(loggingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ 
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
        userId: ctx.session.user.id,
        userRole: ctx.session.user.role as UserRole,
      },
    });
  });

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = protectedProcedure
  .use(({ ctx, next }) => {
    if (ctx.userRole !== "admin" && ctx.userRole !== "superadmin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be an admin to perform this action",
      });
    }
    return next();
  });

/**
 * Rate-limited procedure
 */
export const rateLimitedProcedure = publicProcedure
  .use(rateLimitMiddleware);

// ===========================================
// Utility Types
// ===========================================

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
`;
  await fs13.writeFile(path13.join(projectPath, "src", "server", "api", "trpc.ts"), content);
}
async function generateTrpcRoot(projectPath, includeExampleCode, template) {
  const hasAdmin = template === "admin" || template === "full-system";
  const content = `import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
${includeExampleCode ? `import { postRouter } from "@/server/api/routers/post";
import { userRouter } from "@/server/api/routers/user";` : ""}
${hasAdmin ? `import { adminRouter } from "@/server/api/routers/admin";` : ""}

/**
 * Primary tRPC Router
 * 
 * All routers should be added here.
 * @see https://trpc.io/docs/router
 */
export const appRouter = createTRPCRouter({
${includeExampleCode ? `  post: postRouter,
  user: userRouter,` : "  // Add your routers here"}
${hasAdmin ? `  admin: adminRouter,` : ""}
});

// Export type for client
export type AppRouter = typeof appRouter;

/**
 * Server-side caller
 * @example
 * const trpc = createCaller(createContext);
 * const posts = await trpc.post.getAll();
 */
export const createCaller = createCallerFactory(appRouter);
`;
  await fs13.writeFile(path13.join(projectPath, "src", "server", "api", "root.ts"), content);
}
async function generateTrpcReact(projectPath) {
  const content = `"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "@/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  clientQueryClientSingleton ??= createQueryClient();
  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

/**
 * Type helpers for router inputs/outputs
 * @example type CreatePostInput = RouterInputs['post']['create']
 * @example type Post = RouterOutputs['post']['getById']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return \`https://\${process.env.VERCEL_URL}\`;
  return \`http://localhost:\${process.env.PORT ?? 3000}\`;
}
`;
  await fs13.writeFile(path13.join(projectPath, "src", "trpc", "react.tsx"), content);
}
async function generateTrpcServer(projectPath) {
  const content = `import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * Create tRPC context for React Server Components
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
`;
  await fs13.writeFile(path13.join(projectPath, "src", "trpc", "server.ts"), content);
}
async function generateQueryClient(projectPath) {
  const content = `import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
`;
  await fs13.writeFile(path13.join(projectPath, "src", "trpc", "query-client.ts"), content);
}
async function generateTrpcRoute(projectPath) {
  const content = `import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(\`\u274C tRPC failed on \${path ?? "<no-path>"}: \${error.message}\`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
`;
  await fs13.writeFile(
    path13.join(projectPath, "src", "app", "api", "trpc", "[trpc]", "route.ts"),
    content
  );
}
async function generateCrudHelper(projectPath) {
  const content = `import { z } from "zod";
import { TRPCError } from "@trpc/server";

/**
 * CRUD Router Generator Helper
 * 
 * This utility helps create consistent CRUD operations for any model.
 * 
 * @example
 * // In your router file:
 * import { createCrudInputs } from "@/lib/crud-helper";
 * 
 * const { getAll, getById, create, update, delete: deleteSchema } = createCrudInputs({
 *   idField: "id",
 *   createFields: z.object({ name: z.string(), email: z.string().email() }),
 *   updateFields: z.object({ name: z.string().optional(), email: z.string().email().optional() }),
 * });
 */

// Common pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Common sorting schema
export const sortingSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Common filter schema
export const filterSchema = z.object({
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

/**
 * Create standard CRUD input schemas
 */
export function createCrudInputs<T extends z.ZodRawShape>(config: {
  idField?: string;
  createFields: z.ZodObject<T>;
  updateFields: z.ZodObject<Partial<T>>;
  filterFields?: z.ZodRawShape;
}) {
  const { idField = "id", createFields, updateFields, filterFields = {} } = config;

  return {
    // Get all with pagination, sorting, and filtering
    getAll: paginationSchema.merge(sortingSchema).merge(
      z.object(filterFields)
    ),

    // Get single by ID
    getById: z.object({
      [idField]: z.string(),
    }),

    // Create new
    create: createFields,

    // Update existing
    update: z.object({
      [idField]: z.string(),
    }).merge(updateFields),

    // Delete by ID
    delete: z.object({
      [idField]: z.string(),
    }),

    // Bulk delete
    bulkDelete: z.object({
      ids: z.array(z.string()).min(1),
    }),
  };
}

/**
 * Standard error handler for CRUD operations
 */
export function handleCrudError(error: unknown, operation: string): never {
  console.error(\`[CRUD] \${operation} error:\`, error);
  
  if (error instanceof TRPCError) {
    throw error;
  }
  
  if (error instanceof Error) {
    if (error.message.includes("Record to update not found")) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Record not found",
      });
    }
    
    if (error.message.includes("Unique constraint")) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A record with this value already exists",
      });
    }
  }
  
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: \`Failed to \${operation}\`,
  });
}

/**
 * Build pagination response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Build Prisma where clause from filters
 */
export function buildWhereClause<T extends Record<string, unknown>>(
  filters: T,
  searchFields: string[] = []
): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  
  // Handle search
  if (filters.search && searchFields.length > 0) {
    where.OR = searchFields.map((field) => ({
      [field]: {
        contains: filters.search,
        mode: "insensitive",
      },
    }));
  }
  
  // Handle date range
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as Record<string, unknown>).gte = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as Record<string, unknown>).lte = filters.endDate;
    }
  }
  
  return where;
}
`;
  await fs13.writeFile(path13.join(projectPath, "src", "lib", "crud-helper.ts"), content);
}
async function generatePostRouter(projectPath) {
  const content = `import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { paginatedResponse, buildWhereClause } from "@/lib/crud-helper";

/**
 * Post Router - Full CRUD example
 */
export const postRouter = createTRPCRouter({
  /**
   * Get all posts with pagination and filtering
   */
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(50).default(10),
        search: z.string().optional(),
        categoryId: z.string().optional(),
        published: z.boolean().optional(),
        sortBy: z.enum(["createdAt", "title", "publishedAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, categoryId, published, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }
      
      if (categoryId) where.categoryId = categoryId;
      if (published !== undefined) where.published = published;

      const [posts, total] = await Promise.all([
        ctx.db.post.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: true,
            _count: { select: { comments: true } },
          },
        }),
        ctx.db.post.count({ where }),
      ]);

      return paginatedResponse(posts, total, page, limit);
    }),

  /**
   * Get single post by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { slug: input.slug },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
          tags: true,
          comments: {
            where: { approved: true, parentId: null },
            include: {
              author: { select: { id: true, name: true, image: true } },
              replies: {
                where: { approved: true },
                include: {
                  author: { select: { id: true, name: true, image: true } },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  /**
   * Get posts by current user
   */
  getMine: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        ctx.db.post.findMany({
          where: { authorId: ctx.userId },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
            _count: { select: { comments: true } },
          },
        }),
        ctx.db.post.count({ where: { authorId: ctx.userId } }),
      ]);

      return paginatedResponse(posts, total, page, limit);
    }),

  /**
   * Create new post
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required").max(200),
        content: z.string().optional(),
        excerpt: z.string().max(500).optional(),
        categoryId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
        published: z.boolean().default(false),
        coverImage: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, ...data } = input;
      
      // Generate slug from title
      const baseSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      // Ensure unique slug
      let slug = baseSlug;
      let counter = 1;
      while (await ctx.db.post.findUnique({ where: { slug } })) {
        slug = \`\${baseSlug}-\${counter}\`;
        counter++;
      }

      const post = await ctx.db.post.create({
        data: {
          ...data,
          slug,
          authorId: ctx.userId,
          publishedAt: data.published ? new Date() : null,
          tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
        },
        include: {
          category: true,
          tags: true,
        },
      });

      return post;
    }),

  /**
   * Update post
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        content: z.string().optional(),
        excerpt: z.string().max(500).optional().nullable(),
        categoryId: z.string().optional().nullable(),
        tagIds: z.array(z.string()).optional(),
        published: z.boolean().optional(),
        coverImage: z.string().url().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, ...data } = input;

      // Verify ownership
      const existing = await ctx.db.post.findUnique({
        where: { id },
        select: { authorId: true, published: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existing.authorId !== ctx.userId && ctx.userRole !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own posts",
        });
      }

      // Set publishedAt if publishing for first time
      const publishedAt = data.published && !existing.published ? new Date() : undefined;

      const post = await ctx.db.post.update({
        where: { id },
        data: {
          ...data,
          publishedAt,
          tags: tagIds
            ? { set: [], connect: tagIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          category: true,
          tags: true,
        },
      });

      return post;
    }),

  /**
   * Delete post
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (existing.authorId !== ctx.userId && ctx.userRole !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own posts",
        });
      }

      await ctx.db.post.delete({ where: { id: input.id } });

      return { success: true };
    }),

  /**
   * Get categories
   */
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  }),

  /**
   * Get tags
   */
  getTags: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  }),
});
`;
  await fs13.writeFile(path13.join(projectPath, "src", "server", "api", "routers", "post.ts"), content);
}
async function generateUserRouter(projectPath, template) {
  const content = `import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

/**
 * User Router - Profile and settings management
 */
export const userRouter = createTRPCRouter({
  /**
   * Get current user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        settings: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  /**
   * Update current user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50).optional(),
        image: z.string().url().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.userId },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      return user;
    }),

  /**
   * Update user settings
   */
  updateSettings: protectedProcedure
    .input(
      z.object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        emailNotifications: z.boolean().optional(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
        select: { settings: true },
      });

      const currentSettings = (user?.settings as Record<string, unknown>) || {};
      const newSettings = { ...currentSettings, ...input };

      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { settings: newSettings },
      });

      return { success: true };
    }),

  /**
   * Change password (for credentials auth)
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain an uppercase letter")
          .regex(/[a-z]/, "Password must contain a lowercase letter")
          .regex(/[0-9]/, "Password must contain a number"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
        select: { password: true },
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password login not enabled for this account",
        });
      }

      const isValid = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { password: hashedPassword },
      });

      return { success: true };
    }),

  /**
   * Delete own account
   */
  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE MY ACCOUNT") }))
    .mutation(async ({ ctx }) => {
      await ctx.db.user.delete({
        where: { id: ctx.userId },
      });

      return { success: true };
    }),
});
`;
  await fs13.writeFile(path13.join(projectPath, "src", "server", "api", "routers", "user.ts"), content);
}
async function generateAdminRouter(projectPath) {
  const content = `import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  adminProcedure,
} from "@/server/api/trpc";
import { paginatedResponse } from "@/lib/crud-helper";
import type { UserRole } from "@/types/auth";

/**
 * Admin Router - Admin panel operations
 */
export const adminRouter = createTRPCRouter({
  /**
   * Get dashboard stats
   */
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalPosts,
      publishedPosts,
      recentUsers,
    ] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.post.count(),
      ctx.db.post.count({ where: { published: true } }),
      ctx.db.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        recentSignups: recentUsers,
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        drafts: totalPosts - publishedPosts,
      },
    };
  }),

  /**
   * Get all users with pagination
   */
  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(50).default(10),
        search: z.string().optional(),
        role: z.string().optional(),
        sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, role, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }
      
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            lastLoginAt: true,
            emailVerified: true,
            _count: {
              select: { posts: true, comments: true },
            },
          },
        }),
        ctx.db.user.count({ where }),
      ]);

      return paginatedResponse(users, total, page, limit);
    }),

  /**
   * Update user role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "moderator", "admin", "superadmin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent changing own role
      if (input.userId === ctx.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot change your own role",
        });
      }

      // Only superadmin can create admins
      if (
        (input.role === "admin" || input.role === "superadmin") &&
        ctx.userRole !== "superadmin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only superadmins can assign admin roles",
        });
      }

      const user = await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return user;
    }),

  /**
   * Delete user
   */
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot delete your own account from admin panel",
        });
      }

      const targetUser = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Prevent deleting admins unless superadmin
      if (
        (targetUser.role === "admin" || targetUser.role === "superadmin") &&
        ctx.userRole !== "superadmin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only superadmins can delete admin accounts",
        });
      }

      await ctx.db.user.delete({ where: { id: input.userId } });

      return { success: true };
    }),

  /**
   * Get activity logs
   */
  getActivityLogs: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(100).default(20),
        userId: z.string().optional(),
        action: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, userId, action } = input;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (userId) where.userId = userId;
      if (action) where.action = action;

      const [activities, total] = await Promise.all([
        ctx.db.activity.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        }),
        ctx.db.activity.count({ where }),
      ]);

      return paginatedResponse(activities, total, page, limit);
    }),

  /**
   * Get/Update settings
   */
  getSettings: adminProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db.setting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    });

    // Group settings by category
    const grouped = settings.reduce(
      (acc, setting) => {
        if (!acc[setting.group]) {
          acc[setting.group] = {};
        }
        acc[setting.group][setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, Record<string, unknown>>
    );

    return grouped;
  }),

  updateSetting: adminProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.unknown(),
        group: z.string().default("general"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const setting = await ctx.db.setting.upsert({
        where: { key: input.key },
        update: { value: input.value as any },
        create: {
          key: input.key,
          value: input.value as any,
          group: input.group,
        },
      });

      return setting;
    }),
});
`;
  await fs13.writeFile(path13.join(projectPath, "src", "server", "api", "routers", "admin.ts"), content);
}

// src/templates/styles/index.ts
import fs14 from "fs-extra";
import path14 from "path";
async function generateStyleFiles(options) {
  const { projectPath } = options;
  const globalsCSS = `@import "tailwindcss";

/* ===========================================
   CSS Custom Properties (Design Tokens)
   =========================================== */

@theme {
  /* Typography */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, "SF Mono",
    Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Colors - Modern Premium Palette */
  --color-brand-50: oklch(0.97 0.01 250);
  --color-brand-100: oklch(0.93 0.02 250);
  --color-brand-200: oklch(0.87 0.04 250);
  --color-brand-300: oklch(0.78 0.08 250);
  --color-brand-400: oklch(0.68 0.12 250);
  --color-brand-500: oklch(0.55 0.18 250);
  --color-brand-600: oklch(0.48 0.2 250);
  --color-brand-700: oklch(0.4 0.18 250);
  --color-brand-800: oklch(0.33 0.14 250);
  --color-brand-900: oklch(0.27 0.1 250);
  --color-brand-950: oklch(0.18 0.06 250);

  /* Accent Colors */
  --color-accent-50: oklch(0.98 0.01 160);
  --color-accent-500: oklch(0.7 0.15 160);
  --color-accent-600: oklch(0.6 0.18 160);

  /* Surface Colors (Dark Mode Optimized) */
  --color-surface-0: oklch(0.13 0.01 250);
  --color-surface-50: oklch(0.16 0.01 250);
  --color-surface-100: oklch(0.2 0.01 250);
  --color-surface-200: oklch(0.25 0.01 250);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 20px rgb(139 92 246 / 0.3);

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===========================================
   Base Styles
   =========================================== */

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  @apply bg-surface-0 text-white;
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Selection */
::selection {
  @apply bg-brand-500/30;
}

/* Focus styles */
:focus-visible {
  @apply outline-none ring-2 ring-brand-500 ring-offset-2 ring-offset-surface-0;
}

/* ===========================================
   Custom Utilities
   =========================================== */

/* Glassmorphism */
.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}

.glass-dark {
  @apply bg-black/20 backdrop-blur-xl border border-white/5;
}

/* Gradient text */
.text-gradient {
  @apply bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500 bg-clip-text text-transparent;
}

/* Animated gradient background */
.bg-gradient-animated {
  background: linear-gradient(
    -45deg,
    oklch(0.55 0.18 250),
    oklch(0.48 0.2 280),
    oklch(0.6 0.18 200),
    oklch(0.55 0.15 160)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Glow effect */
.glow {
  box-shadow: var(--shadow-glow);
}

.glow-hover {
  transition: box-shadow var(--transition-base);
}

.glow-hover:hover {
  box-shadow: var(--shadow-glow);
}

/* Smooth enter animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in var(--transition-base) ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up var(--transition-slow) ease-out forwards;
}

.animate-fade-in-down {
  animation: fade-in-down var(--transition-slow) ease-out forwards;
}

.animate-scale-in {
  animation: scale-in var(--transition-base) ease-out forwards;
}

/* Stagger delays for lists */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }

/* ===========================================
   Component Base Styles
   =========================================== */

/* Cards */
.card {
  @apply glass rounded-xl p-6 transition-all duration-200;
}

.card-hover {
  @apply hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5;
}

/* Buttons base */
.btn {
  @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none disabled:opacity-50;
}

.btn-primary {
  @apply btn bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700;
}

.btn-secondary {
  @apply btn bg-white/10 text-white hover:bg-white/20 active:bg-white/5;
}

.btn-ghost {
  @apply btn bg-transparent text-white/70 hover:bg-white/10 hover:text-white;
}

.btn-outline {
  @apply btn border border-white/20 bg-transparent text-white hover:bg-white/10;
}

/* Inputs */
.input {
  @apply w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 transition-all duration-200 focus:border-brand-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500/20;
}

/* Labels */
.label {
  @apply text-sm font-medium text-white/70;
}

/* Links */
.link {
  @apply text-brand-400 underline-offset-4 transition-colors hover:text-brand-300 hover:underline;
}

/* ===========================================
   Scrollbar Styles
   =========================================== */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-surface-0;
}

::-webkit-scrollbar-thumb {
  @apply bg-white/20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-white/30;
}
`;
  await fs14.writeFile(path14.join(projectPath, "src", "styles", "globals.css"), globalsCSS);
}

// src/templates/app/index.ts
import fs15 from "fs-extra";
import path15 from "path";
async function generateAppFiles(options) {
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
    generateLoadingPage(projectPath)
  ]);
}
async function generateRootLayout(projectPath, projectName) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "layout.tsx"), content);
}
async function generateHomePage(projectPath, includeExampleCode) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "page.tsx"), content);
}
async function generateLoginPage(projectPath, authProvider) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "(auth)", "login", "page.tsx"), content);
}
function getOAuthButton(authProvider) {
  if (authProvider === "none") {
    return `            <p className="text-center text-white/40 text-sm py-4">
              Configure an auth provider to enable sign in
            </p>`;
  }
  const providers = {
    discord: {
      icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>`,
      name: "Discord"
    },
    github: {
      icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>`,
      name: "GitHub"
    },
    google: {
      icon: `<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>`,
      name: "Google"
    },
    credentials: {
      icon: "",
      name: ""
    }
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
async function generateRegisterPage(projectPath, authProvider) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "(auth)", "register", "page.tsx"), content);
}
async function generateDashboardLayout(projectPath) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "(dashboard)", "layout.tsx"), content);
}
async function generateDashboardPage(projectPath, includeExampleCode) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "(dashboard)", "page.tsx"), content);
}
async function generateErrorPage(projectPath) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "error.tsx"), content);
}
async function generateNotFoundPage(projectPath) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "not-found.tsx"), content);
}
async function generateLoadingPage(projectPath) {
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
  await fs15.writeFile(path15.join(projectPath, "src", "app", "loading.tsx"), content);
}

// src/templates/components/index.ts
import fs16 from "fs-extra";
import path16 from "path";
async function generateComponentFiles(options) {
  const { projectPath, componentGroups, template } = options;
  await generateEssentialComponents(projectPath);
  if (componentGroups.includes("feedback")) {
    await generateFeedbackComponents(projectPath);
  }
  if (componentGroups.includes("navigation")) {
    await generateNavigationComponents(projectPath);
  }
  if (componentGroups.includes("data-display")) {
    await generateDataDisplayComponents(projectPath);
  }
  if (componentGroups.includes("forms")) {
    await generateFormComponents(projectPath);
  }
  if (componentGroups.includes("layout")) {
    await generateLayoutComponents(projectPath);
  }
}
async function generateEssentialComponents(projectPath) {
  const button = `import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
    
    const variants = {
      primary: "bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500",
      secondary: "bg-zinc-700 text-white hover:bg-zinc-600 focus:ring-zinc-500",
      outline: "border border-zinc-600 text-zinc-100 hover:bg-zinc-800 focus:ring-zinc-500",
      ghost: "text-zinc-300 hover:bg-zinc-800 focus:ring-zinc-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "button.tsx"), button);
  const input = `import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\\s/g, "-");
    
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
            error ? "border-red-500" : "border-zinc-700 hover:border-zinc-600",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "input.tsx"), input);
  const card = `import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6",
        variant === "glass"
          ? "border-white/10 bg-white/5 backdrop-blur-xl"
          : "border-zinc-800 bg-zinc-900/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-zinc-100", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-zinc-400", className)} {...props} />;
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "card.tsx"), card);
  const badge = `import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-zinc-700 text-zinc-200",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    error: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
  };

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "badge.tsx"), badge);
  const avatar = `import { cn } from "@/utils/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };

  return (
    <div className={cn("relative rounded-full bg-zinc-700 overflow-hidden", sizes[size], className)} {...props}>
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-zinc-300">
          {fallback || alt?.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "avatar.tsx"), avatar);
  const spinner = `import { cn } from "@/utils/cn";

interface SpinnerProps { size?: "sm" | "md" | "lg"; className?: string; }

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent text-violet-500", sizes[size], className)} />
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "spinner.tsx"), spinner);
  const index = `export * from "./button";
export * from "./input";
export * from "./card";
export * from "./badge";
export * from "./avatar";
export * from "./spinner";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "index.ts"), index);
}
async function generateFeedbackComponents(projectPath) {
  const toast = `"use client";
import { useState, createContext, useContext, useCallback } from "react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast { id: string; message: string; type: ToastType; }

const ToastContext = createContext<{ addToast: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const colors = {
    success: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    error: "bg-red-500/20 border-red-500/50 text-red-300",
    warning: "bg-amber-500/20 border-amber-500/50 text-amber-300",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-300",
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={cn("rounded-lg border px-4 py-3 backdrop-blur-sm animate-in slide-in-from-right", colors[toast.type])}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "toast.tsx"), toast);
  const modal = `"use client";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        {title && <h2 className="mb-4 text-lg font-semibold text-zinc-100">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "modal.tsx"), modal);
}
async function generateNavigationComponents(projectPath) {
  const sidebar = `"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface NavItem { label: string; href: string; icon?: React.ReactNode; }

export function Sidebar({ items, logo }: { items: NavItem[]; logo?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-screen bg-zinc-900 border-r border-zinc-800 transition-all", collapsed ? "w-16" : "w-64")}>
      <div className="flex items-center h-16 px-4 border-b border-zinc-800">
        {!collapsed && logo}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-zinc-400 hover:text-zinc-100">
          {collapsed ? "\u2192" : "\u2190"}
        </button>
      </div>
      <nav className="flex-1 py-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href ? "text-violet-400 bg-violet-500/10" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            {item.icon}
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "layout", "sidebar.tsx"), sidebar);
  const header = `import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps { user?: { name?: string | null; image?: string | null }; }

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <div className="text-lg font-semibold text-zinc-100">Dashboard</div>
      <div className="flex items-center gap-4">
        {user && (
          <Link href="/settings">
            <Avatar src={user.image} alt={user.name || "User"} fallback={user.name?.charAt(0)} />
          </Link>
        )}
      </div>
    </header>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "layout", "header.tsx"), header);
}
async function generateDataDisplayComponents(projectPath) {
  const table = `import { cn } from "@/utils/cn";

interface Column<T> { key: keyof T; header: string; render?: (value: T[keyof T], row: T) => React.ReactNode; }

interface TableProps<T> { data: T[]; columns: Column<T>[]; className?: string; }

export function Table<T extends { id: string }>({ data, columns, className }: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-zinc-800", className)}>
      <table className="w-full text-sm">
        <thead className="bg-zinc-900/50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-medium text-zinc-400">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-800/50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-zinc-300">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "table.tsx"), table);
  const stats = `import { cn } from "@/utils/cn";

interface StatCardProps { title: string; value: string | number; change?: number; icon?: React.ReactNode; }

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{title}</span>
        {icon && <span className="text-zinc-500">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-100">{value}</div>
      {change !== undefined && (
        <div className={cn("mt-1 text-sm", change >= 0 ? "text-emerald-400" : "text-red-400")}>
          {change >= 0 ? "+" : ""}{change}%
        </div>
      )}
    </div>
  );
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "stats.tsx"), stats);
}
async function generateFormComponents(projectPath) {
  const select = `import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface Option { label: string; value: string; }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-100",
          "focus:outline-none focus:ring-2 focus:ring-violet-500",
          error ? "border-red-500" : "border-zinc-700",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "select.tsx"), select);
  const checkbox = `import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\\s/g, "-");
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn("h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-600 focus:ring-violet-500", className)}
          {...props}
        />
        {label && <span className="text-sm text-zinc-300">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "checkbox.tsx"), checkbox);
  const textarea = `import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-100 min-h-[100px]",
          "focus:outline-none focus:ring-2 focus:ring-violet-500",
          error ? "border-red-500" : "border-zinc-700",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "textarea.tsx"), textarea);
}
async function generateLayoutComponents(projectPath) {
  const container = `import { cn } from "@/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ className, size = "lg", children, ...props }: ContainerProps) {
  const sizes = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "max-w-full" };
  return <div className={cn("mx-auto w-full px-4", sizes[size], className)} {...props}>{children}</div>;
}
`;
  await fs16.writeFile(path16.join(projectPath, "src", "components", "ui", "container.tsx"), container);
}

// src/templates/utils/index.ts
import fs17 from "fs-extra";
import path17 from "path";
async function generateUtilsFiles(options) {
  const { projectPath, template } = options;
  await Promise.all([
    generateCnUtil(projectPath),
    generateFormatters(projectPath),
    generateConstants(projectPath),
    generateLogger(projectPath),
    generateErrorHandler(projectPath),
    generateHooks(projectPath),
    generateTypes(projectPath),
    generateFavicon(projectPath),
    generateValidators(projectPath)
  ]);
}
async function generateCnUtil(projectPath) {
  const content = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 * Handles conditional classes and merges conflicting utilities
 * 
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
 * // Result: "py-2 px-6 bg-blue-500" (if isActive is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  await fs17.writeFile(path17.join(projectPath, "src", "utils", "cn.ts"), content);
}
async function generateFormatters(projectPath) {
  const content = `/**
 * Formatting Utilities
 * Consistent formatting for dates, numbers, currencies, etc.
 */

/**
 * Format a date to localized string
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions & { locale?: string }
): string {
  const { locale = "en-US", ...formatOptions } = options || {};
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...formatOptions,
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: Date | string | number,
  options?: { locale?: string; includeSeconds?: boolean }
): string {
  const { locale = "en-US", includeSeconds = false } = options || {};
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  }).format(new Date(date));
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return "in the future";
  }

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return \`\${count} \${interval.label}\${count !== 1 ? "s" : ""} ago\`;
    }
  }

  return "just now";
}

/**
 * Format number with separators
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions & { locale?: string }
): string {
  const { locale = "en-US", ...formatOptions } = options || {};
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Format as compact number (1K, 1M, etc.)
 */
export function formatCompactNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

/**
 * Format as currency
 */
export function formatCurrency(
  value: number,
  options?: { currency?: string; locale?: string }
): string {
  const { currency = "USD", locale = "en-US" } = options || {};
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Format as percentage
 */
export function formatPercent(
  value: number,
  options?: { decimals?: number; locale?: string }
): string {
  const { decimals = 0, locale = "en-US" } = options || {};
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} \${sizes[i]}\`;
}

/**
 * Format duration in seconds to human readable
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return \`\${seconds}s\`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? \`\${mins}m \${secs}s\` : \`\${mins}m\`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? \`\${hours}h \${mins}m\` : \`\${hours}h\`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Title case
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Create URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, "")
    .replace(/[\\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate initials from name
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Mask sensitive data
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = local.charAt(0) + "***" + local.slice(-1);
  return \`\${maskedLocal}@\${domain}\`;
}
`;
  await fs17.writeFile(path17.join(projectPath, "src", "utils", "formatters.ts"), content);
}
async function generateConstants(projectPath) {
  const content = `/**
 * Application Constants
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "My App";
export const APP_DESCRIPTION = "Built with the ArchillesDC stack";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  AUTH: "/api/auth",
  TRPC: "/api/trpc",
} as const;

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebar-collapsed",
  LOCALE: "locale",
  RECENT_SEARCHES: "recent-searches",
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

/**
 * Time constants (in milliseconds)
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * File upload limits
 */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword"],
} as const;

/**
 * Cache durations (in seconds)
 */
export const CACHE = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;
`;
  await fs17.writeFile(path17.join(projectPath, "src", "utils", "constants.ts"), content);
}
async function generateLogger(projectPath) {
  const content = `/**
 * Logging Utility
 * 
 * A structured logger for development and production.
 * Supports log levels, colored output, and contextual logging.
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
  error?: Error;
}

interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
  minLevel?: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\\x1b[90m", // Gray
  info: "\\x1b[36m",  // Cyan
  warn: "\\x1b[33m",  // Yellow
  error: "\\x1b[31m", // Red
  fatal: "\\x1b[35m", // Magenta
};

const RESET = "\\x1b[0m";

class Logger {
  private prefix: string;
  private enabled: boolean;
  private minLevel: number;
  private context?: string;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || "App";
    this.enabled = options.enabled ?? process.env.NODE_ENV !== "test";
    this.minLevel = LOG_LEVELS[options.minLevel || "debug"];
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    return LOG_LEVELS[level] >= this.minLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const color = LOG_COLORS[entry.level];
    const levelStr = entry.level.toUpperCase().padEnd(5);
    const contextStr = entry.context ? \`[\${entry.context}]\` : "";
    
    return \`\${color}[\${entry.timestamp}] [\${this.prefix}] [\${levelStr}]\${contextStr} \${entry.message}\${RESET}\`;
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.formatTimestamp(),
      context: this.context,
      data,
      error,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case "debug":
        console.debug(formattedMessage, data ? data : "");
        break;
      case "info":
        console.info(formattedMessage, data ? data : "");
        break;
      case "warn":
        console.warn(formattedMessage, data ? data : "");
        break;
      case "error":
      case "fatal":
        console.error(formattedMessage, data ? data : "", error?.stack || "");
        break;
    }

    // In production, you might want to send to external service
    if (process.env.NODE_ENV === "production" && level === "error" || level === "fatal") {
      // TODO: Send to error tracking service
      // Sentry.captureException(error);
    }
  }

  debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown) {
    const err = error instanceof Error ? error : undefined;
    this.log("error", message, data, err);
  }

  fatal(message: string, error?: Error | unknown, data?: unknown) {
    const err = error instanceof Error ? error : undefined;
    this.log("fatal", message, data, err);
  }

  /**
   * Create a child logger with context
   */
  child(context: string): Logger {
    const child = new Logger({
      prefix: this.prefix,
      enabled: this.enabled,
    });
    child.context = context;
    return child;
  }

  /**
   * Time a function execution
   */
  async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.debug(\`\${label} completed in \${duration.toFixed(2)}ms\`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(\`\${label} failed after \${duration.toFixed(2)}ms\`, error);
      throw error;
    }
  }
}

// Default logger instance
export const logger = new Logger();

// Export factory function
export function createLogger(prefix: string, options?: Omit<LoggerOptions, "prefix">): Logger {
  return new Logger({ prefix, ...options });
}

// Export class for extending
export { Logger };
`;
  await fs17.writeFile(path17.join(projectPath, "src", "lib", "logger.ts"), content);
}
async function generateErrorHandler(projectPath) {
  const content = `/**
 * Error Handling Utilities
 * 
 * Consistent error handling across the application.
 */

import { TRPCError } from "@trpc/server";
import { logger } from "./logger";

/**
 * Application Error Types
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: unknown;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true,
    data?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error factories
 */
export const errors = {
  notFound: (resource: string = "Resource") =>
    new AppError(\`\${resource} not found\`, "NOT_FOUND", 404),

  unauthorized: (message: string = "Unauthorized") =>
    new AppError(message, "UNAUTHORIZED", 401),

  forbidden: (message: string = "Forbidden") =>
    new AppError(message, "FORBIDDEN", 403),

  badRequest: (message: string) =>
    new AppError(message, "BAD_REQUEST", 400),

  conflict: (message: string) =>
    new AppError(message, "CONFLICT", 409),

  validation: (errors: Record<string, string[]>) =>
    new AppError("Validation failed", "VALIDATION_ERROR", 422, true, { errors }),

  rateLimit: () =>
    new AppError("Too many requests", "RATE_LIMIT", 429),

  internal: (message: string = "Internal server error") =>
    new AppError(message, "INTERNAL_ERROR", 500, false),
};

/**
 * Convert any error to AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TRPCError) {
    return new AppError(
      error.message,
      error.code,
      getStatusCodeFromTRPCCode(error.code),
      true
    );
  }

  if (error instanceof Error) {
    // Check for Prisma errors
    if (error.message.includes("Record to update not found")) {
      return errors.notFound();
    }
    if (error.message.includes("Unique constraint")) {
      return errors.conflict("A record with this value already exists");
    }

    return new AppError(error.message, "INTERNAL_ERROR", 500, false);
  }

  return errors.internal("An unexpected error occurred");
}

/**
 * Map TRPC error codes to HTTP status codes
 */
function getStatusCodeFromTRPCCode(code: string): number {
  const codeMap: Record<string, number> = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  };

  return codeMap[code] || 500;
}

/**
 * Error response formatter
 */
export function formatErrorResponse(error: AppError) {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.data && { data: error.data }),
    },
  };
}

/**
 * Async error wrapper for server actions
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: AppError) => T
): Promise<T | { success: false; error: string }> {
  try {
    return await fn();
  } catch (error) {
    const appError = normalizeError(error);
    logger.error(appError.message, error);

    if (errorHandler) {
      return errorHandler(appError);
    }

    return {
      success: false,
      error: appError.message,
    };
  }
}

/**
 * Error boundary helper for React
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const appError = normalizeError(error);
  const retryableCodes = ["TIMEOUT", "SERVICE_UNAVAILABLE", "BAD_GATEWAY", "GATEWAY_TIMEOUT"];
  return retryableCodes.includes(appError.code);
}
`;
  await fs17.writeFile(path17.join(projectPath, "src", "lib", "error-handler.ts"), content);
}
async function generateHooks(projectPath) {
  const content = `"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/**
 * Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for local storage with SSR support
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(\`Error setting localStorage key "\${key}":\`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(\`Error removing localStorage key "\${key}":\`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook to detect clicks outside element
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook to track window size
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

/**
 * Hook to copy to clipboard
 */
export function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

  return [copied, copy];
}

/**
 * Hook to check if component is mounted
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Hook to track previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook for media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
): void {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!modifiers.ctrl || event.ctrlKey) &&
        (!modifiers.shift || event.shiftKey) &&
        (!modifiers.alt || event.altKey) &&
        (!modifiers.meta || event.metaKey)
      ) {
        event.preventDefault();
        callback();
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, callback, modifiers]);
}

/**
 * Hook for intersection observer
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry?.isIntersecting ?? false);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Hook for toggle state
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

/**
 * Hook for async operations with loading state
 */
export function useAsync<T, E = Error>(
  asyncFn: () => Promise<T>,
  dependencies: unknown[] = []
): {
  data: T | null;
  loading: boolean;
  error: E | null;
  execute: () => Promise<void>;
} {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: E | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as E });
    }
  }, dependencies);

  return { ...state, execute };
}
`;
  await fs17.writeFile(path17.join(projectPath, "src", "hooks", "index.ts"), content);
}
async function generateTypes(projectPath) {
  const content = `/**
 * Common TypeScript Types
 */

// Make specific properties optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Get async function return type
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : never;

// Make all properties nullable
export type Nullable<T> = { [P in keyof T]: T[P] | null };

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
  };
}

// Sort params
export interface SortParams<T> {
  field: keyof T;
  direction: "asc" | "desc";
}

// Date range
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Key-value pair
export interface KeyValue<T = string> {
  key: string;
  value: T;
}

// Option for select inputs
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// Form field
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
}

// Action result
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
`;
  await fs17.writeFile(path17.join(projectPath, "src", "types", "index.ts"), content);
}
async function generateValidators(projectPath) {
  const content = `import { z } from "zod";

/**
 * Common Zod Validators
 * Reusable validation schemas
 */

// Email
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required");

// Password with requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

// Simple password (less strict)
export const simplePasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

// Name
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(/^[a-zA-Z\\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// Username
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens");

// URL
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .or(z.literal(""));

// Slug
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be at most 100 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

// Phone (US format)
export const phoneSchema = z
  .string()
  .regex(/^\\+?1?[-\\s.]?\\(?\\d{3}\\)?[-\\s.]?\\d{3}[-\\s.]?\\d{4}$/, "Invalid phone number");

// Date string
export const dateStringSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  "Invalid date"
);

// UUID
export const uuidSchema = z.string().uuid("Invalid ID");

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Common form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile update
export const profileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  image: urlSchema.optional().nullable(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

// Content schemas
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  slug: slugSchema.optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});
`;
  await fs17.writeFile(path17.join(projectPath, "src", "lib", "validators.ts"), content);
}
async function generateFavicon(projectPath) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7c3aed"/>
  <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui" font-weight="bold" font-size="18">A</text>
</svg>`;
  await fs17.writeFile(path17.join(projectPath, "public", "favicon.svg"), svgContent);
}

// src/templates/base/readme.ts
import fs18 from "fs-extra";
import path18 from "path";
async function generateReadme(options) {
  const { projectPath, projectName, database, authProvider, packageManager } = options;
  const pmRun = packageManager === "npm" ? "npm run" : packageManager;
  const content = `# ${projectName}

A full-stack web application built with the ArchillesDC stack.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Prisma](https://prisma.io/) with ${database === "sqlite" ? "SQLite" : database === "postgresql" ? "PostgreSQL" : "MySQL"}
- **API**: [tRPC](https://trpc.io/) for end-to-end type-safe APIs
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)${authProvider !== "none" ? ` with ${authProvider} provider` : ""}
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- ${packageManager}${database === "postgresql" ? "\n- PostgreSQL database" : database === "mysql" ? "\n- MySQL database" : ""}

### Installation

\`\`\`bash
# Install dependencies
${packageManager === "npm" ? "npm install" : packageManager === "yarn" ? "yarn" : `${packageManager} install`}

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your secrets

# Push database schema
${pmRun} db:push

# Start development server
${pmRun} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

\`\`\`
\u251C\u2500\u2500 prisma/                 # Database schema and migrations
\u251C\u2500\u2500 public/                 # Static assets
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 app/               # Next.js App Router pages
\u2502   \u2502   \u251C\u2500\u2500 (auth)/        # Authentication pages (login, register)
\u2502   \u2502   \u251C\u2500\u2500 (dashboard)/   # Protected dashboard pages
\u2502   \u2502   \u251C\u2500\u2500 api/           # API routes
\u2502   \u2502   \u2514\u2500\u2500 _components/   # Page-specific components
\u2502   \u251C\u2500\u2500 components/        # Reusable UI components
\u2502   \u2502   \u251C\u2500\u2500 ui/           # Base UI components
\u2502   \u2502   \u251C\u2500\u2500 layout/       # Layout components
\u2502   \u2502   \u2514\u2500\u2500 forms/        # Form components
\u2502   \u251C\u2500\u2500 hooks/            # Custom React hooks
\u2502   \u251C\u2500\u2500 lib/              # Utility libraries
\u2502   \u251C\u2500\u2500 server/           # Server-side code
\u2502   \u2502   \u251C\u2500\u2500 api/          # tRPC routers
\u2502   \u2502   \u2514\u2500\u2500 auth/         # Auth configuration
\u2502   \u251C\u2500\u2500 styles/           # Global styles
\u2502   \u251C\u2500\u2500 trpc/             # tRPC client setup
\u2502   \u251C\u2500\u2500 types/            # TypeScript types
\u2502   \u2514\u2500\u2500 utils/            # Utility functions
\u2514\u2500\u2500 ...config files
\`\`\`

## Available Scripts

| Command | Description |
|---------|-------------|
| \`${pmRun} dev\` | Start development server |
| \`${pmRun} build\` | Build for production |
| \`${pmRun} start\` | Start production server |
| \`${pmRun} lint\` | Run ESLint |
| \`${pmRun} typecheck\` | Run TypeScript type checking |
| \`${pmRun} db:push\` | Push Prisma schema to database |
| \`${pmRun} db:studio\` | Open Prisma Studio |
| \`${pmRun} db:generate\` | Generate Prisma migrations |

## Environment Variables

See \`.env.example\` for all required environment variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
`;
  await fs18.writeFile(path18.join(projectPath, "README.md"), content);
}

// src/templates/index.ts
async function generateTemplateFiles(options) {
  const { projectPath, template, components } = options;
  await createDirectoryStructure(projectPath, template);
  const generators = [
    // Base config files (always included)
    generatePackageJson(options),
    generateTsConfig(options),
    generateNextConfig(options),
    generateEnvFiles(options),
    generateGitIgnore(options),
    generateEslintConfig(options),
    generatePrettierConfig(options),
    generatePostcssConfig(options),
    generateReadme(options),
    // Prisma (always included)
    generatePrismaSchema(options),
    generateDbConnection(options),
    // Environment validation (always included)
    generateEnvJs(options),
    // Auth (always included unless 'none')
    generateAuthFiles(options),
    // tRPC (always included)
    generateTrpcFiles(options),
    // Styles (always included)
    generateStyleFiles(options)
  ];
  if (template !== "barebones") {
    generators.push(generateAppFiles(options));
    generators.push(generateComponentFiles(options));
  } else {
    generators.push(generateBarebonesFiles(options));
  }
  generators.push(generateUtilsFiles(options));
  if (components.includes("data-display")) {
    generators.push(generateDataDisplayComponents2(options));
  }
  if (components.includes("forms")) {
    generators.push(generateFormComponents2(options));
  }
  if (template === "admin" || template === "full-system") {
    generators.push(generateAdminFiles(options));
  }
  await Promise.all(generators);
}
async function createDirectoryStructure(projectPath, template) {
  const baseDirectories = [
    "src/app/_components",
    "src/app/api/auth/[...nextauth]",
    "src/app/api/trpc/[trpc]",
    "src/components/ui",
    "src/components/layout",
    "src/lib",
    "src/hooks",
    "src/utils",
    "src/server/api/routers",
    "src/server/auth",
    "src/styles",
    "src/trpc",
    "src/types",
    "prisma",
    "public"
  ];
  const templateDirectories = {
    "full-system": [
      "src/app/(auth)/login",
      "src/app/(auth)/register",
      "src/app/(dashboard)",
      "src/app/(dashboard)/admin",
      "src/app/(dashboard)/admin/users",
      "src/app/(dashboard)/admin/settings",
      "src/app/(dashboard)/settings",
      "src/components/forms",
      "src/components/admin",
      "src/components/charts"
    ],
    "admin": [
      "src/app/(auth)/login",
      "src/app/(dashboard)",
      "src/app/(dashboard)/admin",
      "src/app/(dashboard)/admin/users",
      "src/app/(dashboard)/admin/settings",
      "src/components/admin",
      "src/components/charts"
    ],
    "dashboard": [
      "src/app/(auth)/login",
      "src/app/(auth)/register",
      "src/app/(dashboard)",
      "src/app/(dashboard)/settings",
      "src/components/forms"
    ],
    "barebones": [
      "src/app/(auth)/login"
    ]
  };
  const directories = [
    ...baseDirectories,
    ...templateDirectories[template] || []
  ];
  for (const dir of directories) {
    await fs19.ensureDir(path19.join(projectPath, dir));
  }
}
async function generateBarebonesFiles(options) {
  const { projectPath, projectName } = options;
  const layoutContent = `import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Built with ArchillesDC",
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface-0 font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
`;
  const homePageContent = `import Link from "next/link";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          ${projectName}
        </h1>
        <p className="text-white/60 mb-8">
          Your barebones project is ready. Start building!
        </p>
        <div className="flex gap-4 justify-center">
          {session ? (
            <Link href="/api/auth/signout" className="btn-primary">
              Sign Out ({session.user?.name})
            </Link>
          ) : (
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
`;
  await fs19.writeFile(path19.join(projectPath, "src", "app", "layout.tsx"), layoutContent);
  await fs19.writeFile(path19.join(projectPath, "src", "app", "page.tsx"), homePageContent);
  const loginPageContent = `import { redirect } from "next/navigation";
import { auth, signIn } from "@/server/auth";

export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <form
          action={async () => {
            "use server";
            await signIn(undefined, { redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn-primary w-full">
            Continue with Provider
          </button>
        </form>
      </div>
    </main>
  );
}
`;
  await fs19.writeFile(path19.join(projectPath, "src", "app", "(auth)", "login", "page.tsx"), loginPageContent);
}
async function generateDataDisplayComponents2(options) {
  const { projectPath } = options;
  const tableContent = `import { cn } from "@/utils/cn";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  className,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-sm font-medium text-white/60"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-white/5 transition-colors",
                onRowClick && "cursor-pointer hover:bg-white/5"
              )}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-white">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="text-center py-8 text-white/40">No data available</p>
      )}
    </div>
  );
}
`;
  const statsContent = `import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-white/40",
  };

  return (
    <div className={cn("card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={cn("text-sm mt-1", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "lg:grid-cols-4 md:grid-cols-2",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
`;
  await fs19.writeFile(path19.join(projectPath, "src", "components", "ui", "table.tsx"), tableContent);
  await fs19.writeFile(path19.join(projectPath, "src", "components", "ui", "stats.tsx"), statsContent);
}
async function generateFormComponents2(options) {
  const { projectPath } = options;
  const selectContent = `"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\\s/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23666%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
`;
  const checkboxContent = `"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\\s/g, "-");

    return (
      <label
        htmlFor={checkboxId}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              "peer h-5 w-5 rounded border border-white/20 bg-white/5 appearance-none cursor-pointer",
              "checked:bg-brand-600 checked:border-brand-600",
              "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
              "transition-colors",
              className
            )}
            {...props}
          />
          <svg
            className="absolute inset-0 w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-white/80 group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
`;
  const textareaContent = `import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\\s/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "input min-h-[100px] resize-y",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-white/40">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
`;
  await fs19.writeFile(path19.join(projectPath, "src", "components", "ui", "select.tsx"), selectContent);
  await fs19.writeFile(path19.join(projectPath, "src", "components", "ui", "checkbox.tsx"), checkboxContent);
  await fs19.writeFile(path19.join(projectPath, "src", "components", "ui", "textarea.tsx"), textareaContent);
}
async function generateAdminFiles(options) {
  const { projectPath } = options;
  const adminLayoutContent = `import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // TODO: Add admin role check
  // if (session.user.role !== "admin") {
  //   redirect("/dashboard");
  // }

  return <>{children}</>;
}
`;
  const adminPageContent = `import { StatsGrid } from "@/components/ui/stats";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminPage() {
  const stats = [
    { title: "Total Users", value: "1,234", change: "+12% from last month", changeType: "positive" as const },
    { title: "Active Sessions", value: "567", change: "+5% from last week", changeType: "positive" as const },
    { title: "Revenue", value: "$45,678", change: "-2% from last month", changeType: "negative" as const },
    { title: "Pending Tasks", value: "23", change: "8 completed today", changeType: "neutral" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-white/60 mt-1">
          Manage your application settings and users.
        </p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <p className="text-white/60">Activity feed will appear here.</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn-secondary w-full justify-start">
              Manage Users
            </button>
            <button className="btn-secondary w-full justify-start">
              View Reports
            </button>
            <button className="btn-secondary w-full justify-start">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  const usersPageContent = `import { Table } from "@/components/ui/table";

export const metadata = {
  title: "User Management",
};

// Mock data - replace with actual data fetching
const users = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "User", status: "Inactive" },
];

export default function UsersPage() {
  const columns = [
    { key: "name" as const, header: "Name" },
    { key: "email" as const, header: "Email" },
    { key: "role" as const, header: "Role" },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => (
        <span
          className={\`px-2 py-1 rounded text-xs font-medium \${
            value === "Active"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }\`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-white/60 mt-1">Manage user accounts and permissions.</p>
        </div>
        <button className="btn-primary">Add User</button>
      </div>

      <div className="card p-0">
        <Table data={users} columns={columns} />
      </div>
    </div>
  );
}
`;
  await fs19.ensureDir(path19.join(projectPath, "src", "app", "(dashboard)", "admin"));
  await fs19.ensureDir(path19.join(projectPath, "src", "app", "(dashboard)", "admin", "users"));
  await fs19.writeFile(
    path19.join(projectPath, "src", "app", "(dashboard)", "admin", "layout.tsx"),
    adminLayoutContent
  );
  await fs19.writeFile(
    path19.join(projectPath, "src", "app", "(dashboard)", "admin", "page.tsx"),
    adminPageContent
  );
  await fs19.writeFile(
    path19.join(projectPath, "src", "app", "(dashboard)", "admin", "users", "page.tsx"),
    usersPageContent
  );
}

// src/create-project.ts
async function createProject(options) {
  const { projectPath, packageManager, initGit, skipInstall } = options;
  const steps = [
    { name: "Creating project directory", fn: () => createDirectory(projectPath) },
    { name: "Generating project files", fn: () => generateTemplateFiles(options) },
    { name: "Setting up environment", fn: () => setupEnvironment(options) },
    ...initGit !== false ? [{ name: "Initializing Git repository", fn: () => initializeGit(projectPath) }] : [],
    ...!skipInstall ? [{ name: `Installing dependencies with ${packageManager}`, fn: () => installDependencies(projectPath, packageManager) }] : [],
    ...!skipInstall ? [{ name: "Generating Prisma client", fn: () => generatePrismaClient(projectPath, packageManager) }] : [],
    { name: "Running final checks", fn: () => runFinalChecks(options) }
  ];
  console.log(chalk.cyan(`
  Creating project in ${chalk.white(projectPath)}
`));
  for (const step of steps) {
    const spinner = ora({
      text: step.name,
      prefixText: "  "
    }).start();
    try {
      await step.fn();
      spinner.succeed(chalk.white(step.name));
    } catch (error) {
      spinner.fail(chalk.red(step.name));
      if (error instanceof Error) {
        console.log(chalk.yellow(`     \u2514\u2500 ${error.message}`));
      }
    }
  }
}
async function createDirectory(projectPath) {
  await fs20.ensureDir(projectPath);
}
async function setupEnvironment(options) {
  const { projectPath } = options;
  const directories = [
    "src/app/_components",
    "src/app/api/auth/[...nextauth]",
    "src/app/api/trpc/[trpc]",
    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(dashboard)",
    "src/components/ui",
    "src/components/layout",
    "src/components/forms",
    "src/lib",
    "src/hooks",
    "src/utils",
    "src/server/api/routers",
    "src/server/auth",
    "src/styles",
    "src/trpc",
    "src/types",
    "prisma",
    "public"
  ];
  if (options.template === "admin" || options.template === "full-system") {
    directories.push(
      "src/app/(dashboard)/admin",
      "src/app/(dashboard)/admin/users",
      "src/app/(dashboard)/admin/settings",
      "src/components/admin"
    );
  }
  for (const dir of directories) {
    await fs20.ensureDir(path20.join(projectPath, dir));
  }
}
function initializeGit(projectPath) {
  try {
    execSync("git init", { cwd: projectPath, stdio: "ignore" });
    const commitMsg = "Initial commit from create-archillesdc-app";
    execSync(`git add -A`, { cwd: projectPath, stdio: "ignore" });
    try {
      execSync(`git commit -m "${commitMsg}"`, { cwd: projectPath, stdio: "ignore" });
    } catch {
    }
  } catch (error) {
    throw new Error("Git not installed or not configured");
  }
}
function installDependencies(projectPath, pm) {
  const installCommand = getInstallCommand(pm);
  try {
    execSync(installCommand, {
      cwd: projectPath,
      stdio: "ignore",
      timeout: 3e5
      // 5 minute timeout
    });
  } catch (error) {
    throw new Error(`Failed to install dependencies. Run '${installCommand}' manually.`);
  }
}
function generatePrismaClient(projectPath, pm) {
  const command = getPrismaGenerateCommand(pm);
  try {
    execSync(command, {
      cwd: projectPath,
      stdio: "ignore",
      timeout: 6e4
      // 1 minute timeout
    });
  } catch (error) {
    throw new Error("Run 'npx prisma generate' manually after setting up .env");
  }
}
async function runFinalChecks(options) {
  const { projectPath, projectName } = options;
  const issues = [];
  const packageJsonPath = path20.join(projectPath, "package.json");
  if (!await fs20.pathExists(packageJsonPath)) {
    issues.push("package.json not found");
  }
  const envExamplePath = path20.join(projectPath, ".env.example");
  if (!await fs20.pathExists(envExamplePath)) {
    issues.push(".env.example not found");
  }
  const prismaSchemaPath = path20.join(projectPath, "prisma", "schema.prisma");
  if (!await fs20.pathExists(prismaSchemaPath)) {
    issues.push("Prisma schema not found");
  }
  const layoutPath = path20.join(projectPath, "src", "app", "layout.tsx");
  if (!await fs20.pathExists(layoutPath)) {
    issues.push("Root layout not found");
  }
  if (issues.length > 0) {
    throw new Error(`Some files missing: ${issues.join(", ")}`);
  }
  const setupMarkerPath = path20.join(projectPath, ".archillesdc-setup");
  await fs20.writeJSON(setupMarkerPath, {
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    projectName,
    template: options.template,
    database: options.database,
    authProvider: options.authProvider,
    version: "1.0.0"
  }, { spaces: 2 });
  const gitignorePath = path20.join(projectPath, ".gitignore");
  if (await fs20.pathExists(gitignorePath)) {
    const gitignore = await fs20.readFile(gitignorePath, "utf-8");
    if (!gitignore.includes(".archillesdc-setup")) {
      await fs20.appendFile(gitignorePath, "\n# CLI setup marker\n.archillesdc-setup\n");
    }
  }
}
function getInstallCommand(pm) {
  switch (pm) {
    case "npm":
      return "npm install";
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn";
    case "bun":
      return "bun install";
    default:
      return "npm install";
  }
}
function getPrismaGenerateCommand(pm) {
  switch (pm) {
    case "npm":
      return "npx prisma generate";
    case "pnpm":
      return "pnpm prisma generate";
    case "yarn":
      return "yarn prisma generate";
    case "bun":
      return "bunx prisma generate";
    default:
      return "npx prisma generate";
  }
}

// src/utils/version.ts
import fs21 from "fs-extra";
import path21 from "path";
import { fileURLToPath } from "url";
function getVersion() {
  try {
    const __dirname = path21.dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = path21.resolve(__dirname, "../../package.json");
    const packageJson = fs21.readJsonSync(packageJsonPath);
    return packageJson.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}

// src/commands/generate.ts
import chalk2 from "chalk";
import ora2 from "ora";
import path22 from "path";
import fs22 from "fs-extra";
function registerGeneratorCommand(program2) {
  const generate = program2.command("generate").alias("g").description("Generate pages, CRUD, modules, or APIs");
  generate.command("page <name>").description("Generate a new page with layout").option("-r, --route <route>", "Custom route path").option("-p, --protected", "Add authentication guard").option("-a, --admin", "Add admin role guard").action(async (name, options) => {
    await generatePage(name, options);
  });
  generate.command("crud <name>").description("Generate full CRUD (model, API, components, page)").option("-f, --fields <fields>", "Fields (e.g., 'name:string,price:number,active:boolean')").option("--no-page", "Skip page generation").option("--no-api", "Skip API generation").action(async (name, options) => {
    await generateCrud(name, options);
  });
  generate.command("module <name>").description("Generate a complete feature module").option("-f, --fields <fields>", "Model fields").action(async (name, options) => {
    await generateModule(name, options);
  });
  generate.command("api <name>").description("Generate tRPC router with CRUD operations").option("-f, --fields <fields>", "Fields for input validation").action(async (name, options) => {
    await generateApi(name, options);
  });
  generate.command("component <name>").description("Generate a React component").option("-t, --type <type>", "Component type (ui, layout, form)", "ui").action(async (name, options) => {
    await generateComponent(name, options);
  });
}
async function generatePage(name, options) {
  const spinner = ora2(`Generating page: ${name}`).start();
  try {
    const projectRoot = await findProjectRoot();
    const pageName = toPascalCase(name);
    const routePath = options.route || toKebabCase(name);
    const pageDir = path22.join(projectRoot, "src", "app", `(dashboard)`, routePath);
    await fs22.ensureDir(pageDir);
    const pageContent = generatePageContent(pageName, {
      protected: options.protected,
      admin: options.admin
    });
    await fs22.writeFile(path22.join(pageDir, "page.tsx"), pageContent);
    const loadingContent = generateLoadingContent();
    await fs22.writeFile(path22.join(pageDir, "loading.tsx"), loadingContent);
    spinner.succeed(chalk2.green(`Generated page: ${chalk2.cyan(routePath)}`));
    console.log(chalk2.gray(`  \u2514\u2500 src/app/(dashboard)/${routePath}/page.tsx`));
    console.log(chalk2.gray(`  \u2514\u2500 src/app/(dashboard)/${routePath}/loading.tsx`));
  } catch (error) {
    spinner.fail(chalk2.red(`Failed to generate page: ${name}`));
    console.error(error);
  }
}
function generatePageContent(name, options) {
  const guardImport = options.admin || options.protected ? `import { RoleGuard } from "@/components/auth/role-guard";` : "";
  const role = options.admin ? "admin" : "user";
  const wrapStart = options.admin || options.protected ? `<RoleGuard requiredRole="${role}">` : "";
  const wrapEnd = options.admin || options.protected ? "</RoleGuard>" : "";
  return `${guardImport ? guardImport + "\n" : ""}
export const metadata = {
  title: "${name}",
  description: "${name} page",
};

export default function ${name}Page() {
  return (
    ${wrapStart}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">${name}</h1>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-zinc-400">
          Welcome to ${name}. Start building your page here.
        </p>
      </div>
    </div>
    ${wrapEnd}
  );
}
`;
}
function generateLoadingContent() {
  return `import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
`;
}
async function generateCrud(name, options) {
  const spinner = ora2(`Generating CRUD for: ${name}`).start();
  try {
    const projectRoot = await findProjectRoot();
    const modelName = toPascalCase(name);
    const modelNameLower = toCamelCase(name);
    const modelNamePlural = pluralize(modelNameLower);
    const fields = parseFields(options.fields || "name:string");
    spinner.text = "Adding Prisma model...";
    await appendPrismaModel(projectRoot, modelName, fields);
    if (options.api !== false) {
      spinner.text = "Generating tRPC router...";
      await generateCrudRouter(projectRoot, modelName, modelNameLower, fields);
    }
    spinner.text = "Generating components...";
    await generateCrudComponents(projectRoot, modelName, modelNameLower, fields);
    if (options.page !== false) {
      spinner.text = "Generating page...";
      await generateCrudPage(projectRoot, modelName, modelNameLower, modelNamePlural);
    }
    spinner.succeed(chalk2.green(`Generated CRUD for: ${chalk2.cyan(modelName)}`));
    console.log(chalk2.gray(`  \u2514\u2500 prisma/schema.prisma (model ${modelName})`));
    console.log(chalk2.gray(`  \u2514\u2500 src/server/api/routers/${modelNameLower}.ts`));
    console.log(chalk2.gray(`  \u2514\u2500 src/components/${modelNameLower}/`));
    if (options.page !== false) {
      console.log(chalk2.gray(`  \u2514\u2500 src/app/(dashboard)/${toKebabCase(modelNamePlural)}/`));
    }
    console.log();
    console.log(chalk2.yellow("  Don't forget to:"));
    console.log(chalk2.gray(`  1. Run ${chalk2.cyan("npx prisma db push")} to update the database`));
    console.log(chalk2.gray(`  2. Add the router to ${chalk2.cyan("src/server/api/root.ts")}`));
  } catch (error) {
    spinner.fail(chalk2.red(`Failed to generate CRUD: ${name}`));
    console.error(error);
  }
}
function parseFields(fieldsStr) {
  return fieldsStr.split(",").map((f) => {
    const [name, type] = f.trim().split(":");
    const isOptional = type?.endsWith("?");
    return {
      name: name.trim(),
      type: (type?.replace("?", "") || "string").trim(),
      optional: isOptional
    };
  });
}
async function appendPrismaModel(projectRoot, modelName, fields) {
  const schemaPath = path22.join(projectRoot, "prisma", "schema.prisma");
  const schema = await fs22.readFile(schemaPath, "utf-8");
  if (schema.includes(`model ${modelName}`)) {
    return;
  }
  const fieldLines = fields.map((f) => {
    const prismaType = toPrismaType(f.type);
    const optional = f.optional ? "?" : "";
    return `  ${f.name}       ${prismaType}${optional}`;
  }).join("\n");
  const modelDef = `
// Generated model: ${modelName}
model ${modelName} {
  id          String   @id @default(cuid())
${fieldLines}
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  createdBy   User?    @relation(fields: [createdById], references: [id])
  createdById String?

  @@index([createdById])
}
`;
  await fs22.appendFile(schemaPath, modelDef);
}
function toPrismaType(type) {
  const typeMap = {
    string: "String",
    number: "Int",
    float: "Float",
    boolean: "Boolean",
    date: "DateTime",
    json: "Json",
    text: "String    @db.Text"
  };
  return typeMap[type.toLowerCase()] || "String";
}
async function generateCrudRouter(projectRoot, modelName, modelNameLower, fields) {
  const routerDir = path22.join(projectRoot, "src", "server", "api", "routers");
  await fs22.ensureDir(routerDir);
  const zodFields = fields.map((f) => `      ${f.name}: z.${toZodType(f.type)}()${f.optional ? ".optional()" : ""},`).join("\n");
  const content = `import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { paginatedResponse } from "@/lib/crud-helper";

/**
 * ${modelName} Router - Auto-generated CRUD
 */
export const ${modelNameLower}Router = createTRPCRouter({
  // Get all with pagination
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(50).default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search } = input;
      const skip = (page - 1) * limit;

      const where = search
        ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }] }
        : {};

      const [items, total] = await Promise.all([
        ctx.db.${modelNameLower}.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { createdBy: { select: { id: true, name: true } } },
        }),
        ctx.db.${modelNameLower}.count({ where }),
      ]);

      return paginatedResponse(items, total, page, limit);
    }),

  // Get by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.${modelNameLower}.findUnique({
        where: { id: input.id },
        include: { createdBy: { select: { id: true, name: true } } },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "${modelName} not found" });
      }

      return item;
    }),

  // Create
  create: protectedProcedure
    .input(
      z.object({
${zodFields}
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.${modelNameLower}.create({
        data: {
          ...input,
          createdById: ctx.userId,
        },
      });
    }),

  // Update
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
${zodFields.replace(/z\.\w+\(\)/g, (match) => match + ".optional()")}
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.${modelNameLower}.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "${modelName} not found" });
      }

      return ctx.db.${modelNameLower}.update({
        where: { id },
        data,
      });
    }),

  // Delete
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.${modelNameLower}.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
`;
  await fs22.writeFile(path22.join(routerDir, `${modelNameLower}.ts`), content);
}
function toZodType(type) {
  const typeMap = {
    string: "string",
    number: "number",
    float: "number",
    boolean: "boolean",
    date: "date",
    json: "unknown",
    text: "string"
  };
  return typeMap[type.toLowerCase()] || "string";
}
async function generateCrudComponents(projectRoot, modelName, modelNameLower, fields) {
  const componentDir = path22.join(projectRoot, "src", "components", modelNameLower);
  await fs22.ensureDir(componentDir);
  const listContent = `"use client";

import { api } from "@/trpc/react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/utils/formatters";

interface ${modelName}ListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ${modelName}List({ onEdit, onDelete }: ${modelName}ListProps) {
  const { data, isLoading } = api.${modelNameLower}.getAll.useQuery({ page: 1, limit: 20 });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-zinc-800 rounded-lg" />;
  }

  const columns = [
${fields.map((f) => `    { key: "${f.name}" as const, header: "${toPascalCase(f.name)}" },`).join("\n")}
    {
      key: "createdAt" as const,
      header: "Created",
      render: (value: Date) => formatRelativeTime(value),
    },
    {
      key: "id" as const,
      header: "Actions",
      render: (_: string, row: { id: string }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(row.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(row.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return <Table data={data?.items || []} columns={columns} />;
}
`;
  await fs22.writeFile(path22.join(componentDir, `${modelNameLower}-list.tsx`), listContent);
  const formFields = fields.map((f) => {
    if (f.type === "boolean") {
      return `        <Checkbox
          label="${toPascalCase(f.name)}"
          checked={form.${f.name}}
          onChange={(e) => setForm({ ...form, ${f.name}: e.target.checked })}
        />`;
    }
    return `        <Input
          label="${toPascalCase(f.name)}"
          value={form.${f.name} || ""}
          onChange={(e) => setForm({ ...form, ${f.name}: e.target.value })}
          ${f.optional ? "" : "required"}
        />`;
  }).join("\n");
  const formContent = `"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";

interface ${modelName}FormProps {
  initialData?: Partial<${modelName}FormData>;
  onSuccess?: () => void;
}

interface ${modelName}FormData {
${fields.map((f) => `  ${f.name}${f.optional ? "?" : ""}: ${toTsType(f.type)};`).join("\n")}
}

export function ${modelName}Form({ initialData, onSuccess }: ${modelName}FormProps) {
  const [form, setForm] = useState<${modelName}FormData>(initialData || {
${fields.map((f) => `    ${f.name}: ${getDefaultValue(f.type)},`).join("\n")}
  });

  const { addToast } = useToast();
  const utils = api.useUtils();

  const createMutation = api.${modelNameLower}.create.useMutation({
    onSuccess: () => {
      addToast("${modelName} created successfully", "success");
      utils.${modelNameLower}.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
${formFields}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" loading={createMutation.isPending}>
          {initialData ? "Update" : "Create"} ${modelName}
        </Button>
      </div>
    </form>
  );
}
`;
  await fs22.writeFile(path22.join(componentDir, `${modelNameLower}-form.tsx`), formContent);
  const indexContent = `export * from "./${modelNameLower}-list";
export * from "./${modelNameLower}-form";
`;
  await fs22.writeFile(path22.join(componentDir, "index.ts"), indexContent);
}
function toTsType(type) {
  const typeMap = {
    string: "string",
    number: "number",
    float: "number",
    boolean: "boolean",
    date: "Date",
    json: "unknown",
    text: "string"
  };
  return typeMap[type.toLowerCase()] || "string";
}
function getDefaultValue(type) {
  const defaults = {
    string: '""',
    number: "0",
    float: "0",
    boolean: "false",
    text: '""'
  };
  return defaults[type.toLowerCase()] || '""';
}
async function generateCrudPage(projectRoot, modelName, modelNameLower, modelNamePlural) {
  const pageDir = path22.join(projectRoot, "src", "app", "(dashboard)", toKebabCase(modelNamePlural));
  await fs22.ensureDir(pageDir);
  const pageContent = `"use client";

import { useState } from "react";
import { ${modelName}List } from "@/components/${modelNameLower}";
import { ${modelName}Form } from "@/components/${modelNameLower}";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/toast";

export default function ${modelName}Page() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const utils = api.useUtils();

  const deleteMutation = api.${modelNameLower}.delete.useMutation({
    onSuccess: () => {
      addToast("${modelName} deleted", "success");
      utils.${modelNameLower}.getAll.invalidate();
    },
  });

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ${modelNameLower}?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">${modelName} Management</h1>
        <Button onClick={() => setShowForm(true)}>Add ${modelName}</Button>
      </div>

      <${modelName}List onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditId(null);
        }}
        title={editId ? "Edit ${modelName}" : "Create ${modelName}"}
      >
        <${modelName}Form
          onSuccess={() => {
            setShowForm(false);
            setEditId(null);
          }}
        />
      </Modal>
    </div>
  );
}
`;
  await fs22.writeFile(path22.join(pageDir, "page.tsx"), pageContent);
}
async function generateModule(name, options) {
  const spinner = ora2(`Generating module: ${name}`).start();
  try {
    spinner.text = "Generating CRUD...";
    await generateCrud(name, { fields: options.fields, page: true, api: true });
    spinner.succeed(chalk2.green(`Generated module: ${chalk2.cyan(name)}`));
    console.log();
    console.log(chalk2.gray("  Module includes:"));
    console.log(chalk2.gray("  \u2713 Prisma model"));
    console.log(chalk2.gray("  \u2713 tRPC router with CRUD"));
    console.log(chalk2.gray("  \u2713 List component"));
    console.log(chalk2.gray("  \u2713 Form component"));
    console.log(chalk2.gray("  \u2713 Management page"));
  } catch (error) {
    spinner.fail(chalk2.red(`Failed to generate module: ${name}`));
    console.error(error);
  }
}
async function generateApi(name, options) {
  const spinner = ora2(`Generating API: ${name}`).start();
  try {
    const projectRoot = await findProjectRoot();
    const modelName = toPascalCase(name);
    const modelNameLower = toCamelCase(name);
    const fields = parseFields(options.fields || "name:string");
    await generateCrudRouter(projectRoot, modelName, modelNameLower, fields);
    spinner.succeed(chalk2.green(`Generated API router: ${chalk2.cyan(modelNameLower)}`));
    console.log(chalk2.gray(`  \u2514\u2500 src/server/api/routers/${modelNameLower}.ts`));
    console.log();
    console.log(chalk2.yellow("  Don't forget to add to root.ts:"));
    console.log(chalk2.cyan(`    import { ${modelNameLower}Router } from "./routers/${modelNameLower}";`));
    console.log(chalk2.cyan(`    ${modelNameLower}: ${modelNameLower}Router,`));
  } catch (error) {
    spinner.fail(chalk2.red(`Failed to generate API: ${name}`));
    console.error(error);
  }
}
async function generateComponent(name, options) {
  const spinner = ora2(`Generating component: ${name}`).start();
  try {
    const projectRoot = await findProjectRoot();
    const componentName = toPascalCase(name);
    const fileName = toKebabCase(name);
    const componentDir = path22.join(projectRoot, "src", "components", options.type);
    await fs22.ensureDir(componentDir);
    const content = `import { cn } from "@/utils/cn";

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${componentName}({ className, children }: ${componentName}Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
`;
    await fs22.writeFile(path22.join(componentDir, `${fileName}.tsx`), content);
    spinner.succeed(chalk2.green(`Generated component: ${chalk2.cyan(componentName)}`));
    console.log(chalk2.gray(`  \u2514\u2500 src/components/${options.type}/${fileName}.tsx`));
  } catch (error) {
    spinner.fail(chalk2.red(`Failed to generate component: ${name}`));
    console.error(error);
  }
}
async function findProjectRoot() {
  let currentDir = process.cwd();
  while (currentDir !== path22.parse(currentDir).root) {
    if (await fs22.pathExists(path22.join(currentDir, "package.json"))) {
      const pkg = await fs22.readJSON(path22.join(currentDir, "package.json"));
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        return currentDir;
      }
    }
    currentDir = path22.dirname(currentDir);
  }
  return process.cwd();
}
function toPascalCase(str) {
  return str.split(/[-_\s]+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
}
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
function pluralize(str) {
  if (str.endsWith("y")) {
    return str.slice(0, -1) + "ies";
  }
  if (str.endsWith("s") || str.endsWith("x") || str.endsWith("ch") || str.endsWith("sh")) {
    return str + "es";
  }
  return str + "s";
}

// src/index.ts
var program = new Command();
var TEMPLATES = {
  "full-system": {
    name: "\u{1F3E2} Full System",
    description: "Complete app with auth, dashboard, admin, API, and all components",
    features: ["Auth pages", "Dashboard", "Admin panel", "All UI components", "Full API routes", "Example CRUD"]
  },
  "admin": {
    name: "\u2699\uFE0F Admin Dashboard",
    description: "Admin panel with data tables, charts, and management features",
    features: ["Admin layout", "Data tables", "Charts", "User management", "Settings pages"]
  },
  "dashboard": {
    name: "\u{1F4CA} Dashboard",
    description: "User dashboard with sidebar navigation and widgets",
    features: ["Dashboard layout", "Sidebar", "Widgets", "Stats cards", "Basic pages"]
  },
  "barebones": {
    name: "\u{1F4E6} Barebones",
    description: "Minimal setup with just the essentials - build from scratch",
    features: ["Basic layout", "Auth setup", "Database ready", "Minimal components"]
  }
};
var COMPONENT_GROUPS = {
  "ui-essentials": {
    name: "UI Essentials",
    components: ["Button", "Input", "Card", "Badge", "Avatar"]
  },
  "feedback": {
    name: "Feedback & Overlays",
    components: ["Toast", "Modal", "Alert", "Tooltip", "Popover"]
  },
  "navigation": {
    name: "Navigation",
    components: ["Sidebar", "Header", "Navbar", "Breadcrumbs", "Tabs"]
  },
  "data-display": {
    name: "Data Display",
    components: ["Table", "DataGrid", "List", "Stats", "Charts"]
  },
  "forms": {
    name: "Form Components",
    components: ["Select", "Checkbox", "Radio", "Switch", "Textarea", "DatePicker"]
  },
  "layout": {
    name: "Layout",
    components: ["Container", "Grid", "Divider", "Spacer"]
  }
};
async function main() {
  console.log();
  console.log(chalk3.cyan.bold("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
  console.log(chalk3.cyan.bold("\u2551") + chalk3.white.bold("        \u{1F680} Create ArchillesDC App - Full Stack CLI           ") + chalk3.cyan.bold("\u2551"));
  console.log(chalk3.cyan.bold("\u2551") + chalk3.gray("       Next.js \u2022 Tailwind CSS \u2022 Prisma \u2022 tRPC \u2022 Auth         ") + chalk3.cyan.bold("\u2551"));
  console.log(chalk3.cyan.bold("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
  console.log();
  program.name("archillesdc").description("ArchillesDC CLI - Create and manage full-stack web applications").version(getVersion());
  registerGeneratorCommand(program);
  program.command("create [project-name]", { isDefault: true }).description("Create a new ArchillesDC project").option("-y, --yes", "Skip prompts and use defaults").option("-t, --template <template>", "Template (full-system, admin, dashboard, barebones)").option("--db <database>", "Database provider (sqlite, postgresql, mysql)").option("--auth <provider>", "Auth provider (discord, github, google, credentials, none)").option("--pm <packageManager>", "Package manager (npm, pnpm, yarn, bun)").option("--no-examples", "Skip example code").option("--no-install", "Skip dependency installation").action(async (projectName, opts) => {
    await handleCreate(projectName, opts);
  });
  await program.parseAsync();
}
async function handleCreate(projectName, opts) {
  if (opts.yes && projectName) {
    const projectPath2 = path23.resolve(process.cwd(), projectName);
    const options2 = {
      projectName,
      projectPath: projectPath2,
      template: opts.template || "full-system",
      database: opts.db || "sqlite",
      authProvider: opts.auth || "discord",
      includeExampleCode: opts.examples !== false,
      packageManager: opts.pm || "npm",
      components: ["ui-essentials", "feedback", "navigation", "forms", "layout"],
      componentGroups: ["ui-essentials", "feedback", "navigation", "data-display", "forms", "layout"],
      skipInstall: opts.install === false,
      initGit: true
    };
    await runProjectCreation(options2);
    return;
  }
  console.log(chalk3.white.bold("  Let's set up your new project!\n"));
  const answers = await inquirer.prompt([
    // Step 1: Project Name
    {
      type: "input",
      name: "projectName",
      message: chalk3.cyan("?") + " What is your project name?",
      default: projectName || "my-archillesdc-app",
      validate: (input) => {
        const validation = validateProjectName(input);
        if (!validation.validForNewPackages) {
          return `Invalid project name: ${validation.errors?.join(", ") || validation.warnings?.join(", ")}`;
        }
        return true;
      }
    },
    // Step 2: Template Selection
    {
      type: "list",
      name: "template",
      message: chalk3.cyan("?") + " Choose a template:",
      choices: Object.entries(TEMPLATES).map(([key, value]) => ({
        name: `${value.name}
     ${chalk3.gray(value.description)}
     ${chalk3.gray("\u2192 " + value.features.join(", "))}`,
        value: key,
        short: value.name
      })),
      default: opts.template || "full-system",
      when: !opts.template
    },
    // Step 3: Database
    {
      type: "list",
      name: "database",
      message: chalk3.cyan("?") + " Which database would you like to use?",
      choices: [
        {
          name: `${chalk3.green("SQLite")} ${chalk3.gray("(Default, no setup needed)")}`,
          value: "sqlite",
          short: "SQLite"
        },
        {
          name: `${chalk3.blue("PostgreSQL")} ${chalk3.gray("(Production-ready, requires setup)")}`,
          value: "postgresql",
          short: "PostgreSQL"
        },
        {
          name: `${chalk3.yellow("MySQL")} ${chalk3.gray("(Popular choice, requires setup)")}`,
          value: "mysql",
          short: "MySQL"
        }
      ],
      default: opts.db || "sqlite",
      when: !opts.db
    },
    // Step 4: Authentication
    {
      type: "list",
      name: "authProvider",
      message: chalk3.cyan("?") + " Which authentication provider would you like?",
      choices: [
        { name: `${chalk3.magenta("Discord")} ${chalk3.gray("(Easy social login)")}`, value: "discord" },
        { name: `${chalk3.white("GitHub")} ${chalk3.gray("(Great for dev tools)")}`, value: "github" },
        { name: `${chalk3.red("Google")} ${chalk3.gray("(Most widely used)")}`, value: "google" },
        { name: `${chalk3.cyan("Credentials")} ${chalk3.gray("(Email & Password)")}`, value: "credentials" },
        { name: `${chalk3.gray("None")} ${chalk3.gray("(I'll add it later)")}`, value: "none" }
      ],
      default: opts.auth || "discord",
      when: !opts.auth
    },
    // Step 5: Components to include
    {
      type: "checkbox",
      name: "components",
      message: chalk3.cyan("?") + " Which component groups do you want to include?",
      choices: Object.entries(COMPONENT_GROUPS).map(([key, value]) => ({
        name: `${value.name} ${chalk3.gray("(" + value.components.join(", ") + ")")}`,
        value: key,
        checked: true
      })),
      validate: (input) => {
        if (input.length === 0) {
          return "Please select at least one component group";
        }
        return true;
      }
    },
    // Step 6: Package Manager
    {
      type: "list",
      name: "packageManager",
      message: chalk3.cyan("?") + " Which package manager would you like to use?",
      choices: [
        { name: `npm ${chalk3.gray("(Default)")}`, value: "npm" },
        { name: `pnpm ${chalk3.gray("(Fast & efficient)")}`, value: "pnpm" },
        { name: `yarn ${chalk3.gray("(Classic choice)")}`, value: "yarn" },
        { name: `bun ${chalk3.gray("(Fastest, newer)")}`, value: "bun" }
      ],
      default: opts.pm || "npm",
      when: !opts.pm
    },
    // Step 7: Example code
    {
      type: "confirm",
      name: "includeExampleCode",
      message: chalk3.cyan("?") + " Include example code and demo pages?",
      default: opts.examples !== false,
      when: opts.examples === void 0
    },
    // Step 8: Initialize Git
    {
      type: "confirm",
      name: "initGit",
      message: chalk3.cyan("?") + " Initialize a Git repository?",
      default: true
    }
  ]);
  projectName = answers.projectName || projectName;
  const projectPath = path23.resolve(process.cwd(), projectName);
  const options = {
    projectName,
    projectPath,
    template: answers.template || opts.template || "full-system",
    database: answers.database || opts.db || "sqlite",
    authProvider: answers.authProvider || opts.auth || "discord",
    includeExampleCode: answers.includeExampleCode ?? opts.examples !== false,
    packageManager: answers.packageManager || opts.pm || "npm",
    components: answers.components || ["ui-essentials", "feedback", "navigation", "forms", "layout"],
    componentGroups: answers.components || ["ui-essentials", "feedback", "navigation", "data-display", "forms", "layout"],
    initGit: answers.initGit ?? true,
    skipInstall: opts.install === false
  };
  if (fs23.existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: chalk3.yellow("\u26A0") + ` Directory ${chalk3.cyan(projectName)} already exists. Overwrite?`,
        default: false
      }
    ]);
    if (!overwrite) {
      console.log(chalk3.red("\n\u2716 Operation cancelled\n"));
      process.exit(1);
    }
    const spinner = ora3("Removing existing directory...").start();
    await fs23.remove(projectPath);
    spinner.succeed("Removed existing directory");
  }
  await runProjectCreation(options);
}
async function runProjectCreation(options) {
  console.log();
  console.log(chalk3.cyan.bold("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510"));
  console.log(chalk3.cyan.bold("\u2502") + chalk3.white.bold("                    Project Configuration                    ") + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Project:")}      ${chalk3.white(options.projectName.padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Template:")}     ${chalk3.white((TEMPLATES[options.template]?.name || options.template).padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Database:")}     ${chalk3.white(options.database.padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Auth:")}         ${chalk3.white(options.authProvider.padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Components:")}   ${chalk3.white((options.components.length + " groups").padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2502") + `  ${chalk3.gray("Package Mgr:")}  ${chalk3.white(options.packageManager.padEnd(42))}` + chalk3.cyan.bold("\u2502"));
  console.log(chalk3.cyan.bold("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"));
  console.log();
  await createProject(options);
  console.log();
  console.log(chalk3.green.bold("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
  console.log(chalk3.green.bold("\u2551") + chalk3.white.bold("              \u2713 Project created successfully!                 ") + chalk3.green.bold("\u2551"));
  console.log(chalk3.green.bold("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
  console.log();
  const pmRun = getPmRunCommand(options.packageManager);
  console.log(chalk3.white.bold("  Next steps:\n"));
  console.log(`  ${chalk3.cyan("1.")} ${chalk3.white("cd")} ${chalk3.cyan(options.projectName)}`);
  console.log();
  console.log(`  ${chalk3.cyan("2.")} ${chalk3.white("Set up environment variables:")}`);
  console.log(`     ${chalk3.gray("Copy .env.example to .env and add your secrets")}`);
  console.log();
  console.log(`  ${chalk3.cyan("3.")} ${chalk3.white("Initialize database:")}`);
  console.log(`     ${chalk3.cyan(pmRun("db:push"))}`);
  console.log();
  console.log(`  ${chalk3.cyan("4.")} ${chalk3.white("Start development server:")}`);
  console.log(`     ${chalk3.cyan(pmRun("dev"))}`);
  console.log();
  console.log(chalk3.gray("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
  console.log();
  console.log(`  ${chalk3.white("Useful commands:")}`);
  console.log(`     ${chalk3.cyan(pmRun("dev"))}          ${chalk3.gray("Start dev server")}`);
  console.log(`     ${chalk3.cyan(pmRun("build"))}        ${chalk3.gray("Build for production")}`);
  console.log(`     ${chalk3.cyan(pmRun("db:studio"))}    ${chalk3.gray("Open Prisma Studio")}`);
  console.log(`     ${chalk3.cyan(pmRun("lint"))}         ${chalk3.gray("Run linter")}`);
  console.log();
  console.log(chalk3.gray("  Happy coding! \u{1F389}\n"));
}
function getPmRunCommand(pm) {
  return (script) => {
    switch (pm) {
      case "npm":
        return `npm run ${script}`;
      case "pnpm":
        return `pnpm ${script}`;
      case "yarn":
        return `yarn ${script}`;
      case "bun":
        return `bun run ${script}`;
      default:
        return `npm run ${script}`;
    }
  };
}
main().catch((err) => {
  console.error(chalk3.red("\n\u2716 Error:"), err.message || err);
  if (process.env.DEBUG) {
    console.error(err);
  }
  process.exit(1);
});
