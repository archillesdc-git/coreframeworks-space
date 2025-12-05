import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generatePrismaSchema(options: ProjectOptions): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "prisma", "schema.prisma"), content);

  // Generate seed file
  await generateSeedFile(projectPath, template);
}

async function generateSeedFile(projectPath: string, template: string): Promise<void> {
  const content = `import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * Run with: npm run db:seed
 */
async function main() {
  console.log("🌱 Starting database seed...");

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
  console.log("✅ Categories created:", categories.length);

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
  console.log("✅ Tags created:", tags.length);

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
  console.log("✅ Settings created:", settings.length);
` : ""}

  console.log("🌱 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  await fs.writeFile(path.join(projectPath, "prisma", "seed.ts"), content);
}
