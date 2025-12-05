import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateEnvFiles(options: ProjectOptions): Promise<void> {
    const { projectPath, database, authProvider } = options;

    const envExample = generateEnvExample(database, authProvider);
    const envLocal = generateEnvLocal(database, authProvider);

    await Promise.all([
        fs.writeFile(path.join(projectPath, ".env.example"), envExample),
        fs.writeFile(path.join(projectPath, ".env"), envLocal),
    ]);
}

function generateEnvExample(
    database: "sqlite" | "postgresql" | "mysql",
    authProvider: string
): string {
    let content = `# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.

# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.

# ===========================================
# App Configuration
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# Database Configuration
# ===========================================
`;

    switch (database) {
        case "sqlite":
            content += `# SQLite (file-based, great for development)
DATABASE_URL="file:./db.sqlite"
`;
            break;
        case "postgresql":
            content += `# PostgreSQL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
`;
            break;
        case "mysql":
            content += `# MySQL
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/mydb"
`;
            break;
    }

    content += `
# ===========================================
# Authentication
# ===========================================
# You can generate a new secret on the command line with:
# npx auth secret
# https://next-auth.js.org/configuration/options#secret
AUTH_SECRET=""

`;

    switch (authProvider) {
        case "discord":
            content += `# Discord OAuth
# Create an app at https://discord.com/developers/applications
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""
`;
            break;
        case "github":
            content += `# GitHub OAuth
# Create an app at https://github.com/settings/developers
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
`;
            break;
        case "google":
            content += `# Google OAuth
# Create credentials at https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
`;
            break;
        case "credentials":
            content += `# Credentials (Email/Password)
# No additional OAuth secrets needed for credentials auth
`;
            break;
        case "none":
            content += `# No authentication configured
# Add your auth provider secrets here when you set up authentication
`;
            break;
    }

    content += `
# ===========================================
# Optional: Third-party Services
# ===========================================
# Add your API keys for external services here
# STRIPE_SECRET_KEY=""
# RESEND_API_KEY=""
# OPENAI_API_KEY=""
`;

    return content;
}

function generateEnvLocal(
    database: "sqlite" | "postgresql" | "mysql",
    authProvider: string
): string {
    let content = `# Local development environment
# DO NOT commit this file to version control

NEXT_PUBLIC_APP_URL="http://localhost:3000"

`;

    switch (database) {
        case "sqlite":
            content += `DATABASE_URL="file:./db.sqlite"\n`;
            break;
        case "postgresql":
            content += `DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"\n`;
            break;
        case "mysql":
            content += `DATABASE_URL="mysql://root:password@localhost:3306/mydb"\n`;
            break;
    }

    content += `\n# Generate with: npx auth secret\nAUTH_SECRET="your-super-secret-key-here-change-in-production"\n\n`;

    switch (authProvider) {
        case "discord":
            content += `AUTH_DISCORD_ID="your-discord-client-id"\nAUTH_DISCORD_SECRET="your-discord-client-secret"\n`;
            break;
        case "github":
            content += `AUTH_GITHUB_ID="your-github-client-id"\nAUTH_GITHUB_SECRET="your-github-client-secret"\n`;
            break;
        case "google":
            content += `AUTH_GOOGLE_ID="your-google-client-id"\nAUTH_GOOGLE_SECRET="your-google-client-secret"\n`;
            break;
    }

    return content;
}
