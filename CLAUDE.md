# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Development: `yarn dev` - Run Next.js development server
- Build: `yarn build` - Build production application
- Start: `yarn start` - Start production server
- Lint: `yarn lint` - Run ESLint

## Code Style
- TypeScript with strict type checking
- React functional components with arrow function syntax
- Path aliases: `@/*` maps to `./src/*`
- 4-space indentation
- Single quotes for strings and JSX
- Semicolons at line ends

## Naming Conventions
- PascalCase for components, interfaces, and types
- camelCase for variables, functions, and props
- Server actions prefixed with 'use server' directive
- Files match exported component/function names

## Import Order
1. React/Next.js imports first
2. External library imports next
3. Local imports using `@/` alias
4. Types and interfaces with implementations

## Error Handling
- Return typed objects with success/error fields
- Use try/catch blocks for async operations
- Console.error for server-side logging
- Schema validation with Zod or custom validators