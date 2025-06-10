"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Heart, Star, MapPin, Phone, Mail, ShoppingBag, Truck, Clock, Award } from "lucide-react"
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

// Add import for ImageWithFallback
import { ImageWithFallback } from "@/components/image-with-fallback"

// Increase the total products constant
const totalProducts = 50 // Total number of products in the system

// Hero background image - Buea/Mount Cameroon market scene
const heroBackgroundImage =
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2670&auto=format&fit=crop"

export default function Home() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)
  const [followedStores, setFollowedStores] = useState<number[]>([])
  const [storeFollowers, setStoreFollowers] = useState<Record<number, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLocationReady, setIsLocationReady] = useState(false)

  // Safely access location context
  const locationData = useLocation()
  const { selectedCity, selectedRegion } = locationData

  useEffect(() => {
    if (!isLocationReady && selectedCity && selectedRegion) {
      setIsLocationReady(true)
    }
  }, [selectedCity, selectedRegion, isLocationReady])

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

  // Generate popular products for the home page based on selected city
  const popularProducts = useMemo(() => {
    if (!selectedCity) return []

    let allProducts: any[] = []
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
        title: "Vendor Unfollowed",
        description: `You have unfollowed this Buea vendor.`,
      })
    } else {
      // Follow the store
      updatedFollowedStores = [...followedStores, storeId]
      newFollowerCount = currentFollowers + 1

      // Show special toast if store just got verified
      if (newFollowerCount === 200) {
        toast({
          title: "Vendor Verified! 🎉",
          description: `This Buea vendor has reached 200 followers and is now verified!`,
        })
      } else {
        toast({
          title: "Vendor Followed",
          description: `You are now following this Buea vendor. You'll receive updates and fresh produce alerts.`,
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

  // Add scroll restoration
  useEffect(() => {
    // Prevent automatic scroll on page load
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
  }, [])

  // If location is not selected yet, show loading
  if (!isLocationReady || !selectedCity || !selectedRegion) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
        <SiteHeader cartItemCount={cartItems.length} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700">Loading Buea location data...</p>
            <p className="text-sm text-gray-500 mt-2">Connecting to local vendors...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SiteHeader cartItemCount={cartItems.length} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1">
        {/* Hero section with Mount Cameroon/Buea market background */}
        <div
          className="relative w-full py-8 md:py-12 lg:py-16 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 100, 0, 0.8), rgba(34, 139, 34, 0.7)), url(${heroBackgroundImage})`,
            backgroundAttachment: "fixed",
          }}
        >
          {/* Floating elements for visual appeal */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <ScrollReveal className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 mb-3 text-sm px-3 py-1.5 font-semibold">
                      🇨🇲 Proudly Cameroonian • Buea Based
                    </Badge>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
                  >
                    Fresh Ingredients from
                    <span className="text-yellow-400 block mt-2">{selectedCity.name}</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-green-100 text-base md:text-lg leading-relaxed max-w-xl"
                  >
                    Shop from trusted Buea vendors for plantains, cassava, groundnuts, palm oil, and traditional Cameroonian ingredients.
                    Fresh from Mount Cameroon's fertile slopes to your doorstep in {selectedCity.name}.
                  </motion.p>
                </div>

                {/* Feature highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap gap-3 text-white"
                >
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">Free Delivery in Buea</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Same Day Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Local Vendors</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/browse" className="flex-1">
                    <AnimatedButton
                      size="lg"
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Shop Buea Markets
                    </AnimatedButton>
                  </Link>
                  <Link href="/auth/register?type=store" className="flex-1">
                    <AnimatedButton
                      size="lg"
                      variant="outline"
                      className="w-full text-black border-2 border-white hover:bg-white hover:text-green-700 font-bold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-sm"
                    >
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
                  className="relative"
                >
                  <div className="bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto rounded-2xl"
                    >
                      <source src="/intro.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-500 rounded-full animate-bounce delay-500"></div>
                  </div>
                </motion.div>
              </FloatingElement>
            </div>
          </div>
        </div>

        {/* Top Buea Vendors Section */}
        <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-green-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1.5">
                    🏆 Top Rated Vendors
                  </Badge>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                    Trusted Buea Vendors
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                    Meet our most popular local vendors in {selectedCity.name}, specializing in fresh plantains, cassava, groundnuts,
                    and traditional Cameroonian ingredients from Mount Cameroon region.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="relative">
              <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-4 md:gap-6">
                {sortedStoreIds.map((storeId, index) => {
                  const isFollowing = followedStores.includes(storeId)
                  const followerCount = storeFollowers[storeId] || 0
                  const isVerified = followerCount >= 200
                  const storeImage = getStoreImage(storeId)
                  const neighborhood = selectedCity.neighborhoods[storeId % selectedCity.neighborhoods.length]

                  // Cameroon-specific vendor names
                  const vendorNames = [
                    "Mama Ngozi's Fresh Produce", "Uncle Benson's Farm", "Sister Marie's Market",
                    "Papa John's Vegetables", "Auntie Grace's Store", "Brother Paul's Corner",
                    "Mama Comfort's Garden", "Chief Ako's Market"
                  ]

                  return (
                    <div key={storeId} className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[380px]">
                      <AnimatedCard delay={index * 0.1} className="overflow-hidden transition-all h-full bg-white shadow-lg hover:shadow-2xl border-0 rounded-2xl">
                        <CardHeader className="p-0 relative">
                          <Link href={`/store/${storeId}`}>
                            <div className="relative overflow-hidden rounded-t-2xl">
                              <ImageWithFallback
                                src={storeImage || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2574&auto=format&fit=crop"}
                                alt={vendorNames[storeId - 1]}
                                width={400}
                                height={240}
                                className="w-full object-cover h-40 sm:h-48 transition-transform duration-500 hover:scale-110"
                                fallbackSrc={`/placeholder.svg?height=240&width=400&text=${encodeURIComponent(vendorNames[storeId - 1])}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                              {index < 3 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                  className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
                                >
                                  🥇 #{index + 1} Vendor
                                </motion.div>
                              )}

                              {isVerified && (
                                <div className="absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg">
                                  <CheckCircle2 className="h-4 w-4 text-white fill-current" />
                                </div>
                              )}
                            </div>
                          </Link>
                        </CardHeader>

                        <CardContent className="p-4 md:p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <Link href={`/store/${storeId}`}>
                                <CardTitle className="text-lg md:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-1">
                                  {vendorNames[storeId - 1]}
                                </CardTitle>
                              </Link>
                              <p className="text-sm text-gray-500 mt-1 truncate">{neighborhood}, {selectedCity.name}</p>
                            </div>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleFollowStore(storeId)
                                    }}
                                  >
                                    <Heart
                                      className={`h-5 w-5 ${isFollowing ? "text-red-500 fill-current" : "text-gray-400"}`}
                                    />
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{isFollowing ? "Unfollow" : "Follow"} this vendor</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </AnimatedCard>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category Section */}
        <ParallaxSection className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2">
                  🛒 Shop by Category
                </Badge>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-gray-900">
                    Traditional Cameroonian Ingredients
                  </h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl leading-relaxed">
                    Explore our selection of authentic {selectedRegion.name} region groceries at local Buea market prices.
                    Perfect for preparing Ndolé, Eru, Achu, and other traditional dishes.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Plantains & Bananas",
                  price: "500 - 2,500 FCFA",
                  image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Fruits",
                  description: "Sweet plantains and cooking bananas"
                },
                {
                  name: "Cassava & Cocoyam",
                  price: "800 - 3,000 FCFA",
                  image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Vegetables",
                  description: "Fresh tubers for fufu and achu"
                },
                {
                  name: "Country Onions & Spices",
                  price: "300 - 3,500 FCFA",
                  image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Spices",
                  description: "Local onions, ginger, and traditional spices"
                },
                {
                  name: "Palm Oil & Groundnut Oil",
                  price: "1,000 - 4,000 FCFA",
                  image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Oils",
                  description: "Pure palm oil and locally pressed oils"
                },
                {
                  name: "Sweet Potatoes & Yams",
                  price: "1,500 - 5,000 FCFA",
                  image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Tubers",
                  description: "Fresh yams and sweet potatoes"
                },
                {
                  name: "Groundnuts & Egusi",
                  price: "1,000 - 3,500 FCFA",
                  image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Nuts",
                  description: "Raw groundnuts and egusi seeds"
                },
                {
                  name: "Rice & Corn",
                  price: "700 - 2,500 FCFA",
                  image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Grains",
                  description: "Local rice and corn varieties"
                },
                {
                  name: "Fresh Fish & Meat",
                  price: "800 - 3,000 FCFA",
                  image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?q=80&w=2574&auto=format&fit=crop",
                  url: "/browse?category=Meat+%26+Fish",
                  description: "Fresh fish from Limbe and local meat"
                },
              ].map((category, index) => (
                <ScrollReveal key={category.name} delay={index * 0.1} direction="up">
                  <Link href={category.url} className="block group">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={300}
                          height={300}
                          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                          fallbackSrc={`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(category.name)}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                          <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                          <p className="text-sm opacity-90 mb-1">{category.description}</p>
                          <p className="text-lg font-semibold text-yellow-400">{category.price}</p>
                        </div>

                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-green-500 opacity-80"></div>
                      </div>
                    </motion.div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/browse">
                <AnimatedButton className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">
                  Explore All Categories <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </ParallaxSection>

        {/* Popular Products Section */}
        <section className="w-full py-8 md:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-3 text-center mb-6">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1.5">
                  🔥 Trending Now
                </Badge>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-gray-900">
                    Popular Ingredients in {selectedCity.name}
                  </h2>
                  <p className="max-w-[600px] text-gray-600 text-base md:text-lg leading-relaxed">
                    Discover the most sought-after traditional ingredients from our trusted Buea vendors.
                    Perfect for your favorite Cameroonian recipes.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularProducts.slice(0, 12).map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
                  <AnimatedCard className="h-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0">
                    <CardHeader className="p-0 relative">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <ImageWithFallback
                            src={product.image || "https://images.unsplash.com/photo-1610832746107-ba3898bb3cbb?q=80&w=2574&auto=format&fit=crop"}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-56 object-cover transition-transform duration-700 hover:scale-110"
                            fallbackSrc={`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(product.name)}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Trending badge for popular items */}
                          {index < 3 && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              🔥 Trending
                            </div>
                          )}
                        </div>
                      </Link>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg line-clamp-1 hover:text-green-600 transition-colors text-gray-900">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            {product.category}
                          </Badge>
                          {product.regionSpecific && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                              🇨🇲 Local
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>

                        <div className="flex items-center justify-between pt-2">
                          <span className="font-bold text-xl text-green-600">{product.price.toLocaleString()} FCFA</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{product.location.split(",")[0]}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/browse">
                <AnimatedButton className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section */}
      <ParallaxSection className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-br from-green-50 to-blue-50" speed={0.1}>
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <ScrollReveal direction="left" className="space-y-6">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
                  🏠 About CamGrocer
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-gray-900">
                  Connecting Buea to Fresh Local Produce
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                   CamGrocer is Cameroon's premier online grocery marketplace, proudly connecting local vendors
                    from the fertile slopes of Mount Cameroon with families throughout the Southwest Region.
                  </p>
                  <p>
                    Founded in 2025 by University of Buea graduate, our mission is to make fresh,
                    authentic Cameroonian ingredients accessible to everyone while supporting local farmers
                    and traditional vendors in Buea, Limbe, and surrounding communities.
                  </p>
                  <p>
                    We believe in preserving Cameroon's rich culinary heritage while embracing modern convenience.
                    From fresh palm oil to the perfect plantains for your Ndolé, we bring the vibrant Buea market
                    experience directly to your doorstep.
                  </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Local Vendors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">10K+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">24hrs</div>
                    <div className="text-sm text-gray-600">Delivery Time</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/about">
                    <AnimatedButton className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-full">
                      Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
                    </AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <FloatingElement amplitude={10} duration={5}>
                  <div className="relative">
                    <ImageWithFallback
                      src="groceryfresh.jpg"
                      alt="Mount Cameroon Fresh Produce"
                      width={550}
                      height={550}
                      className="mx-auto aspect-square overflow-hidden rounded-3xl object-cover sm:w-full shadow-2xl"
                      fallbackSrc="/placeholder.svg?height=550&width=550&text=Mount+Cameroon+Produce"
                    />
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-400 rounded-full opacity-70 animate-pulse"></div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-yellow-400 rounded-full opacity-70 animate-pulse delay-1000"></div>
                  </div>
                </FloatingElement>
              </ScrollReveal>
            </div>
          </div>
        </ParallaxSection>

        {/* Contact Us Section */}
        <AnimatedGradient className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <ScrollReveal direction="left">
                <FloatingElement amplitude={8} duration={7}>
                  <div className="relative">
                    <ImageWithFallback
                      src="faqs.jpg"
                      alt="ContactCamGrocer Team"
                      width={550}
                      height={550}
                      className="mx-auto aspect-square overflow-hidden rounded-3xl object-cover sm:w-full shadow-2xl order-2 lg:order-1"
                      fallbackSrc="/placeholder.svg?height=550&width=550&text=Contact+BueaFresh"
                    />
                    {/* Glowing effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-xl"></div>
                  </div>
                </FloatingElement>
              </ScrollReveal>

              <ScrollReveal direction="right" className="space-y-6 order-1 lg:order-2 text-white">
                <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                  📞 Get In Touch
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Need Help in {selectedCity.name}?
                </h2>
                <p className="text-gray-300 md:text-xl leading-relaxed">
                  Our friendly Buea-based team is here to help with your grocery needs. Contact us for vendor
                  inquiries, delivery questions, or product recommendations.
                </p>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                  >
                    <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">University of Buea Road</div>
                      <div className="text-sm text-gray-300">Molyko, Buea, Southwest Region</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                  >
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">+237 670 123 456</div>
                      <div className="text-sm text-gray-300">WhatsApp available 24/7</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                  >
                    <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">hello@bueafresh.cm</div>
                      <div className="text-sm text-gray-300">We reply within 2 hours</div>
                    </div>
                  </motion.div>
                </div>

                <div className="pt-6">
                  <Link href="/contact">
                    <AnimatedButton className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-lg">
                      Contact Our Team <ArrowRight className="ml-2 h-5 w-5" />
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