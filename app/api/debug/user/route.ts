import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check in both collections
    const [user, storeOwner] = await Promise.all([
      db.collection('users').findOne({ email }),
      db.collection('store_owners').findOne({ email })
    ]);

    const userData = user || storeOwner;
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password for security
    const { password, ...safeUserData } = userData;
    
    return NextResponse.json({
      user: safeUserData,
      hasPassword: !!password,
      passwordHash: password ? `${password.substring(0, 10)}... (${password.length} chars)` : 'No password',
      collectionsChecked: ['users', 'store_owners']
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
