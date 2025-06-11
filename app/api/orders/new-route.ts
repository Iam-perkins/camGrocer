import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";

// POST - Create a new order
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const orderData = await request.json();
    
    // Basic validation
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = orderData.items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    );
    
    const shippingFee = orderData.shippingFee || 0;
    const total = subtotal + shippingFee;

    // Create order document
    const order = new Order({
      ...orderData,
      userId: session.user.id,
      customerName: session.user.name || '',
      customerEmail: session.user.email,
      customerPhone: orderData.phone || '',
      subtotal,
      shippingFee,
      total,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      storeIds: [...new Set(orderData.items.map((item: any) => item.storeId))],
    });

    // Save to database
    const savedOrder = await order.save();

    return NextResponse.json(
      { 
        success: true, 
        orderId: savedOrder._id,
        orderNumber: savedOrder.orderNumber
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Get orders with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { userId, storeId, status } = Object.fromEntries(searchParams.entries());
    const query: any = {};

    // Regular users can only see their own orders
    if (session.user.role === 'customer') {
      query.userId = session.user.id;
    } 
    // Store owners can see orders for their store
    else if (session.user.role === 'store_owner' && session.user.storeId) {
      query.storeIds = session.user.storeId;
    }
    // Admin can see all orders or filter by user/store
    else if (userId) {
      query.userId = userId;
    } else if (storeId) {
      query.storeIds = storeId;
    }

    // Filter by status if provided
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
