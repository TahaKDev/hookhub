# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Commands

```bash
npm run dev      # Start development server (Turbopack by default in Next.js 16)
npm run build    # Production build (also Turbopack by default)
npm run start    # Start production server
npm run lint     # Run ESLint via the ESLint CLI (not `next lint`)
```

No test framework is installed. Add one before writing tests.

## Architecture

This is a **Next.js 16** application using the **App Router** exclusively. There is no Pages Router.

```
app/           # All routes and UI live here
  layout.tsx   # Root layout — sets up Geist font and global metadata
  page.tsx     # Home route (/)
  globals.css  # Tailwind CSS v4 imports + CSS custom properties for light/dark theme
public/        # Static assets served at /
```

Path alias `@/*` maps to the repository root.

## Next.js 16 — Key Breaking Changes

Before adding any feature, read the relevant guide in `node_modules/next/dist/docs/`.

**Async Request APIs (breaking):** `params` and `searchParams` are now always `Promise`s. Synchronous access is removed. Run `npx next typegen` to generate `PageProps`/`LayoutProps` type helpers.

```tsx
// page.tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**`middleware` → `proxy`:** The `middleware.ts` convention is deprecated. Use `proxy.ts` instead. The `edge` runtime is not supported in `proxy` — keep `middleware.ts` if you need edge.

**Turbopack by default:** `next dev` and `next build` use Turbopack. Custom `webpack` config in `next.config.ts` will break the build — migrate to Turbopack config or pass `--webpack` to opt out.

**PPR / caching:** Partial Prerendering is now enabled via `cacheComponents: true` in `next.config.ts` (not an experimental flag). `cacheLife`/`cacheTag` are stable — drop the `unstable_` prefix. `revalidateTag` now requires a second `cacheLife` argument.

**Instant navigation:** For routes that should navigate instantly, export `unstable_instant` from the route file and ensure dynamic data is wrapped in `<Suspense>` boundaries. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.

**`next/image`:** `minimumCacheTTL` default changed to 4 hours; default `imageSizes` no longer includes 16px; default `qualities` is now `[75]`. Local images with query strings require `images.localPatterns.search` config.

**React Compiler:** Stable but not enabled by default. Enable with `reactCompiler: true` in `next.config.ts`.
