import fs from "fs-extra";
import path from "path";
import type { ProjectOptions } from "../../create-project.js";

export async function generateNextConfig(options: ProjectOptions): Promise<void> {
    const { projectPath } = options;

    const content = `/**
 * Run \`build\` or \`dev\` with \`SKIP_ENV_VALIDATION\` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Output standalone build for containerized deployments
  // output: "standalone",

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default config;
`;

    await fs.writeFile(path.join(projectPath, "next.config.js"), content);
}
