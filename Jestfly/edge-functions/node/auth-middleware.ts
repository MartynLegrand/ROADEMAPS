// Node.js Edge Function for JWT Authentication
// Compatible with Vercel Edge Functions or AWS Lambda@Edge

import { verify } from 'jsonwebtoken';

interface EdgeRequest {
  headers: Headers;
  url: string;
  method: string;
}

interface EdgeResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authMiddleware(request: EdgeRequest): Promise<EdgeResponse> {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No authorization token provided' },
      }),
    };
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = verify(token, JWT_SECRET);

    // Token is valid, pass through to origin
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': (decoded as any).userId,
      },
      body: JSON.stringify({ success: true, user: decoded }),
    };
  } catch (error) {
    return {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      }),
    };
  }
}

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
