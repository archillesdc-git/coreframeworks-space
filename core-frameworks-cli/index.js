#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.bold.cyan("\n✨ Core Frameworks Universal Generator ✨\n"));

async function main() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'systemName',
            message: 'What system do you want to generate?',
            validate: (input) => input.trim() !== '' ? true : 'Please enter a system name.'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Briefly describe what this system does:',
            default: (answers) => `A complete solution for ${answers.systemName}.`
        },
        {
            type: 'input',
            name: 'roles',
            message: 'What user roles does this system have? (comma separated)',
            default: 'Admin, User, Staff'
        },
        {
            type: 'list',
            name: 'themeColor',
            message: 'Select a primary theme color:',
            choices: ['Blue', 'Purple', 'Green', 'Red', 'Orange', 'Slate'],
            default: 'Blue'
        }
    ]);

    const { systemName, description, roles, themeColor } = answers;

    // Convert "Payroll System" -> "payroll-system"
    const slug = systemName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Trim start/end hyphens

    const finalSlug = slug || 'core-system';

    // Extract keyword for images (e.g. "Car Rental System" -> "car,rental")
    const imageKeyword = systemName
        .replace(/system|app|application|management|manager|tool|platform|portal|dashboard|solution|software/gi, '')
        .trim()
        .replace(/\s+/g, ',') || 'technology';

    const roleArray = roles.split(',').map(r => r.trim());

    const targetDir = path.join(process.cwd(), finalSlug);
    const templateDir = path.join(__dirname, 'templates', 'generic-system');

    if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`\n❌ Error: Folder "${finalSlug}" already exists.\n`));
        process.exit(1);
    }

    console.log(chalk.blue(`\n🚀 Generating "${systemName}" in ./${finalSlug}...\n`));

    try {
        // Copy template
        await fs.copy(templateDir, targetDir);

        // Create .env from example if exists
        const envExample = path.join(targetDir, '.env.example');
        const envTarget = path.join(targetDir, '.env');
        if (await fs.pathExists(envExample)) {
            await fs.copy(envExample, envTarget);
        }

        // Update package.json name
        const pkgPath = path.join(targetDir, 'package.json');
        if (await fs.pathExists(pkgPath)) {
            const pkg = await fs.readJson(pkgPath);
            pkg.name = finalSlug;
            await fs.writeJson(pkgPath, pkg, { spaces: 2 });
        }

        // Create system.json (Metadata)
        const systemJsonPath = path.join(targetDir, 'src', 'system.json'); // Moved to src for importing
        // Also keep root one for CLI reference
        await fs.writeJson(path.join(targetDir, 'system.json'), {
            systemName,
            slug: finalSlug,
            description,
            roles: roleArray,
            theme: themeColor,
            imageKeyword,
            createdAt: new Date().toISOString(),
            generator: "core-frameworks"
        }, { spaces: 2 });

        // Ensure src directory exists for system.json copy
        await fs.ensureDir(path.join(targetDir, 'src'));
        await fs.writeJson(path.join(targetDir, 'src', 'system.json'), {
            systemName,
            description,
            roles: roleArray,
            theme: themeColor,
            imageKeyword
        }, { spaces: 2 });


        // Replace placeholders in src/pages/index.tsx
        const indexPagePath = path.join(targetDir, 'src', 'pages', 'index.tsx');
        if (await fs.pathExists(indexPagePath)) {
            let content = await fs.readFile(indexPagePath, 'utf-8');

            // Simple handlebar-style replacements
            const replacements = {
                'SYSTEM_NAME': systemName,
                'DESCRIPTION': description,
                'IMAGE_KEYWORD': encodeURIComponent(imageKeyword),
                'THEME_COLOR': themeColor.toLowerCase(),
            };

            for (const [key, value] of Object.entries(replacements)) {
                // Regex to match {{ KEY }} with optional whitespace
                const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
                content = content.replace(regex, value);
            }

            await fs.writeFile(indexPagePath, content);
        }

        // Output success
        console.log(chalk.green("✔ Done!"));
        console.log(`\ncd ${finalSlug}`);
        console.log("npm install");
        console.log("npm run dev\n");

    } catch (err) {
        console.error(chalk.red("\n❌ Error generating project:"), err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
