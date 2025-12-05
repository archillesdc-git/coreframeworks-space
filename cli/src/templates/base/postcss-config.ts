import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generatePostcssConfig(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const content = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`;

    await fs.writeFile(path.join(projectPath, "postcss.config.js"), content);
}
