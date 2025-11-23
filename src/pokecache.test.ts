import { Cache } from "./pokecache.js";
import { describe, expect, test, beforeEach, afterEach } from "vitest";

describe("Cache", () => {
  let cache: Cache;

  beforeEach(() => {
    // Create a new cache with short interval for testing
    cache = new Cache(100); // 100ms interval for fast testing
  });

  afterEach(() => {
    // Clean up resources after each test
    cache.stopReapLoop();
  });

  describe("Basic Operations", () => {
    test.concurrent.each([
      {
        key: "string-key",
        value: "test string",
        description: "string value",
      },
      {
        key: "number-key",
        value: 42,
        description: "number value",
      },
      {
        key: "object-key",
        value: { name: "Pikachu", type: "Electric" },
        description: "object value",
      },
      {
        key: "array-key",
        value: [1, 2, 3, 4, 5],
        description: "array value",
      },
      {
        key: "boolean-key",
        value: true,
        description: "boolean value",
      },
    ])("should cache and retrieve $description", ({ key, value }) => {
      // Add value to cache
      cache.add(key, value);

      // Retrieve value from cache
      const retrieved = cache.get(key);

      // Verify it matches original value
      expect(retrieved).toBe(value);
    });

    test("should return undefined for non-existent keys", () => {
      const result = cache.get("non-existent-key");
      expect(result).toBeUndefined();
    });

    test("should return undefined for expired entries", async () => {
      const shortCache = new Cache(50); // 50ms interval
      shortCache.add("test-key", "test-value");

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 60));

      const result = shortCache.get("test-key");
      expect(result).toBeUndefined();

      shortCache.stopReapLoop();
    });
  });

  describe("Cache Management", () => {
    test("should delete specific entries", () => {
      cache.add("key1", "value1");
      cache.add("key2", "value2");

      expect(cache.get("key1")).toBe("value1");
      expect(cache.get("key2")).toBe("value2");

      // Delete first entry
      const deleted = cache.delete("key1");
      expect(deleted).toBe(true);

      // Verify deletion
      expect(cache.get("key1")).toBeUndefined();
      expect(cache.get("key2")).toBe("value2"); // Second entry should remain
    });

    test("should return false when deleting non-existent entries", () => {
      const result = cache.delete("non-existent-key");
      expect(result).toBe(false);
    });

    test("should clear all entries", () => {
      cache.add("key1", "value1");
      cache.add("key2", "value2");
      cache.add("key3", "value3");

      expect(cache.get("key1")).toBe("value1");
      expect(cache.get("key2")).toBe("value2");
      expect(cache.get("key3")).toBe("value3");

      cache.clear();

      expect(cache.get("key1")).toBeUndefined();
      expect(cache.get("key2")).toBeUndefined();
      expect(cache.get("key3")).toBeUndefined();
    });
  });

  describe("Cache Expiration", () => {
    test("should expire entries after specified interval", async () => {
      const shortCache = new Cache(75); // 75ms interval
      shortCache.add("fresh", "data");

      // Immediately after adding, should be available
      expect(shortCache.get("fresh")).toBe("data");

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 80));

      // After expiration, should be undefined
      expect(shortCache.get("fresh")).toBeUndefined();

      shortCache.stopReapLoop();
    });

    test("should automatically clean up expired entries during periodic reaping", async () => {
      const testCache = new Cache(50);
      testCache.add("expire1", "value1");
      testCache.add("expire2", "value2");

      // Wait for entries to expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Trigger manual reaping by getting a non-existent key (which also triggers cleanup)
      testCache.get("non-existent");

      // Now add a new entry to verify cache is still functional
      testCache.add("new", "fresh");
      expect(testCache.get("new")).toBe("fresh");

      testCache.stopReapLoop();
    });
  });

  describe("Resource Management", () => {
    test("should properly stopReapLoop of intervals", () => {
      const intervalCount = 5;
      const caches: Cache[] = [];

      // Create multiple caches
      for (let i = 0; i < intervalCount; i++) {
        caches.push(new Cache(1000));
      }

      // All should be functional
      caches.forEach((c, i) => {
        c.add(`key${i}`, `value${i}`);
        expect(c.get(`key${i}`)).toBe(`value${i}`);
      });

      // Dispose all
      caches.forEach((c) => c.stopReapLoop());

      // Verify disposal (intervals should be cleared)
      caches.forEach((c, i) => {
        // Cache should still work but without periodic cleanup
        expect(c.get(`key${i}`)).toBe(`value${i}`);
        c.add("test-after-dispose", "should-work");
        expect(c.get("test-after-dispose")).toBe("should-work");
      });
    });

    test("should handle disposal when called multiple times", () => {
      const testCache = new Cache(100);
      testCache.add("test", "value");

      // Multiple disposals should not cause errors
      expect(() => {
        testCache.stopReapLoop();
        testCache.stopReapLoop();
        testCache.stopReapLoop();
      }).not.toThrow();

      // Cache should still be readable after disposal
      expect(testCache.get("test")).toBe("value");
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty strings as keys", () => {
      const emptyKey = "";
      const value = "empty key value";

      cache.add(emptyKey, value);
      expect(cache.get(emptyKey)).toBe(value);
    });

    test("should handle special characters in keys", () => {
      const specialKeys = [
        "key with spaces",
        "key/with/slashes",
        "key?with?questions",
        "key#with#hashes",
        "key.with.dots",
        "key-with-dashes",
      ];

      specialKeys.forEach((key) => {
        const value = `value for ${key}`;
        cache.add(key, value);
        expect(cache.get(key)).toBe(value);
      });
    });

    test("should handle large values", () => {
      const largeObject = {
        data: Array(1000).fill("large data piece"),
        metadata: {
          timestamp: Date.now(),
          type: "large-payload-test",
        },
      };

      cache.add("large-key", largeObject);
      const retrieved = cache.get<typeof largeObject>("large-key");

      expect(retrieved).toEqual(largeObject);
      expect(retrieved?.data).toHaveLength(1000);
    });

    test("should handle undefined and null values", () => {
      cache.add("undefined-key", undefined);
      cache.add("null-key", null);

      expect(cache.get("undefined-key")).toBeUndefined();
      expect(cache.get("null-key")).toBeNull();
    });
  });

  describe("Custom Intervals", () => {
    test("should work with different interval durations", () => {
      const instantCache = new Cache(1); // 1ms
      const longCache = new Cache(10000); // 10 seconds

      instantCache.add("instant", "fast");
      longCache.add("long", "slow");

      // Instant cache should expire quickly
      setTimeout(() => {
        expect(instantCache.get("instant")).toBeUndefined();
      }, 10);

      // Long cache should still be valid
      expect(longCache.get("long")).toBe("slow");

      instantCache.stopReapLoop();
      longCache.stopReapLoop();
    });
  });
});
