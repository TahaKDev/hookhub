import type { Hook } from "@/lib/hooks";

export default function HookCard({ hook }: { hook: Hook }) {
  return (
    <a
      href={hook.repoUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-3 rounded-xl border border-black/[.08] dark:border-white/[.12] p-5 transition-all hover:shadow-md hover:border-black/[.16] dark:hover:border-white/[.2] bg-white dark:bg-zinc-900"
    >
      <span className="inline-block w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {hook.category}
      </span>
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
          {hook.name}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {hook.author}
        </p>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1">
        {hook.description}
      </p>
      <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-auto">
        View repo →
      </span>
    </a>
  );
}
