import { NextResponse } from 'next/server';
import { ObjectId, WithId, Document } from 'mongodb';
import clientPromise from '@/lib/mongodb';

interface UserDocument extends WithId<Document> {
  _id: ObjectId;
  email: string;
  name?: string;
  phone?: string;
  isAdmin?: boolean;
  status?: 'active' | 'suspended' | 'banned';
  storeName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

// This route only handles GET /api/admin/users
// PATCH and DELETE are moved to /api/admin/users/[id]/route.ts

export async function GET() {
  try {
    // Get database connection
    const client = await clientPromise;
    const db = client.db();
    
    // Get all regular users
    const users = await db.collection<UserDocument>('users')
      .find({}, { 
        projection: { 
          password: 0,
          resetToken: 0,
          resetTokenExpiry: 0,
          emailVerified: 0,
          verificationToken: 0,
          // Add any other sensitive fields to exclude
        } 
      })
      .sort({ createdAt: -1 })
      .toArray()
      .catch(() => [] as UserDocument[]);

    // Get all store owners
    const storeOwners = await db.collection<UserDocument>('store_owners')
      .find({}, { 
        projection: { 
          password: 0,
          resetToken: 0,
          resetTokenExpiry: 0,
          emailVerified: 0,
          verificationToken: 0,
          // Add any other sensitive fields to exclude
        } 
      })
      .sort({ createdAt: -1 })
      .toArray()
      .catch(() => [] as UserDocument[]);

    // Transform data to a consistent format
    const formattedUsers = users.map((user) => ({
      id: user._id?.toString(),
      name: user.name || user.email.split('@')[0],
      email: user.email,
      phone: user.phone || 'N/A',
      role: user.isAdmin ? 'admin' : 'customer',
      status: user.status || 'active',
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    }));

    const formattedStoreOwners = storeOwners.map((owner) => ({
      id: owner._id?.toString(),
      name: owner.name || owner.email.split('@')[0],
      email: owner.email,
      phone: owner.phone || 'N/A',
      role: 'store_owner',
      storeName: owner.storeName || 'N/A',
      status: owner.status || 'active',
      createdAt: owner.createdAt?.toISOString(),
      updatedAt: owner.updatedAt?.toISOString()
    }));

    // Combine both user types
    const allUsers = [...formattedUsers, ...formattedStoreOwners];
    
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
// PATCH and DELETE handlers have been moved to /api/admin/users/[id]/route.ts
