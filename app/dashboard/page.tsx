"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BarChart3, Box, Home, LogOut, Package, Settings, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProductById } from "@/lib/product-data"
import { ImageUploader } from "@/components/image-uploader"

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fresh Plantains",
      category: "Fruits",
      price: 1500,
      stock: 50,
      image: getProductById(1).image,
      description: "Fresh plantains from Western Cameroon",
    },
    {
      id: 2,
      name: "Red Beans",
      category: "Grains",
      price: 2000,
      stock: 100,
      image: getProductById(2).image,
      description: "High quality red beans from Northern Cameroon",
    },
    {
      id: 3,
      name: "Cassava",
      category: "Vegetables",
      price: 1200,
      stock: 30,
      image: getProductById(3).image,
      description: "Fresh cassava roots from Central Cameroon",
    },
    {
      id: 4,
      name: "Egusi Seeds",
      category: "Spices",
      price: 3500,
      stock: 25,
      image: getProductById(4).image,
      description: "Premium quality egusi seeds for soups and stews",
    },
  ])

  // New state for the form
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Fruits",
    price: 1000,
    stock: 10,
    image: "/placeholder.svg?height=100&width=100&text=New",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "stock" ? Number.parseInt(value) : value,
    })
  }

  const handleImageSelected = (imageUrl: string) => {
    setNewProduct({
      ...newProduct,
      image: imageUrl || "/placeholder.svg?height=100&width=100&text=New",
    })
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the product to the database
    const productToAdd = {
      id: products.length + 1,
      ...newProduct,
    }
    setProducts([...products, productToAdd])

    // Reset form
    setNewProduct({
      name: "",
      category: "Fruits",
      price: 1000,
      stock: 10,
      image: "/placeholder.svg?height=100&width=100&text=New",
      description: "",
    })

    setActiveTab("products")
  }

  const handleDeleteProduct = (id: number) => {
    // In a real app, you would delete the product from the database
    setProducts(products.filter((product) => product.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">CamGrocer</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "products" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("products")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <Box className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "customers" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("customers")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="products" onClick={() => setActiveTab("products")}>
                  Products
                </TabsTrigger>
                <TabsTrigger value="add-product" onClick={() => setActiveTab("add-product")}>
                  Add Product
                </TabsTrigger>
                <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>
                  Orders
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className={activeTab === "overview" ? "block" : "hidden"}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">250,000 FCFA</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Orders</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45</div>
                      <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Products</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{products.length}</div>
                      <p className="text-xs text-muted-foreground">+2 new products this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rating</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.5/5</div>
                      <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>#ORD-001</TableCell>
                            <TableCell>John Doe</TableCell>
                            <TableCell>3 items</TableCell>
                            <TableCell>15,000 FCFA</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Delivered
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>#ORD-002</TableCell>
                            <TableCell>Jane Smith</TableCell>
                            <TableCell>2 items</TableCell>
                            <TableCell>8,500 FCFA</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Processing
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>#ORD-003</TableCell>
                            <TableCell>Robert Johnson</TableCell>
                            <TableCell>5 items</TableCell>
                            <TableCell>22,000 FCFA</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Shipped
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>Your best performing products this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center gap-4">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="text-sm font-medium">{product.price} FCFA</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products" className={activeTab === "products" ? "block" : "hidden"}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                  <Button onClick={() => setActiveTab("add-product")} className="bg-green-600 hover:bg-green-700">
                    Add Product
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardHeader className="p-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{product.price} FCFA</p>
                            <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="add-product" className={activeTab === "add-product" ? "block" : "hidden"}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                  <Button variant="outline" onClick={() => setActiveTab("products")}>
                    Cancel
                  </Button>
                </div>
                <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Grains">Grains</option>
                        <option value="Spices">Spices</option>
                        <option value="Oils">Oils</option>
                        <option value="Tubers">Tubers</option>
                        <option value="Nuts">Nuts</option>
                        <option value="Meat & Fish">Meat & Fish</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (FCFA)</Label>
                      <Input
                        id="price"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <ImageUploader
                        onImageSelected={handleImageSelected}
                        defaultImage={newProduct.image}
                        label="Product Image"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Product
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="orders" className={activeTab === "orders" ? "block" : "hidden"}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                </div>
                <Card className="mt-4">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>#ORD-001</TableCell>
                          <TableCell>John Doe</TableCell>
                          <TableCell>2023-04-01</TableCell>
                          <TableCell>3 items</TableCell>
                          <TableCell>15,000 FCFA</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Delivered
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>#ORD-002</TableCell>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>2023-04-02</TableCell>
                          <TableCell>2 items</TableCell>
                          <TableCell>8,500 FCFA</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Processing
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>#ORD-003</TableCell>
                          <TableCell>Robert Johnson</TableCell>
                          <TableCell>2023-04-03</TableCell>
                          <TableCell>5 items</TableCell>
                          <TableCell>22,000 FCFA</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Shipped
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
