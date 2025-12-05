import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs-extra";

/**
 * Generator Command
 * Usage: archillesdc generate <type> <name>
 */
export function registerGeneratorCommand(program: Command): void {
    const generate = program
        .command("generate")
        .alias("g")
        .description("Generate pages, CRUD, modules, or APIs");

    // Page Generator
    generate
        .command("page <name>")
        .description("Generate a new page with layout")
        .option("-r, --route <route>", "Custom route path")
        .option("-p, --protected", "Add authentication guard")
        .option("-a, --admin", "Add admin role guard")
        .action(async (name: string, options) => {
            await generatePage(name, options);
        });

    // CRUD Generator
    generate
        .command("crud <name>")
        .description("Generate full CRUD (model, API, components, page)")
        .option("-f, --fields <fields>", "Fields (e.g., 'name:string,price:number,active:boolean')")
        .option("--no-page", "Skip page generation")
        .option("--no-api", "Skip API generation")
        .action(async (name: string, options) => {
            await generateCrud(name, options);
        });

    // Module Generator
    generate
        .command("module <name>")
        .description("Generate a complete feature module")
        .option("-f, --fields <fields>", "Model fields")
        .action(async (name: string, options) => {
            await generateModule(name, options);
        });

    // API Generator
    generate
        .command("api <name>")
        .description("Generate tRPC router with CRUD operations")
        .option("-f, --fields <fields>", "Fields for input validation")
        .action(async (name: string, options) => {
            await generateApi(name, options);
        });

    // Component Generator
    generate
        .command("component <name>")
        .description("Generate a React component")
        .option("-t, --type <type>", "Component type (ui, layout, form)", "ui")
        .action(async (name: string, options) => {
            await generateComponent(name, options);
        });
}

// ============================================
// Page Generator
// ============================================
async function generatePage(name: string, options: { route?: string; protected?: boolean; admin?: boolean }): Promise<void> {
    const spinner = ora(`Generating page: ${name}`).start();

    try {
        const projectRoot = await findProjectRoot();
        const pageName = toPascalCase(name);
        const routePath = options.route || toKebabCase(name);
        const pageDir = path.join(projectRoot, "src", "app", `(dashboard)`, routePath);

        await fs.ensureDir(pageDir);

        // Generate page.tsx
        const pageContent = generatePageContent(pageName, {
            protected: options.protected,
            admin: options.admin,
        });
        await fs.writeFile(path.join(pageDir, "page.tsx"), pageContent);

        // Generate loading.tsx
        const loadingContent = generateLoadingContent();
        await fs.writeFile(path.join(pageDir, "loading.tsx"), loadingContent);

        spinner.succeed(chalk.green(`Generated page: ${chalk.cyan(routePath)}`));
        console.log(chalk.gray(`  └─ src/app/(dashboard)/${routePath}/page.tsx`));
        console.log(chalk.gray(`  └─ src/app/(dashboard)/${routePath}/loading.tsx`));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to generate page: ${name}`));
        console.error(error);
    }
}

function generatePageContent(name: string, options: { protected?: boolean; admin?: boolean }): string {
    const guardImport = options.admin || options.protected
        ? `import { RoleGuard } from "@/components/auth/role-guard";`
        : "";

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

function generateLoadingContent(): string {
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

// ============================================
// CRUD Generator
// ============================================
async function generateCrud(name: string, options: { fields?: string; page?: boolean; api?: boolean }): Promise<void> {
    const spinner = ora(`Generating CRUD for: ${name}`).start();

    try {
        const projectRoot = await findProjectRoot();
        const modelName = toPascalCase(name);
        const modelNameLower = toCamelCase(name);
        const modelNamePlural = pluralize(modelNameLower);
        const fields = parseFields(options.fields || "name:string");

        // 1. Generate Prisma Model
        spinner.text = "Adding Prisma model...";
        await appendPrismaModel(projectRoot, modelName, fields);

        // 2. Generate tRPC Router
        if (options.api !== false) {
            spinner.text = "Generating tRPC router...";
            await generateCrudRouter(projectRoot, modelName, modelNameLower, fields);
        }

        // 3. Generate Components
        spinner.text = "Generating components...";
        await generateCrudComponents(projectRoot, modelName, modelNameLower, fields);

        // 4. Generate Page
        if (options.page !== false) {
            spinner.text = "Generating page...";
            await generateCrudPage(projectRoot, modelName, modelNameLower, modelNamePlural);
        }

        spinner.succeed(chalk.green(`Generated CRUD for: ${chalk.cyan(modelName)}`));
        console.log(chalk.gray(`  └─ prisma/schema.prisma (model ${modelName})`));
        console.log(chalk.gray(`  └─ src/server/api/routers/${modelNameLower}.ts`));
        console.log(chalk.gray(`  └─ src/components/${modelNameLower}/`));
        if (options.page !== false) {
            console.log(chalk.gray(`  └─ src/app/(dashboard)/${toKebabCase(modelNamePlural)}/`));
        }
        console.log();
        console.log(chalk.yellow("  Don't forget to:"));
        console.log(chalk.gray(`  1. Run ${chalk.cyan("npx prisma db push")} to update the database`));
        console.log(chalk.gray(`  2. Add the router to ${chalk.cyan("src/server/api/root.ts")}`));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to generate CRUD: ${name}`));
        console.error(error);
    }
}

