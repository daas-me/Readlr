import { Request, Response } from 'express';

/**
 * GET /health
 * Health check endpoint
 */
export function handleHealthCheck(req: Request, res: Response) {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
}
