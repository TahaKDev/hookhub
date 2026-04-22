# HookHub — MVP Spec

## Context

HookHub is a browsable directory of open-source **Claude Code hooks** shared on GitHub. Claude Code hooks are user-defined shell commands that fire at specific lifecycle events (PreToolUse, PostToolUse, SessionStart, Notification, etc.) — there are [23 official event types](https://code.claude.com/docs/en/hooks-guide.md).

**Gap this fills:** today hook discovery is fragmented across a handful of GitHub "awesome-lists" (e.g. `hesreallyhim/awesome-claude-code`, `pascalporedda/awesome-claude-code`, `boxabirds/awesome-hooks`) and commercial aggregators (`aitmpl.com/hooks`). None offer a focused, searchable, grid-based view scoped specifically to hooks.

**Outcome:** a single-page Next.js site where someone looking for a Claude Code hook can scan a grid of curated entries, filter by event type, and search by name/description — then click through to the source repo.

## MVP Scope

- **Home page only** (`/`): header + filter bar + grid of hook cards.
- Each card shows: **name**, **category** (hook event), **description**, **link to repo**.
- **Client-side** category filter + text search (case-insensitive substring over name + description).
- **Static JSON** data source committed to the repo. No backend, no DB, no auth, no API integration.

### Explicit non-goals (MVP)

- No submission flow, voting, comments, user accounts.
- No per-hook detail page.
- No GitHub API enrichment (stars, last-updated).
- No URL-synced filter state.
- No dark-mode toggle (the existing `prefers-color-scheme` setup in `globals.css` is enough).

## Data Model

`data/hooks.json` — hand-curated array. Each entry:

```ts
// lib/hooks.ts
export type Hook = {
  id: string          // stable slug, e.g. "disler-hooks-mastery"
  name: string        // short display name
  author: string      // GitHub owner/org, e.g. "disler"
  description: string // 1–2 sentence summary
  category: HookEvent // primary event the hook reacts to (see hookEvents.ts)
  repoUrl: string     // https://github.com/...
}
```

`lib/hookEvents.ts` exports `HOOK_EVENTS` — a readonly tuple of the 23 official event names — and `HookEvent = typeof HOOK_EVENTS[number]`. Source of truth: https://code.claude.com/docs/en/hooks-guide.md. Categories:

`SessionStart`, `SessionEnd`, `InstructionsLoaded`, `UserPromptSubmit`, `UserPromptExpansion`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, `Stop`, `StopFailure`, `Notification`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `TeammateIdle`, `ConfigChange`, `FileChanged`, `CwdChanged`, `WorktreeCreate`, `WorktreeRemove`, `PreCompact`, `PostCompact`, `Elicitation`, `ElicitationResult`.

## File Structure (files to create)

```
app/
  page.tsx              # async server component: import hooks.json, render <HookGrid />
  layout.tsx            # existing — update <title> / metadata only
components/
  HookGrid.tsx          # 'use client' — filter state, renders FilterBar + cards
  HookCard.tsx          # presentational card
  FilterBar.tsx         # search input + event chip list with counts
lib/
  hookEvents.ts         # HOOK_EVENTS tuple + HookEvent type
  hooks.ts              # Hook type
data/
  hooks.json            # seed data (10 entries, see below)
```

Uses existing path alias `@/*` (e.g. `import hooks from "@/data/hooks.json"`). No new dependencies — Tailwind v4 classes only.

## UI Behavior

- **Header:** "HookHub" + tagline "A directory of open-source Claude Code hooks."
- **FilterBar:** full-width search `<input>` + horizontal-scrollable chip list. Each chip is a `<button>` labeled `EventName · N` (count of matching hooks) with `aria-pressed`. An "All" chip clears the filter. Clicking an active chip toggles it off.
- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
- **HookCard:** the whole card is an `<a href={repoUrl} target="_blank" rel="noreferrer">` so keyboard nav and Cmd-click work. Shows category badge (top), name (heading), author (muted subtitle), description (body).
- **Empty state:** "No hooks match your filters."
- Filtering uses `useMemo` over name + description substring match AND (no category selected OR `hook.category === selected`).

## Seed Data (10 entries for `data/hooks.json`)

Each with a representative primary category:

1. `anthropics/claude-code` examples/hooks — official bash validator — **PreToolUse**
2. `disler/claude-code-hooks-mastery` — lifecycle-wide reference collection — **PostToolUse**
3. `karanb192/claude-code-hooks` — safety/format/notify starter pack — **PreToolUse**
4. `CodyLunders/claude-code-hooks-library` — 60+ hooks across security/quality/git — **PostToolUse**
5. `disler/claude-code-hooks-multi-agent-observability` — event logging & visualization — **PostToolUse**
6. `gjohnsx/claude-code-notification-hooks` — cross-platform desktop alerts — **Notification**
7. `ChrisWiles/claude-code-showcase` — end-to-end project config example — **Stop**
8. `diet103/claude-code-infrastructure-showcase` — skill activation + tracking — **PostToolUse**
9. `ronaldeddings/Basic-Claude-Code-Hook-For-Context` — simple context injector — **SessionStart**
10. `johnlindquist/claude-hooks` — TypeScript hooks w/ typed payloads — **PreToolUse**

## Verification

1. `npm run dev` — home at http://localhost:3000 renders all 10 seed hooks in a grid.
2. Type in the search box — result count narrows; clearing restores the full list.
3. Click an event chip (e.g. `PostToolUse`) — grid filters to matching hooks; chip shows `aria-pressed="true"`; clicking again clears.
4. Combine search + chip — both filters apply together.
5. Click a card — target repo opens in a new tab.
6. Resize: 1 column < 640px, 2 columns ≥ 640px, 3 columns ≥ 1024px.
7. `npm run lint` passes.
8. `npm run build` succeeds under Turbopack.

## Future Work (post-MVP, out of scope)

- Submission flow (PR template or GitHub issue form).
- GitHub API enrichment at build time (stars, last commit, avatar).
- Per-hook detail page with an installable `settings.json` snippet and copy-to-clipboard.
- URL-synced filter state for shareable views (`?category=PreToolUse&q=format`).
- Extended taxonomy: secondary `tags` (safety/formatting/logging/...) and hook-type (command/prompt/agent).
- Multi-event hooks (primary + additional events array).
