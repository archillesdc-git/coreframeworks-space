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
    const { systemName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'systemName',
            message: 'What system do you want to generate?',
            validate: (input) => input.trim() !== '' ? true : 'Please enter a system name.'
        }
    ]);

    // Convert "Payroll System" -> "payroll-system"
    const slug = systemName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Trim start/end hyphens

    const finalSlug = slug || 'core-system';

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

        // Create system.json
        const systemJsonPath = path.join(targetDir, 'system.json');
        await fs.writeJson(systemJsonPath, {
            systemName: systemName,
            slug: finalSlug,
            createdAt: new Date().toISOString(),
            generator: "core-frameworks"
        }, { spaces: 2 });

        // Replace placeholders in src/pages/index.tsx
        const indexPagePath = path.join(targetDir, 'src', 'pages', 'index.tsx');
        if (await fs.pathExists(indexPagePath)) {
            let content = await fs.readFile(indexPagePath, 'utf-8');
            content = content.replace(/{{SYSTEM_NAME}}/g, systemName);
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
