import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting for demonstration (Phase 8 Production Hardening)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per minute per IP

export function middleware(request: NextRequest) {
  // 1. Rate Limiting (Simulated WAF)
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const record = rateLimit.get(ip);
    
    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else {
      record.count += 1;
      if (record.count > MAX_REQUESTS) {
        console.warn(`[WAF] Rate limit exceeded for IP: ${ip}`);
        return new NextResponse(
          JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 2. Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");
  
  return response;
}

export const config = {
  matcher: '/:path*',
};
