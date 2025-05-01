"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Filter, Search, ShoppingBag, ShoppingCart, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { generateProductsFromStore, categories as allCategories } from "@/lib/product-data"

export default function BrowsePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)
  const [storeFollowers, setStoreFollowers] = useState<Record<number, number>>({})

  // Get category from URL query parameters
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  // Set initial category filter from URL if present
  useEffect(() => {
    if (categoryParam) {
      // URL decode the category parameter and handle spaces
      const decodedCategory = decodeURIComponent(categoryParam.replace(/\+/g, " "))

      // Find the closest matching category in our system
      const matchingCategory = allCategories.find(
        (cat) =>
          cat.toLowerCase() === decodedCategory.toLowerCase() ||
          decodedCategory.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(decodedCategory.toLowerCase()),
      )

      if (matchingCategory && !selectedCategories.includes(matchingCategory)) {
        setSelectedCategories([...selectedCategories, matchingCategory])
      }
    }
  }, [categoryParam])

  // Load cart data and store followers from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")
    const savedStoreFollowers = localStorage.getItem("storeFollowers")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }

    if (savedStoreFollowers) {
      setStoreFollowers(JSON.parse(savedStoreFollowers))
    }
  }, [])

  // Total number of products in the system
  const totalProducts = 50

  // Create sorted store IDs based on follower count
  const sortedStoreIds = (() => {
    // Create array of store IDs (1-8)
    const storeIds = Array.from({ length: 8 }, (_, i) => i + 1)

    // Sort by follower count in descending order
    return storeIds.sort((a, b) => {
      const followersA = storeFollowers[a] || 0
      const followersB = storeFollowers[b] || 0
      return followersB - followersA
    })
  })()

  // Generate all products
  const products = (() => {
    // Allocate products based on store ranking
    let allProducts = []
    let startId = 1

    sortedStoreIds.forEach((storeId, index) => {
      // Top stores get more products
      const productsCount = index === 0 ? 15 : index === 1 ? 12 : index === 2 ? 8 : index < 5 ? 4 : 1
      const storeProducts = generateProductsFromStore(storeId, productsCount, startId)
      allProducts = [...allProducts, ...storeProducts]
      startId += productsCount
    })

    return allProducts
  })()

  const categories = [...new Set(products.map((product) => product.category))]
  const stores = [...new Set(products.map((product) => product.store))]

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleStoreChange = (store: string) => {
    setSelectedStores((prev) => (prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]))
  }

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false
    }

    // Filter by store
    if (selectedStores.length > 0 && !selectedStores.includes(product.store)) {
      return false
    }

    return true
  })

  const handleAddToCart = (product: any) => {
    // If cart is empty, set the current store
    if (cartItems.length === 0) {
      setCurrentStore(product.store)

      // Create a new cart item with quantity
      const newItem = {
        ...product,
        quantity: 1,
      }

      setCartItems([newItem])

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify([newItem]))
      localStorage.setItem("currentStore", product.store)

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } else {
      // Check if product is from the same store
      if (product.store === currentStore) {
        // Check if product is already in cart
        const existingItem = cartItems.find((item) => item.id === product.id)

        if (!existingItem) {
          // Add new item to cart
          const newItem = {
            ...product,
            quantity: 1,
          }

          const updatedCart = [...cartItems, newItem]
          setCartItems(updatedCart)

          // Save to localStorage
          localStorage.setItem("cartItems", JSON.stringify(updatedCart))

          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          })
        } else {
          // Increase quantity of existing item
          const updatedCart = cartItems.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity + 1 }
            }
            return item
          })

          setCartItems(updatedCart)

          // Save to localStorage
          localStorage.setItem("cartItems", JSON.stringify(updatedCart))

          toast({
            title: "Updated cart",
            description: `Added another ${product.name} to your cart.`,
          })
        }
      } else {
        // Show error if product is from a different store
        toast({
          title: "Cannot add to cart",
          description: `You can only add items from ${currentStore} to your current cart. Please empty your cart first to shop from ${product.store}.`,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CamGrocer</span>
          </Link>
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for groceries, stores..."
                className="w-full pl-8 md:w-[300px] lg:w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 lg:w-72 shrink-0">
            <div className="sticky top-24 hidden md:block">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">{priceRange[0]} FCFA</span>
                        <span className="text-sm">{priceRange[1]} FCFA</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Stores</h4>
                      <div className="space-y-2">
                        {stores.map((store) => (
                          <div key={store} className="flex items-center space-x-2">
                            <Checkbox
                              id={`store-${store}`}
                              checked={selectedStores.includes(store)}
                              onCheckedChange={() => handleStoreChange(store)}
                            />
                            <Label htmlFor={`store-${store}`}>{store}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter products by price, category, and store</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 py-4">
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">{priceRange[0]} FCFA</span>
                        <span className="text-sm">{priceRange[1]} FCFA</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Stores</h4>
                      <div className="space-y-2">
                        {stores.map((store) => (
                          <div key={store} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-store-${store}`}
                              checked={selectedStores.includes(store)}
                              onCheckedChange={() => handleStoreChange(store)}
                            />
                            <Label htmlFor={`mobile-store-${store}`}>{store}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex-1">
            {(selectedCategories.length > 0 ||
              selectedStores.length > 0 ||
              searchQuery ||
              priceRange[0] > 0 ||
              priceRange[1] < 5000) && (
              <div className="mb-4 flex items-center">
                <div className="text-sm text-muted-foreground mr-2">Active filters:</div>
                {categoryParam && (
                  <Badge variant="secondary" className="mr-2">
                    Category: {decodeURIComponent(categoryParam.replace(/\+/g, " "))}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedStores([])
                    setSearchQuery("")
                    setPriceRange([0, 5000])
                  }}
                  className="ml-auto"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Browse Products</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalProducts} products available from local Cameroonian markets
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${product.id}`} className="font-semibold hover:underline">
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="outline">{product.price} FCFA</Badge>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex items-center">
                      <Link href={`/store/${product.storeId}`} className="text-sm text-green-600 hover:underline">
                        {product.store}
                      </Link>
                      {storeFollowers[product.storeId] >= 200 && (
                        <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500 ml-1" />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
