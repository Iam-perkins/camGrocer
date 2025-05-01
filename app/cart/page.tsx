"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getProductById } from "@/lib/product-data"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)

  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)

      // Ensure all cart items have proper images
      const updatedCart = parsedCart.map((item) => {
        if (!item.image || item.image.includes("placeholder.svg")) {
          // Try to get the proper image from our product data
          const productData = getProductById(item.id)
          return {
            ...item,
            image: productData.image,
          }
        }
        return item
      })

      setCartItems(updatedCart)
      // Update localStorage with fixed images
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }
  }, [])

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )

    // Update localStorage
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))

    // If cart is empty, clear the current store
    if (updatedCart.length === 0) {
      setCurrentStore(null)
      localStorage.removeItem("currentStore")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = cartItems.length > 0 ? 1000 : 0
  const total = subtotal + deliveryFee

  // Calculate total savings from negotiated prices
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CamGrocer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader className="px-6">
                  <CardTitle className="flex items-center gap-2">
                    <Link href={`/store/${cartItems[0].storeId}`} className="hover:underline">
                      {currentStore}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex py-4 border-b last:border-0">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || `/placeholder.svg?height=80&width=80&text=${item.name}`}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                            {item.name}
                          </Link>
                          <span className="font-semibold">{item.price * item.quantity} FCFA</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="text-sm text-muted-foreground">{item.price} FCFA each</div>

                          {/* Show discount badge if negotiated price */}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <Badge variant="outline" className="ml-2 text-green-600">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee} FCFA</span>
                  </div>

                  {/* Show savings if any */}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Your Savings</span>
                      <span>-{totalSavings} FCFA</span>
                    </div>
                  )}

                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{total} FCFA</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/checkout")}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/browse">
              <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
