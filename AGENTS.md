<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# hrfashion-frontend

**Stack:** Next.js 16.2.10 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · TanStack React Query 5 · better-auth + MongoDB · framer-motion/gsap · radix-ui · lucide-react · recharts

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` (Turbopack, port 3000) |
| Build | `npm run build` |
| Lint | `npm run lint` (ESLint flat config — `eslint.config.mjs`) |
| Start | `npm run start` |

No test or typecheck scripts exist. Only verification is lint.

## Conventions

- **Path alias:** `@/*` → `./src/*` (configured in `tsconfig.json`)
- **Tailwind v4:** uses `@import "tailwindcss"` and `@theme inline {}` — NOT the v3 `@tailwind` directives or `tailwind.config`
- **CSS class utils:** `clsx` + `tailwind-merge` + `class-variance-authority` (use `cn()` helper pattern)
- **Auth:** `better-auth` + `@better-auth/mongo-adapter` — MongoDB-backed
- **State:** TanStack React Query v5 for server state
- **Icons:** `lucide-react`
- **Toasts:** `sonner`
- **Themes:** `next-themes` + `nextjs-toploader`

## Env

No `.env*` files are committed. Create `.env.local` for local development. Variables required: `MONGODB_URI`, `DATABASE_NAME`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`.

## Source layout

```
src/
  app/              # App Router pages & layouts (auth, admin, dashboard, collections, careers, contact, about, etc.)
  components/       # UI components (providers, layout, home, product, career, interview modals, cards, skeletons)
  lib/              # Client helpers (auth.ts server, auth-client.ts client, mongodb.ts, api.ts, queryKeys.ts)
  proxy.ts          # Middleware: protects /dashboard/* and /admin/* routes via better-auth session check
```
