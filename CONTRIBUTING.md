# Contributing to ArchillesDC

Thank you for your interest in contributing! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Style Guide](#style-guide)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your changes

```bash
git clone https://github.com/YOUR_USERNAME/core-framework.git
cd core-framework
git checkout -b feature/your-feature-name
```

## Development Setup

### Prerequisites

- Node.js 18.17+
- npm, pnpm, yarn, or bun

### CLI Development

```bash
# Navigate to CLI directory
cd cli

# Install dependencies
npm install

# Build the CLI
npm run build

# Watch mode for development
npm run dev

# Test locally
node dist/index.js --help
node dist/index.js test-project -y --no-install
```

### Testing Changes

```bash
# Create a test project
cd cli
node dist/index.js ../test-app -y

# Navigate to test project
cd ../test-app

# Run the project
npm run dev
```

## Making Changes

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(cli): add new template option
fix(auth): resolve session persistence issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Submitting a Pull Request

1. Ensure your code builds without errors
2. Update documentation if needed
3. Add tests if applicable
4. Push your branch and create a PR

```bash
git push origin feature/your-feature-name
```

### PR Checklist

- [ ] Code builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Follows style guide
- [ ] Meaningful commit messages

## Style Guide

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit return types for functions
- Use interfaces for object shapes

```typescript
// ✅ Good
interface UserOptions {
  name: string;
  email: string;
}

function createUser(options: UserOptions): User {
  return { ...options, id: generateId() };
}

// ❌ Avoid
function createUser(options: any) {
  return { ...options, id: generateId() };
}
```

### File Organization

```
src/
├── commands/      # CLI commands
├── templates/     # Template generators
│   ├── base/      # Base config files
│   ├── app/       # App pages
│   ├── auth/      # Auth module
│   └── ...
├── utils/         # Utility functions
└── index.ts       # Entry point
```

### Component Templates

```typescript
// Component generator template
export function generateComponent(name: string): string {
  return `
import { cn } from "@/utils/cn";

interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${name}({ className, children }: ${name}Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
`.trim();
}
```

## Questions?

Feel free to open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
