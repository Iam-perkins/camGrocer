import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this order
    if (session.user.role === 'customer' && order.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to view this order" },
        { status: 403 }
      );
    }

    // For store owners, check if the order is for their store
    if (session.user.role === 'store' && !order.storeIds.includes(session.user.storeId)) {
      return NextResponse.json(
        { error: "Not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
