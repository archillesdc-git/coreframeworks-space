import path from "path";
import fs from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import { execSync } from "child_process";
import { generateTemplateFiles } from "./templates/index.js";

export interface ProjectOptions {
    projectName: string;
    projectPath: string;
    template: "full-system" | "admin" | "dashboard" | "barebones";
    database: "sqlite" | "postgresql" | "mysql";
    authProvider: "discord" | "github" | "google" | "credentials" | "none";
    includeExampleCode: boolean;
    packageManager: "npm" | "pnpm" | "yarn" | "bun";
    components: string[];
    componentGroups: string[];
    initGit?: boolean;
    skipInstall?: boolean;
}

export async function createProject(options: ProjectOptions): Promise<void> {
    const { projectPath, packageManager, initGit, skipInstall } = options;

    const steps = [
        { name: "Creating project directory", fn: () => createDirectory(projectPath) },
        { name: "Generating project files", fn: () => generateTemplateFiles(options) },
        { name: "Setting up environment", fn: () => setupEnvironment(options) },
        ...(initGit !== false ? [{ name: "Initializing Git repository", fn: () => initializeGit(projectPath) }] : []),
        ...(!skipInstall ? [{ name: `Installing dependencies with ${packageManager}`, fn: () => installDependencies(projectPath, packageManager) }] : []),
        ...(!skipInstall ? [{ name: "Generating Prisma client", fn: () => generatePrismaClient(projectPath, packageManager) }] : []),
        { name: "Running final checks", fn: () => runFinalChecks(options) },
    ];

    console.log(chalk.cyan(`\n  Creating project in ${chalk.white(projectPath)}\n`));

    for (const step of steps) {
        const spinner = ora({
            text: step.name,
            prefixText: "  ",
        }).start();

        try {
            await step.fn();
            spinner.succeed(chalk.white(step.name));
        } catch (error) {
            spinner.fail(chalk.red(step.name));
            if (error instanceof Error) {
                console.log(chalk.yellow(`     └─ ${error.message}`));
            }
            // Continue with other steps even if one fails
        }
    }
}

async function createDirectory(projectPath: string): Promise<void> {
    await fs.ensureDir(projectPath);
}

async function setupEnvironment(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    // Create necessary directories
    const directories = [
        "src/app/_components",
        "src/app/api/auth/[...nextauth]",
        "src/app/api/trpc/[trpc]",
        "src/app/(auth)/login",
        "src/app/(auth)/register",
        "src/app/(dashboard)",
        "src/components/ui",
        "src/components/layout",
        "src/components/forms",
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

    // Add template-specific directories
    if (options.template === "admin" || options.template === "full-system") {
        directories.push(
            "src/app/(dashboard)/admin",
            "src/app/(dashboard)/admin/users",
            "src/app/(dashboard)/admin/settings",
            "src/components/admin",
        );
    }

    for (const dir of directories) {
        await fs.ensureDir(path.join(projectPath, dir));
    }
}

function initializeGit(projectPath: string): void {
    try {
        execSync("git init", { cwd: projectPath, stdio: "ignore" });

        // Create initial commit message file
        const commitMsg = "Initial commit from create-archillesdc-app";
        execSync(`git add -A`, { cwd: projectPath, stdio: "ignore" });

        // Try to make initial commit (might fail if git user not configured)
        try {
            execSync(`git commit -m "${commitMsg}"`, { cwd: projectPath, stdio: "ignore" });
        } catch {
            // Git user not configured, that's okay
        }
    } catch (error) {
        throw new Error("Git not installed or not configured");
    }
}

function installDependencies(projectPath: string, pm: string): void {
    const installCommand = getInstallCommand(pm);

    try {
        execSync(installCommand, {
            cwd: projectPath,
            stdio: "ignore",
            timeout: 300000, // 5 minute timeout
        });
    } catch (error) {
        throw new Error(`Failed to install dependencies. Run '${installCommand}' manually.`);
    }
}

function generatePrismaClient(projectPath: string, pm: string): void {
    const command = getPrismaGenerateCommand(pm);

    try {
        execSync(command, {
            cwd: projectPath,
            stdio: "ignore",
            timeout: 60000, // 1 minute timeout
        });
    } catch (error) {
        throw new Error("Run 'npx prisma generate' manually after setting up .env");
    }
}

async function runFinalChecks(options: ProjectOptions): Promise<void> {
    const { projectPath, projectName } = options;
    const issues: string[] = [];

    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!await fs.pathExists(packageJsonPath)) {
        issues.push("package.json not found");
    }

    // Check if .env.example exists
    const envExamplePath = path.join(projectPath, ".env.example");
    if (!await fs.pathExists(envExamplePath)) {
        issues.push(".env.example not found");
    }

    // Check if prisma schema exists
    const prismaSchemaPath = path.join(projectPath, "prisma", "schema.prisma");
    if (!await fs.pathExists(prismaSchemaPath)) {
        issues.push("Prisma schema not found");
    }

    // Check if main layout exists
    const layoutPath = path.join(projectPath, "src", "app", "layout.tsx");
    if (!await fs.pathExists(layoutPath)) {
        issues.push("Root layout not found");
    }

    if (issues.length > 0) {
        throw new Error(`Some files missing: ${issues.join(", ")}`);
    }

    // Create a setup completion marker
    const setupMarkerPath = path.join(projectPath, ".archillesdc-setup");
    await fs.writeJSON(setupMarkerPath, {
        createdAt: new Date().toISOString(),
        projectName,
        template: options.template,
        database: options.database,
        authProvider: options.authProvider,
        version: "1.0.0",
    }, { spaces: 2 });

    // Add to .gitignore
    const gitignorePath = path.join(projectPath, ".gitignore");
    if (await fs.pathExists(gitignorePath)) {
        const gitignore = await fs.readFile(gitignorePath, "utf-8");
        if (!gitignore.includes(".archillesdc-setup")) {
            await fs.appendFile(gitignorePath, "\n# CLI setup marker\n.archillesdc-setup\n");
        }
    }
}

function getInstallCommand(pm: string): string {
    switch (pm) {
        case "npm": return "npm install";
        case "pnpm": return "pnpm install";
        case "yarn": return "yarn";
        case "bun": return "bun install";
        default: return "npm install";
    }
}

function getPrismaGenerateCommand(pm: string): string {
    switch (pm) {
        case "npm": return "npx prisma generate";
        case "pnpm": return "pnpm prisma generate";
        case "yarn": return "yarn prisma generate";
        case "bun": return "bunx prisma generate";
        default: return "npx prisma generate";
    }
}
