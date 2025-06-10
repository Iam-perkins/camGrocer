// app/api/auth/login/route.ts
// WARNING: This code is for debugging purposes only and uses plain text password comparison.


import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
// import bcrypt from 'bcryptjs'; // <--- REMOVED FOR PLAIN TEXT COMPARISON
import { ObjectId } from 'mongodb';

// Define a type for the user document, which could come from any of your collections
type UserDocument = {
  _id: ObjectId;
  email: string;
  password?: string; // Optional because some users might not have a password
  name?: string;
  storeName?: string;
  ownerName?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  type?: 'customer' | 'store';
  // Add any other fields you need to pass to the session
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('--- Login Attempt (Plain Text Password Mode) ---'); // Added specific log
    console.log(`1. Received request for email: ${email}`);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const dbName = 'grocerdb'; // <-- IMPORTANT: REPLACE WITH YOUR ACTUAL DATABASE NAME
    const db = client.db(dbName);

    console.log(`2. Connected to DB: ${dbName}`);

    // Check across all relevant collections for the user
    const [user, storeOwner, pendingStoreOwner] = await Promise.all([
      db.collection('users').findOne<UserDocument>({ email }),
      db.collection('store_owners').findOne<UserDocument>({ email }),
      db.collection('pending_store_owners').findOne<UserDocument>({ email })
    ]);

    const authUser: UserDocument | null = user || storeOwner || pendingStoreOwner;

    console.log(`3. After DB lookup. authUser: ${authUser ? authUser.email : 'NOT FOUND'}`);
    console.log(`   Is storeOwner object found: ${!!storeOwner}`);
    console.log(`   Is pendingStoreOwner object found: ${!!pendingStoreOwner}`);

    // Handle cases where the account is pending approval
    if (pendingStoreOwner && pendingStoreOwner.verificationStatus !== 'approved') {
      console.log(`4. Account for ${email} is pending approval.`);
      return NextResponse.json(
        { error: 'Your account is pending approval. Please wait for admin approval.' },
        { status: 403 }
      );
    }

    // If no user found in any collection after checks
    if (!authUser) {
      console.log('5. No authUser found, returning 401.');
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    console.log('6. AuthUser found, proceeding to password check.');
    console.log(`   AuthUser password (from DB): "${authUser.password || 'NONE'}"`); // Log stored password (for debugging only!)
    console.log(`   Incoming password (from Postman): "${password}"`); // Log incoming password (for debugging only!)

    // --- PLAIN TEXT PASSWORD COMPARISON (TEMPORARY & INSECURE) ---
    const isPasswordValid = (password === authUser.password); // Direct comparison
    console.log(`7. Password comparison result (isPasswordValid): ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('8. Password comparison failed, returning 401.');
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    console.log('9. Password successfully validated.');

    // --- Prepare User Data for NextAuth Session ---
    const finalUserId = authUser._id.toString();
    const isStoreOwnerRole = !!storeOwner || (!!pendingStoreOwner && pendingStoreOwner.verificationStatus === 'approved');

    const finalStoreId = isStoreOwnerRole ? authUser._id.toString() : undefined;
    const finalStoreName = isStoreOwnerRole
      ? authUser.storeName || authUser.name || authUser.email
      : undefined;

    const userType = isStoreOwnerRole ? 'store' : 'customer';
    const verificationStatus = authUser.verificationStatus || 'approved';

    const userData: {
      id: string;
      email: string;
      name: string;
      type: string;
      verificationStatus: string;
      storeId?: string;
      storeName?: string;
      status: string;
      role: string;
    } = {
      id: finalUserId,
      email: authUser.email,
      name: authUser.name || authUser.ownerName || authUser.email,
      type: userType,
      verificationStatus: verificationStatus,
      storeId: finalStoreId,
      storeName: finalStoreName,
      status: verificationStatus === 'approved' ? 'approved' : 'pending',
      role: userType,
    };

    console.log('--- Successfully Authenticated ---');
    console.log('User data prepared for NextAuth session:', userData);

    const responseData = {
      success: true,
      message: 'Login successful',
      user: userData,
    };

    const response = NextResponse.json(responseData, { status: 200 });

    // --- Custom Cookie Handling (Optional / Consider Removal) ---
    response.cookies.set('authToken', 'dummy-token-from-custom-api', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('currentUser', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (error) {
    console.error('--- Login API Top-Level Error ---');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred during login.' },
      { status: 500 }
    );
  }
}