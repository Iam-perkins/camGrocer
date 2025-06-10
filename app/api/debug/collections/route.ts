import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    // Get count of documents in each collection
    const collectionsWithCounts = await Promise.all(
      collections.map(async (collection) => {
        const count = await db.collection(collection.name).countDocuments();
        return {
          name: collection.name,
          count,
        };
      })
    );
    
    // Get sample documents from each collection
    const collectionsWithSamples = await Promise.all(
      collectionsWithCounts.map(async (collection) => {
        const sample = await db.collection(collection.name).findOne({});
        return {
          ...collection,
          sample: sample || null,
        };
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      collections: collectionsWithSamples 
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch collections',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
