# AI Agent Instructions for frontend/

## Coding Standards
- Use TypeScript and React (with Vite) conventions.
- Use ECMAScript Modules (ESM) syntax, not CommonJS (CJS).
- Follow best practices for code structure, modularity, and maintainability.
- Name variables, functions, and components descriptively and consistently.
- Write reusable components and hooks; avoid duplication.
- Add concise JSDoc comments to public functions, components, and hooks.

## Code Formatting
- Format all code using Prettier by running the formatting script defined in `package.json` (e.g., `npm run format`).
- Fix linting issues using the linting script in `package.json` (e.g., `npm run lint`).
- Follow the project's Prettier and ESLint configuration files for style rules.

## Dependency Management
- Add dependencies using npm: `npm install <package>` which updates `package.json` and `package-lock.json`.
- Do not manually edit `package-lock.json`.

## Project Practices
- Organize code by feature or domain (e.g., components, hooks, pages, stores, utils).
- Use the `src/` directory for all source code.
- Keep configuration files (e.g., `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `prettier.config.mjs`) up to date and consistent.
- Use environment variables for configuration and secrets.

## Commit and Workflow
- Ensure code is formatted and linted before commit using the scripts in `package.json`.
- Write clear commit messages describing changes.

## Summary
Follow these instructions to ensure code quality, maintainability, and reliability in the frontend project. All code, formatting, and dependencies must comply with these rules.
