const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Evita crescimento ilimitado do Map em processos de longa duração.
function sweepExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Rate limit em memória, por IP. Funciona bem em um único processo Node
 * (self-hosted, Docker, etc.). Em plataformas serverless com múltiplas
 * instâncias (Vercel, por exemplo) cada instância tem seu próprio contador,
 * então o limite efetivo é aproximado, não exato — para uma garantia mais
 * forte nesse cenário, troque por um store compartilhado (ex.: Upstash Redis).
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (buckets.size > 10_000) sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
