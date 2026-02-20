# AGENTS.md

This file contains guidelines for AI agents working on this codebase.

## Project Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4, shadcn/ui (base-mira style)
- **Icons**: Hugeicons (`@hugeicons/react` with `@hugeicons/core-free-icons`)
- **Package Manager**: Bun

## Build Commands

```bash
bun run dev              # Start dev server (runs types:fetch first)
bun run build            # Production build (includes type checking)
bun run start            # Start production server
bun run lint             # Run ESLint
bun run lint --fix       # Fix auto-fixable issues
bun run types:fetch      # Fetch backend types from API
```

**Note**: No test framework is currently configured.

## Code Style Guidelines

### Imports

Use `@/*` alias for root-level imports. Group and order imports:

```typescript
// 1. React/Next
import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// 2. Third-party libraries
import { HugeiconsIcon } from "@hugeicons/react";
import { Film01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

// 3. Internal modules (ui components first, then others)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth-client";
```

- Use named imports preferentially
- Type imports use `import type { ... }` syntax
- Component imports follow shadcn/ui patterns

### Component Structure

```typescript
"use client";  // Only for client components

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Component({ className, children }: Props) {
  const [state, setState] = useState(false);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
```

- Server components are default (no directive)
- Props interfaces defined inline in the same file
- Destructure props in function signature
- Use `React.ComponentProps<"element">` for extending native elements

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `UserSession` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Non-component files | kebab-case | `auth-client.ts` |

### Styling

- Use Tailwind CSS utility classes exclusively
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer semantic color tokens: `bg-background`, `text-foreground`, `bg-primary`
- Use `size-*` for square elements instead of `w-* h-*`
- Dark mode via `dark:` variant (enabled by default)

```tsx
<div className={cn(
  "flex items-center gap-2 rounded-md px-2",
  isActive && "bg-primary text-primary-foreground",
  className
)}>
```

### TypeScript

- Strict mode enabled - no implicit `any`
- Use `type` for unions, `interface` for object shapes
- Use `import type` for type-only imports
- Environment variables: `process.env.VARIABLE_NAME as string` with non-null assertion

### Error Handling

- Use try-catch for async operations
- Log errors with context: `console.error("Action failed:", error)`
- Use Next.js error boundaries for component-level errors
- Display user-friendly error messages via state

### shadcn/ui Components

- Located in `components/ui/`
- Import: `import { Component } from "@/components/ui/component-name"`
- Icons use Hugeicons pattern:

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { Film01Icon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={Film01Icon} strokeWidth={2} className="size-6" />
```

## Project Structure

```
app/                    # Next.js App Router pages
  (auth)/               # Authentication route group
    login/page.tsx
    signup/page.tsx
  (explore)/            # Explore route group
    movies/page.tsx
    shows/page.tsx
  layout.tsx            # Root layout
  globals.css           # Tailwind CSS v4 config
components/
  ui/                   # shadcn/ui components
  auth/                 # Auth-related components
  explore/              # Explore page components
  theme-provider.tsx    # next-themes provider
lib/
  utils.ts              # cn() utility
  auth-client.ts        # Better Auth client
  eden.ts               # Elysia Eden API client
  tmdb.ts               # TMDB integration
types/
  index.ts              # Type re-exports
  server.d.ts           # Backend API types (auto-generated)
```

## API Integration

### Backend API

```typescript
import { api } from "@/lib/eden";

const response = await api.endpoint.get();
```

Types are fetched via `bun run types:fetch` and stored in `types/server.d.ts`.

### Authentication

```typescript
import { signIn, signOut, useSession } from "@/lib/auth-client";

// Email sign in
await signIn.email({ email, password, callbackURL: "/" });

// Social sign in
await signIn.social({ provider: "google", callbackURL: "/" });

// Get session
const { data: session } = useSession();
```

## Environment Variables

- Stored in `.env.local` (never commit)
- Client-side: prefix with `NEXT_PUBLIC_`
- Access: `process.env.NEXT_PUBLIC_BACKEND_URL as string`
- Required env vars: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_FRONTEND_URL`

## Key Dependencies

- **@base-ui/react**: Unstyled UI primitives (used by shadcn/ui)
- **better-auth**: Authentication
- **@elysiajs/eden**: Type-safe API client
- **next-themes**: Dark mode support
- **class-variance-authority**: Component variants
- **clsx + tailwind-merge**: Class merging via `cn()`
