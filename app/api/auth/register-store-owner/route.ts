import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { PendingStoreOwner } from '@/models/pending-store-owner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, ...rest } = body;

    // Basic validation
    if (!password || !rest.email || !rest.storeName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Check if email already exists in either collection
    const [existingPending, existingApproved] = await Promise.all([
      db.collection('pending_store_owners').findOne({ email: rest.email }),
      db.collection('store_owners').findOne({ email: rest.email })
    ]);

    if (existingPending || existingApproved) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Store password in plain text for now - will be hashed after approval
    // Create pending store owner document
    const pendingStoreOwner: PendingStoreOwner = {
      ...rest,
      password: password, // Store plain text password temporarily
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to pending_store_owners collection
    const result = await db.collection('pending_store_owners').insertOne(pendingStoreOwner);

    // Remove password from response
    const { password: _, ...responseData } = pendingStoreOwner;

    return NextResponse.json({
      success: true,
      message: 'Store owner registration submitted for approval',
      data: {
        ...responseData,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error('Store owner registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
