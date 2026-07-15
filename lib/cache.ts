/**
 * A tiny in-memory TTL cache for server-side use.
 *
 * Entries expire lazily on read. Sized to be safe inside a serverless function:
 * we never store more than `maxEntries` items (oldest evicted first).
 */
export class TtlCache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlMs: number, maxEntries = 200) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    // Refresh recency by re-inserting at the end of the Map.
    this.store.delete(key);
    this.store.set(key, hit);
    return hit.value;
  }

  set(key: string, value: T, ttlMs: number = this.ttlMs): void {
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) this.store.delete(firstKey);
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  /** Read an existing value or compute, cache and return it. */
  async getOrCompute(
    key: string,
    compute: () => Promise<T>,
    ttlMs: number = this.ttlMs
  ): Promise<T> {
    const existing = this.get(key);
    if (existing !== undefined) return existing;
    const value = await compute();
    this.set(key, value, ttlMs);
    return value;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
