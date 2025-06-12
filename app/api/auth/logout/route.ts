import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the redirect URL from the request or use the root path as default
    const { redirectTo = '/' } = await request.json();
    
    // Create a response with redirect
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Cookie options
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0)
    };

    // Clear all auth-related cookies
    response.cookies.set('authToken', '', cookieOptions);
    response.cookies.set('next-auth.session-token', '', cookieOptions);
    response.cookies.set('currentUser', '', cookieOptions);
    
    // Get all cookies from the request headers
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMap = cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        acc[name] = value;
      }
      return acc;
    }, {});
    
    // Clear any NextAuth-related cookies
    Object.keys(cookieMap).forEach(name => {
      if (name.startsWith('next-auth.') || name.startsWith('__Secure-next-auth.')) {
        response.cookies.set(name, '', cookieOptions);
      }
    });
    
    // Clear the session in the response headers
    response.headers.set('Clear-Site-Data', '"cookies", "storage"');
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

// Also support GET requests for backward compatibility
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Cookie options
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  };

  // Clear all auth-related cookies
  response.cookies.set('authToken', '', cookieOptions);
  response.cookies.set('next-auth.session-token', '', cookieOptions);
  response.cookies.set('currentUser', '', cookieOptions);
  
  // Clear the session in the response headers
  response.headers.set('Clear-Site-Data', '"cookies", "storage"');
  
  return response;
}
