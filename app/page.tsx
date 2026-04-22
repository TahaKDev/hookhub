import hooksData from "@/data/hooks.json";
import type { Hook } from "@/lib/hooks";
import HookGrid from "@/components/HookGrid";

export default function Home() {
  const hooks = hooksData as Hook[];
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          HookHub
        </h1>
        <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
          A directory of open-source Claude Code hooks.
        </p>
      </header>
      <HookGrid hooks={hooks} />
    </main>
  );
}
