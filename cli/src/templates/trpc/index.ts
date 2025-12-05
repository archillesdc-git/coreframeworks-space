import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateTrpcFiles(options: ProjectOptions): Promise<void> {
    const { projectPath, includeExampleCode, template } = options;

    await Promise.all([
        generateTrpcSetup(projectPath),
        generateTrpcRoot(projectPath, includeExampleCode, template),
        generateTrpcReact(projectPath),
        generateTrpcServer(projectPath),
        generateQueryClient(projectPath),
        generateTrpcRoute(projectPath),
        generateCrudHelper(projectPath),
        ...(includeExampleCode ? [
            generatePostRouter(projectPath),
            generateUserRouter(projectPath, template),
        ] : []),
        ...(template === "admin" || template === "full-system" ? [
            generateAdminRouter(projectPath),
        ] : []),
    ]);
}

async function generateTrpcSetup(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "server", "api", "trpc.ts"), content);
}

async function generateTrpcRoot(projectPath: string, includeExampleCode: boolean, template: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "server", "api", "root.ts"), content);
}

async function generateTrpcReact(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "trpc", "react.tsx"), content);
}

async function generateTrpcServer(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "trpc", "server.ts"), content);
}

async function generateQueryClient(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "trpc", "query-client.ts"), content);
}

async function generateTrpcRoute(projectPath: string): Promise<void> {
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
            console.error(\`❌ tRPC failed on \${path ?? "<no-path>"}: \${error.message}\`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
`;

    await fs.writeFile(
        path.join(projectPath, "src", "app", "api", "trpc", "[trpc]", "route.ts"),
        content
    );
}

async function generateCrudHelper(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "lib", "crud-helper.ts"), content);
}

async function generatePostRouter(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "server", "api", "routers", "post.ts"), content);
}

async function generateUserRouter(projectPath: string, template: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "server", "api", "routers", "user.ts"), content);
}

async function generateAdminRouter(projectPath: string): Promise<void> {
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

    await fs.writeFile(path.join(projectPath, "src", "server", "api", "routers", "admin.ts"), content);
}
