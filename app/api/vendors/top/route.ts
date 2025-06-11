import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch top 8 active store owners with their ratings
    const vendors = await db.collection('store_owners')
      .find({ 
        status: 'active',
        rating: { $exists: true }
      })
      .sort({ rating: -1, followers: -1 })
      .limit(8)
      .toArray();

    // Transform the data for the frontend
    const formattedVendors = vendors.map(vendor => ({
      id: vendor._id.toString(),
      name: vendor.storeName || 'Local Vendor',
      rating: vendor.rating || 4.5,
      followers: vendor.followers || 0,
      location: vendor.city || 'Buea',
      image: vendor.storeImage || null,
      isVerified: (vendor.followers || 0) >= 200,
      productsCount: vendor.productsCount || 0,
      joinedAt: vendor.createdAt ? new Date(vendor.createdAt).toISOString() : new Date().toISOString()
    }));

    return NextResponse.json(formattedVendors);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top vendors' },
      { status: 500 }
    );
  }
}
