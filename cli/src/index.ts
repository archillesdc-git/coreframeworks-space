#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import validateProjectName from "validate-npm-package-name";
import { createProject, type ProjectOptions } from "./create-project.js";
import { getVersion } from "./utils/version.js";
import { registerGeneratorCommand } from "./commands/generate.js";

const program = new Command();

// Template descriptions
const TEMPLATES = {
    "full-system": {
        name: "🏢 Full System",
        description: "Complete app with auth, dashboard, admin, API, and all components",
        features: ["Auth pages", "Dashboard", "Admin panel", "All UI components", "Full API routes", "Example CRUD"],
    },
    "admin": {
        name: "⚙️ Admin Dashboard",
        description: "Admin panel with data tables, charts, and management features",
        features: ["Admin layout", "Data tables", "Charts", "User management", "Settings pages"],
    },
    "dashboard": {
        name: "📊 Dashboard",
        description: "User dashboard with sidebar navigation and widgets",
        features: ["Dashboard layout", "Sidebar", "Widgets", "Stats cards", "Basic pages"],
    },
    "barebones": {
        name: "📦 Barebones",
        description: "Minimal setup with just the essentials - build from scratch",
        features: ["Basic layout", "Auth setup", "Database ready", "Minimal components"],
    },
};

// Component groups
const COMPONENT_GROUPS = {
    "ui-essentials": {
        name: "UI Essentials",
        components: ["Button", "Input", "Card", "Badge", "Avatar"],
    },
    "feedback": {
        name: "Feedback & Overlays",
        components: ["Toast", "Modal", "Alert", "Tooltip", "Popover"],
    },
    "navigation": {
        name: "Navigation",
        components: ["Sidebar", "Header", "Navbar", "Breadcrumbs", "Tabs"],
    },
    "data-display": {
        name: "Data Display",
        components: ["Table", "DataGrid", "List", "Stats", "Charts"],
    },
    "forms": {
        name: "Form Components",
        components: ["Select", "Checkbox", "Radio", "Switch", "Textarea", "DatePicker"],
    },
    "layout": {
        name: "Layout",
        components: ["Container", "Grid", "Divider", "Spacer"],
    },
};

