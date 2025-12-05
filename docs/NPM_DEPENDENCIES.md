# NPM Dependencies Reference

Complete list of all npm packages used in ArchillesDC projects.

## Production Dependencies

### Core Framework

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

### Database

```json
{
  "@prisma/client": "^6.0.0"
}
```

### API & Data Fetching

```json
{
  "@trpc/client": "^11.0.0",
  "@trpc/react-query": "^11.0.0",
  "@trpc/server": "^11.0.0",
  "@tanstack/react-query": "^5.60.0",
  "superjson": "^2.2.1",
  "zod": "^3.23.8"
}
```

### Authentication

```json
{
  "next-auth": "5.0.0-beta.25",
  "@auth/prisma-adapter": "^2.7.2",
  "bcryptjs": "^2.4.3"
}
```

### Styling

```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4"
}
```

### Environment

```json
{
  "@t3-oss/env-nextjs": "^0.11.1"
}
```

## Development Dependencies

### TypeScript

```json
{
  "typescript": "^5.6.3",
  "@types/node": "^22.9.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "@types/bcryptjs": "^2.4.6"
}
```

### CSS

```json
{
  "tailwindcss": "^4.0.0-beta.8",
  "@tailwindcss/postcss": "^4.0.0-beta.8"
}
```

### Linting & Formatting

```json
{
  "eslint": "^9.14.0",
  "eslint-config-next": "^15.0.0",
  "@eslint/eslintrc": "^3.2.0",
  "prettier": "^3.3.3",
  "prettier-plugin-tailwindcss": "^0.6.8"
}
```

### Database

```json
{
  "prisma": "^6.0.0"
}
```

### Build Tools

```json
{
  "tsx": "^4.19.2"
}
```

## Complete package.json

```json
{
  "name": "my-archillesdc-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma migrate dev",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.7.2",
    "@prisma/client": "^6.0.0",
    "@t3-oss/env-nextjs": "^0.11.1",
    "@tanstack/react-query": "^5.60.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/server": "^11.0.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "next": "^15.0.0",
    "next-auth": "5.0.0-beta.25",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "superjson": "^2.2.1",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@tailwindcss/postcss": "^4.0.0-beta.8",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.14.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8",
    "prisma": "^6.0.0",
    "tailwindcss": "^4.0.0-beta.8",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

## CLI Tool Dependencies

The CLI tool (`create-archillesdc-app`) uses:

```json
{
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^12.1.0",
    "fs-extra": "^11.2.0",
    "inquirer": "^12.1.0",
    "ora": "^8.1.1",
    "validate-npm-package-name": "^5.0.1"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.4",
    "@types/validate-npm-package-name": "^4.0.2",
    "tsup": "^8.3.5",
    "typescript": "^5.6.3"
  }
}
```

## Package Purposes

### Production

| Package | Purpose |
|---------|---------|
| `next` | React framework with App Router, SSR, and API routes |
| `react` / `react-dom` | UI library |
| `@prisma/client` | Type-safe database queries |
| `@trpc/*` | End-to-end type-safe APIs |
| `@tanstack/react-query` | Server state management and caching |
| `superjson` | JSON serialization for dates, BigInt, etc. |
| `zod` | Runtime schema validation |
| `next-auth` | Authentication with multiple providers |
| `@auth/prisma-adapter` | Store sessions in database |
| `bcryptjs` | Password hashing for credentials auth |
| `clsx` | Conditional CSS classes |
| `tailwind-merge` | Merge Tailwind classes without conflicts |
| `@t3-oss/env-nextjs` | Type-safe environment variables |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | Type safety |
| `@types/*` | TypeScript definitions |
| `tailwindcss` | Utility-first CSS |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `prisma` | Database migrations and studio |
| `tsx` | Run TypeScript directly (for seeding) |

## Version Compatibility

| Next.js | React | Tailwind | Prisma | tRPC |
|---------|-------|----------|--------|------|
| 15.x | 19.x | 4.x beta | 6.x | 11.x |
| 14.x | 18.x | 3.x | 5.x | 10.x |

## Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update to latest (including major)
npx npm-check-updates -u
npm install
```

## Optional Dependencies

These can be added as needed:

```bash
# Icons
npm install lucide-react

# Forms
npm install react-hook-form @hookform/resolvers

# Email
npm install resend @react-email/components

# File Upload
npm install uploadthing @uploadthing/react

# Charts
npm install recharts

# Date Handling
npm install date-fns

# Animations
npm install framer-motion

# State Management
npm install zustand
```
