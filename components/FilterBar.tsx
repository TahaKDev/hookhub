"use client";

import type { HookEvent } from "@/lib/hookEvents";
import { HOOK_EVENTS } from "@/lib/hookEvents";
import type { Hook } from "@/lib/hooks";

type Props = {
  hooks: Hook[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: HookEvent | null;
  onCategoryChange: (category: HookEvent | null) => void;
};

export default function FilterBar({
  hooks,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: Props) {
  const categoriesWithCount = HOOK_EVENTS.filter((event) =>
    hooks.some((h) => h.category === event)
  ).map((event) => ({
    event,
    count: hooks.filter((h) => h.category === event).length,
  }));

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        placeholder="Search hooks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          aria-pressed={selectedCategory === null}
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            selectedCategory === null
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-black/[.12] dark:border-white/[.15] text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
          }`}
        >
          All · {hooks.length}
        </button>
        {categoriesWithCount.map(({ event, count }) => (
          <button
            key={event}
            aria-pressed={selectedCategory === event}
            onClick={() =>
              onCategoryChange(selectedCategory === event ? null : event)
            }
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === event
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-black/[.12] dark:border-white/[.15] text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
            }`}
          >
            {event} · {count}
          </button>
        ))}
      </div>
    </div>
  );
}
