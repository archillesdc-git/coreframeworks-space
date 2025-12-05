import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../create-project.js";

// Import all template generators
import { generatePackageJson } from "./base/package-json.js";
import { generateTsConfig } from "./base/tsconfig.js";
import { generateNextConfig } from "./base/next-config.js";
import { generateEnvFiles } from "./base/env-files.js";
import { generateGitIgnore } from "./base/gitignore.js";
import { generateEslintConfig } from "./base/eslint-config.js";
import { generatePrettierConfig } from "./base/prettier-config.js";
import { generatePostcssConfig } from "./base/postcss-config.js";
import { generatePrismaSchema } from "./prisma/schema.js";
import { generateDbConnection } from "./prisma/db.js";
import { generateEnvJs } from "./env/env-js.js";
import { generateAuthFiles } from "./auth/index.js";
import { generateTrpcFiles } from "./trpc/index.js";
import { generateStyleFiles } from "./styles/index.js";
import { generateAppFiles } from "./app/index.js";
import { generateComponentFiles } from "./components/index.js";
import { generateUtilsFiles } from "./utils/index.js";
import { generateReadme } from "./base/readme.js";

export async function generateTemplateFiles(
    options: ProjectOptions
): Promise<void> {
    const { projectPath, template, components } = options;

    // Create base directory structure
    await createDirectoryStructure(projectPath, template);

    // Generate all template files based on template type
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
        generateStyleFiles(options),
    ];

    // Add template-specific generators
    if (template !== "barebones") {
        generators.push(generateAppFiles(options));
        generators.push(generateComponentFiles(options));
    } else {
        generators.push(generateBarebonesFiles(options));
    }

    // Utils (always included)
    generators.push(generateUtilsFiles(options));

    // Add component-specific generators based on selection
    if (components.includes("data-display")) {
        generators.push(generateDataDisplayComponents(options));
    }

    if (components.includes("forms")) {
        generators.push(generateFormComponents(options));
    }

    // Add admin-specific files for admin template
    if (template === "admin" || template === "full-system") {
        generators.push(generateAdminFiles(options));
    }

    await Promise.all(generators);
}

async function createDirectoryStructure(projectPath: string, template: string): Promise<void> {
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
        "public",
    ];

    const templateDirectories: Record<string, string[]> = {
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
            "src/components/charts",
        ],
        "admin": [
            "src/app/(auth)/login",
            "src/app/(dashboard)",
            "src/app/(dashboard)/admin",
            "src/app/(dashboard)/admin/users",
            "src/app/(dashboard)/admin/settings",
            "src/components/admin",
            "src/components/charts",
        ],
        "dashboard": [
            "src/app/(auth)/login",
            "src/app/(auth)/register",
            "src/app/(dashboard)",
            "src/app/(dashboard)/settings",
            "src/components/forms",
        ],
        "barebones": [
            "src/app/(auth)/login",
        ],
    };

    const directories = [
        ...baseDirectories,
        ...(templateDirectories[template] || []),
    ];

    for (const dir of directories) {
        await fs.ensureDir(path.join(projectPath, dir));
    }
}

async function generateBarebonesFiles(options: ProjectOptions): Promise<void> {
    const { projectPath, projectName } = options;

    // Minimal layout
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

    // Minimal home page
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

    await fs.writeFile(path.join(projectPath, "src", "app", "layout.tsx"), layoutContent);
    await fs.writeFile(path.join(projectPath, "src", "app", "page.tsx"), homePageContent);

    // Minimal login page
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

    await fs.writeFile(path.join(projectPath, "src", "app", "(auth)", "login", "page.tsx"), loginPageContent);
}

async function generateDataDisplayComponents(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    // Table component
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

    // Stats component
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

    await fs.writeFile(path.join(projectPath, "src", "components", "ui", "table.tsx"), tableContent);
    await fs.writeFile(path.join(projectPath, "src", "components", "ui", "stats.tsx"), statsContent);
}

async function generateFormComponents(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    // Select component
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

    // Checkbox component
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

    // Textarea component
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

    await fs.writeFile(path.join(projectPath, "src", "components", "ui", "select.tsx"), selectContent);
    await fs.writeFile(path.join(projectPath, "src", "components", "ui", "checkbox.tsx"), checkboxContent);
    await fs.writeFile(path.join(projectPath, "src", "components", "ui", "textarea.tsx"), textareaContent);
}

async function generateAdminFiles(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    // Admin layout
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

    // Admin page
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

    // Users management page
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

    await fs.ensureDir(path.join(projectPath, "src", "app", "(dashboard)", "admin"));
    await fs.ensureDir(path.join(projectPath, "src", "app", "(dashboard)", "admin", "users"));

    await fs.writeFile(
        path.join(projectPath, "src", "app", "(dashboard)", "admin", "layout.tsx"),
        adminLayoutContent
    );
    await fs.writeFile(
        path.join(projectPath, "src", "app", "(dashboard)", "admin", "page.tsx"),
        adminPageContent
    );
    await fs.writeFile(
        path.join(projectPath, "src", "app", "(dashboard)", "admin", "users", "page.tsx"),
        usersPageContent
    );
}
