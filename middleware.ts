import { NextResponse } from 'next/server';

/**
 * Middleware to enforce basic authentication on the Preview (staging) environment.
 * It checks the Authorization header for a Basic credential and compares
 * it against BASIC_AUTH_USER/PASS environment variables.  In production
 * and development environments, the request passes through unmodified.
 */
export const config = {
  // Apply this middleware to all routes
  matcher: ['/(.*)'],
};

export default function middleware(req: any) {
  // Only enforce auth in preview/staging environment
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.next();
  }
  const authHeader = req.headers.get('authorization') || '';
  const [scheme, encoded] = authHeader.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
    if (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASS
    ) {
      return NextResponse.next();
    }
  }
  // Otherwise request credentials
  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Staging"' },
  });
}