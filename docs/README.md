# ArchillesDC Framework

> A powerful CLI and framework for building production-ready full-stack web applications with Next.js, Tailwind CSS, Prisma, tRPC, and NextAuth.js.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [CLI Commands](#cli-commands)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Templates](#templates)
- [Modules](#modules)
- [Components](#components)
- [Configuration](#configuration)

## Quick Start

```bash
# Create a new project
npx create-archillesdc-app my-app

# Navigate to project
cd my-app

# Set up environment
cp .env.example .env

# Push database schema
npm run db:push

# Start development
npm run dev
```

## Installation

### Prerequisites

- Node.js 18.17 or later
- npm, pnpm, yarn, or bun
- Git (optional)

### Create New Project

```bash
# Interactive mode
npx create-archillesdc-app my-app

# Quick mode with defaults
npx create-archillesdc-app my-app -y

# With specific options
npx create-archillesdc-app my-app \
  --template admin \
  --db postgresql \
  --auth github \
  --pm pnpm
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-y, --yes` | Skip prompts, use defaults | - |
| `-t, --template <type>` | Template type | `full-system` |
| `--db <database>` | Database provider | `sqlite` |
| `--auth <provider>` | Auth provider | `discord` |
| `--pm <manager>` | Package manager | `npm` |
| `--no-examples` | Skip example code | - |
| `--no-install` | Skip installation | - |

## CLI Commands

### Create Command

```bash
archillesdc create [project-name] [options]
```

### Generate Command

```bash
# Generate a page
archillesdc generate page <name> [options]
  -r, --route <route>    Custom route path
  -p, --protected        Add authentication guard
  -a, --admin            Add admin role guard

# Generate full CRUD
archillesdc generate crud <name> [options]
  -f, --fields <fields>  Model fields (e.g., "name:string,price:number")
  --no-page              Skip page generation
  --no-api               Skip API generation

# Generate API router
archillesdc generate api <name> [options]
  -f, --fields <fields>  Fields for input validation

# Generate module
archillesdc generate module <name> [options]
  -f, --fields <fields>  Model fields

# Generate component
archillesdc generate component <name> [options]
  -t, --type <type>      Component type (ui, layout, form)
```

### Field Types

| Type | Prisma Type | Zod Type | TypeScript |
|------|-------------|----------|------------|
| `string` | `String` | `z.string()` | `string` |
| `number` | `Int` | `z.number()` | `number` |
| `float` | `Float` | `z.number()` | `number` |
| `boolean` | `Boolean` | `z.boolean()` | `boolean` |
| `date` | `DateTime` | `z.date()` | `Date` |
| `text` | `String @db.Text` | `z.string()` | `string` |
| `json` | `Json` | `z.unknown()` | `unknown` |

## Project Structure

```
my-app/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
├── public/
│   └── favicon.svg          # App favicon
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── (dashboard)/     # Protected pages
│   │   │   ├── admin/       # Admin pages (full-system/admin)
│   │   │   └── settings/    # Settings page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth route
│   │   │   └── trpc/[trpc]/         # tRPC route
│   │   ├── _components/     # Page-specific components
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── error.tsx        # Error boundary
│   │   ├── not-found.tsx    # 404 page
│   │   └── loading.tsx      # Loading state
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   ├── auth/            # Auth components
│   │   └── admin/           # Admin components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── logger.ts        # Logging utility
│   │   ├── error-handler.ts # Error handling
│   │   ├── crud-helper.ts   # CRUD utilities
│   │   └── validators.ts    # Zod schemas
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/     # tRPC routers
│   │   │   ├── root.ts      # Root router
│   │   │   └── trpc.ts      # tRPC config
│   │   ├── auth/
│   │   │   ├── config.ts    # Auth config
│   │   │   ├── index.ts     # Auth exports
│   │   │   └── actions.ts   # Auth server actions
│   │   └── db.ts            # Database client
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── trpc/
│   │   ├── react.tsx        # React client
│   │   ├── server.ts        # Server client
│   │   └── query-client.ts  # Query client
│   ├── types/
│   │   ├── index.ts         # Common types
│   │   └── auth.ts          # Auth types
│   ├── utils/
│   │   ├── cn.ts            # Class merge utility
│   │   ├── formatters.ts    # Formatting utilities
│   │   └── constants.ts     # App constants
│   └── env.js               # Environment validation
├── .env.example
├── .gitignore
├── eslint.config.js
├── next.config.js
├── package.json
├── postcss.config.js
├── prettier.config.js
├── README.md
└── tsconfig.json
```

## Tech Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.x | React framework |
| `react` | 19.x | UI library |
| `react-dom` | 19.x | React DOM |
| `typescript` | 5.x | Type safety |

### Database

| Package | Version | Purpose |
|---------|---------|---------|
| `prisma` | 6.x | Database migrations |
| `@prisma/client` | 6.x | Database client |

### API

| Package | Version | Purpose |
|---------|---------|---------|
| `@trpc/server` | 11.x | Type-safe API |
| `@trpc/client` | 11.x | API client |
| `@trpc/react-query` | 11.x | React integration |
| `@tanstack/react-query` | 5.x | Data fetching |
| `superjson` | 2.x | Serialization |
| `zod` | 3.x | Schema validation |

### Authentication

| Package | Version | Purpose |
|---------|---------|---------|
| `next-auth` | 5.x (beta) | Authentication |
| `@auth/prisma-adapter` | 2.x | Database adapter |
| `bcryptjs` | 2.x | Password hashing |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.x (beta) | CSS framework |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin |
| `clsx` | 2.x | Conditional classes |
| `tailwind-merge` | 2.x | Class merging |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | 9.x | Linting |
| `prettier` | 3.x | Formatting |
| `@types/node` | 22.x | Node types |
| `@types/react` | 19.x | React types |

## Templates

### Full System
Complete application with all features.

**Includes:**
- Authentication pages (login, register)
- User dashboard with sidebar
- Admin panel with user management
- All UI components
- Full API routes
- Example CRUD operations

### Admin Dashboard
Admin panel focused template.

**Includes:**
- Admin layout and navigation
- Data tables with sorting
- Stats and charts
- User management
- Settings pages

### Dashboard
User dashboard template.

**Includes:**
- Dashboard layout
- Sidebar navigation
- Widgets and stats cards
- Basic pages
- Settings

### Barebones
Minimal setup template.

**Includes:**
- Basic layout
- Auth setup (ready to use)
- Database configured
- Minimal components

## Modules

### Auth Module

**Features:**
- Multiple OAuth providers (Discord, GitHub, Google)
- Email/Password authentication
- Role-based access control (user, moderator, admin, superadmin)
- Session management
- Middleware and route guards
- Server actions

**Files:**
- `src/server/auth/config.ts` - Auth configuration
- `src/server/auth/index.ts` - Auth exports
- `src/server/auth/actions.ts` - Server actions
- `src/lib/auth-middleware.ts` - Middleware
- `src/components/auth/role-guard.tsx` - Role guard component
- `src/types/auth.ts` - Auth types

### Database Module

**Features:**
- Prisma ORM setup
- SQLite, PostgreSQL, MySQL support
- Extended schema with common models
- Seed file for initial data
- Singleton pattern for development

**Models:**
- User (with roles)
- Account, Session, VerificationToken (NextAuth)
- Post, Category, Tag, Comment (Content)
- Activity, Notification, Setting (Admin)

### UI Module

**Component Groups:**

| Group | Components |
|-------|------------|
| UI Essentials | Button, Input, Card, Badge, Avatar, Spinner |
| Feedback | Toast, Modal, Alert |
| Navigation | Sidebar, Header |
| Data Display | Table, StatCard |
| Forms | Select, Checkbox, Textarea |
| Layout | Container |

### API Module

**Features:**
- tRPC setup with SuperJSON
- Public, protected, admin procedures
- Rate limiting middleware
- CRUD helper utilities
- Pagination and filtering

**Routers:**
- `post.ts` - Post CRUD
- `user.ts` - User profile/settings
- `admin.ts` - Admin operations

## Components

### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```
**Variants:** primary, secondary, outline, ghost, danger
**Sizes:** sm, md, lg

### Input
```tsx
<Input label="Email" error="Required" placeholder="Enter email" />
```

### Card
```tsx
<Card variant="default">
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>
```
**Variants:** default, glass

### Badge
```tsx
<Badge variant="success">Active</Badge>
```
**Variants:** default, success, warning, error, info

### Avatar
```tsx
<Avatar src="/avatar.jpg" size="md" fallback="JD" />
```
**Sizes:** sm, md, lg

### Toast
```tsx
const { addToast } = useToast();
addToast("Success!", "success");
```
**Types:** success, error, warning, info

### Modal
```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Title">
  Content
</Modal>
```

### Table
```tsx
<Table data={items} columns={[
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
]} />
```

### StatCard
```tsx
<StatCard title="Users" value="1,234" change={12.5} />
```

### Sidebar
```tsx
<Sidebar items={[
  { label: "Dashboard", href: "/dashboard" },
]} logo={<Logo />} />
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL="file:./db.sqlite"

# Auth (required in production)
AUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

### NPM Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `start` | Start production server |
| `lint` | Run ESLint |
| `lint:fix` | Fix ESLint errors |
| `typecheck` | TypeScript checking |
| `db:push` | Push Prisma schema |
| `db:studio` | Open Prisma Studio |
| `db:generate` | Create migration |
| `db:migrate` | Apply migrations |
| `db:seed` | Seed database |

### TypeScript Paths

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## License

MIT © ArchillesDC
