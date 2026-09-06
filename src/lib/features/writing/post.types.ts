import type { WritingData, WorkData } from '$lib/content';

export type StaticEntry<T> = {
  id: string;
  data: T;
};

export type WritingEntry = StaticEntry<WritingData>;
export type WorkEntry = StaticEntry<WorkData>;

// The editorial backend is intentionally deferred. These arrays are the stable
// frontend contract that the future published-post service will replace.
export const publishedWriting: WritingEntry[] = [];
export const publishedWork: WorkEntry[] = [];
