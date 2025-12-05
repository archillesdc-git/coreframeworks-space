import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateComponentFiles(options: ProjectOptions): Promise<void> {
  const { projectPath, componentGroups, template } = options;

  // Always generate essential UI components
  await generateEssentialComponents(projectPath);

  // Generate based on selected groups
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

async function generateEssentialComponents(projectPath: string): Promise<void> {
  // Button
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "button.tsx"), button);

  // Input
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "input.tsx"), input);

  // Card
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "card.tsx"), card);

  // Badge
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "badge.tsx"), badge);

  // Avatar
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "avatar.tsx"), avatar);

  // Spinner
  const spinner = `import { cn } from "@/utils/cn";

interface SpinnerProps { size?: "sm" | "md" | "lg"; className?: string; }

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent text-violet-500", sizes[size], className)} />
  );
}
`;
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "spinner.tsx"), spinner);

  // Index export
  const index = `export * from "./button";
export * from "./input";
export * from "./card";
export * from "./badge";
export * from "./avatar";
export * from "./spinner";
`;
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "index.ts"), index);
}

async function generateFeedbackComponents(projectPath: string): Promise<void> {
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "toast.tsx"), toast);

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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "modal.tsx"), modal);
}

async function generateNavigationComponents(projectPath: string): Promise<void> {
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
          {collapsed ? "→" : "←"}
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
  await fs.writeFile(path.join(projectPath, "src", "components", "layout", "sidebar.tsx"), sidebar);

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
  await fs.writeFile(path.join(projectPath, "src", "components", "layout", "header.tsx"), header);
}

async function generateDataDisplayComponents(projectPath: string): Promise<void> {
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "table.tsx"), table);

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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "stats.tsx"), stats);
}

async function generateFormComponents(projectPath: string): Promise<void> {
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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "select.tsx"), select);

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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "checkbox.tsx"), checkbox);

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
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "textarea.tsx"), textarea);
}

async function generateLayoutComponents(projectPath: string): Promise<void> {
  const container = `import { cn } from "@/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ className, size = "lg", children, ...props }: ContainerProps) {
  const sizes = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "max-w-full" };
  return <div className={cn("mx-auto w-full px-4", sizes[size], className)} {...props}>{children}</div>;
}
`;
  await fs.writeFile(path.join(projectPath, "src", "components", "ui", "container.tsx"), container);
}
