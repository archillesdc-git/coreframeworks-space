# CLI Reference

Complete documentation for the ArchillesDC CLI tool.

## Installation

```bash
# Using npx (no install needed)
npx create-archillesdc-app my-app

# Global installation
npm install -g create-archillesdc-app
archillesdc create my-app
```

## Commands

### create

Create a new ArchillesDC project.

```bash
archillesdc create [project-name] [options]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `project-name` | Name of the project (optional, will prompt if not provided) |

#### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--yes` | `-y` | Skip all prompts, use defaults | `false` |
| `--template <type>` | `-t` | Template type | `full-system` |
| `--db <database>` | | Database provider | `sqlite` |
| `--auth <provider>` | | Authentication provider | `discord` |
| `--pm <manager>` | | Package manager | `npm` |
| `--no-examples` | | Skip example code | `false` |
| `--no-install` | | Skip dependency installation | `false` |

#### Template Types

| Template | Description |
|----------|-------------|
| `full-system` | Complete app with auth, dashboard, admin, all components |
| `admin` | Admin panel with data tables, charts, user management |
| `dashboard` | User dashboard with sidebar, widgets, stats |
| `barebones` | Minimal setup with essentials only |

#### Database Providers

| Provider | Connection String |
|----------|------------------|
| `sqlite` | `file:./db.sqlite` |
| `postgresql` | `postgresql://user:pass@localhost:5432/db` |
| `mysql` | `mysql://user:pass@localhost:3306/db` |

#### Auth Providers

| Provider | Requirements |
|----------|-------------|
| `discord` | `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` |
| `github` | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` |
| `google` | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |
| `credentials` | Password hashing with bcryptjs |
| `none` | No authentication setup |

#### Examples

```bash
# Interactive mode
archillesdc create

# Quick mode with defaults
archillesdc create my-app -y

# Specific configuration
archillesdc create my-app \
  --template admin \
  --db postgresql \
  --auth github \
  --pm pnpm

# Create without installing dependencies
archillesdc create my-app -y --no-install
```

---

### generate

Generate code within an existing project.

```bash
archillesdc generate <type> <name> [options]
# Alias: archillesdc g <type> <name>
```

---

### generate page

Generate a new page with loading state.

```bash
archillesdc generate page <name> [options]
# Alias: archillesdc g page <name>
```

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--route <path>` | `-r` | Custom route path |
| `--protected` | `-p` | Add authentication guard |
| `--admin` | `-a` | Add admin role guard |

#### Examples

```bash
# Basic page at /dashboard
archillesdc g page dashboard

# Page at /user/profile
archillesdc g page profile --route user/profile

# Protected page (requires login)
archillesdc g page settings --protected

# Admin-only page
archillesdc g page users --admin
```

#### Generated Files

```
src/app/(dashboard)/<route>/
├── page.tsx       # Page component
└── loading.tsx    # Loading state
```

#### Generated Code

```tsx
// page.tsx (with --protected)
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata = {
  title: "Settings",
  description: "Settings page",
};

export default function SettingsPage() {
  return (
    <RoleGuard requiredRole="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        {/* Your content */}
      </div>
    </RoleGuard>
  );
}
```

---

### generate crud

Generate full CRUD with model, API, components, and page.

```bash
archillesdc generate crud <name> [options]
# Alias: archillesdc g crud <name>
```

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--fields <fields>` | `-f` | Model fields definition |
| `--no-page` | | Skip page generation |
| `--no-api` | | Skip API router generation |

#### Field Format

```
fieldName:type,fieldName:type,...
```

#### Field Types

| Type | Prisma | Zod | TypeScript | Default |
|------|--------|-----|------------|---------|
| `string` | `String` | `z.string()` | `string` | `""` |
| `number` | `Int` | `z.number()` | `number` | `0` |
| `float` | `Float` | `z.number()` | `number` | `0` |
| `boolean` | `Boolean` | `z.boolean()` | `boolean` | `false` |
| `date` | `DateTime` | `z.date()` | `Date` | - |
| `text` | `String @db.Text` | `z.string()` | `string` | `""` |
| `json` | `Json` | `z.unknown()` | `unknown` | - |

Add `?` for optional fields: `description:text?`

#### Examples

```bash
# Simple CRUD
archillesdc g crud posts -f "title:string,content:text"

# Product with multiple fields
archillesdc g crud products -f "name:string,price:float,description:text?,active:boolean"

# API only (no page)
archillesdc g crud tags -f "name:string,slug:string" --no-page
```

#### Generated Files

```
prisma/schema.prisma                    # Model added
src/server/api/routers/<name>.ts        # tRPC router
src/components/<name>/
├── <name>-list.tsx                     # List component
├── <name>-form.tsx                     # Form component
└── index.ts                            # Exports
src/app/(dashboard)/<names>/
└── page.tsx                            # Management page
```

#### After Generation

```bash
# 1. Add router to root.ts
import { productsRouter } from "./routers/products";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});

# 2. Update database
npm run db:push
```

---

### generate api

Generate a tRPC router with CRUD operations.

```bash
archillesdc generate api <name> [options]
# Alias: archillesdc g api <name>
```

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--fields <fields>` | `-f` | Fields for input validation |

#### Examples

```bash
archillesdc g api orders -f "customerId:string,total:number,status:string"
archillesdc g api comments -f "postId:string,content:text,approved:boolean"
```

#### Generated File

```
src/server/api/routers/<name>.ts
```

#### Generated Router

```ts
export const ordersRouter = createTRPCRouter({
  getAll: publicProcedure.input(...).query(...),
  getById: publicProcedure.input(...).query(...),
  create: protectedProcedure.input(...).mutation(...),
  update: protectedProcedure.input(...).mutation(...),
  delete: protectedProcedure.input(...).mutation(...),
});
```

---

### generate module

Generate a complete feature module (alias for crud).

```bash
archillesdc generate module <name> [options]
# Alias: archillesdc g module <name>
```

Same as `generate crud`.

---

### generate component

Generate a React component.

```bash
archillesdc generate component <name> [options]
# Alias: archillesdc g component <name>
```

#### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--type <type>` | `-t` | Component type | `ui` |

#### Component Types

| Type | Location |
|------|----------|
| `ui` | `src/components/ui/` |
| `layout` | `src/components/layout/` |
| `form` | `src/components/forms/` |

#### Examples

```bash
archillesdc g component DataCard -t ui
archillesdc g component PageHeader -t layout
archillesdc g component ContactForm -t form
```

#### Generated Code

```tsx
import { cn } from "@/utils/cn";

interface DataCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function DataCard({ className, children }: DataCardProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
```

---

## Configuration

### Project Detection

The CLI looks for the project root by finding `package.json` with Next.js as a dependency. Run commands from within your project directory.

### Naming Conventions

| Input | PascalCase | camelCase | kebab-case |
|-------|------------|-----------|------------|
| `user-profile` | `UserProfile` | `userProfile` | `user-profile` |
| `UserProfile` | `UserProfile` | `userProfile` | `user-profile` |
| `user_profile` | `UserProfile` | `userProfile` | `user-profile` |

### Pluralization

| Singular | Plural |
|----------|--------|
| `post` | `posts` |
| `category` | `categories` |
| `status` | `statuses` |

---

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |

---

## Environment

| Variable | Description |
|----------|-------------|
| `DEBUG` | Enable debug output |
| `NO_COLOR` | Disable colored output |

```bash
DEBUG=1 archillesdc create my-app
```
