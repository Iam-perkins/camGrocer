// app/api/store-owners/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In your current data model (where the store_owners document IS the store),
    // the 'id' parameter from the URL (e.g., /api/store-owners/THIS_ID)
    // is expected to be the _id of the specific store_owner document.
    const storeId = params.id; // Renamed from 'ownerId' to 'storeId' for clarity

    if (!ObjectId.isValid(storeId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const dbName = 'grocerdb'; // <-- IMPORTANT: Replace with your actual database name
    const db = client.db(dbName);

    // Find the store_owners document using the provided 'storeId' (which is its _id)
    const storeData = await db
      .collection('store_owners')
      .findOne({ _id: new ObjectId(storeId) });

    if (!storeData) {
      return NextResponse.json(
        { error: 'Store (owner) data not found for the provided ID.' },
        { status: 404 }
      );
    }

    // --- Prepare Data for Frontend ---
    // Ensure all ObjectIds are converted to strings before sending to frontend.
    // This is crucial for JSON serialization.
    const serializedStoreData = {
      ...storeData,
      _id: storeData._id.toString(), // Convert owner's _id to string
      // Convert other ObjectId fields if they exist in your store_owners document
      // Example: someOtherObjectIdField: storeData.someOtherObjectIdField?.toString(),
      // Convert Date objects to ISO strings if you have them and want them as strings
      createdAt: storeData.createdAt ? storeData.createdAt.toISOString() : undefined,
      updatedAt: storeData.updatedAt ? storeData.updatedAt.toISOString() : undefined,
    };

    // Return the entire store_owner document, as it contains all your store's info.
    console.log(`Successfully fetched store data for ID: ${storeId}`);
    return NextResponse.json(serializedStoreData);

  } catch (error) {
    console.error(`Error fetching store data for ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch store data due to a server error.' },
      { status: 500 }
    );
  }
}