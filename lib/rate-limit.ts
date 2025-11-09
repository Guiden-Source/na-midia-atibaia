// Simple in-memory rate limiter
// For production, consider using Redis or Upstash

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000);

interface RateLimitOptions {
  maxRequests?: number; // Max requests per window
  windowMs?: number; // Time window in milliseconds
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const maxRequests = options.maxRequests || 5; // 5 requests
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes

  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // No existing entry or expired - create new
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  // Existing entry - check limit
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getRateLimitIdentifier(ip: string, eventId?: string): string {
  return eventId ? `${ip}:${eventId}` : ip;
}
