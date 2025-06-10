import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { client } from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from database to verify admin status
    const db = client.db();
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get counts for all collections in parallel
    const [
      usersCount,
      storeOwnersCount,
      productsCount,
      ordersCount,
      pendingStoreOwnersCount
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('store_owners').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('orders').countDocuments(),
      db.collection('pending_store_owners').countDocuments({ verificationStatus: 'pending' })
    ]);

    // Get recent activities (last 5 of each)
    const [
      recentUsers,
      recentStoreOwners,
      recentProducts,
      recentOrders
    ] = await Promise.all([
      db.collection('users')
        .find({}, { projection: { _id: 1, name: 1, email: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection('store_owners')
        .find({}, { projection: { _id: 1, name: 1, email: 1, storeName: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection('products')
        .find({}, { projection: { _id: 1, name: 1, price: 1, category: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection('orders')
        .find({}, { projection: { _id: 1, total: 1, status: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
    ]);

    return NextResponse.json({
      counts: {
        users: usersCount,
        storeOwners: storeOwnersCount,
        products: productsCount,
        orders: ordersCount,
        pendingApprovals: pendingStoreOwnersCount
      },
      recent: {
        users: recentUsers,
        storeOwners: recentStoreOwners,
        products: recentProducts,
        orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
