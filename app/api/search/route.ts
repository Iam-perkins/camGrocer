import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const organic = searchParams.get('organic');
    const onSale = searchParams.get('onSale');

    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] });
    }

    // Create search query
    const searchQuery = {
      name: { $regex: query, $options: 'i' },
      ...(category && { category }),
      ...(minPrice && { price: { $gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { $lte: parseFloat(maxPrice) } }),
      ...(organic === 'true' && { organic: true }),
      ...(onSale === 'true' && { onSale: true }),
      available: true,
    };

    const results = await Product.find(searchQuery)
      .select('name description price category subcategory images stock rating reviews store location tags weight weightUnit available organic onSale salePrice discountPercentage')
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
