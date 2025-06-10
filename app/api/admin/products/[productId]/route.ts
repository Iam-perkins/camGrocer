import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/product';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/admin/products/[productId] - Get product details for admin
// PATCH /api/admin/products/[productId] - Approve/Reject/Update product
// PUT /api/admin/products/[productId] - Update product
// DELETE /api/admin/products/[productId] - Delete product

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const product = await Product.findById(params.productId)
      .populate('store', 'storeName owner')
      .populate('approvedBy', 'name email');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, reason, ...updateData } = await request.json();
    
    await connectToDatabase();
    
    let updatePayload: any = {};
    
    // Handle approval/rejection
    if (action && ['approve', 'reject'].includes(action)) {
      if (action === 'reject' && !reason?.trim()) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      
      updatePayload = {
        approvalStatus: action === 'approve' ? 'approved' : 'rejected',
        approvedAt: new Date(),
        approvedBy: session.user.id,
        ...(action === 'reject' && { rejectionReason: reason })
      };
    } else {
      // Handle regular updates
      updatePayload = { ...updateData, updatedAt: new Date() };
    }
    
    const product = await Product.findByIdAndUpdate(
      params.productId,
      updatePayload,
      { new: true, runValidators: true }
    )
    .populate('store', 'storeName owner')
    .populate('approvedBy', 'name email');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // TODO: Send email notification to store owner if status changed
    // if (action && ['approve', 'reject'].includes(action)) {
    //   await sendProductStatusEmail(product);
    // }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[productId] - Update product
export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    
    if (!ObjectId.isValid(params.productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const product = await Product.findByIdAndUpdate(
      params.productId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('store', 'storeName owner');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[productId] - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(params.productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const product = await Product.findByIdAndDelete(params.productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
