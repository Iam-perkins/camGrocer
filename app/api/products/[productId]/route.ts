import { NextRequest, NextResponse } from 'next/server';
import { updateProduct } from '@/lib/db-operations';

export async function PATCH(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId;
    const body = await request.json();
    
    // Call the actual update function
    const result = await updateProduct(productId, body);
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch the updated product to return
    const response = await fetch(`${request.nextUrl.origin}/api/products?storeId=${body.storeId}`);
    const products = await response.json();
    const updatedProduct = products.find((p: any) => p._id === productId);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to fetch updated product' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
