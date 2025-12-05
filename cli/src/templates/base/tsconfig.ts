import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateTsConfig(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const tsconfig = {
        compilerOptions: {
            /* Base Options: */
            esModuleInterop: true,
            skipLibCheck: true,
            target: "es2022",
            allowJs: true,
            resolveJsonModule: true,
            moduleDetection: "force",
            isolatedModules: true,
            verbatimModuleSyntax: true,

            /* Strictness */
            strict: true,
            noUncheckedIndexedAccess: true,
            checkJs: true,

            /* Bundled projects */
            lib: ["dom", "dom.iterable", "ES2022"],
            noEmit: true,
            module: "ESNext",
            moduleResolution: "Bundler",
            jsx: "preserve",
            plugins: [{ name: "next" }],
            incremental: true,

            /* Path Aliases */
            baseUrl: ".",
            paths: {
                "@/*": ["./src/*"],
            },
        },
        include: [
            "next-env.d.ts",
            "**/*.ts",
            "**/*.tsx",
            "**/*.cjs",
            "**/*.js",
            ".next/types/**/*.ts",
        ],
        exclude: ["node_modules", "generated"],
    };

    await fs.writeJSON(path.join(projectPath, "tsconfig.json"), tsconfig, {
        spaces: 2,
    });
}
