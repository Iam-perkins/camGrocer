'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ShoppingBag } from 'lucide-react'

type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  storeId: string
  storeName: string
}

type Order = {
  _id: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  storeIds: string[]
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Orders</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Button onClick={() => router.push('/')}>Start Shopping</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => {
          const orderDate = new Date(order.createdAt)
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
          
          return (
            <Card key={order._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(orderDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.orderStatus}
                    </span>
                    <span className="font-medium">FCFA {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div 
                          key={`${item.productId}-${index}`}
                          className="w-12 h-12 rounded-md border-2 border-background bg-gray-100 overflow-hidden"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-md border-2 border-background bg-gray-100 flex items-center justify-center text-xs font-medium text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items[0].storeName}
                        {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/orders/${order._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