interface Field {
    name: string;
    type: string;
    optional?: boolean;
}

function parseFields(fieldsStr: string): Field[] {
    return fieldsStr.split(",").map((f) => {
        const [name, type] = f.trim().split(":");
        const isOptional = type?.endsWith("?");
        return {
            name: name.trim(),
            type: (type?.replace("?", "") || "string").trim(),
            optional: isOptional,
        };
    });
}

async function appendPrismaModel(projectRoot: string, modelName: string, fields: Field[]): Promise<void> {
    const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
    const schema = await fs.readFile(schemaPath, "utf-8");

    // Check if model already exists
    if (schema.includes(`model ${modelName}`)) {
        return; // Skip if exists
    }

    const fieldLines = fields
        .map((f) => {
            const prismaType = toPrismaType(f.type);
            const optional = f.optional ? "?" : "";
            return `  ${f.name}       ${prismaType}${optional}`;
        })
        .join("\n");

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

    await fs.appendFile(schemaPath, modelDef);
}

function toPrismaType(type: string): string {
    const typeMap: Record<string, string> = {
        string: "String",
        number: "Int",
        float: "Float",
        boolean: "Boolean",
        date: "DateTime",
        json: "Json",
        text: "String    @db.Text",
    };
    return typeMap[type.toLowerCase()] || "String";
}

async function generateCrudRouter(projectRoot: string, modelName: string, modelNameLower: string, fields: Field[]): Promise<void> {
    const routerDir = path.join(projectRoot, "src", "server", "api", "routers");
    await fs.ensureDir(routerDir);

    const zodFields = fields
        .map((f) => `      ${f.name}: z.${toZodType(f.type)}()${f.optional ? ".optional()" : ""},`)
        .join("\n");

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

    await fs.writeFile(path.join(routerDir, `${modelNameLower}.ts`), content);
}

function toZodType(type: string): string {
    const typeMap: Record<string, string> = {
        string: "string",
        number: "number",
        float: "number",
        boolean: "boolean",
        date: "date",
        json: "unknown",
        text: "string",
    };
    return typeMap[type.toLowerCase()] || "string";
}

