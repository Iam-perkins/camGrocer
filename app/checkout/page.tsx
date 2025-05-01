"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, CreditCard, MapPin, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getProductById } from "@/lib/product-data"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("mobile-money")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const cartItems = [
    {
      id: 1,
      name: "Fresh Plantains",
      price: 1500,
      quantity: 2,
      image: getProductById(1).image,
      store: "Marché Central 1",
    },
    {
      id: 3,
      name: "Cassava",
      price: 1200,
      quantity: 1,
      image: getProductById(3).image,
      store: "Marché Central 1",
    },
    {
      id: 7,
      name: "Peanuts",
      price: 1800,
      quantity: 3,
      image: getProductById(7).image,
      store: "Marché Central 1",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 1000
  const total = subtotal + deliveryFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the payment and create the order here
    setShowSuccessDialog(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CamGrocer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+237 6XX XXX XXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Street address, apartment, etc." required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Yaoundé" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input id="region" defaultValue="Centre" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-instructions">Delivery Instructions (Optional)</Label>
                    <Textarea id="delivery-instructions" placeholder="Special instructions for delivery" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="mobile-money" id="mobile-money" />
                      <Label htmlFor="mobile-money" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mobile Money</div>
                        <div className="text-sm text-muted-foreground">Pay with MTN Mobile Money or Orange Money</div>
                      </Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          MTN
                        </div>
                        <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          OM
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "mobile-money" && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobile-number">Mobile Money Number</Label>
                        <Input id="mobile-number" type="tel" placeholder="+237 6XX XXX XXX" required />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Place Order
              </Button>
            </form>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{item.price * item.quantity} FCFA</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total} FCFA</span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription>
              Your order has been placed successfully. We have sent a confirmation email to you and the store.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="font-medium">Order Details</div>
              <div className="text-sm text-muted-foreground mt-2">
                <div>Order ID: #ORD-{Math.floor(Math.random() * 10000)}</div>
                <div>Total Amount: {total} FCFA</div>
                <div>Estimated Delivery: Within 2-3 hours</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
