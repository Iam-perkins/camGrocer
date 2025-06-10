"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { generateProductsFromStore, categories as allCategories, bueaNeighborhoods } from "@/lib/product-data"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { AnimatedCard } from "@/components/ui/animated-card"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { AnimatedButton } from "@/components/ui/animated-button"

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
        setSelectedCategories((prev) => [...prev, matchingCategory])
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
    } else {
      // Initialize with empty follower counts, consistent with HomePage
      const initialFollowers: Record<number, number> = {}
      for (let i = 1; i <= 8; i++) {
        initialFollowers[i] = 0
      }
      localStorage.setItem("storeFollowers", JSON.stringify(initialFollowers))
      setStoreFollowers(initialFollowers)
    }
  }, [])

  // Total number of products in the system
  const totalProducts = 50

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

  // Generate all products
  const products = useMemo(() => {
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
  }, [sortedStoreIds])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])
  const stores = useMemo(() => [...new Set(products.map((product) => product.store))], [products])

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

  const featuredProduct = useMemo(() => {
    // Select a compelling product for the featured section.
    // For simplicity, let's pick a high-priced or popular product from the generated list.
    // Or, pick the first product if products array is guaranteed to be non-empty.
    return products.find((p) => p.price > 3000) || products[0]
  }, [products])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-green-50">
      <SiteHeader cartItemCount={cartItems.length} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 container py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="md:w-64 lg:w-72 shrink-0">
            <div className="sticky top-24 hidden md:block p-6 bg-white rounded-xl shadow-lg border border-green-100">
              <ScrollReveal delay={0.1} direction="left">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Filters</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                        <Slider
                          defaultValue={[0, 5000]}
                          max={5000}
                          step={100}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="mt-2"
                        />
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                          <span>{priceRange[0]} FCFA</span>
                          <span>{priceRange[1]} FCFA</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Categories</h4>
                        <div className="space-y-3">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                                className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                              />
                              <Label htmlFor={`category-${category}`} className="text-gray-700">
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Stores</h4>
                        <div className="space-y-3">
                          {stores.map((store) => (
                            <div key={store} className="flex items-center space-x-2">
                              <Checkbox
                                id={`store-${store}`}
                                checked={selectedStores.includes(store)}
                                onCheckedChange={() => handleStoreChange(store)}
                                className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                              />
                              <Label htmlFor={`store-${store}`} className="text-gray-700">
                                {store}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Location</h4>
                        <div className="space-y-3">
                          {bueaNeighborhoods.slice(0, 6).map((neighborhood) => (
                            <div key={neighborhood} className="flex items-center space-x-2">
                              <Checkbox id={`location-${neighborhood}`} defaultChecked disabled />
                              <Label htmlFor={`location-${neighborhood}`} className="text-gray-700">
                                {neighborhood}, Buea
                              </Label>
                            </div>
                          ))}
                          <Badge variant="outline" className="mt-3 bg-blue-50 text-blue-700 border-blue-200">
                            Service limited to Buea only
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            {/* Mobile Filters */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full bg-green-50 hover:bg-green-100 text-green-800 border-green-200 rounded-lg shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-gray-900">Filters</SheetTitle>
                    <SheetDescription className="text-gray-600">Filter products by price, category, and store</SheetDescription>
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
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                        <span>{priceRange[0]} FCFA</span>
                        <span>{priceRange[1]} FCFA</span>
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
                              className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                            />
                            <Label htmlFor={`mobile-category-${category}`} className="text-gray-700">
                              {category}
                            </Label>
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
                              className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                            />
                            <Label htmlFor={`mobile-store-${store}`} className="text-gray-700">
                              {store}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <div className="space-y-2">
                        {bueaNeighborhoods.slice(0, 6).map((neighborhood) => (
                          <div key={neighborhood} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-location-${neighborhood}`} defaultChecked disabled />
                            <Label htmlFor={`mobile-location-${neighborhood}`} className="text-gray-700">
                              {neighborhood}, Buea
                            </Label>
                          </div>
                        ))}
                        <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                          Service limited to Buea only
                        </Badge>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Product Listing */}
          <div className="flex-1 space-y-8">
            <ScrollReveal delay={0.2} direction="right">
              {/* Active filters and Clear All */}
              {(selectedCategories.length > 0 ||
                selectedStores.length > 0 ||
                searchQuery ||
                priceRange[0] > 0 ||
                priceRange[1] < 5000) && (
                <div className="mb-6 flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm flex-wrap gap-2">
                  <div className="text-sm font-medium text-blue-800 mr-3">Active filters:</div>
                  {categoryParam && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Category: {decodeURIComponent(categoryParam.replace(/\+/g, " "))}
                    </Badge>
                  )}
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="bg-green-100 text-green-800">
                      {cat}
                    </Badge>
                  ))}
                  {selectedStores.map((store) => (
                    <Badge key={store} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {store}
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Price: {priceRange[0]} - {priceRange[1]} FCFA
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Search: {searchQuery}
                    </Badge>
                  )}

                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedStores([])
                      setSearchQuery("")
                      setPriceRange([0, 5000])
                    }}
                    className="ml-auto text-red-600 hover:bg-red-50"
                  >
                    Clear All Filters
                  </AnimatedButton>
                </div>
              )}

              {/* Browse Header */}
              <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Browse Fresh Products</h1>
                  <p className="text-md text-muted-foreground mt-2">
                    {totalProducts} products available from local Buea markets
                  </p>
                </div>
                <div className="text-base font-semibold text-gray-700">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </ScrollReveal>

            {/* NEW FEATURE: Quick Filters */}
            <ScrollReveal delay={0.3} direction="up">
              <div className="mb-6 flex flex-wrap gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <span className="font-semibold text-gray-800 mr-2">Quick Categories:</span>
                {allCategories.slice(0, 5).map((category) => (
                  <Badge
                    key={`quick-${category}`}
                    variant={selectedCategories.includes(category) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${selectedCategories.includes(category) ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
                {/* Add a quick price filter */}
                <Badge
                  variant={priceRange[0] === 0 && priceRange[1] === 1000 ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${priceRange[0] === 0 && priceRange[1] === 1000 ? "bg-yellow-600 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"}`}
                  onClick={() => setPriceRange([0, 1000])}
                >
                  Under 1000 FCFA
                </Badge>
              </div>
            </ScrollReveal>

            {/* NEW FEATURE: Featured Product Banner */}
            {featuredProduct && (
              <ScrollReveal delay={0.4} direction="up">
                <div className="relative w-full p-6 md:p-8 bg-gradient-to-r from-green-700 to-blue-700 text-white rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 space-y-3 text-center md:text-left md:w-2/3"
                  >
                    <Badge className="bg-yellow-400 text-black px-3 py-1.5 font-bold mb-2">
                      ✨ Buea's Pick of the Day!
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      {featuredProduct.name}
                    </h2>
                    <p className="text-green-100 text-lg max-w-md mx-auto md:mx-0">
                      {featuredProduct.description}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span className="text-3xl font-bold text-yellow-400">
                        {featuredProduct.price.toLocaleString()} FCFA
                      </span>
                      <AnimatedButton
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full shadow-lg"
                        onClick={() => handleAddToCart(featuredProduct)}
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                      </AnimatedButton>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="md:w-1/3 flex justify-center mt-6 md:mt-0 relative z-10"
                  >
                    <ImageWithFallback
                      src={featuredProduct.image || "/placeholder.svg"}
                      alt={featuredProduct.name}
                      width={200}
                      height={200}
                      className="rounded-xl shadow-lg object-cover w-48 h-48 md:w-56 md:h-56 border-2 border-white/30"
                      fallbackSrc={`/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
                        featuredProduct.name,
                      )}`}
                    />
                    {/* Decorative elements for the banner */}
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                  </motion.div>
                  {/* Background gradient overlay for visual effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl"></div>
                </div>
              </ScrollReveal>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.05} direction="up">
                  <AnimatedCard className="h-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl border-0">
                    <CardHeader className="p-0 relative">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <ImageWithFallback
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                            fallbackSrc={`/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
                              product.name,
                            )}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/product/${product.id}`} className="font-bold text-lg hover:underline text-gray-900">
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base py-1 px-3">
                          {product.price} FCFA
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-3 flex items-center">
                        <Link href={`/store/${product.storeId}`} className="text-sm text-green-600 hover:underline font-medium">
                          {product.store}
                        </Link>
                        {storeFollowers[product.storeId] >= 200 && (
                          <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500 ml-1" />
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {product.location || `${bueaNeighborhoods[product.storeId % bueaNeighborhoods.length]}, Buea`}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </AnimatedCard>
                </ScrollReveal>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                <h3 className="text-xl font-medium text-gray-800">No products found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
                <div className="mt-4">
                  <AnimatedButton
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedStores([])
                      setSearchQuery("")
                      setPriceRange([0, 5000])
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                  >
                    Reset Filters
                  </AnimatedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  )
}