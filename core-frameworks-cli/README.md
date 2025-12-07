# Core Frameworks Universal Generator

A powerful, no-nonsense CLI tool to generate full Universal Systems instantly.
Unlike other generators that ask 20 questions, `core-frameworks` asks **one**:

> **"What system do you want to generate?"**

## 🔥 Features

- **Universal Input**: Payroll, Hospital, POS, e-Commerce... type anything.
- **Auto-Adapt**: Automatically detects context (e.g., "Car Rental" -> uses car images, "School System" -> uses education images).
- **Smart Scaffolding**: Automatically creates a safe project slug (e.g., `Payroll System` -> `payroll-system`).
- **Complete Tech Stack**: Generates a production-ready T3 Stack application.
- **Pre-configured**:
    - **Next.js** (App/Pages)
    - **TypeScript**
    - **Tailwind CSS**
    - **tRPC**
    - **Prisma** (SQLite default)
    - **NextAuth.js**

## 🚀 Quick Start

Run the generator with `npx`:

```bash
npx core-frameworks
```

1. Enter your system name (e.g., "Library Management System").
2. Watch it generate.
3. Start coding!

```bash
cd library-management-system
npm install
npm run dev
```

## 🛠️ Generated Stack

Your new system comes with:
- **Auth**: Secure authentication setup.
- **Database**: Local SQLite database (easily switchable to Postgres/MySQL).
- **API**: Type-safe API endpoints via tRPC.
- **UI**: Modern, responsive design with Tailwind CSS.

## 📦 Installation

To use it globally (optional):

```bash
npm install -g core-frameworks
```

## 📄 License

MIT
