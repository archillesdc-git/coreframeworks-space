export const metadata = {
    title: "Troubleshooting - ArchillesDC Docs",
    description: "Common issues and solutions for ArchillesDC",
};

export default function TroubleshootingPage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">Troubleshooting</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Solutions to common issues and problems.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Installation Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Command not found: archillesdc</h3>
            <p className="text-gray-400 mb-4">If you get this error after installation:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Use npx instead
npx archillesdc generate page dashboard

# Or install globally
npm install -g create-archillesdc-app`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Permission denied errors</h3>
            <p className="text-gray-400 mb-4">On macOS/Linux, you might need to fix npm permissions:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Option 1: Use a node version manager (recommended)
# Install nvm: https://github.com/nvm-sh/nvm

# Option 2: Change npm directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Database Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Prisma: Database URL not set</h3>
            <p className="text-gray-400 mb-4">Ensure your <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">.env</code> file has the correct DATABASE_URL:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# SQLite (default)
DATABASE_URL="file:./db.sqlite"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/dbname"`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Migration failed</h3>
            <p className="text-gray-400 mb-4">If <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">db:push</code> fails:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or push with force
npx prisma db push --force-reset`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Prisma client not generated</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Generate the Prisma client
npx prisma generate

# Then restart your dev server
npm run dev`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Authentication Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">AUTH_SECRET missing</h3>
            <p className="text-gray-400 mb-4">Generate a secure secret:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Generate secret
openssl rand -base64 32

# Add to .env
AUTH_SECRET="your-generated-secret"`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">OAuth callback error</h3>
            <p className="text-gray-400 mb-4">Check your OAuth provider settings:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li>Callback URL should be: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">http://localhost:3000/api/auth/callback/[provider]</code></li>
                <li>For Discord: <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">http://localhost:3000/api/auth/callback/discord</code></li>
                <li>Make sure client ID and secret are correct</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Session not persisting</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li>Check that DATABASE_URL is correct</li>
                <li>Run <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">npx prisma db push</code></li>
                <li>Clear browser cookies</li>
                <li>Restart the dev server</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Build Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">TypeScript errors</h3>
            <p className="text-gray-400 mb-4">Common fixes:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Check for type errors
npm run typecheck

# Generate Prisma types
npx prisma generate

# Clear Next.js cache
rm -rf .next`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Module not found</h3>
            <p className="text-gray-400 mb-4">Try these steps:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Tailwind styles not applying</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-8 ml-4">
                <li>Check that <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">postcss.config.js</code> exists</li>
                <li>Ensure <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">globals.css</code> imports Tailwind</li>
                <li>Check the content paths in Tailwind config</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Generator Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Generator not finding project</h3>
            <p className="text-gray-400 mb-4">Make sure you're in a project directory with a <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">package.json</code> that has Next.js:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Navigate to your project first
cd my-app

# Then run generators
npx archillesdc generate page dashboard`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Generated files in wrong location</h3>
            <p className="text-gray-400 mb-8">The generator looks for the project root by finding <code className="bg-white/10 px-1 py-0.5 rounded text-white text-sm">package.json</code> with Next.js. Ensure you're in the correct directory.</p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Development Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Hot reload not working</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Stop the dev server
# Clear the cache
rm -rf .next

# Restart
npm run dev`}</pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Port already in use</h3>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`# Use a different port
npm run dev -- -p 3001

# Or kill the process using the port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or (macOS/Linux)
lsof -ti:3000 | xargs kill -9`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Still Having Issues?</h2>
            <div className="rounded-xl border border-white/10 bg-[#12121a] p-6 not-prose">
                <h4 className="font-semibold text-white mb-2">Get Help</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                        <span>📖</span> Check the <a href="/docs" className="text-violet-400 hover:text-violet-300 hover:underline">documentation</a>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>🐛</span> Report a bug on <a href="https://github.com/archillesdc/core-framework/issues" className="text-violet-400 hover:text-violet-300 hover:underline">GitHub Issues</a>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>💬</span> Ask in our <a href="https://discord.gg/archillesdc" className="text-violet-400 hover:text-violet-300 hover:underline">Discord community</a>
                    </li>
                </ul>
            </div>
        </article>
    );
}
