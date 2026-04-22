import type { HookEvent } from "./hookEvents";

export type Hook = {
  id: string;
  name: string;
  author: string;
  description: string;
  category: HookEvent;
  repoUrl: string;
};
