export const metadata = {
    title: "API (tRPC) Module - ArchillesDC Docs",
    description: "Complete API documentation and reference",
};

export default function ApiModulePage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">API Reference (tRPC)</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Complete API documentation for ArchillesDC using tRPC.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">tRPC Setup</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Configuration</h3>
            <p className="text-gray-400 mb-4">Location: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">src/server/api/trpc.ts</code></p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { initTRPC, TRPCError } from "@trpc/server";
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
});`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Procedures</h3>

            <h4 className="text-lg font-medium mt-6 mb-2 text-white">publicProcedure</h4>
            <p className="text-gray-400 mb-2">No authentication required.</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">export const publicProcedure = t.procedure;</pre>
            </div>

            <h4 className="text-lg font-medium mt-6 mb-2 text-white">protectedProcedure</h4>
            <p className="text-gray-400 mb-2">Requires authenticated user.</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});`}</pre>
            </div>

            <h4 className="text-lg font-medium mt-6 mb-2 text-white">adminProcedure</h4>
            <p className="text-gray-400 mb-2">Requires admin role.</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.userRole !== "admin" && ctx.userRole !== "superadmin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next(ctx);
});`}</pre>
            </div>

            <hr className="my-12 border-white/10" />

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Built-in Routers</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Post Router</h3>
            <p className="text-gray-400 mb-4">Location: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">src/server/api/routers/post.ts</code></p>

            <h4 className="text-lg font-medium mt-6 mb-2 text-white">getAll</h4>
            <p className="text-gray-400 mb-2">Get all posts with pagination.</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`input: z.object({
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
}`}</pre>
            </div>

            <h4 className="text-lg font-medium mt-6 mb-2 text-white">create (protected)</h4>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-6 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`input: z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
})

output: Post`}</pre>
            </div>

            <hr className="my-12 border-white/10" />

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Using tRPC</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Client-side (React)</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`"use client";
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
}`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Server-side (RSC)</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { api } from "@/trpc/server";

async function PostPage({ params }: { params: { id: string } }) {
  const post = await api.post.getById({ id: params.id });
  
  return <PostView post={post} />;
}`}</pre>
            </div>

            <hr className="my-12 border-white/10" />

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Error Codes</h2>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Code</th><th className="px-4 py-3 font-medium">HTTP Status</th><th className="px-4 py-3 font-medium">Description</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">BAD_REQUEST</td><td className="px-4 py-3">400</td><td className="px-4 py-3">Invalid input</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">UNAUTHORIZED</td><td className="px-4 py-3">401</td><td className="px-4 py-3">Not authenticated</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">FORBIDDEN</td><td className="px-4 py-3">403</td><td className="px-4 py-3">Not authorized</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">NOT_FOUND</td><td className="px-4 py-3">404</td><td className="px-4 py-3">Resource not found</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">CONFLICT</td><td className="px-4 py-3">409</td><td className="px-4 py-3">Resource conflict</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">TOO_MANY_REQUESTS</td><td className="px-4 py-3">429</td><td className="px-4 py-3">Rate limited</td></tr>
                        <tr><td className="px-4 py-3 font-mono text-violet-400 text-xs">INTERNAL_SERVER_ERROR</td><td className="px-4 py-3">500</td><td className="px-4 py-3">Server error</td></tr>
                    </tbody>
                </table>
            </div>
        </article>
    );
}
