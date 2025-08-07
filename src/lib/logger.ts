import { NextRequest } from 'next/server';

export function loggerMiddleware(req: NextRequest) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
}
