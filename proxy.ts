import { NextRequest, NextResponse } from 'next/server';
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const dev = process.env.NODE_ENV === 'development';
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' https://checkout.stripe.com",
    `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  ].join('; ');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', policy);
  if (
    request.nextUrl.searchParams.has('purchase') ||
    request.nextUrl.pathname.startsWith('/checkout')
  ) {
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  if (process.env.PUBLIC_INDEXING !== 'true' || process.env.LIVE_MODE !== 'true')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)'],
};
