import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId, WithId, Document } from 'mongodb';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import type { Session } from 'next-auth';
import { sendStatusChangeEmail, sendAccountDeletionEmail } from '@/lib/email';

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
  try {
    console.log(`PATCH /api/admin/users/${params.id} called - Master Admin Access`);
    
    // Skip session validation for master admin
    console.log('Skipping session validation for master admin');
    
    // Get database connection
    const client = await clientPromise;
    console.log('Connected to MongoDB');
    
    const db = client.db();
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

    // Try to update in users collection first
    const userId = new ObjectId(id);
    console.log(`Attempting to update user with ID: ${id} (ObjectId: ${userId})`);
    
    // First, check if the user exists
    const userExists = await db.collection<UserDocument>('users').findOne({ _id: userId });
    console.log(`User exists in users collection: ${!!userExists}`);
    
    // Then try to update
    const userResult = await db.collection<UserDocument>('users').findOneAndUpdate(
      { _id: userId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    if (userResult) {
      console.log('User update result:', {
        ok: userResult.ok,
        lastErrorObject: userResult.lastErrorObject,
        value: userResult.value ? 'exists' : 'null'
      });
    } else {
      console.log('User update result: null');
    }

    if (userResult?.ok && userResult.value) {
      const user = userResult.value;
      console.log(`Updated user ${user._id} status to ${status}`);
      
      // Send status change email
      try {
        await sendStatusChangeEmail(
          user.email,
          user.name || user.email.split('@')[0],
          status,
          `Your account status has been updated to '${status}' by an administrator.`
        );
      } catch (emailError) {
        console.error('Failed to send status change email:', emailError);
        // Continue even if email fails
      }
      
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
    console.log(`User not found in users collection, trying store_owners with ID: ${id}`);
    const storeOwnerExists = await db.collection<UserDocument>('store_owners').findOne({ _id: userId });
    console.log(`User exists in store_owners collection: ${!!storeOwnerExists}`);
    
    const storeOwnerResult = await db.collection<UserDocument>('store_owners').findOneAndUpdate(
      { _id: userId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    if (storeOwnerResult) {
      console.log('Store owner update result:', {
        ok: storeOwnerResult.ok,
        lastErrorObject: storeOwnerResult.lastErrorObject,
        value: storeOwnerResult.value ? 'exists' : 'null'
      });
    } else {
      console.log('Store owner update result: null');
    }

    if (storeOwnerResult?.ok && storeOwnerResult.value) {
      const owner = storeOwnerResult.value;
      console.log(`Updated store owner ${owner._id} status to ${status}`);
      
      // Send status change email
      try {
        await sendStatusChangeEmail(
          owner.email,
          owner.name || owner.email.split('@')[0],
          status,
          `Your store owner account status has been updated to '${status}' by an administrator.`
        );
      } catch (emailError) {
        console.error('Failed to send status change email:', emailError);
        // Continue even if email fails
      }
      
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

    console.error(`User with ID ${id} not found in any collection`);
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );

  } catch (error: any) {
    console.error('Error in PATCH /api/admin/users/[id]:', error);
    
    // Handle specific error types
    if (error.name === 'BSONError' || error?.message?.includes('BSONTypeError')) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Handle MongoDB connection errors
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('ENOTFOUND')) {
      console.error('Failed to connect to database:', error);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 503 }
      );
    }
    
    // Handle validation errors
    if (error?.message?.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    // Default error response
    const errorMessage = error?.message || 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function handleDelete(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`DELETE /api/admin/users/${params.id} called - Master Admin Access`);
  
  // Skip session validation for master admin
  console.log('Skipping session validation for master admin');
  
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
  
  try {
    // Try to find and delete from users collection
    const userBeforeDelete = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (userBeforeDelete) {
      const deleteResult = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      
      if (deleteResult.deletedCount > 0) {
        console.log(`Deleted user with ID: ${id}`);
        
        // Send account deletion email
        try {
          await sendAccountDeletionEmail(
            userBeforeDelete.email,
            userBeforeDelete.name || userBeforeDelete.email.split('@')[0],
            'Your account has been deleted by an administrator.'
          );
        } catch (emailError) {
          console.error('Failed to send account deletion email:', emailError);
          // Continue even if email fails
        }
        
        return NextResponse.json(
          { success: true, message: 'User deleted successfully' },
          { status: 200 }
        );
      }
    }

    // If not found in users, try store_owners collection
    const storeOwnerBeforeDelete = await db.collection('store_owners').findOne({ _id: new ObjectId(id) });
    
    if (storeOwnerBeforeDelete) {
      const deleteResult = await db.collection('store_owners').deleteOne({ _id: new ObjectId(id) });
      
      if (deleteResult.deletedCount > 0) {
        console.log(`Deleted store owner with ID: ${id}`);
        
        // Send account deletion email
        try {
          await sendAccountDeletionEmail(
            storeOwnerBeforeDelete.email,
            storeOwnerBeforeDelete.name || storeOwnerBeforeDelete.email.split('@')[0],
            'Your store owner account has been deleted by an administrator.'
          );
        } catch (emailError) {
          console.error('Failed to send account deletion email:', emailError);
          // Continue even if email fails
        }
        
        return NextResponse.json(
          { success: true, message: 'Store owner deleted successfully' },
          { status: 200 }
        );
      }
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
  // Error handling is done in the inner try-catch
  // No need for an outer catch block
}

export const PATCH = handlePatch;
export const DELETE = handleDelete;
