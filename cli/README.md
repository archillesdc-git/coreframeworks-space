# Create ArchillesDC App

A powerful CLI tool to scaffold full-stack web applications with Next.js, Tailwind CSS, Prisma, tRPC, and NextAuth.js.

[![npm version](https://img.shields.io/npm/v/create-archillesdc-app.svg)](https://www.npmjs.com/package/create-archillesdc-app)

## Quick Start

```bash
npx create-archillesdc-app my-app
```

## Features

- 🚀 **Next.js 15** with App Router
- 🎨 **Tailwind CSS v4** with design tokens and premium styling
- 🔐 **NextAuth.js** with multiple providers (Discord, GitHub, Google, Credentials)
- 🗃️ **Prisma** ORM with SQLite, PostgreSQL, or MySQL
- 🔌 **tRPC** for end-to-end type-safe APIs
- 📦 **Pre-built Components** - Button, Input, Card, Toast, Table, and more
- 📊 **Multiple Templates** - Full System, Admin, Dashboard, or Barebones
- ⚡ **Component Selection** - Choose what you need

## Installation

### Using npx (Recommended)

```bash
npx create-archillesdc-app my-app
```

### Global Installation

```bash
npm install -g create-archillesdc-app
create-archillesdc-app my-app
```

## Usage

### Interactive Mode

```bash
npx create-archillesdc-app
```

You'll be prompted for:

1. **Project name** - Name of your new project
2. **Template** - Choose from 4 templates:
   - 🏢 **Full System** - Complete app with everything
   - ⚙️ **Admin Dashboard** - Admin panel with data tables
   - 📊 **Dashboard** - User dashboard with widgets
   - 📦 **Barebones** - Minimal setup
3. **Database** - SQLite, PostgreSQL, or MySQL
4. **Auth Provider** - Discord, GitHub, Google, Credentials, or None
5. **Components** - Select component groups to include
6. **Package Manager** - npm, pnpm, yarn, or bun
7. **Example Code** - Include demos or not

### Quick Mode

Skip all prompts with defaults:

```bash
npx create-archillesdc-app my-app -y
```

### With Options

```bash
npx create-archillesdc-app my-app \
  --template admin \
  --db postgresql \
  --auth github \
  --pm pnpm \
  --no-examples
```

### CLI Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts, use defaults |
| `-t, --template <type>` | Template: full-system, admin, dashboard, barebones |
| `--db <database>` | Database: sqlite, postgresql, mysql |
| `--auth <provider>` | Auth: discord, github, google, credentials, none |
| `--pm <manager>` | Package manager: npm, pnpm, yarn, bun |
| `--no-examples` | Skip example code |
| `--no-install` | Skip dependency installation |

## Templates

### 🏢 Full System

Complete application with:
- Authentication pages (login, register)
- User dashboard with sidebar
- Admin panel with user management
- All UI components
- Full API routes
- Example CRUD operations

### ⚙️ Admin Dashboard

Admin panel with:
- Admin layout and navigation
- Data tables with sorting
- Stats and charts
- User management
- Settings pages

### 📊 Dashboard

User dashboard with:
- Sidebar navigation
- Dashboard widgets
- Stats cards
- Basic pages
- Settings

### 📦 Barebones

Minimal setup with:
- Basic layout
- Auth setup (ready to use)
- Database configured
- Minimal components

## Component Groups

Select which components to include:

| Group | Components |
|-------|------------|
| **UI Essentials** | Button, Input, Card, Badge, Avatar |
| **Feedback** | Toast, Modal, Alert, Tooltip, Popover |
| **Navigation** | Sidebar, Header, Navbar, Breadcrumbs, Tabs |
| **Data Display** | Table, DataGrid, List, Stats, Charts |
| **Forms** | Select, Checkbox, Radio, Switch, Textarea |
| **Layout** | Container, Grid, Divider, Spacer |

## Project Structure

```
my-app/
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/         # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/    # Protected pages
│   │   │   ├── admin/      # Admin panel (full-system/admin)
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── auth/       # NextAuth routes
│   │   │   └── trpc/       # tRPC endpoint
│   │   ├── _components/    # Page-specific components
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
│   ├── components/
│   │   ├── ui/             # Base components
│   │   ├── layout/         # Layout components
│   │   ├── forms/          # Form components
│   │   └── admin/          # Admin components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/    # tRPC routers
│   │   │   ├── root.ts
│   │   │   └── trpc.ts
│   │   ├── auth/           # Auth config
│   │   └── db.ts           # Database client
│   ├── styles/
│   │   └── globals.css     # Global styles + Tailwind
│   ├── trpc/               # tRPC client setup
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── env.js              # Environment validation
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

## After Creation

```bash
# 1. Navigate to project
cd my-app

# 2. Set up environment
cp .env.example .env
# Edit .env with your secrets

# 3. Initialize database
npm run db:push

# 4. Start development
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run typecheck` | TypeScript checking |
| `npm run db:push` | Push Prisma schema |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Create migration |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed database |

## Environment Variables

Required variables (see `.env.example`):

```env
# Database
DATABASE_URL="file:./db.sqlite"

# Auth
AUTH_SECRET="your-secret-here"
AUTH_DISCORD_ID=""      # If using Discord
AUTH_DISCORD_SECRET=""
```

## Customization

### Adding a tRPC Router

1. Create `src/server/api/routers/my-router.ts`:

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const myRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.myModel.findMany();
  }),
  
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.myModel.create({ data: input });
    }),
});
```

2. Add to `src/server/api/root.ts`:

```typescript
import { myRouter } from "./routers/my-router";

export const appRouter = createTRPCRouter({
  my: myRouter,
});
```

### Adding Auth Providers

Edit `src/server/auth/config.ts`:

```typescript
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [
    Discord,
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  // ...
};
```

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[Prisma](https://prisma.io/)** - Database ORM
- **[tRPC](https://trpc.io/)** - Type-safe APIs
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[React Query](https://tanstack.com/query)** - Data fetching
- **[Zod](https://zod.dev/)** - Schema validation

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT © ArchillesDC
