export const metadata = {
    title: "Troubleshooting - ArchillesDC Docs",
    description: "Common issues and solutions for ArchillesDC",
};

export default function TroubleshootingPage() {
    return (
        <article className="prose">
            <h1 className="text-4xl font-bold mb-4">Troubleshooting</h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Solutions to common issues and problems.
            </p>

            <h2>Installation Issues</h2>

            <h3>Command not found: archillesdc</h3>
            <p>If you get this error after installation:</p>
            <pre>{`# Use npx instead
npx archillesdc generate page dashboard

# Or install globally
npm install -g create-archillesdc-app`}</pre>

            <h3>Permission denied errors</h3>
            <p>On macOS/Linux, you might need to fix npm permissions:</p>
            <pre>{`# Option 1: Use a node version manager (recommended)
# Install nvm: https://github.com/nvm-sh/nvm

# Option 2: Change npm directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH`}</pre>

            <h2>Database Issues</h2>

            <h3>Prisma: Database URL not set</h3>
            <p>Ensure your <code>.env</code> file has the correct DATABASE_URL:</p>
            <pre>{`# SQLite (default)
DATABASE_URL="file:./db.sqlite"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/dbname"`}</pre>

            <h3>Migration failed</h3>
            <p>If <code>db:push</code> fails:</p>
            <pre>{`# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or push with force
npx prisma db push --force-reset`}</pre>

            <h3>Prisma client not generated</h3>
            <pre>{`# Generate the Prisma client
npx prisma generate

# Then restart your dev server
npm run dev`}</pre>

            <h2>Authentication Issues</h2>

            <h3>AUTH_SECRET missing</h3>
            <p>Generate a secure secret:</p>
            <pre>{`# Generate secret
openssl rand -base64 32

# Add to .env
AUTH_SECRET="your-generated-secret"`}</pre>

            <h3>OAuth callback error</h3>
            <p>Check your OAuth provider settings:</p>
            <ul>
                <li>Callback URL should be: <code>http://localhost:3000/api/auth/callback/[provider]</code></li>
                <li>For Discord: <code>http://localhost:3000/api/auth/callback/discord</code></li>
                <li>Make sure client ID and secret are correct</li>
            </ul>

            <h3>Session not persisting</h3>
            <ol>
                <li>Check that DATABASE_URL is correct</li>
                <li>Run <code>npx prisma db push</code></li>
                <li>Clear browser cookies</li>
                <li>Restart the dev server</li>
            </ol>

            <h2>Build Issues</h2>

            <h3>TypeScript errors</h3>
            <p>Common fixes:</p>
            <pre>{`# Check for type errors
npm run typecheck

# Generate Prisma types
npx prisma generate

# Clear Next.js cache
rm -rf .next`}</pre>

            <h3>Module not found</h3>
            <p>Try these steps:</p>
            <pre>{`# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev`}</pre>

            <h3>Tailwind styles not applying</h3>
            <ol>
                <li>Check that <code>postcss.config.js</code> exists</li>
                <li>Ensure <code>globals.css</code> imports Tailwind</li>
                <li>Check the content paths in Tailwind config</li>
            </ol>

            <h2>Generator Issues</h2>

            <h3>Generator not finding project</h3>
            <p>Make sure you're in a project directory with a <code>package.json</code> that has Next.js:</p>
            <pre>{`# Navigate to your project first
cd my-app

# Then run generators
npx archillesdc generate page dashboard`}</pre>

            <h3>Generated files in wrong location</h3>
            <p>The generator looks for the project root by finding <code>package.json</code> with Next.js. Ensure you're in the correct directory.</p>

            <h2>Development Issues</h2>

            <h3>Hot reload not working</h3>
            <pre>{`# Stop the dev server
# Clear the cache
rm -rf .next

# Restart
npm run dev`}</pre>

            <h3>Port already in use</h3>
            <pre>{`# Use a different port
npm run dev -- -p 3001

# Or kill the process using the port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or (macOS/Linux)
lsof -ti:3000 | xargs kill -9`}</pre>

            <h2>Still Having Issues?</h2>
            <div className="not-prose rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h4 className="font-semibold text-white mb-2">Get Help</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li>
                        📖 Check the <a href="/docs" className="text-[var(--color-primary-400)]">documentation</a>
                    </li>
                    <li>
                        🐛 Report a bug on <a href="https://github.com/archillesdc/core-framework/issues" className="text-[var(--color-primary-400)]">GitHub Issues</a>
                    </li>
                    <li>
                        💬 Ask in our <a href="https://discord.gg/archillesdc" className="text-[var(--color-primary-400)]">Discord community</a>
                    </li>
                </ul>
            </div>
        </article>
    );
}
