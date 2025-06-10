import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If it's an API route or auth route, let it pass through
  if (path.startsWith('/api/') || path.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Get the token and user from cookies
  const token = request.cookies.get('authToken')?.value;
  const userCookie = request.cookies.get('currentUser')?.value;
  
  // Parse user data if it exists
  let userData = null;
  try {
    userData = userCookie ? JSON.parse(userCookie) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
  }

  // Handle auth routes
  if (path.startsWith('/auth/')) {
    // If user is already logged in, redirect them away from auth pages
    if (token && userData) {
      // For store owners, redirect to dashboard if approved, otherwise to verification
      if (userData.type === 'store' || userData.role === 'store') {
        const isApproved = userData.verificationStatus === 'approved' || userData.status === 'approved';
        const redirectPath = isApproved ? '/admin/dashboard' : '/admin/verifications';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      // For other user types, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check if the route is protected (admin routes)
  const isAdminRoute = path.startsWith('/admin');

  // Handle unauthenticated access to admin routes
  if (isAdminRoute && (!token || !userData)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated users trying to access admin routes
  if (isAdminRoute && userData) {
    const isStoreOwner = userData.type === 'store' || userData.role === 'store';
    const isApproved = userData.verificationStatus === 'approved' || userData.status === 'approved';
    
    // Only allow approved store owners to access admin routes
    if (!isStoreOwner) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (!isApproved) {
      return NextResponse.redirect(new URL('/auth/verification-pending', request.url));
    }
    
    // If trying to access admin root, redirect to dashboard
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
};
