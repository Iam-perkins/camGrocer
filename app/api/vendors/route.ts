import { NextResponse } from 'next/server';
import { ObjectId, WithId, Document } from 'mongodb';
import clientPromise from '@/lib/mongodb';

interface VendorDocument extends WithId<Document> {
  _id: ObjectId;
  email: string;
  name?: string;
  phone?: string;
  storeName?: string;
  storeType?: string;
  businessAddress?: string;
  city?: string;
  region?: string;
  status?: 'active' | 'suspended' | 'banned';
  rating?: number;
  productsCount?: number;
  followersCount?: number;
  isVerified?: boolean;
  image?: string;
  joinedAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db();
    
    console.log('Querying store_owners collection...');
    const collection = db.collection<VendorDocument>('store_owners');
    console.log('Collection stats:', await collection.stats().catch(e => ({
      error: e.message,
      collection: 'store_owners',
      db: db.databaseName
    })));
    
    // Get all active store owners
    const query = { status: 'active' };
    const options = { 
      projection: { 
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        storeName: 1,
        storeType: 1,
        businessAddress: 1,
        city: 1,
        region: 1,
        status: 1,
        rating: 1,
        productsCount: 1,
        followersCount: 1,
        isVerified: 1,
        image: 1,
        joinedAt: 1,
        updatedAt: 1
      },
      sort: { rating: -1, followersCount: -1, storeName: 1 },
      limit: 8
    };
    
    console.log('Executing find with query:', JSON.stringify(query), 'and options:', JSON.stringify(options));
    
    const vendors = await collection
      .find(query, options)
      .toArray()
      .catch((e) => {
        console.error('Error fetching vendors:', e);
        return [] as VendorDocument[];
      });
      
    console.log(`Found ${vendors.length} active vendors`);

    // Transform data to a consistent format
    const formattedVendors = vendors.map((vendor) => ({
      id: vendor._id?.toString(),
      name: vendor.storeName || vendor.name || 'Vendor',
      email: vendor.email,
      phone: vendor.phone || 'N/A',
      rating: vendor.rating || 0,
      followers: vendor.followersCount || 0,
      location: [
        vendor.businessAddress,
        vendor.city,
        vendor.region
      ].filter(Boolean).join(', ') || 'Location not specified',
      image: vendor.image || null,
      isVerified: vendor.isVerified || false,
      productsCount: vendor.productsCount || 0,
      joinedAt: vendor.joinedAt?.toISOString() || new Date().toISOString(),
      storeType: vendor.storeType || 'General Store',
      status: vendor.status || 'active'
    }));
    
    console.log('Formatted vendors response:', JSON.stringify(formattedVendors, null, 2));
    return NextResponse.json(formattedVendors);
  } catch (error) {
    console.error('Error in GET /api/vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}
