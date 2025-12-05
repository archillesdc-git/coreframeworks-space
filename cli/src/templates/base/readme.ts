import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateReadme(options: ProjectOptions): Promise<void> {
    const { projectPath, projectName, database, authProvider, packageManager } = options;

    const pmRun = packageManager === "npm" ? "npm run" : packageManager;

    const content = `# ${projectName}

A full-stack web application built with the ArchillesDC stack.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Prisma](https://prisma.io/) with ${database === "sqlite" ? "SQLite" : database === "postgresql" ? "PostgreSQL" : "MySQL"}
- **API**: [tRPC](https://trpc.io/) for end-to-end type-safe APIs
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)${authProvider !== "none" ? ` with ${authProvider} provider` : ""}
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- ${packageManager}${database === "postgresql" ? "\n- PostgreSQL database" : database === "mysql" ? "\n- MySQL database" : ""}

### Installation

\`\`\`bash
# Install dependencies
${packageManager === "npm" ? "npm install" : packageManager === "yarn" ? "yarn" : `${packageManager} install`}

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your secrets

# Push database schema
${pmRun} db:push

# Start development server
${pmRun} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

\`\`\`
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication pages (login, register)
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   ├── api/           # API routes
│   │   └── _components/   # Page-specific components
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   └── forms/        # Form components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── server/           # Server-side code
│   │   ├── api/          # tRPC routers
│   │   └── auth/         # Auth configuration
│   ├── styles/           # Global styles
│   ├── trpc/             # tRPC client setup
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── ...config files
\`\`\`

## Available Scripts

| Command | Description |
|---------|-------------|
| \`${pmRun} dev\` | Start development server |
| \`${pmRun} build\` | Build for production |
| \`${pmRun} start\` | Start production server |
| \`${pmRun} lint\` | Run ESLint |
| \`${pmRun} typecheck\` | Run TypeScript type checking |
| \`${pmRun} db:push\` | Push Prisma schema to database |
| \`${pmRun} db:studio\` | Open Prisma Studio |
| \`${pmRun} db:generate\` | Generate Prisma migrations |

## Environment Variables

See \`.env.example\` for all required environment variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
`;

    await fs.writeFile(path.join(projectPath, "README.md"), content);
}
