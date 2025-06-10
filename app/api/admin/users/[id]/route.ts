import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId, WithId, Document } from 'mongodb';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import type { Session } from 'next-auth';

interface UserDocument extends WithId<Document> {
  _id: ObjectId;
  email: string;
  name?: string;
  phone?: string;
  role?: 'admin' | 'store_owner' | 'customer';
  isAdmin?: boolean; // Legacy field, prefer 'role' for new code
  status?: 'active' | 'suspended' | 'banned';
  storeName?: string;
  storeId?: ObjectId | string;
  updatedAt?: Date;
  createdAt?: Date;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  emailVerified?: boolean;
  verificationToken?: string;
  [key: string]: any;
}

type UserResponse = Omit<UserDocument, '_id' | 'password' | 'resetToken' | 'resetTokenExpiry' | 'verificationToken' | 'emailVerified'> & {
  id: string;
  role: 'admin' | 'store_owner' | 'customer';
  storeName?: string;
};

// Remove the duplicate User interface since we're using UserDocument now

// Common function to check admin authorization
async function checkAdminAuthorization(session: Session | null) {
  if (!session?.user?.email) {
    console.log('Unauthorized: No session or user');
    return { 
      error: 'Unauthorized: Please sign in',
      status: 401 
    } as const;
  }
  
  const user = session.user;
  if (user.role !== 'admin') {
    console.log('Forbidden: User is not an admin');
    return { 
      error: 'Forbidden: Admin access required',
      status: 403 
    } as const;
  }
  
  return { adminEmail: user.email };
}

async function handlePatch(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`PATCH /api/admin/users/${params.id} called`);
  
  try {
    const session = await getServerSession(authOptions) as Session | null;
    console.log('Session:', session ? 'Authenticated' : 'No session');
    
    // Check admin authorization
    const authCheck = await checkAdminAuthorization(session);
    if ('error' in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    // Get database connection
    let client;
    try {
      client = await clientPromise;
      console.log('Connected to MongoDB');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const db = client.db();
    
    // Verify admin status in the database
    const adminUser = await db.collection<UserDocument>('users').findOne({ 
      email: authCheck.adminEmail,
      role: 'admin'
    });
    
    if (!adminUser) {
      console.log('Admin user not found in database or insufficient permissions');
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const { id } = params;

    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      const errorMsg = `Invalid status value: ${status}. Must be one of: active, suspended, banned`;
      console.error(errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }
    
    console.log(`Updating user ${id} status to ${status}`);

    try {
      // Try to update in users collection first
      const userResult = await db.collection<UserDocument>('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (userResult && userResult.value) {
        const user = userResult.value;
        console.log(`Updated user ${user._id} status to ${status}`);
        
        // Transform user to match response format
        const updatedUser: UserResponse = {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split('@')[0],
          phone: user.phone || 'N/A',
          role: user.role || (user.isAdmin ? 'admin' : 'customer'),
          status: user.status || 'active',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return NextResponse.json(updatedUser);
      }

      // If not found in users, try store_owners collection
      const storeOwnerResult = await db.collection<UserDocument>('store_owners').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (storeOwnerResult && storeOwnerResult.value) {
        const owner = storeOwnerResult.value;
        console.log(`Updated store owner ${owner._id} status to ${status}`);
        
        // Transform store owner to match response format
        const updatedUser: UserResponse = {
          id: owner._id.toString(),
          email: owner.email,
          name: owner.name || owner.email.split('@')[0],
          phone: owner.phone || 'N/A',
          role: 'store_owner',
          status: owner.status || 'active',
          storeName: owner.storeName,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
        };

        return NextResponse.json(updatedUser);
      }
    } catch (dbError) {
      console.error('Database error during update:', dbError);
      return NextResponse.json(
        { error: 'Database error during update' },
        { status: 500 }
      );
    }

    console.error(`User with ID ${id} not found in any collection`);
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[id]:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Handle ObjectId cast errors
      if (error.name === 'BSONError' || error.message.includes('BSONTypeError')) {
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      
      // Handle MongoDB connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        console.error('Failed to connect to database:', error);
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        );
      }
      
      // Handle validation errors
      if (error.message.includes('validation failed')) {
        return NextResponse.json(
          { error: 'Validation error', details: error.message },
          { status: 400 }
        );
      }
    }
    
    // Default error response
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorResponse: { error: string; details?: any } = { error: errorMessage };
    
    // Only include error details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error;
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function handleDelete(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`DELETE /api/admin/users/${params.id} called`);
  
  try {
    const session = await getServerSession(authOptions) as Session | null;
    console.log('Session:', session ? 'Authenticated' : 'No session');
    
    // Check admin authorization
    const authCheck = await checkAdminAuthorization(session);
    if ('error' in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    // Get database connection
    let client;
    try {
      client = await clientPromise;
      console.log('Connected to MongoDB');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const db = client.db();
    const { id } = params;
    
    // Verify admin status in the database
    const adminUser = await db.collection<UserDocument>('users').findOne({ 
      email: authCheck.adminEmail,
      role: 'admin'
    });
    
    if (!adminUser) {
      console.log('Admin user not found in database or insufficient permissions');
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    try {
      // Try to delete from users collection first
      const userDeleteResult = await db.collection('users').deleteOne({ 
        _id: new ObjectId(id) 
      });

      if (userDeleteResult.deletedCount > 0) {
        console.log(`Deleted user with ID: ${id}`);
        return NextResponse.json(
          { success: true, message: 'User deleted successfully' },
          { status: 200 }
        );
      }

      // If not found in users, try store_owners collection
      const storeOwnerDeleteResult = await db.collection('store_owners').deleteOne({ 
        _id: new ObjectId(id) 
      });

      if (storeOwnerDeleteResult.deletedCount > 0) {
        console.log(`Deleted store owner with ID: ${id}`);
        return NextResponse.json(
          { success: true, message: 'Store owner deleted successfully' },
          { status: 200 }
        );
      }

      // If we get here, the user wasn't found in either collection
      console.error(`User with ID ${id} not found in any collection`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    } catch (dbError) {
      console.error('Database error during deletion:', dbError);
      return NextResponse.json(
        { error: 'Database error during deletion' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/admin/users/[id]:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Handle ObjectId cast errors
      if (error.name === 'BSONError' || error.message.includes('BSONTypeError')) {
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      
      // Handle MongoDB connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        console.error('Failed to connect to database:', error);
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        );
      }
    }
    
    // Default error response
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const PATCH = handlePatch;
export const DELETE = handleDelete;
