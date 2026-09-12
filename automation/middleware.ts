import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASSWORD;

  if (!user || !pass) {
    return new NextResponse('Dashboard credentials are not configured.', { status: 503 });
  }

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const separator = decoded.indexOf(':');
      const suppliedUser = decoded.slice(0, separator);
      const suppliedPass = decoded.slice(separator + 1);
      if (suppliedUser === user && suppliedPass === pass) {
        return NextResponse.next();
      }
    } catch {}
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="ANMs Fulfillment"' },
  });
}

export const config = {
  matcher: ['/((?!api/webhooks).*)'],
};
