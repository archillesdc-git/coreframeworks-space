# API Reference

Complete API documentation for ArchillesDC.

## tRPC Setup

### Configuration

Location: `src/server/api/trpc.ts`

```ts
import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

// Context
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return {
    db,
    session,
    userId: session?.user?.id,
    userRole: session?.user?.role,
    ...opts,
  };
};

// tRPC initialization
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
```

### Procedures

#### publicProcedure
No authentication required.

```ts
export const publicProcedure = t.procedure;
```

#### protectedProcedure
Requires authenticated user.

```ts
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
```

#### adminProcedure
Requires admin role.

```ts
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.userRole !== "admin" && ctx.userRole !== "superadmin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next(ctx);
});
```

#### rateLimitedProcedure
Includes rate limiting.

```ts
export const rateLimitedProcedure = publicProcedure.use(rateLimitMiddleware);
```

---

## Built-in Routers

### Post Router

Location: `src/server/api/routers/post.ts`

#### getAll
Get all posts with pagination.

```ts
input: z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  published: z.boolean().optional(),
})

output: {
  items: Post[],
  total: number,
  page: number,
  totalPages: number,
  hasMore: boolean,
}
```

#### getById
Get single post by ID or slug.

```ts
input: z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
})

output: Post | null
```

#### create (protected)
Create a new post.

```ts
input: z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
})

output: Post
```

#### update (protected)
Update an existing post.

```ts
input: z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
})

output: Post
```

#### delete (protected)
Delete a post.

```ts
input: z.object({ id: z.string() })
output: { success: true }
```

---

### User Router

Location: `src/server/api/routers/user.ts`

#### getProfile (protected)
Get current user's profile.

```ts
input: none
output: User
```

#### updateProfile (protected)
Update current user's profile.

```ts
input: z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
})

output: User
```

#### updateSettings (protected)
Update user settings.

```ts
input: z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z.boolean().optional(),
  language: z.string().optional(),
})

output: User
```

#### changePassword (protected)
Change password (credentials auth only).

```ts
input: z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})

output: { success: true }
```

#### deleteAccount (protected)
Delete current user's account.

```ts
input: z.object({
  confirmation: z.literal("DELETE"),
})

output: { success: true }
```

---

### Admin Router

Location: `src/server/api/routers/admin.ts`

#### getStats (admin)
Get admin dashboard statistics.

```ts
input: none
output: {
  users: { total, new: number },
  posts: { total, published: number },
  activity: { today, week: number },
}
```

#### getUsers (admin)
Get all users with pagination.

```ts
input: z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().optional(),
  role: z.string().optional(),
})

output: {
  items: User[],
  total: number,
  page: number,
  totalPages: number,
}
```

#### updateUserRole (admin)
Change a user's role.

```ts
input: z.object({
  userId: z.string(),
  role: z.enum(["user", "moderator", "admin"]),
})

output: User
```

#### deleteUser (admin)
Delete a user.

```ts
input: z.object({ userId: z.string() })
output: { success: true }
```

#### getActivityLogs (admin)
Get system activity logs.

```ts
input: z.object({
  page: z.number().default(1),
  limit: z.number().default(50),
  type: z.string().optional(),
})

output: Activity[]
```

---

## Using tRPC

### Client-side (React)

```tsx
"use client";
import { api } from "@/trpc/react";

function PostList() {
  // Query
  const { data, isLoading } = api.post.getAll.useQuery({ page: 1 });

  // Mutation
  const createMutation = api.post.create.useMutation({
    onSuccess: () => {
      // Invalidate cache
      utils.post.getAll.invalidate();
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      title: "New Post",
      content: "Content here",
    });
  };
}
```

### Server-side (RSC)

```tsx
import { api } from "@/trpc/server";

async function PostPage({ params }: { params: { id: string } }) {
  const post = await api.post.getById({ id: params.id });
  
  return <PostView post={post} />;
}
```

### Server Actions

```tsx
"use server";
import { api } from "@/trpc/server";

export async function createPost(data: { title: string; content: string }) {
  return api.post.create(data);
}
```

---

## CRUD Helper

Location: `src/lib/crud-helper.ts`

### Pagination Schema

```ts
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
```

### Sorting Schema

```ts
export const sortingSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
```

### Filter Schema

```ts
export const filterSchema = z.object({
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
```

### createCrudInputs

Generate standard CRUD input schemas:

```ts
const inputs = createCrudInputs({
  name: z.string(),
  price: z.number(),
  active: z.boolean(),
});

// inputs.getAll - Pagination + filters
// inputs.getById - { id: z.string() }
// inputs.create - { name, price, active }
// inputs.update - { id, name?, price?, active? }
// inputs.delete - { id: z.string() }
```

### paginatedResponse

Format paginated results:

```ts
const result = paginatedResponse(items, total, page, limit);
// {
//   items: [...],
//   total: 100,
//   page: 1,
//   limit: 20,
//   totalPages: 5,
//   hasMore: true,
// }
```

### handleCrudError

Standard error handler:

```ts
try {
  // operation
} catch (error) {
  handleCrudError(error, "Creating post");
  // Throws TRPCError with proper code
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `TOO_MANY_REQUESTS` | 429 | Rate limited |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Middleware

### Rate Limiting

```ts
const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const key = ctx.userId || ctx.headers.get("x-forwarded-for");
  const limit = 100; // requests per minute
  
  // Check rate limit
  if (isRateLimited(key, limit)) {
    throw new TRPCError({ 
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests",
    });
  }
  
  return next();
});
```

### Logging

```ts
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  
  console.log(`${type} ${path} - ${duration}ms`);
  
  return result;
});
```

### Timing

```ts
const timingMiddleware = t.middleware(async ({ path, next }) => {
  const start = performance.now();
  const result = await next();
  const end = performance.now();
  
  if (end - start > 1000) {
    console.warn(`Slow query: ${path} took ${end - start}ms`);
  }
  
  return result;
});
```
