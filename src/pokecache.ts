export type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalid: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(interval: number = 5000) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  #reap() {
    const now = Date.now();
    for (const [key, entry] of this.#cache) {
      if (now - entry.createdAt > this.#interval) {
        this.#cache.delete(key);
      }
    }
  }

  #startReapLoop() {
    this.#reapIntervalid = setInterval(() => this.#reap(), this.#interval);
  }

  add<T>(key: string, val: T): void {
    const entry: CacheEntry<T> = {
      createdAt: Date.now(),
      val: val,
    };
    this.#cache.set(key, entry);
  }

  get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key);
    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() - entry.createdAt > this.#interval) {
      this.#cache.delete(key);
      return undefined;
    }

    return entry.val;
  }

  delete(key: string): boolean {
    return this.#cache.delete(key);
  }

  clear(): void {
    this.#cache.clear();
  }

  stopReapLoop(): void {
    if (this.#reapIntervalid) {
      clearInterval(this.#reapIntervalid);
      this.#reapIntervalid = undefined;
    }
  }
}
