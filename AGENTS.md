# AGENTS.md

This file contains guidelines for AI agents working on this codebase.

## Project Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4, shadcn/ui (base-mira style)
- **Icons**: Hugeicons
- **Package Manager**: Bun

## Build Commands

```bash
# Development
bun run dev              # Start dev server with type fetching
bun run types:fetch      # Run type fetching script

# Build
bun run build            # Production build
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint
bun run lint --fix       # Fix auto-fixable issues
```

### Type Checking

TypeScript is configured with strict mode. Check types without emitting:
```bash
bun run build            # Full build (includes type checking)
```

## Code Style Guidelines

### Imports

- Use `@/*` alias for root-level imports (configured in tsconfig.json)
- Group imports: React/Next, third-party libraries, internal modules
- Use named imports preferentially
- Type imports should use `import type { ... }` syntax

```typescript
import type { Metadata } from "next";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
```

### Component Structure

- Use function components with explicit return types when beneficial
- Props interfaces should be defined inline or in the same file
- Client components must include `"use client"` directive
- Server components are default (no directive needed)

```typescript
"use client";

interface Props {
  children: React.ReactNode;
}

export function Component({ children }: Props) {
  return <div>{children}</div>;
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserSession`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: Use kebab-case for non-component files

### Styling

- Use Tailwind CSS utility classes exclusively
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Prefer semantic color tokens (`bg-background`, `text-foreground`)
- Use `size-*` utility instead of `w-* h-*` for square elements
- Dark mode is supported via `dark:` variant

```tsx
<div className={cn("flex items-center gap-2", isActive && "bg-primary")}>
```

### TypeScript

- Enable strict mode - avoid implicit `any` types
- Use explicit return types for exported functions
- Define interfaces for component props and API responses
- Use `type` for unions, `interface` for object shapes

### Error Handling

- Use try-catch for async operations
- Log errors with context: `console.error("Action failed:", error)`
- Use Next.js error boundaries for component errors

### shadcn/ui Components

- Located in `components/ui/`
- Import from `@/components/ui/component-name`
- Use Hugeicons for icons (configured in components.json)
- Follow the base-mira design system

### Project Structure

```
app/              # Next.js App Router pages
  (explore)/      # Route groups
  (auth)/
  (media)/
components/       # React components
  ui/             # shadcn/ui components
  auth/           # Auth-related components
  explore/        # Explore page components
  player/         # Media player components
lib/              # Utility functions and clients
  auth-client.ts  # Better Auth client
  eden.ts         # Elysia Eden client
  utils.ts        # General utilities
public/           # Static assets
types/            # Type definitions
typescripts/      # TypeScript configuration
```

### Route Groups

- Use route groups `(group-name)` for layout organization
- Group names don't affect URL structure
- Current groups: `(auth)`, `(explore)`, `(media)`

### API Integration

- Use Elysia Eden (`@/lib/eden.ts`) for type-safe API calls
- Use Better Auth (`@/lib/auth-client.ts`) for authentication
- Store API keys in `.env` file (never commit)

### Environment Variables

- Next.js automatically loads `.env.local` and `.env` files
- Access via `process.env.VARIABLE_NAME`
- Add type definitions to `types/` directory for type safety

## Testing

**Note**: No test framework is currently configured. When adding tests:
- Consider Vitest for unit testing
- Use Playwright for E2E testing
- Place test files alongside components or in `__tests__/` directories

## Important Notes

- This project uses Bun as the package manager
- TypeScript strict mode is enforced
- Next.js 16 with React 19 features (Server Components by default)
- Tailwind CSS v4 with new CSS-first configuration
- Dark mode enabled by default via `next-themes`
- Fonts: DM Sans (primary), Geist Sans, Geist Mono
