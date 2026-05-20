type Hit = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, Hit>();
const windowMs = 60_000;
const maxRequests = 8;

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}