async function generateCrudComponents(projectRoot: string, modelName: string, modelNameLower: string, fields: Field[]): Promise<void> {
    const componentDir = path.join(projectRoot, "src", "components", modelNameLower);
    await fs.ensureDir(componentDir);

    // List Component
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
    await fs.writeFile(path.join(componentDir, `${modelNameLower}-list.tsx`), listContent);

    // Form Component
    const formFields = fields
        .map((f) => {
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
          ${f.optional ? "" : 'required'}
        />`;
        })
        .join("\n");

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
    await fs.writeFile(path.join(componentDir, `${modelNameLower}-form.tsx`), formContent);

    // Index export
    const indexContent = `export * from "./${modelNameLower}-list";
export * from "./${modelNameLower}-form";
`;
    await fs.writeFile(path.join(componentDir, "index.ts"), indexContent);
}

function toTsType(type: string): string {
    const typeMap: Record<string, string> = {
        string: "string",
        number: "number",
        float: "number",
        boolean: "boolean",
        date: "Date",
        json: "unknown",
        text: "string",
    };
    return typeMap[type.toLowerCase()] || "string";
}

function getDefaultValue(type: string): string {
    const defaults: Record<string, string> = {
        string: '""',
        number: "0",
        float: "0",
        boolean: "false",
        text: '""',
    };
    return defaults[type.toLowerCase()] || '""';
}

async function generateCrudPage(projectRoot: string, modelName: string, modelNameLower: string, modelNamePlural: string): Promise<void> {
    const pageDir = path.join(projectRoot, "src", "app", "(dashboard)", toKebabCase(modelNamePlural));
    await fs.ensureDir(pageDir);

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
    await fs.writeFile(path.join(pageDir, "page.tsx"), pageContent);
}

// ============================================
// Module Generator
// ============================================
async function generateModule(name: string, options: { fields?: string }): Promise<void> {
    const spinner = ora(`Generating module: ${name}`).start();

    try {
        // A module is essentially a full CRUD + additional features
        spinner.text = "Generating CRUD...";
        await generateCrud(name, { fields: options.fields, page: true, api: true });

        spinner.succeed(chalk.green(`Generated module: ${chalk.cyan(name)}`));
        console.log();
        console.log(chalk.gray("  Module includes:"));
        console.log(chalk.gray("  ✓ Prisma model"));
        console.log(chalk.gray("  ✓ tRPC router with CRUD"));
        console.log(chalk.gray("  ✓ List component"));
        console.log(chalk.gray("  ✓ Form component"));
        console.log(chalk.gray("  ✓ Management page"));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to generate module: ${name}`));
        console.error(error);
    }
}

// ============================================
// API Generator
// ============================================
async function generateApi(name: string, options: { fields?: string }): Promise<void> {
    const spinner = ora(`Generating API: ${name}`).start();

    try {
        const projectRoot = await findProjectRoot();
        const modelName = toPascalCase(name);
        const modelNameLower = toCamelCase(name);
        const fields = parseFields(options.fields || "name:string");

        await generateCrudRouter(projectRoot, modelName, modelNameLower, fields);

        spinner.succeed(chalk.green(`Generated API router: ${chalk.cyan(modelNameLower)}`));
        console.log(chalk.gray(`  └─ src/server/api/routers/${modelNameLower}.ts`));
        console.log();
        console.log(chalk.yellow("  Don't forget to add to root.ts:"));
        console.log(chalk.cyan(`    import { ${modelNameLower}Router } from "./routers/${modelNameLower}";`));
        console.log(chalk.cyan(`    ${modelNameLower}: ${modelNameLower}Router,`));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to generate API: ${name}`));
        console.error(error);
    }
}

// ============================================
// Component Generator
// ============================================
async function generateComponent(name: string, options: { type: string }): Promise<void> {
    const spinner = ora(`Generating component: ${name}`).start();

    try {
        const projectRoot = await findProjectRoot();
        const componentName = toPascalCase(name);
        const fileName = toKebabCase(name);
        const componentDir = path.join(projectRoot, "src", "components", options.type);

        await fs.ensureDir(componentDir);

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

        await fs.writeFile(path.join(componentDir, `${fileName}.tsx`), content);

        spinner.succeed(chalk.green(`Generated component: ${chalk.cyan(componentName)}`));
        console.log(chalk.gray(`  └─ src/components/${options.type}/${fileName}.tsx`));
    } catch (error) {
        spinner.fail(chalk.red(`Failed to generate component: ${name}`));
        console.error(error);
    }
}

// ============================================
// Utility Functions
// ============================================
async function findProjectRoot(): Promise<string> {
    let currentDir = process.cwd();

    while (currentDir !== path.parse(currentDir).root) {
        if (await fs.pathExists(path.join(currentDir, "package.json"))) {
            const pkg = await fs.readJSON(path.join(currentDir, "package.json"));
            if (pkg.dependencies?.next || pkg.devDependencies?.next) {
                return currentDir;
            }
        }
        currentDir = path.dirname(currentDir);
    }

    return process.cwd();
}

function toPascalCase(str: string): string {
    return str
        .split(/[-_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
}

function toCamelCase(str: string): string {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
}

function pluralize(str: string): string {
    if (str.endsWith("y")) {
        return str.slice(0, -1) + "ies";
    }
    if (str.endsWith("s") || str.endsWith("x") || str.endsWith("ch") || str.endsWith("sh")) {
        return str + "es";
    }
    return str + "s";
}
