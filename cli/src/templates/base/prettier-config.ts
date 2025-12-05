import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generatePrettierConfig(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const content = `/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
};
`;

    await fs.writeFile(path.join(projectPath, "prettier.config.js"), content);
}
