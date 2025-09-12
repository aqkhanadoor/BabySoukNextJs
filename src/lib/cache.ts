// A simple in-memory cache with a TTL
const cache = new Map<string, { value: any; expires: number }>();

const get = (key: string) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.value;
};

const set = (key: string, value: any, ttlMs = 1000 * 60 * 5) => {
  const expires = Date.now() + ttlMs;
  cache.set(key, { value, expires });
};

export const memoryCache = { get, set };
