"use client"

import react from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Heart, Star, MapPin, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AnimatedGradient } from "@/components/ui/animated-gradient"
import { AnimatedCard } from "@/components/ui/animated-card"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ParallaxSection } from "@/components/ui/parallax-section"
import { FloatingElement } from "@/components/ui/floating-element"
import { useLocation } from "@/contexts/location-context"
import { Button } from "@/components/ui/button"

// Import the product data utilities
import { getStoreImage, generateProductsFromStore, categoryImages } from "@/lib/product-data"

// Increase the total products constant
const totalProducts = 50 // Total number of products in the system

export default function Home() {
  const { toast } = useToast()
  const { selectedCity, selectedRegion } = useLocation()
  const [cartItems, setCartItems] = react.useState<any[]>([])
  const [currentStore, setCurrentStore] = react.useState<string | null>(null)
  const [followedStores, setFollowedStores] = react.useState<number[]>([])
  const [storeFollowers, setStoreFollowers] = react.useState<Record<number, number>>({})
  const [searchQuery, setSearchQuery] = react.useState("")

  // Load cart data and followed stores from localStorage when component mounts
  react.useEffect(() => {
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
  const sortedStoreIds = react.useMemo(() => {
    // Create array of store IDs (1-8)
    const storeIds = Array.from({ length: 8 }, (_, i) => i + 1)

    // Sort by follower count in descending order
    return storeIds.sort((a, b) => {
      const followersA = storeFollowers[a] || 0
      const followersB = storeFollowers[b] || 0
      return followersB - followersA
    })
  }, [storeFollowers])

  // Generate popular products for the home page based on selected city
  const popularProducts = react.useMemo(() => {
    if (!selectedCity) return []

    let allProducts = []
    let startId = 1

    sortedStoreIds.forEach((storeId, index) => {
      // Top stores get more products displayed
      const productsToShow = index === 0 ? 6 : index === 1 ? 5 : index === 2 ? 4 : index < 5 ? 2 : 1

      // Generate products for this store and city
      const storeProducts = generateProductsFromStore(storeId, productsToShow, startId, selectedCity.id)
      allProducts = [...allProducts, ...storeProducts]
      startId += productsToShow
    })

    return allProducts
  }, [sortedStoreIds, storeFollowers, selectedCity])

  const handleAddToCart = (product: any) => {
    // If cart is empty, set the current store
    if (cartItems.length === 0) {
      const storeName = product.store || `${product.location.split(",")[0]} Market ${product.storeId}`
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
      const storeName = product.store || `${product.location.split(",")[0]} Market ${product.storeId}`
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
        description: `You have unfollowed Store ${storeId}.`,
      })
    } else {
      // Follow the store
      updatedFollowedStores = [...followedStores, storeId]
      newFollowerCount = currentFollowers + 1

      // Show special toast if store just got verified
      if (newFollowerCount === 200) {
        toast({
          title: "Store Verified! 🎉",
          description: `Store ${storeId} has reached 200 followers and is now verified!`,
        })
      } else {
        toast({
          title: "Store followed",
          description: `You are now following Store ${storeId}. You'll receive updates and recommendations from this store.`,
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

  // If location is not selected yet, show loading
  if (!selectedCity || !selectedRegion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader cartItemCount={cartItems.length} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1">
        <AnimatedGradient className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <ScrollReveal className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  >
                    Fresh Groceries from {selectedCity.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    Shop from local {selectedCity.name} stores or become a vendor. Quality produce delivered to your
                    doorstep in {selectedCity.name} within 24 hours.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                >
                  <Link href="/browse">
                    <AnimatedButton size="lg" className="bg-green-600 hover:bg-green-700">
                      Shop Now
                    </AnimatedButton>
                  </Link>
                  <Link href="/auth/register?type=store">
                    <AnimatedButton size="lg" variant="outline">
                      Become a Vendor
                    </AnimatedButton>
                  </Link>
                </motion.div>
              </ScrollReveal>
              <FloatingElement amplitude={15} duration={6} className="order-first lg:order-last">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={getStoreImage(2) || "/placeholder.svg"}
                    alt={`${selectedCity.name} Groceries`}
                    width={550}
                    height={550}
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full shadow-lg"
                  />
                </motion.div>
              </FloatingElement>
            </div>
          </div>
        </AnimatedGradient>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Top Rated Stores in {selectedCity.name}
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Discover the best grocery stores in {selectedCity.name} ranked by follower count
                  </p>
                </div>
              </div>
            </ScrollReveal>
            {/* Update the store cards to use real images */}
            <div className="relative mt-8">
              <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {sortedStoreIds.map((storeId, index) => {
                  const isFollowing = followedStores.includes(storeId)
                  const followerCount = storeFollowers[storeId] || 0
                  const isVerified = followerCount >= 200
                  const storeImage = getStoreImage(storeId)
                  const neighborhood = selectedCity.neighborhoods[storeId % selectedCity.neighborhoods.length]

                  return (
                    <div key={storeId} className="snap-start shrink-0 pr-4 sm:w-[350px] w-[280px]">
                      <AnimatedCard delay={index} className="overflow-hidden transition-all h-full">
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
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                              >
                                #{index + 1}
                              </motion.div>
                            )}
                          </Link>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1">
                              <Link href={`/store/${storeId}`}>
                                <CardTitle className="line-clamp-1">
                                  {neighborhood} Market {storeId}
                                </CardTitle>
                              </Link>
                              {isVerified && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
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
                                </motion.div>
                              )}
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="h-8 w-8 flex items-center justify-center rounded-full"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleFollowStore(storeId)
                                    }}
                                  >
                                    <Heart
                                      className={`h-4 w-4 transition-colors duration-300 ${
                                        isFollowing ? "fill-red-500 text-red-500" : ""
                                      }`}
                                    />
                                  </motion.button>
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
                                className={`h-4 w-4 ${
                                  j < (5 - (storeId % 2)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
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
                            from the {neighborhood} area of {selectedCity.name}.
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
                          <span className="text-xs text-muted-foreground">
                            {neighborhood}, {selectedCity.name}
                          </span>
                        </CardFooter>
                      </AnimatedCard>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <ParallaxSection className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Explore our selection of fresh {selectedRegion.name} region groceries at local market prices
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {[
                {
                  name: "Fruits",
                  price: "500 - 2,500 FCFA",
                  image: categoryImages.fruits,
                  url: "/browse?category=Fruits",
                },
                {
                  name: "Vegetables",
                  price: "800 - 3,000 FCFA",
                  image: categoryImages.vegetables,
                  url: "/browse?category=Vegetables",
                },
                {
                  name: "Spices",
                  price: "300 - 3,500 FCFA",
                  image: categoryImages.spices,
                  url: "/browse?category=Spices",
                },
                { name: "Oils", price: "1,000 - 4,000 FCFA", image: categoryImages.oils, url: "/browse?category=Oils" },
                {
                  name: "Tubers",
                  price: "1,500 - 5,000 FCFA",
                  image: categoryImages.tubers,
                  url: "/browse?category=Tubers",
                },
                { name: "Nuts", price: "1,000 - 3,500 FCFA", image: categoryImages.nuts, url: "/browse?category=Nuts" },
                {
                  name: "Grains",
                  price: "700 - 2,500 FCFA",
                  image: categoryImages.grains,
                  url: "/browse?category=Grains",
                },
                {
                  name: "Meat & Fish",
                  price: "800 - 3,000 FCFA",
                  image: categoryImages["meat & fish"],
                  url: "/browse?category=Meat+%26+Fish",
                },
              ].map((category, index) => (
                <ScrollReveal key={category.name} delay={index} direction="up">
                  <Link href={category.url} className="block group">
                    <motion.div whileHover={{ scale: 1.03 }} className="relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                        <h3 className="font-bold text-xl">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.price}</p>
                      </div>
                    </motion.div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/browse">
                <AnimatedButton className="bg-green-600 hover:bg-green-700">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </ParallaxSection>

        {/* Popular Products Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Popular Products in {selectedCity.name}
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Discover the most popular groceries from top-rated stores in {selectedCity.name}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {popularProducts.slice(0, 12).map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
                  <AnimatedCard className="h-full overflow-hidden">
                    <CardHeader className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold line-clamp-1 hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{product.category}</Badge>
                          {product.regionSpecific && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Regional</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-bold text-green-600">{product.price.toLocaleString()} FCFA</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{product.location.split(",")[0]}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                        >
                          Add to Cart
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/browse">
                <AnimatedButton className="bg-green-600 hover:bg-green-700">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <ParallaxSection className="w-full py-12 md:py-24 lg:py-32 bg-green-50" speed={0.1}>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <ScrollReveal direction="left" className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About CameroonGrocer</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  CameroonGrocer is Cameroon's premier online grocery marketplace, connecting local vendors with
                  customers throughout the country.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2023, our mission is to make fresh, local groceries accessible to everyone in Cameroon
                  while supporting local farmers and vendors. We believe in the power of community and the importance of
                  access to quality food.
                </p>
                <p className="text-muted-foreground">
                  Our platform serves as a digital bridge between Cameroon's vibrant markets and its residents, bringing
                  the traditional shopping experience online while preserving the personal connections that make our
                  community special.
                </p>
                <div className="pt-4">
                  <Link href="/about">
                    <AnimatedButton className="bg-green-600 hover:bg-green-700">
                      Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <FloatingElement amplitude={10} duration={5}>
                  <Image
                    src={getStoreImage(3) || "/placeholder.svg"}
                    alt="About CameroonGrocer"
                    width={550}
                    height={550}
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full shadow-lg"
                  />
                </FloatingElement>
              </ScrollReveal>
            </div>
          </div>
        </ParallaxSection>

        {/* Contact Us Section */}
        <AnimatedGradient className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <ScrollReveal direction="left">
                <FloatingElement amplitude={8} duration={7}>
                  <Image
                    src={getStoreImage(5) || "/placeholder.svg"}
                    alt="Contact CameroonGrocer"
                    width={550}
                    height={550}
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full order-2 lg:order-1 shadow-lg"
                  />
                </FloatingElement>
              </ScrollReveal>
              <ScrollReveal direction="right" className="space-y-4 order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Get In Touch</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Have questions about our service in {selectedCity.name}? We're here to help!
                </p>
                <div className="space-y-3">
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>
                      123 {selectedCity.neighborhoods[0]} Street, {selectedCity.name}, {selectedRegion.name} Region
                    </span>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span>+237 650 123 456</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span>info@cameroongrocer.com</span>
                  </motion.div>
                </div>
                <div className="pt-4">
                  <Link href="/contact">
                    <AnimatedButton className="bg-green-600 hover:bg-green-700">
                      Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                    </AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </AnimatedGradient>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  )
}
