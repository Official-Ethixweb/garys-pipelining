// Best-effort, in-memory sliding-window limiter. It resets whenever the
// serverless function instance recycles and isn't shared across regions or
// concurrent instances, so it's a speed bump against casual abuse, not a
// durable defense. If this endpoint ever needs to withstand a real attack,
// swap this for Upstash Redis or Vercel KV without changing the call site.
type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

function sweep(now: number, windowMs: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs) buckets.delete(key);
  }
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, opts?: { windowMs?: number; max?: number }): RateLimitResult {
  const windowMs = opts?.windowMs ?? 60_000;
  const max = opts?.max ?? 5;
  const now = Date.now();

  sweep(now, windowMs);

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStart + windowMs - now) / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true };
}
