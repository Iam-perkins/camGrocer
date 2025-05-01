"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Star, Heart, CheckCircle2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

// Import the product data utilities
import { getStoreImage, generateProductsFromStore, categoryImages } from "@/lib/product-data"

// Increase the total products constant
const totalProducts = 50 // Total number of products in the system

export default function Home() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)
  const [followedStores, setFollowedStores] = useState<number[]>([])
  const [storeFollowers, setStoreFollowers] = useState<Record<number, number>>({})

  // Load cart data and followed stores from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")
    const savedFollowedStores = localStorage.getItem("followedStores")
    const savedStoreFollowers = localStorage.getItem("storeFollowers")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }

    if (savedFollowedStores) {
      setFollowedStores(JSON.parse(savedFollowedStores))
    } else {
      localStorage.setItem("followedStores", JSON.stringify([]))
    }

    if (savedStoreFollowers) {
      setStoreFollowers(JSON.parse(savedStoreFollowers))
    } else {
      // Initialize with empty follower counts
      const initialFollowers: Record<number, number> = {}
      for (let i = 1; i <= 8; i++) {
        initialFollowers[i] = 0
      }
      localStorage.setItem("storeFollowers", JSON.stringify(initialFollowers))
      setStoreFollowers(initialFollowers)
    }
  }, [])

  // Create sorted store IDs based on follower count
  const sortedStoreIds = useMemo(() => {
    // Create array of store IDs (1-8)
    const storeIds = Array.from({ length: 8 }, (_, i) => i + 1)

    // Sort by follower count in descending order
    return storeIds.sort((a, b) => {
      const followersA = storeFollowers[a] || 0
      const followersB = storeFollowers[b] || 0
      return followersB - followersA
    })
  }, [storeFollowers])

  // Generate popular products for the home page
  const popularProducts = useMemo(() => {
    let allProducts = []
    let startId = 1

    sortedStoreIds.forEach((storeId, index) => {
      // Top stores get more products displayed
      const productsToShow = index === 0 ? 6 : index === 1 ? 5 : index === 2 ? 4 : index < 5 ? 2 : 1

      // Generate products for this store
      const storeProducts = generateProductsFromStore(storeId, productsToShow, startId)
      allProducts = [...allProducts, ...storeProducts]
      startId += productsToShow
    })

    return allProducts
  }, [sortedStoreIds, storeFollowers])

  const handleAddToCart = (product: any) => {
    // If cart is empty, set the current store
    if (cartItems.length === 0) {
      const storeName = product.store || `Marché Central ${product.storeId}`
      setCurrentStore(storeName)

      // Create a new cart item with quantity
      const newItem = {
        ...product,
        quantity: 1,
        store: storeName,
        image: product.image || `/placeholder.svg?height=150&width=150&text=${product.name}`,
      }

      setCartItems([newItem])

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify([newItem]))
      localStorage.setItem("currentStore", storeName)

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } else {
      // Check if product is from the same store
      const storeName = product.store || `Marché Central ${product.storeId}`
      if (storeName === currentStore) {
        // Check if product is already in cart
        const existingItem = cartItems.find((item) => item.id === product.id)

        if (!existingItem) {
          // Add new item to cart
          const newItem = {
            ...product,
            quantity: 1,
            store: storeName,
            image: product.image || `/placeholder.svg?height=150&width=150&text=${product.name}`,
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
          description: `You can only add items from ${currentStore} to your current cart. Please empty your cart first to shop from ${storeName}.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleFollowStore = (storeId: number) => {
    const isFollowing = followedStores.includes(storeId)
    let updatedFollowedStores: number[]

    // Get current store followers
    const currentFollowers = storeFollowers[storeId] || 0
    let newFollowerCount: number

    if (isFollowing) {
      // Unfollow the store
      updatedFollowedStores = followedStores.filter((id) => id !== storeId)
      newFollowerCount = Math.max(0, currentFollowers - 1)

      toast({
        title: "Store unfollowed",
        description: `You have unfollowed Marché Central ${storeId}.`,
      })
    } else {
      // Follow the store
      updatedFollowedStores = [...followedStores, storeId]
      newFollowerCount = currentFollowers + 1

      // Show special toast if store just got verified
      if (newFollowerCount === 200) {
        toast({
          title: "Store Verified! 🎉",
          description: `Marché Central ${storeId} has reached 200 followers and is now verified!`,
        })
      } else {
        toast({
          title: "Store followed",
          description: `You are now following Marché Central ${storeId}. You'll receive updates and recommendations from this store.`,
        })
      }
    }

    // Update state and localStorage
    setFollowedStores(updatedFollowedStores)
    localStorage.setItem("followedStores", JSON.stringify(updatedFollowedStores))

    // Update follower count
    const updatedStoreFollowers = {
      ...storeFollowers,
      [storeId]: newFollowerCount,
    }
    setStoreFollowers(updatedStoreFollowers)
    localStorage.setItem("storeFollowers", JSON.stringify(updatedStoreFollowers))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CamGrocer</span>
          </div>
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for groceries, stores..."
                className="w-full pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <Link href="/" className="text-sm font-medium text-green-600 transition-colors">
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
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-4 w-4" />
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
            <Link href="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Fresh Groceries from Cameroon
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Shop from local stores or become a vendor. Quality produce delivered to your doorstep.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/browse">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/auth/register?type=store">
                    <Button size="lg" variant="outline">
                      Become a Vendor
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src={getStoreImage(2) || "/placeholder.svg"}
                alt="Cameroon Groceries"
                width={550}
                height={550}
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Top Rated Stores</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the best grocery stores in Cameroon ranked by follower count
                </p>
              </div>
            </div>
            {/* Update the store cards to use real images */}
            <div className="relative mt-8">
              <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {sortedStoreIds.map((storeId, index) => {
                  const isFollowing = followedStores.includes(storeId)
                  const followerCount = storeFollowers[storeId] || 0
                  const isVerified = followerCount >= 200
                  const storeImage = getStoreImage(storeId)

                  return (
                    <div key={storeId} className="snap-start shrink-0 pr-4 sm:w-[350px] w-[280px]">
                      <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
                        <CardHeader className="p-0 relative">
                          <Link href={`/store/${storeId}`}>
                            <Image
                              src={storeImage || "/placeholder.svg"}
                              alt={`Store ${storeId}`}
                              width={400}
                              height={200}
                              className="w-full object-cover h-48"
                            />
                            {index < 3 && (
                              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                #{index + 1}
                              </div>
                            )}
                          </Link>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1">
                              <Link href={`/store/${storeId}`}>
                                <CardTitle className="line-clamp-1">Marché Central {storeId}</CardTitle>
                              </Link>
                              {isVerified && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Verified Store (200+ followers)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleFollowStore(storeId)
                                    }}
                                    className="h-8 w-8"
                                  >
                                    <Heart className={`h-4 w-4 ${isFollowing ? "fill-red-500 text-red-500" : ""}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{isFollowing ? "Unfollow store" : "Follow store"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center mt-2 space-x-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < (5 - (storeId % 2)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">
                              ({Math.floor(Math.random() * 100) + 50})
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm mt-2 text-muted-foreground">
                            Specializing in fresh{" "}
                            {storeId % 3 === 0
                              ? "fruits and vegetables"
                              : storeId % 3 === 1
                                ? "local spices and grains"
                                : "traditional herbs and oils"}{" "}
                            from the {storeId % 3 === 0 ? " Western" : storeId % 3 === 1 ? " Central" : " Northern"}{" "}
                            region.
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="text-sm font-medium">{followerCount} followers</span>
                            {index === 0 && followerCount > 0 && (
                              <Badge className="ml-2 bg-green-600 text-white text-xs">Top Store</Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline" className="text-xs">
                            {storeId % 3 === 0
                              ? "Fruits & Vegetables"
                              : storeId % 3 === 1
                                ? "Spices & Grains"
                                : "Herbs & Oils"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Yaoundé, Cameroon</span>
                        </CardFooter>
                      </Card>
                    </div>
                  )
                })}
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
                <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                  <span className="sr-only">Previous</span>
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our selection of fresh Cameroonian groceries at local market prices
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              <Link href="/browse?category=Fruits" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.fruits || "/placeholder.svg"}
                    alt="Fruits"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Fruits</h3>
                    <p className="text-sm opacity-90">500 - 2,500 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Vegetables" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.vegetables || "/placeholder.svg"}
                    alt="Vegetables"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Vegetables</h3>
                    <p className="text-sm opacity-90">800 - 3,000 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Spices" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.spices || "/placeholder.svg"}
                    alt="Spices"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Spices</h3>
                    <p className="text-sm opacity-90">300 - 3,500 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Oils" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.oils || "/placeholder.svg"}
                    alt="Oils"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Oils</h3>
                    <p className="text-sm opacity-90">1,000 - 4,000 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Tubers" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.tubers || "/placeholder.svg"}
                    alt="Tubers"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Tubers</h3>
                    <p className="text-sm opacity-90">1,500 - 5,000 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Nuts" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.nuts || "/placeholder.svg"}
                    alt="Nuts"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Nuts</h3>
                    <p className="text-sm opacity-90">1,000 - 3,500 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Grains" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages.grains || "/placeholder.svg"}
                    alt="Grains"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Grains</h3>
                    <p className="text-sm opacity-90">700 - 2,500 FCFA</p>
                  </div>
                </div>
              </Link>
              <Link href="/browse?category=Meat+%26+Fish" className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={categoryImages["meat & fish"] || "/placeholder.svg"}
                    alt="Meat & Fish"
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-xl">Meat & Fish</h3>
                    <p className="text-sm opacity-90">800 - 3,000 FCFA</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/browse">
                <Button className="bg-green-600 hover:bg-green-700">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Updated Popular Items section with more products and a See All link */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Popular Items</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover what's trending in Cameroonian markets right now •{" "}
                  <span className="font-medium">{totalProducts} products available</span>
                </p>
              </div>
            </div>

            {/* Grid layout for popular products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
              {popularProducts.slice(0, 15).map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg h-full">
                  <CardHeader className="p-0">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full object-cover h-48"
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
                    <div className="mt-2 flex items-center">
                      <Link href={`/store/${product.storeId}`} className="text-sm text-green-600 hover:underline">
                        Marché Central {product.storeId}
                      </Link>
                      {storeFollowers[product.storeId] >= 200 && (
                        <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500 ml-1" />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* See All Products link */}
            <div className="flex justify-center mt-10">
              <Link href="/browse">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  See All Products ({totalProducts}) <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
      <Toaster />
    </div>
  )
}
