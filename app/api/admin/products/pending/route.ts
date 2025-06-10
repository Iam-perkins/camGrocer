import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/product';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/admin/products/pending - Get all products pending approval
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectToDatabase();
    
    // Get pending products with pagination
    const [products, total] = await Promise.all([
      Product.find({ approvalStatus: 'pending' })
        .populate('store', 'storeName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ approvalStatus: 'pending' })
    ]);
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}
