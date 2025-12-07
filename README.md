# ✨ Core Frameworks Ecosystem

Welcome to the **Core Frameworks** monorepo, a collection of powerful tools and CLI generators designed to accelerate the development of full-stack web applications and robust enterprise systems using the **T3 Stack** (Next.js, Tailwind, tRPC, Prisma, NextAuth).

## 🚀 Available Tools

### 1. Core Frameworks Universal Generator (`core-frameworks`)

A **Universal System Generator** that adapts to *any* input. No choices, just results. You name it, we build it.

**Features:**
- **Free Input**: Type ANY system name (e.g., "Payroll System", "Hospital Management", "POS").
- **Smart Slugification**: Automatically converts names to safe folder paths (e.g., `Payroll System` → `payroll-system`).
- **Dynamic Scaffolding**: Generates a generic T3-based system with your specific system name embedded.
- **Instant Setup**: Comes with Auth, Database (SQLite), UI Components, and API structure pre-wired.

**Usage:**
```bash
npx core-frameworks
```
*Follow the single prompt to generate your system.*

---

### 2. Create ArchillesDC App (`create-archillesdc-app`)

A highly structured, template-based generator for specific use cases.

**Features:**
- **Selection Choices**: Choose your specific template (Full System, Admin Dashboard, Barebones).
- **Component Picker**: Select which UI components to include.
- **Tech Flexibility**: Choices for Database and Auth providers.
- **Production Ready**: Optimized for structured enterprise deployment.

**Usage:**
```bash
npx create-archillesdc-app
```

---

## 🛠️ Tech Stack

Both tools leverage the modern **T3 Stack**:
- **Next.js**: The React Framework for the Web
- **TypeScript**: Strictly typed for reliability
- **Tailwind CSS**: Rapid UI development
- **Prisma**: Next-generation ORM
- **tRPC**: End-to-end typesafe APIs
- **NextAuth.js**: Authentication for Next.js

## 📦 Project Structure

```
coreframeworks-space/
├── cli/                    # source for create-archillesdc-app
├── core-frameworks-cli/    # source for Universal Generator (core-frameworks)
├── docs/                   # Documentation portal
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

MIT © ArchillesDC
