import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import { UserType } from '@/models/user';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      wishlist: user.wishlist,
      orderHistory: user.orderHistory,
      searchHistory: user.searchHistory,
      priceComparison: user.priceComparison,
    });
  } catch (error) {
    console.error('Error fetching user features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    const email = request.nextUrl.searchParams.get('email');

    switch (action) {
      case 'wishlist':
        return await handleWishlist(email, data);
      case 'search':
        return await handleSearch(email, data);
      case 'compare-prices':
        return await handlePriceComparison(email, data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing user feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleWishlist(email: string, data: any) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (data.productId) {
      // Add to wishlist
      const existing = user.wishlist.find(w => w.productId === data.productId);
      if (!existing) {
        user.wishlist.push({
          ...data,
          addedAt: new Date(),
          notes: data.notes || '',
        });
      }
    } else if (data.productIdToDelete) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(w => w.productId !== data.productIdToDelete);
    } else if (data.productIdToUpdate && data.notes) {
      // Update notes
      const item = user.wishlist.find(w => w.productId === data.productIdToUpdate);
      if (item) {
        item.notes = data.notes;
      }
    }

    await user.save();
    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error handling wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleSearch(email: string, data: any) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.searchHistory.unshift({
      query: data.query,
      timestamp: new Date(),
      resultsCount: data.resultsCount,
    });

    // Keep only the last 50 searches
    user.searchHistory = user.searchHistory.slice(0, 50);

    await user.save();
    return NextResponse.json({ searchHistory: user.searchHistory });
  } catch (error) {
    console.error('Error handling search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePriceComparison(email: string, data: any) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = user.priceComparison.find(p => p.productId === data.productId);
    if (existing) {
      existing.prices = data.prices;
      existing.lastUpdated = new Date();
    } else {
      user.priceComparison.push({
        productId: data.productId,
        name: data.name,
        prices: data.prices,
        lastUpdated: new Date(),
      });
    }

    await user.save();
    return NextResponse.json({ priceComparison: user.priceComparison });
  } catch (error) {
    console.error('Error handling price comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
