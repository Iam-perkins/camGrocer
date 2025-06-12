import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Get the session
  const session = await getServerSession(authOptions);
  
  // Clear the session
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear all auth-related cookies
  response.cookies.set({
    name: 'next-auth.session-token',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  response.cookies.set({
    name: 'authToken',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  response.cookies.set({
    name: 'currentUser',
    value: '',
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  // Clear the session in the response headers
  response.headers.set('Clear-Site-Data', '"cookies", "storage"');

  return response;
}
