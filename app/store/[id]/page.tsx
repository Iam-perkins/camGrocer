"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, ShoppingBag, ShoppingCart, Star, Heart, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { getStoreImage } from "@/lib/product-data"
// Add import for ImageWithFallback
import { ImageWithFallback } from "@/components/image-with-fallback"

export default function StorePage() {
  const params = useParams()
  const storeId = Number(params.id)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  // Load cart data and following status from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }

    // Load store followers data
    const storeFollowersData = JSON.parse(localStorage.getItem("storeFollowers") || "{}")
    const followedStores = JSON.parse(localStorage.getItem("followedStores") || "[]")

    // Set initial follower count (default to 0 if not set)
    const currentFollowers = storeFollowersData[storeId] || 0
    setFollowerCount(currentFollowers)

    // Check if store is verified (200+ followers)
    setIsVerified(currentFollowers >= 200)

    // Check if user is following this store
    setIsFollowing(followedStores.includes(storeId))
  }, [storeId])

  // Mock store data
  const store = {
    id: storeId,
    name: `Marché Central ${storeId}`,
    description: `One of the best grocery stores in Yaoundé, specializing in fresh ${storeId % 2 === 0 ? "fruits and vegetables" : "local spices and grains"} from the ${storeId % 2 === 0 ? "Western" : "Central"} region.`,
    rating: 4.2,
    reviews: 87,
    image: getStoreImage(storeId),
    location: "Yaoundé, Cameroon",
    openingHours: "8:00 AM - 6:00 PM",
    phone: "+237 6XX XXX XXX",
  }

  // Update the products array to include more products with consistent IDs
  // Mock products data
  const products = [
    {
      id: 1,
      name: "Fresh Plantains",
      category: "Fruits",
      price: 1500,
      image: "/placeholder.svg?height=200&width=200&text=Plantains",
      description: "Fresh plantains from Western Cameroon",
      storeId: 1,
      store: "Marché Central 1",
    },
    {
      id: 2,
      name: "Red Beans",
      category: "Grains",
      price: 2000,
      image: "/placeholder.svg?height=200&width=200&text=Red+Beans",
      description: "High quality red beans from Northern Cameroon",
      storeId: 2,
      store: "Marché Central 2",
    },
    {
      id: 3,
      name: "Cassava",
      category: "Vegetables",
      price: 1200,
      image: "/placeholder.svg?height=200&width=200&text=Cassava",
      description: "Fresh cassava roots from Central Cameroon",
      storeId: 1,
      store: "Marché Central 1",
    },
    {
      id: 4,
      name: "Egusi Seeds",
      category: "Spices",
      price: 3500,
      image: "/placeholder.svg?height=200&width=200&text=Egusi",
      description: "Premium quality egusi seeds for soups and stews",
      storeId: 3,
      store: "Marché Central 3",
    },
    {
      id: 5,
      name: "Palm Oil",
      category: "Oils",
      price: 2500,
      image: "/placeholder.svg?height=200&width=200&text=Palm+Oil",
      description: "Pure palm oil from the coastal region",
      storeId: 2,
      store: "Marché Central 2",
    },
    {
      id: 6,
      name: "Yams",
      category: "Tubers",
      price: 1800,
      image: "/placeholder.svg?height=200&width=200&text=Yams",
      description: "Fresh yams from the fertile soils of Cameroon",
      storeId: 3,
      store: "Marché Central 3",
    },
    {
      id: 7,
      name: "Peanuts",
      category: "Nuts",
      price: 1800,
      image: "/placeholder.svg?height=200&width=200&text=Peanuts",
      description: "Roasted peanuts from Northern Cameroon",
      storeId: 1,
      store: "Marché Central 1",
    },
    {
      id: 8,
      name: "Bitter Leaf",
      category: "Vegetables",
      price: 1000,
      image: "/placeholder.svg?height=200&width=200&text=Bitter+Leaf",
      description: "Fresh bitter leaf for traditional soups",
      storeId: 2,
      store: "Marché Central 2",
    },
    {
      id: 9,
      name: "Palm Wine",
      category: "Beverages",
      price: 2500,
      image: "/placeholder.svg?height=200&width=200&text=Palm+Wine",
      description: "Fresh palm wine from the coastal region",
      storeId: 3,
      store: "Marché Central 3",
    },
    {
      id: 10,
      name: "Cocoyams",
      category: "Vegetables",
      price: 1300,
      image: "/placeholder.svg?height=200&width=200&text=Cocoyams",
      description: "Fresh cocoyams from the rainforest region",
      storeId: 1,
      store: "Marché Central 1",
    },
    {
      id: 11,
      name: "Njangsa",
      category: "Spices",
      price: 3000,
      image: "/placeholder.svg?height=200&width=200&text=Njangsa",
      description: "Traditional spice for soups and stews",
      storeId: 2,
      store: "Marché Central 2",
    },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.storeId === storeId &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleAddToCart = (product: any) => {
    // If cart is empty, set the current store
    if (cartItems.length === 0) {
      setCurrentStore(store.name)

      // Create a new cart item with quantity
      const newItem = {
        ...product,
        quantity: 1,
        storeId: storeId,
        store: store.name,
      }

      setCartItems([newItem])

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify([newItem]))
      localStorage.setItem("currentStore", store.name)

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } else {
      // Check if product is from the same store
      if (store.name === currentStore) {
        // Check if product is already in cart
        const existingItem = cartItems.find((item) => item.id === product.id)

        if (!existingItem) {
          // Add new item to cart
          const newItem = {
            ...product,
            quantity: 1,
            storeId: storeId,
            store: store.name,
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
          description: `You can only add items from ${currentStore} to your current cart. Please empty your cart first to shop from ${store.name}.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleFollowStore = () => {
    // Get current followed stores
    const followedStores = JSON.parse(localStorage.getItem("followedStores") || "[]")

    // Get current store followers data
    const storeFollowersData = JSON.parse(localStorage.getItem("storeFollowers") || "{}")

    // Current follower count for this store
    const currentFollowers = storeFollowersData[storeId] || 0

    if (isFollowing) {
      // Unfollow the store
      const updatedFollowedStores = followedStores.filter((id: number) => id !== storeId)
      localStorage.setItem("followedStores", JSON.stringify(updatedFollowedStores))

      // Decrease follower count
      const newFollowerCount = Math.max(0, currentFollowers - 1)
      storeFollowersData[storeId] = newFollowerCount
      localStorage.setItem("storeFollowers", JSON.stringify(storeFollowersData))

      setIsFollowing(false)
      setFollowerCount(newFollowerCount)

      // Update verification status
      setIsVerified(newFollowerCount >= 200)

      toast({
        title: "Store unfollowed",
        description: `You have unfollowed ${store.name}.`,
      })
    } else {
      // Follow the store
      const updatedFollowedStores = [...followedStores, storeId]
      localStorage.setItem("followedStores", JSON.stringify(updatedFollowedStores))

      // Increase follower count
      const newFollowerCount = currentFollowers + 1
      storeFollowersData[storeId] = newFollowerCount
      localStorage.setItem("storeFollowers", JSON.stringify(storeFollowersData))

      setIsFollowing(true)
      setFollowerCount(newFollowerCount)

      // Update verification status
      setIsVerified(newFollowerCount >= 200)

      // Show special toast if store just got verified
      if (newFollowerCount === 200) {
        toast({
          title: "Store Verified! 🎉",
          description: `${store.name} has reached 200 followers and is now verified!`,
        })
      } else {
        toast({
          title: "Store followed",
          description: `You are now following ${store.name}. You'll receive updates and recommendations from this store.`,
        })
      }
    }
  }

  // Mock function to get product by ID (replace with your actual implementation)
  const getProductById = (productId: number) => {
    return products.find((product) => product.id === productId) || { image: "/placeholder.svg" }
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
                placeholder="Search products in this store..."
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
      <main className="flex-1">
        <div className="relative h-[300px] w-full">
          <ImageWithFallback
            src={store.image || "/placeholder.svg"}
            alt={store.name}
            fill
            className="object-cover"
            priority
            fallbackSrc="/placeholder.svg?height=300&width=1200&text=Store+Image"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="container p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{store.name}</h1>
                    {isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified Store (200+ followers)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(store.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 font-medium">{store.rating}</span>
                      <span className="ml-1 text-sm">({store.reviews} reviews)</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{store.location}</span>
                    <span className="mx-2">•</span>
                    <span>{followerCount} followers</span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleFollowStore}
                        variant={isFollowing ? "default" : "outline"}
                        className={
                          isFollowing ? "bg-green-600 hover:bg-green-700" : "bg-white text-black hover:bg-gray-100"
                        }
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-white" : ""}`} />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow this store to get updates and recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-8">
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Why follow stores?</AlertTitle>
            <AlertDescription>
              Following stores helps us personalize your shopping experience. You'll receive updates about new products,
              promotions, and recommendations based on your preferences. It also helps us rank stores in our system,
              ensuring the best stores get more visibility. Stores with 200+ followers receive a verification badge!
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="products">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="products" className="flex-1">
                Products
              </TabsTrigger>
              <TabsTrigger value="about" className="flex-1">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <ImageWithFallback
                          src={product.image || getProductById(product.id).image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover"
                          fallbackSrc={`/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`}
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
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleAddToCart(product)}
                      >
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
                  <p className="text-muted-foreground mt-2">Try adjusting your search query</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold">About {store.name}</h2>
                  {isVerified && <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500" />}
                </div>
                <p className="text-muted-foreground mb-6">{store.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">Store Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{store.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Opening Hours:</span>
                        <span>{store.openingHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Followers:</span>
                        <span>{followerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="flex items-center gap-1">
                          {isVerified ? (
                            <>
                              <span>Verified</span>
                              <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
                            </>
                          ) : (
                            <span>Unverified ({200 - followerCount} more followers needed)</span>
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">Delivery Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee:</span>
                        <span>1,000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Time:</span>
                        <span>2-3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Minimum Order:</span>
                        <span>5,000 FCFA</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    {isVerified && <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500" />}
                  </div>
                  <Button>Write a Review</Button>
                </div>
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="font-medium">{String.fromCharCode(65 + i)}</span>
                            </div>
                            <div>
                              <div className="font-medium">Customer {i + 1}</div>
                              <div className="flex items-center mt-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`h-4 w-4 ${j < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {new Date(2023, 3 + i, 10 + i).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4">
                          {i === 0
                            ? "Great store with fresh products. The plantains were perfectly ripe and the cassava was excellent quality. Will definitely shop here again!"
                            : i === 1
                              ? "Good selection of local products. The prices are reasonable and the quality is good. Delivery was prompt and the driver was friendly."
                              : "I love shopping from this store. They always have what I need and the quality is consistent. Highly recommended!"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
