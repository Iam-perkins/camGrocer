import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...userData } = body;

    const client = await clientPromise;
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Temporarily store password in plain text for debugging
    console.log('Storing password in plain text (temporary for debugging):', userData.password);
    const plainPassword = userData.password;

    let user;
    let result;

    if (type === 'store') {
      // For store owners, create a store document
      const storeData = {
        storeName: userData.storeName,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        storeType: userData.storeType,
        description: userData.description,
        isVerified: false,
        verificationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Inserting store into database:', storeData);
      const storeResult = await db.collection('stores').insertOne(storeData);
      console.log('Store insert result:', storeResult);

      // Create a minimal user document with reference to the store
      user = {
        email: userData.email,
        password: plainPassword, // Temporarily store plain password
        type: 'store',
        storeId: storeResult.insertedId,
        createdAt: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.storeName)}&background=27AE60&color=fff`
      };
    } else {
      // Regular customer
      user = {
        ...userData,
        password: plainPassword, // Temporarily store plain password
        type: 'customer',
        createdAt: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`
      };
    }

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;

    // Insert user into database
    console.log('Inserting user into database:', { ...user, password: '[HIDDEN]' });
    result = await db.collection('users').insertOne(user);
    console.log('User insert result:', result);

    // Create JWT token (you'll need to implement this part based on your auth setup)
    const token = 'your-jwt-token-here'; // Replace with actual JWT generation

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
