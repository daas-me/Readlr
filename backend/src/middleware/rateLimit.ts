import type { Request, Response, NextFunction } from 'express';

// In-memory fixed-window counter shared by per-IP request limits and per-account failure limits.
export function createLimiter(max: number, windowMs: number, message = 'Please wait a minute before trying again.') {
  const attempts = new Map<string, { count: number; until: number }>();
  const prune = (now: number) => { for (const [key, value] of attempts) if (value.until < now) attempts.delete(key); };
  const blocked = (key: string) => { prune(Date.now()); return (attempts.get(key)?.count ?? 0) >= max; };
  const hit = (key: string) => {
    const now = Date.now();
    prune(now);
    const item = attempts.get(key) ?? { count: 0, until: now + windowMs };
    item.count++;
    attempts.set(key, item);
    return item.count > max || attempts.size > 10000;
  };
  const clear = (key: string) => { attempts.delete(key); };
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    if (hit(req.ip ?? req.socket?.remoteAddress ?? 'unknown')) { res.status(429).json({ success: false, message }); return; }
    next();
  };
  return { middleware, hit, blocked, clear };
}
