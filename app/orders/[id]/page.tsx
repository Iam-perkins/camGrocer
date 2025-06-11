'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ShoppingBag } from 'lucide-react'

interface OrderItem {
  productId: string;
  name: string;
  price: number; // Ensure price is a number for calculations
  quantity: number;
  image?: string;
  storeId: string;
  storeName: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
  deliveryInstructions?: string;
}

type OrderPageParams = {
  id: string
}

export default function OrderDetailsPage() {
  const params = useParams<OrderPageParams>()
  const id = params.id
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || 'The order you are looking for does not exist.'}</p>
        <Button onClick={() => router.push('/orders')}>View All Orders</Button>
      </div>
    )
  }

  const orderDate = new Date(order.createdAt)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(orderDate.getDate() + 1) // Add 1 day for delivery

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
        <p className="text-muted-foreground">
          Placed on {format(orderDate, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.storeId}`} className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Store: {item.storeName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      FCFA {Number(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.country} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {order.customerPhone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>FCFA {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>FCFA {order.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>FCFA {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="capitalize">{order.orderStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="capitalize">
                    {order.paymentStatus === 'pending' ? 'Pending' : 'Paid'} ({order.paymentMethod})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p>{format(estimatedDelivery, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            onClick={() => router.push('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
