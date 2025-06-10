import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// GET: Get all pending store owners
export async function GET() {
  console.log('GET /api/admin/store-owners called');
  try {
    const client = await clientPromise;
    const db = client.db();
    
    console.log('Connected to MongoDB, fetching pending store owners...');
    
    // First, check if the collection exists
    const collections = await db.listCollections({ name: 'pending_store_owners' }).toArray();
    if (collections.length === 0) {
      console.log('Collection "pending_store_owners" does not exist');
      return NextResponse.json([], { status: 200 });
    }
    
    // Get all store owner requests, sorted by status (pending first) and then by creation date
    const pendingOwners = await db.collection('pending_store_owners')
      .find({})
      .sort({ verificationStatus: 1, createdAt: -1 })
      .toArray();
      
    console.log(`Found ${pendingOwners.length} pending store owners`);
    
    // Convert ObjectId to string for each document
    const serializedOwners = pendingOwners.map(owner => ({
      ...owner,
      _id: owner._id.toString(),
      createdAt: owner.createdAt ? owner.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: owner.updatedAt ? owner.updatedAt.toISOString() : new Date().toISOString()
    }));

    return NextResponse.json(serializedOwners);
  } catch (error) {
    console.error('Error fetching pending store owners:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch pending store owners',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email';

// POST: Approve/Reject store owner application
export async function POST(request: NextRequest) {
  try {
    const { action, storeOwnerId, reason } = await request.json();
    
    if (!['approve', 'reject'].includes(action) || !storeOwnerId) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const objectId = new ObjectId(storeOwnerId);

    // Find the pending store owner
    const pendingOwner = await db.collection('pending_store_owners').findOne({
      _id: objectId
    });

    if (!pendingOwner) {
      return NextResponse.json(
        { error: 'Store owner not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Update status to approved in pending_store_owners
      await db.collection('pending_store_owners').updateOne(
        { _id: objectId },
        {
          $set: {
            verificationStatus: 'approved',
            updatedAt: new Date()
          }
        }
      );

      // Also add to store_owners collection
      const { _id, password, ...storeOwnerData } = pendingOwner;
      await db.collection('store_owners').insertOne({
        ...storeOwnerData,
        password: password,
        verificationStatus: 'approved',
        updatedAt: new Date()
      });

      // Send approval email
      try {
        await sendApprovalEmail(storeOwnerData.email, storeOwnerData.storeName);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the request if email sending fails
      }

      return NextResponse.json({
        success: true,
        message: 'Store owner approved successfully. Notification email sent.',
        data: { storeOwnerId: _id }
      });
    } else {
      // Reject the application
      await db.collection('pending_store_owners').updateOne(
        { _id: objectId },
        {
          $set: {
            verificationStatus: 'rejected',
            rejectionReason: reason || 'Application rejected',
            updatedAt: new Date()
          }
        }
      );

      // Send rejection email
      try {
        await sendRejectionEmail(pendingOwner.email, pendingOwner.storeName, reason || 'Application rejected');
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the request if email sending fails
      }

      return NextResponse.json({
        success: true,
        message: 'Store owner application rejected. Notification email sent.',
        data: { storeOwnerId }
      });
    }
  } catch (error) {
    console.error('Error processing store owner approval:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