async function main() {
    // Display banner
    console.log();
    console.log(chalk.cyan.bold("╔═══════════════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("║") + chalk.white.bold("        🚀 Create ArchillesDC App - Full Stack CLI           ") + chalk.cyan.bold("║"));
    console.log(chalk.cyan.bold("║") + chalk.gray("       Next.js • Tailwind CSS • Prisma • tRPC • Auth         ") + chalk.cyan.bold("║"));
    console.log(chalk.cyan.bold("╚═══════════════════════════════════════════════════════════════╝"));
    console.log();

    program
        .name("archillesdc")
        .description("ArchillesDC CLI - Create and manage full-stack web applications")
        .version(getVersion());

    // Register generator subcommand
    registerGeneratorCommand(program);

    // Create command (also default action)
    program
        .command("create [project-name]", { isDefault: true })
        .description("Create a new ArchillesDC project")
        .option("-y, --yes", "Skip prompts and use defaults")
        .option("-t, --template <template>", "Template (full-system, admin, dashboard, barebones)")
        .option("--db <database>", "Database provider (sqlite, postgresql, mysql)")
        .option("--auth <provider>", "Auth provider (discord, github, google, credentials, none)")
        .option("--pm <packageManager>", "Package manager (npm, pnpm, yarn, bun)")
        .option("--no-examples", "Skip example code")
        .option("--no-install", "Skip dependency installation")
        .action(async (projectName: string | undefined, opts: Record<string, unknown>) => {
            await handleCreate(projectName, opts);
        });

    await program.parseAsync();
}

async function handleCreate(projectName: string | undefined, opts: Record<string, unknown>) {

    // Quick mode with defaults
    if (opts.yes && projectName) {
        const projectPath = path.resolve(process.cwd(), projectName);
        const options: ProjectOptions = {
            projectName,
            projectPath,
            template: (opts.template as ProjectOptions["template"]) || "full-system",
            database: (opts.db as ProjectOptions["database"]) || "sqlite",
            authProvider: (opts.auth as ProjectOptions["authProvider"]) || "discord",
            includeExampleCode: opts.examples !== false,
            packageManager: (opts.pm as ProjectOptions["packageManager"]) || "npm",
            components: ["ui-essentials", "feedback", "navigation", "forms", "layout"],
            componentGroups: ["ui-essentials", "feedback", "navigation", "data-display", "forms", "layout"],
            skipInstall: opts.install === false,
            initGit: true,
        };

        await runProjectCreation(options);
        return;
    }

    // Interactive prompts
    console.log(chalk.white.bold("  Let's set up your new project!\n"));

    const answers = await inquirer.prompt([
        // Step 1: Project Name
        {
            type: "input",
            name: "projectName",
            message: chalk.cyan("?") + " What is your project name?",
            default: projectName || "my-archillesdc-app",
            validate: (input: string) => {
                const validation = validateProjectName(input);
                if (!validation.validForNewPackages) {
                    return `Invalid project name: ${validation.errors?.join(", ") || validation.warnings?.join(", ")}`;
                }
                return true;
            },
        },

        // Step 2: Template Selection
        {
            type: "list",
            name: "template",
            message: chalk.cyan("?") + " Choose a template:",
            choices: Object.entries(TEMPLATES).map(([key, value]) => ({
                name: `${value.name}\n     ${chalk.gray(value.description)}\n     ${chalk.gray("→ " + value.features.join(", "))}`,
                value: key,
                short: value.name,
            })),
            default: opts.template || "full-system",
            when: !opts.template,
        },

        // Step 3: Database
        {
            type: "list",
            name: "database",
            message: chalk.cyan("?") + " Which database would you like to use?",
            choices: [
                {
                    name: `${chalk.green("SQLite")} ${chalk.gray("(Default, no setup needed)")}`,
                    value: "sqlite",
                    short: "SQLite",
                },
                {
                    name: `${chalk.blue("PostgreSQL")} ${chalk.gray("(Production-ready, requires setup)")}`,
                    value: "postgresql",
                    short: "PostgreSQL",
                },
                {
                    name: `${chalk.yellow("MySQL")} ${chalk.gray("(Popular choice, requires setup)")}`,
                    value: "mysql",
                    short: "MySQL",
                },
            ],
            default: opts.db || "sqlite",
            when: !opts.db,
        },

        // Step 4: Authentication
        {
            type: "list",
            name: "authProvider",
            message: chalk.cyan("?") + " Which authentication provider would you like?",
            choices: [
                { name: `${chalk.magenta("Discord")} ${chalk.gray("(Easy social login)")}`, value: "discord" },
                { name: `${chalk.white("GitHub")} ${chalk.gray("(Great for dev tools)")}`, value: "github" },
                { name: `${chalk.red("Google")} ${chalk.gray("(Most widely used)")}`, value: "google" },
                { name: `${chalk.cyan("Credentials")} ${chalk.gray("(Email & Password)")}`, value: "credentials" },
                { name: `${chalk.gray("None")} ${chalk.gray("(I'll add it later)")}`, value: "none" },
            ],
            default: opts.auth || "discord",
            when: !opts.auth,
        },

        // Step 5: Components to include
        {
            type: "checkbox",
            name: "components",
            message: chalk.cyan("?") + " Which component groups do you want to include?",
            choices: Object.entries(COMPONENT_GROUPS).map(([key, value]) => ({
                name: `${value.name} ${chalk.gray("(" + value.components.join(", ") + ")")}`,
                value: key,
                checked: true,
            })),
            validate: (input: string[]) => {
                if (input.length === 0) {
                    return "Please select at least one component group";
                }
                return true;
            },
        },

        // Step 6: Package Manager
        {
            type: "list",
            name: "packageManager",
            message: chalk.cyan("?") + " Which package manager would you like to use?",
            choices: [
                { name: `npm ${chalk.gray("(Default)")}`, value: "npm" },
                { name: `pnpm ${chalk.gray("(Fast & efficient)")}`, value: "pnpm" },
                { name: `yarn ${chalk.gray("(Classic choice)")}`, value: "yarn" },
                { name: `bun ${chalk.gray("(Fastest, newer)")}`, value: "bun" },
            ],
            default: opts.pm || "npm",
            when: !opts.pm,
        },

        // Step 7: Example code
        {
            type: "confirm",
            name: "includeExampleCode",
            message: chalk.cyan("?") + " Include example code and demo pages?",
            default: opts.examples !== false,
            when: opts.examples === undefined,
        },

        // Step 8: Initialize Git
        {
            type: "confirm",
            name: "initGit",
            message: chalk.cyan("?") + " Initialize a Git repository?",
            default: true,
        },
    ]);

    projectName = answers.projectName || projectName;
    const projectPath = path.resolve(process.cwd(), projectName!);

    const options: ProjectOptions = {
        projectName: projectName!,
        projectPath,
        template: answers.template || opts.template || "full-system",
        database: answers.database || opts.db || "sqlite",
        authProvider: answers.authProvider || opts.auth || "discord",
        includeExampleCode: answers.includeExampleCode ?? opts.examples !== false,
        packageManager: answers.packageManager || opts.pm || "npm",
        components: answers.components || ["ui-essentials", "feedback", "navigation", "forms", "layout"],
        componentGroups: answers.components || ["ui-essentials", "feedback", "navigation", "data-display", "forms", "layout"],
        initGit: answers.initGit ?? true,
        skipInstall: opts.install === false,
    };

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
        const { overwrite } = await inquirer.prompt([
            {
                type: "confirm",
                name: "overwrite",
                message: chalk.yellow("⚠") + ` Directory ${chalk.cyan(projectName)} already exists. Overwrite?`,
                default: false,
            },
        ]);

        if (!overwrite) {
            console.log(chalk.red("\n✖ Operation cancelled\n"));
            process.exit(1);
        }

        const spinner = ora("Removing existing directory...").start();
        await fs.remove(projectPath);
        spinner.succeed("Removed existing directory");
    }

    await runProjectCreation(options);
}

async function runProjectCreation(options: ProjectOptions) {
    // Display configuration summary
    console.log();
    console.log(chalk.cyan.bold("┌─────────────────────────────────────────────────────────────┐"));
    console.log(chalk.cyan.bold("│") + chalk.white.bold("                    Project Configuration                    ") + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("├─────────────────────────────────────────────────────────────┤"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Project:")}      ${chalk.white(options.projectName.padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Template:")}     ${chalk.white((TEMPLATES[options.template]?.name || options.template).padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Database:")}     ${chalk.white(options.database.padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Auth:")}         ${chalk.white(options.authProvider.padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Components:")}   ${chalk.white((options.components.length + " groups").padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("│") + `  ${chalk.gray("Package Mgr:")}  ${chalk.white(options.packageManager.padEnd(42))}` + chalk.cyan.bold("│"));
    console.log(chalk.cyan.bold("└─────────────────────────────────────────────────────────────┘"));
    console.log();

    // Run project creation
    await createProject(options);

    // Success message
    console.log();
    console.log(chalk.green.bold("╔═══════════════════════════════════════════════════════════════╗"));
    console.log(chalk.green.bold("║") + chalk.white.bold("              ✓ Project created successfully!                 ") + chalk.green.bold("║"));
    console.log(chalk.green.bold("╚═══════════════════════════════════════════════════════════════╝"));
    console.log();

    // Next steps
    const pmRun = getPmRunCommand(options.packageManager);

    console.log(chalk.white.bold("  Next steps:\n"));
    console.log(`  ${chalk.cyan("1.")} ${chalk.white("cd")} ${chalk.cyan(options.projectName)}`);
    console.log();
    console.log(`  ${chalk.cyan("2.")} ${chalk.white("Set up environment variables:")}`);
    console.log(`     ${chalk.gray("Copy .env.example to .env and add your secrets")}`);
    console.log();
    console.log(`  ${chalk.cyan("3.")} ${chalk.white("Initialize database:")}`);
    console.log(`     ${chalk.cyan(pmRun("db:push"))}`);
    console.log();
    console.log(`  ${chalk.cyan("4.")} ${chalk.white("Start development server:")}`);
    console.log(`     ${chalk.cyan(pmRun("dev"))}`);
    console.log();
    console.log(chalk.gray("  ─────────────────────────────────────────────────────────────"));
    console.log();
    console.log(`  ${chalk.white("Useful commands:")}`);
    console.log(`     ${chalk.cyan(pmRun("dev"))}          ${chalk.gray("Start dev server")}`);
    console.log(`     ${chalk.cyan(pmRun("build"))}        ${chalk.gray("Build for production")}`);
    console.log(`     ${chalk.cyan(pmRun("db:studio"))}    ${chalk.gray("Open Prisma Studio")}`);
    console.log(`     ${chalk.cyan(pmRun("lint"))}         ${chalk.gray("Run linter")}`);
    console.log();
    console.log(chalk.gray("  Happy coding! 🎉\n"));
}

function getPmRunCommand(pm: string): (script: string) => string {
    return (script: string) => {
        switch (pm) {
            case "npm": return `npm run ${script}`;
            case "pnpm": return `pnpm ${script}`;
            case "yarn": return `yarn ${script}`;
            case "bun": return `bun run ${script}`;
            default: return `npm run ${script}`;
        }
    };
}

main().catch((err) => {
    console.error(chalk.red("\n✖ Error:"), err.message || err);
    if (process.env.DEBUG) {
        console.error(err);
    }
    process.exit(1);
});
