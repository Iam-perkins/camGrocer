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
import { addToCart } from "@/lib/cart-utils"
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
  const [isClient, setIsClient] = useState(false)

  // Set client-side state after mount
  useEffect(() => {
    setIsClient(true)
    
    // Load negotiated prices from sessionStorage
    const savedNegotiatedPrices = sessionStorage.getItem("negotiatedPrices")
    if (savedNegotiatedPrices) {
      try {
        setNegotiatedPrices(JSON.parse(savedNegotiatedPrices))
      } catch (error) {
        console.error("Error parsing negotiated prices:", error)
      }
    }

    // Check premium status
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
  const [isCartLoaded, setIsCartLoaded] = useState(false)

  // Load cart data from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedCart = localStorage.getItem("cartItems")
      const savedStore = localStorage.getItem("currentStore")

      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }

      if (savedStore) {
        setCurrentStore(savedStore)
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
    } finally {
      setIsCartLoaded(true)
    }
  }, [])

  const handleAddToCart = () => {
    const currentPrice = getCurrentPrice();
    const productWithPrice = { ...product, price: currentPrice };
    
    const result = addToCart(productWithPrice, quantity);
    
    if (result.success) {
      // Update local state
      const updatedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(updatedCart);
      
      // Update current store if this is the first item
      if (updatedCart.length === 1) {
        setCurrentStore(product.store);
      }
      
      toast({
        title: result.message.includes('more') ? 'Updated cart' : 'Added to cart',
        description: result.message,
      });
    } else {
      // Show error message
      toast({
        title: 'Cannot add to cart',
        description: result.message,
        variant: 'destructive',
      });
    }
  }

  // Handle bid acceptance with client-side storage
  const handleBidAccepted = (productId: number, newPrice: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Update negotiated prices
      const updatedPrices = [
        ...negotiatedPrices.filter((item) => item.productId !== productId),
        { productId, price: newPrice },
      ]
      
      setNegotiatedPrices(updatedPrices)

      // Save to sessionStorage
      sessionStorage.setItem("negotiatedPrices", JSON.stringify(updatedPrices))

      // Show a more prominent success message
      toast({
        title: "Price updated!",
        description: `Your negotiated price of ${newPrice} FCFA for ${product.name} has been applied for this session.`,
        duration: 5000,
      })
    } catch (error) {
      console.error("Error saving negotiated price:", error);
      toast({
        title: "Error",
        description: "Failed to save the negotiated price. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Toggle premium user status with client-side storage
  const togglePremiumStatus = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const newStatus = !isPremiumUser;
      setIsPremiumUser(newStatus);
      
      // Save to sessionStorage
      sessionStorage.setItem("isPremiumUser", newStatus.toString());

      toast({
        title: newStatus ? "Premium activated" : "Premium deactivated",
        description: newStatus
          ? "You now have access to premium features like price negotiation."
          : "Premium features are now disabled.",
      });
    } catch (error) {
      console.error("Error updating premium status:", error);
      toast({
        title: "Error",
        description: "Failed to update premium status. Please try again.",
        variant: "destructive",
      });
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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <ImageWithFallback
                src={selectedImage || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                style={{ objectFit: 'contain' }}
                fallbackSrc="/placeholder.svg?height=600&width=600&text=Product+Image"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-3 overflow-x-auto py-2 px-1">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === image 
                        ? "ring-2 ring-green-600 border-transparent" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      style={{ objectFit: 'cover' }}
                      fallbackSrc="/placeholder.svg?height=80&width=80&text=Thumbnail"
                    />
                  </button>
                ))
              ) : (
                <div className="w-full text-center py-4 text-gray-500">
                  No additional images available
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Store Link */}
              <Link 
                href={`/store/${product.storeId}`} 
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                <span className="mr-2">🏪</span>
                {product.store}
              </Link>
              
              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-full">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 4.5) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1.5 text-sm font-medium text-gray-900">
                    {product.rating || 4.5}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews || 28} reviews)
                </span>
                {product.reviews > 10 && (
                  <span className="text-sm text-blue-600 font-medium">
                    🏆 Best Seller
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="mt-6 space-y-3">
                <div className="flex items-baseline gap-3">
                  {getNegotiatedPrice() !== null ? (
                    <>
                      <span className="text-3xl font-bold text-green-700">
                        {getNegotiatedPrice().toLocaleString()} FCFA
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                        Save {Math.round(((product.price - getNegotiatedPrice()!) / product.price) * 100)}%
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2 text-sm text-gray-500 flex items-center">
                              / {product.unit || "item"}
                              <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-[250px]">
                            <p className="text-sm">
                              Price is for {product.quantityDescription || '1 item'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </div>

                {getNegotiatedPrice() !== null && (
                  <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Your negotiated price has been applied! This discount is temporary and will reset when you close your browser.
                    </p>
                  </div>
                )}

                {/* Quantity Info */}
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {product.quantityDescription || "Standard quantity"}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {product.unit ? `Ships as ${product.unit}` : 'Ready to ship'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Select the quantity you need</p>
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none hover:bg-gray-100"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none hover:bg-gray-100"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
                
                {/* Total Price */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {(getCurrentPrice() * quantity).toLocaleString()} FCFA
                      </div>
                      {quantity > 1 && (
                        <div className="text-xs text-gray-500">
                          {getCurrentPrice().toLocaleString()} FCFA × {quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 text-base font-medium bg-green-600 hover:bg-green-700 transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart • {(getCurrentPrice() * quantity).toLocaleString()} FCFA
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
                  onClick={() => setIsBiddingModalOpen(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Make an Offer
                </Button>
                
                {/* Premium Badge */}
                {!isPremiumUser && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start">
                    <svg className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Want a better price?</p>
                      <p className="text-xs text-yellow-700 mt-0.5">
                        Become a premium member to unlock exclusive discounts and make offers on products.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Product Details */}
              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{product.category || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="text-sm font-medium text-gray-900">1-2 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Demo toggle for premium status */}
              <div className="mt-6 pt-4 border-t border-gray-200">
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
