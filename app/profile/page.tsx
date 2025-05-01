"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, CreditCard, Heart, LogOut, Package, Settings, ShoppingBag, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProductById } from "@/lib/product-data"

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("orders")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+237 6XX XXX XXX",
    address: "123 Avenue de l'Indépendance, Yaoundé, Cameroon",
    image: "/placeholder.svg?height=100&width=100&text=JD",
  }

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      date: "2023-04-01",
      store: "Marché Central 1",
      items: 3,
      total: 15000,
      status: "Delivered",
    },
    {
      id: "ORD-002",
      date: "2023-04-15",
      store: "Marché Central 2",
      items: 5,
      total: 22000,
      status: "Processing",
    },
    {
      id: "ORD-003",
      date: "2023-05-02",
      store: "Marché Central 1",
      items: 2,
      total: 8500,
      status: "Shipped",
    },
  ]

  // Mock wishlist data
  const wishlist = [
    {
      id: 1,
      name: "Fresh Plantains",
      price: 1500,
      store: "Marché Central 1",
      image: getProductById(1).image,
    },
    {
      id: 4,
      name: "Egusi Seeds",
      price: 3500,
      store: "Marché Central 3",
      image: getProductById(4).image,
    },
    {
      id: 9,
      name: "Eru Leaves",
      price: 2000,
      store: "Marché Central 1",
      image: getProductById(9).image,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CamGrocer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium hover:text-green-600 transition-colors">
              Browse
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon">
                <ShoppingBag className="h-4 w-4" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src={user.image || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="grid">
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("addresses")}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "reviews" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("reviews")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Reviews
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("account")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="orders" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Store</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.store}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.total} FCFA</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="wishlist" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Wishlist</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {wishlist.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-0">
                            <div className="flex p-4">
                              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.store}</p>
                                <p className="font-semibold mt-2">{item.price} FCFA</p>
                              </div>
                            </div>
                            <div className="flex border-t">
                              <Button variant="ghost" className="flex-1 rounded-none h-12">
                                Remove
                              </Button>
                              <Separator orientation="vertical" />
                              <Button variant="ghost" className="flex-1 rounded-none h-12">
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="addresses" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Home</CardTitle>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{user.name}</p>
                          <p className="text-sm">{user.phone}</p>
                          <p className="text-sm">{user.address}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                      <Button className="bg-green-600 hover:bg-green-700">Add New Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="account" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 CamGrocer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
