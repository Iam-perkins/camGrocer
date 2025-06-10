import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/store - Get store information
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // In a real app, you would get the store ID from the authenticated user's session
    // For now, we'll use a placeholder store ID
    const store = await db.collection('stores').findOne({ 
      _id: new ObjectId('YOUR_STORE_ID') 
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store information' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/store - Update store information
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { name, description, contact, logo, banner } = data;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('stores').updateOne(
      { _id: new ObjectId('YOUR_STORE_ID') },
      {
        $set: {
          name,
          description,
          contact: {
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
          },
          logo: logo || '',
          banner: banner || '',
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update store');
    }

    // Get the updated store
    const updatedStore = await db.collection('stores').findOne({ 
      _id: new ObjectId('YOUR_STORE_ID') 
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json(
      { error: 'Failed to update store information' },
      { status: 500 }
    );
  }
}
