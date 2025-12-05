import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateGitIgnore(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const content = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# ===========================================
# Dependencies
# ===========================================
node_modules
/.pnp
.pnp.js
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# ===========================================
# Testing
# ===========================================
coverage
.nyc_output

# ===========================================
# Database
# ===========================================
*.sqlite
*.sqlite-journal
*.db
/prisma/*.sqlite
/prisma/*.sqlite-journal

# ===========================================
# Next.js
# ===========================================
.next
out
build
.swc

# ===========================================
# Environment & Secrets
# ===========================================
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem

# ===========================================
# Editor & IDE
# ===========================================
.idea
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
*.swp
*.swo
*~

# ===========================================
# OS Files
# ===========================================
.DS_Store
Thumbs.db
ehthumbs.db
Desktop.ini

# ===========================================
# Logs
# ===========================================
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-debug.log*

# ===========================================
# Build & Cache
# ===========================================
*.tsbuildinfo
.cache
.turbo
dist

# ===========================================
# Vercel
# ===========================================
.vercel

# ===========================================
# Generated Files
# ===========================================
/generated
next-env.d.ts

# ===========================================
# Misc
# ===========================================
*.pid
*.seed
*.pid.lock
`;

    await fs.writeFile(path.join(projectPath, ".gitignore"), content);
}
