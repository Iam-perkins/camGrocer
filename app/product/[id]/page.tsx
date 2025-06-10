"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Heart, Minus, Plus, ShoppingBag, ShoppingCart, Star, MessageSquare, CheckCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import BiddingModal from "@/components/bidding-modal"
import { getProductById } from "@/lib/product-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Add import for ImageWithFallback
import { ImageWithFallback } from "@/components/image-with-fallback"

// Type for negotiated prices - now using sessionStorage instead of localStorage
type NegotiatedPrice = {
  productId: number
  price: number
}

export default function ProductPage() {
  const params = useParams()
  const productId = Number(params.id)
  const [quantity, setQuantity] = useState(1)
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false)
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [negotiatedPrices, setNegotiatedPrices] = useState<NegotiatedPrice[]>([])

  // Load negotiated prices from sessionStorage instead of localStorage
  useEffect(() => {
    const savedNegotiatedPrices = sessionStorage.getItem("negotiatedPrices")
    if (savedNegotiatedPrices) {
      setNegotiatedPrices(JSON.parse(savedNegotiatedPrices))
    }

    // For demo purposes, we'll check if the user is premium
    // In a real app, this would come from your authentication system
    const isPremium = sessionStorage.getItem("isPremiumUser") === "true"
    setIsPremiumUser(isPremium)
  }, [])

  // Get the product data based on the ID from the URL
  const product = getProductById(productId)

  // Get negotiated price if available
  const getNegotiatedPrice = () => {
    const negotiated = negotiatedPrices.find((item) => item.productId === productId)
    return negotiated ? negotiated.price : null
  }

  // Get current price (negotiated or original)
  const getCurrentPrice = () => {
    const negotiatedPrice = getNegotiatedPrice()
    return negotiatedPrice !== null ? negotiatedPrice : product.price
  }

  const [selectedImage, setSelectedImage] = useState(product.images ? product.images[0] : product.image)

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  // Generate related products based on category
  const relatedProducts = (() => {
    // Find products in the same category
    const sameCategory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .map((id) => getProductById(id))
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3)

    // If we don't have enough, add some random products
    if (sameCategory.length < 3) {
      const randomIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        .filter((id) => id !== product.id && !sameCategory.some((p) => p.id === id))
        .slice(0, 3 - sameCategory.length)

      return [...sameCategory, ...randomIds.map((id) => getProductById(id))]
    }

    return sameCategory
  })()

  // Add the cart state and functionality inside the component
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)

  // Load cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }
  }, [])

  const handleAddToCart = () => {
    // If cart is empty, set the current store
    if (cartItems.length === 0) {
      setCurrentStore(product.store)

      // Use negotiated price if available
      const currentPrice = getCurrentPrice()

      setCartItems([
        {
          ...product,
          price: currentPrice, // Use negotiated price
          originalPrice: product.price, // Store original price for reference
          quantity: quantity,
        },
      ])

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      // Save to localStorage
      localStorage.setItem(
        "cartItems",
        JSON.stringify([
          {
            ...product,
            price: currentPrice,
            originalPrice: product.price,
            quantity: quantity,
          },
        ]),
      )
      localStorage.setItem("currentStore", product.store)
    } else {
      // Check if product is from the same store
      if (product.store === currentStore) {
        // Check if product is already in cart
        const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

        if (existingItemIndex === -1) {
          // Add to cart if not already in cart
          const currentPrice = getCurrentPrice()

          const newItem = {
            ...product,
            price: currentPrice,
            originalPrice: product.price,
            quantity: quantity,
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
          // Update quantity if already in cart
          const updatedCart = [...cartItems]
          updatedCart[existingItemIndex].quantity += quantity

          setCartItems(updatedCart)

          // Save to localStorage
          localStorage.setItem("cartItems", JSON.stringify(updatedCart))

          toast({
            title: "Updated cart",
            description: `Added ${quantity} more ${product.name} to your cart.`,
          })
        }
      } else {
        // Show error if product is from a different store
        toast({
          title: "Cannot add to cart",
          description: `You can only add items from ${currentStore} to your current cart.`,
          variant: "destructive",
        })
      }
    }
  }

  // Update the handleBidAccepted function to save to sessionStorage instead of localStorage
  const handleBidAccepted = (productId: number, newPrice: number) => {
    // Update negotiated prices
    const updatedPrices = [
      ...negotiatedPrices.filter((item) => item.productId !== productId),
      { productId, price: newPrice },
    ]
    setNegotiatedPrices(updatedPrices)

    // Save to sessionStorage instead of localStorage
    sessionStorage.setItem("negotiatedPrices", JSON.stringify(updatedPrices))

    // Show a more prominent success message
    toast({
      title: "Price updated!",
      description: `Your negotiated price of ${newPrice} FCFA for ${product.name} has been applied for this session.`,
      duration: 5000,
    })
  }

  // Toggle premium user status (for demo purposes)
  const togglePremiumStatus = () => {
    const newStatus = !isPremiumUser
    setIsPremiumUser(newStatus)
    sessionStorage.setItem("isPremiumUser", newStatus.toString())

    toast({
      title: newStatus ? "Premium activated" : "Premium deactivated",
      description: newStatus
        ? "You now have access to premium features like price negotiation."
        : "Premium features are now disabled.",
    })
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
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
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
      <main className="flex-1 container py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4">
            {/* Replace Image with ImageWithFallback in the main product image section */}
            <div className="aspect-square overflow-hidden rounded-lg border">
              <ImageWithFallback
                src={selectedImage || product.image}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
                fallbackSrc="/placeholder.svg?height=500&width=500&text=Product+Image"
              />
            </div>
            <div className="flex gap-4 overflow-auto pb-2">
              {/* Replace Image with ImageWithFallback in the thumbnail section */}
              {product.images &&
                product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                      selectedImage === image ? "ring-2 ring-green-600" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <ImageWithFallback
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      fallbackSrc="/placeholder.svg?height=80&width=80&text=Thumbnail"
                    />
                  </button>
                ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Link href={`/store/${product.storeId}`} className="text-sm font-medium text-green-600 hover:underline">
                {product.store}
              </Link>
              <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating || 4.5} ({product.reviews || 28} reviews)
                </span>
              </div>

              {/* Quantity information - made more prominent */}
              <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">Quantity/Unit:</span>
                  <span className="ml-2">{product.quantityDescription || "1 item"}</span>
                </div>
              </div>

              {/* Price display with negotiated price if available */}
              <div className="mt-4 flex items-center gap-3">
                {getNegotiatedPrice() !== null && (
                  <>
                    <div className="text-3xl font-bold text-green-600">{getNegotiatedPrice()} FCFA</div>
                    <div className="text-xl text-muted-foreground line-through">{product.price} FCFA</div>
                    <Badge variant="outline" className="ml-1">
                      {Math.round(((product.price - getNegotiatedPrice()!) / product.price) * 100)}% off
                    </Badge>
                  </>
                )}
                {getNegotiatedPrice() === null && (
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">{product.price} FCFA</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-2 text-sm text-muted-foreground flex items-center">
                            per {product.unit || "item"}
                            <Info className="h-3 w-3 ml-1" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price is for {product.quantityDescription}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              {getNegotiatedPrice() !== null && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">
                    Your negotiated price has been applied! This discount is temporary and will reset when you close
                    your browser.
                  </span>
                </div>
              )}

              <p className="mt-4 text-muted-foreground">{product.description}</p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500 text-right">
                Total: {(getCurrentPrice() * quantity).toLocaleString()} FCFA
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsBiddingModalOpen(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Make an Offer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Demo toggle for premium status */}
              <div className="mt-4 flex justify-center">
                <Button variant="ghost" size="sm" onClick={togglePremiumStatus} className="text-xs">
                  {isPremiumUser ? "Disable Premium (Demo)" : "Enable Premium (Demo)"}
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Store</span>
                <Link href={`/store/${product.storeId}`} className="text-green-600 hover:underline">
                  {product.store}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity/Unit</span>
                <span>{product.quantityDescription || "1 item"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>{product.longDescription}</p>
                    <h3>Product Details</h3>
                    <ul>
                      <li>Freshly harvested from local farms</li>
                      <li>No preservatives or artificial additives</li>
                      <li>Rich in essential nutrients</li>
                      <li>Perfect for traditional Cameroonian dishes</li>
                      <li>
                        <strong>Quantity/Unit:</strong> {product.quantityDescription || "1 item"}
                      </li>
                      <li>
                        <strong>Price:</strong> {product.price} FCFA per {product.unit || "item"}
                      </li>
                    </ul>
                    <h3>Storage Instructions</h3>
                    <p>
                      Store in a cool, dry place. For best results, refrigerate after opening and consume within a few
                      days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="pb-6 border-b last:border-0">
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
                                    className={`h-4 w-4 ${j < 5 - i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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
                            ? "Excellent quality! The product was fresh and exactly as described. Will definitely buy again."
                            : i === 1
                              ? "Good product, but the delivery took longer than expected. The quality was good though."
                              : "Average product. Nothing special but it gets the job done."}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <Link href={`/product/${relatedProduct.id}`} className="block">
                  {/* Replace Image with ImageWithFallback in the related products section */}
                  <ImageWithFallback
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                    fallbackSrc="/placeholder.svg?height=200&width=200&text=Related+Product"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{relatedProduct.name}</h3>
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-bold">{relatedProduct.price} FCFA</span>
                          <span className="text-xs text-muted-foreground ml-1">/{relatedProduct.unit || "item"}</span>
                        </div>
                        <span className="text-green-600 hover:text-green-700 text-sm">View Details</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{relatedProduct.quantityDescription}</div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Bidding Modal */}
      <BiddingModal
        isOpen={isBiddingModalOpen}
        onClose={() => setIsBiddingModalOpen(false)}
        product={product}
        isPremiumUser={isPremiumUser}
        onBidAccepted={handleBidAccepted}
      />

      <Toaster />
    </div>
  )
}
