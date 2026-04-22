"use client";

import { useMemo, useState } from "react";
import type { HookEvent } from "@/lib/hookEvents";
import type { Hook } from "@/lib/hooks";
import FilterBar from "./FilterBar";
import HookCard from "./HookCard";

export default function HookGrid({ hooks }: { hooks: Hook[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HookEvent | null>(
    null
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hooks.filter((h) => {
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || h.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [hooks, search, selectedCategory]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        hooks={hooks}
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-400">
          No hooks match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      )}
    </div>
  );
}
