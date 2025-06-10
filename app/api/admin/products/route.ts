import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/products - Get all products for the store
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // In a real app, you would filter by the store ID from the authenticated user's session
    const products = await db.collection('products')
      .find({ storeId: new ObjectId('YOUR_STORE_ID') })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, price, stock, category, image } = data;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category,
      image: image || '',
      storeId: new ObjectId('YOUR_STORE_ID'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(newProduct);

    if (!result.acknowledged) {
      throw new Error('Failed to create product');
    }

    const createdProduct = await db.collection('products').findOne({
      _id: result.insertedId,
    });

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
