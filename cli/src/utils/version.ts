import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

export function getVersion(): string {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const packageJsonPath = path.resolve(__dirname, "../../package.json");
        const packageJson = fs.readJsonSync(packageJsonPath);
        return packageJson.version || "1.0.0";
    } catch {
        return "1.0.0";
    }
}
