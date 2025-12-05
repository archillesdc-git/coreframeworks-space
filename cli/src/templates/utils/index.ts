import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateUtilsFiles(options: ProjectOptions): Promise<void> {
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
    generateValidators(projectPath),
  ]);
}

async function generateCnUtil(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "utils", "cn.ts"), content);
}

async function generateFormatters(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "utils", "formatters.ts"), content);
}

async function generateConstants(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "utils", "constants.ts"), content);
}

async function generateLogger(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "lib", "logger.ts"), content);
}

async function generateErrorHandler(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "lib", "error-handler.ts"), content);
}

async function generateHooks(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "hooks", "index.ts"), content);
}

async function generateTypes(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "types", "index.ts"), content);
}

async function generateValidators(projectPath: string): Promise<void> {
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

  await fs.writeFile(path.join(projectPath, "src", "lib", "validators.ts"), content);
}

async function generateFavicon(projectPath: string): Promise<void> {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7c3aed"/>
  <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui" font-weight="bold" font-size="18">A</text>
</svg>`;

  await fs.writeFile(path.join(projectPath, "public", "favicon.svg"), svgContent);
}
