"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, CreditCard, MapPin, ShoppingBag, Navigation, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapLocationPicker } from "@/components/map-location-picker"
import { useLanguage } from "@/contexts/language-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [paymentMethod, setPaymentMethod] = useState("mobile-money")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentStore, setCurrentStore] = useState<string | null>(null)
  const [deliveryPaymentComplete, setDeliveryPaymentComplete] = useState(false)
  const [mobileNumber, setMobileNumber] = useState("")
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  // Define order item type
  type OrderItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    storeId: string;
    storeName: string;
  };

  // Define order data type
  type OrderData = {
    items: OrderItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    status: string;
    deliveryInstructions: string;
    storeIds: string[];
  };

  const [orderResult, setOrderResult] = useState<{orderId: string; orderNumber: string} | null>(null)
  const [addressDetails, setAddressDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "Yaoundé",
    region: "Centre",
    instructions: "",
  })

  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    const savedStore = localStorage.getItem("currentStore")

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCartItems(parsedCart)
    }

    if (savedStore) {
      setCurrentStore(savedStore)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setAddressDetails((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location)
    setUseCurrentLocation(true)
    // Clear any previous location error when user selects a location
    if (location) {
      setLocationError(null)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = cartItems.length > 0 ? 1000 : 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate location
      if (!currentLocation) {
        setLocationError(
          language === 'en'
            ? 'Please select a delivery location on the map or from the dropdown.'
            : 'Veuillez sélectionner un lieu de livraison sur la carte ou dans le menu déroulant.'
        );
        // Scroll to location section
        document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Prepare order data with location
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          storeId: item.storeId,
          storeName: item.storeName
        })),
        subtotal,
        shippingFee: deliveryFee,
        total,
        paymentMethod: paymentMethod || 'cash', // Default to cash if not specified
        // Customer information
        userId: `guest_${Math.random().toString(36).substr(2, 9)}`,
        customerName: `${addressDetails.firstName || ''} ${addressDetails.lastName || ''}`.trim() || 'Guest Customer',
        customerEmail: 'guest@example.com',
        customerPhone: addressDetails.phone || '000000000',
        // Shipping information
        shippingAddress: {
          street: addressDetails.address || 'Not specified',
          city: 'Buea',
          state: 'Southwest',
          country: 'Cameroon',
          postalCode: '0000',
          coordinates: currentLocation ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng
          } : undefined
        },
        status: 'pending',
        paymentStatus: 'pending',
        deliveryInstructions: addressDetails.instructions || '',
        // Extract unique store IDs from items
        storeIds: [...new Set(cartItems.map(item => item.storeId))],
        // Add timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Log the order data being sent
      console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));

      // Send order to API
      let orderResponse;
      try {
        orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData),
        });

        const responseData = await orderResponse.json().catch(() => ({}));
        console.log('Order API response:', {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          data: responseData
        });

        if (!orderResponse.ok) {
          let errorMessage = `Failed to create order (${orderResponse.status} ${orderResponse.statusText})`;
          if (responseData.error) {
            errorMessage = responseData.error;
            if (responseData.details) {
              errorMessage += `: ${JSON.stringify(responseData.details)}`;
            }
          } else if (orderResponse.status === 400) {
            errorMessage = 'Invalid order data. Please check your information and try again.';
            if (responseData.message) {
              errorMessage += ` ${responseData.message}`;
            }
          } else if (orderResponse.status === 500) {
            errorMessage = 'Server error. Please try again later.';
            if (responseData.message) {
              errorMessage += ` ${responseData.message}`;
            }
          }
          throw new Error(errorMessage);
        }

        return responseData;
      } catch (error) {
        console.error('Error creating order:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred while creating the order');
      }

      const result = await orderResponse.json()
      setOrderResult({
        orderId: result.orderId,
        orderNumber: result.orderNumber
      })

      // Clear cart after successful order
      localStorage.removeItem("cartItems")
      localStorage.removeItem("currentStore")
      
      // Show success dialog with order details
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    }
  }

  const simulateDeliveryPayment = () => {
    // In a real app, this would integrate with MTN/Orange Money API
    if (mobileNumber.length < 9) {
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      setDeliveryPaymentComplete(true)
    }, 1500)
  }

  if (cartItems.length === 0) {
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
                <Button variant="outline" size="sm">
                  {t("backToCart")}
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-10">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{t("emptyCart")}</h2>
            <p className="text-muted-foreground mb-6">{t("addItems")}</p>
            <Link href="/browse">
              <Button className="bg-green-600 hover:bg-green-700">{t("browseProducts")}</Button>
            </Link>
          </div>
        </main>
      </div>
    )
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
              <Button variant="outline" size="sm">
                {t("backToCart")}
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t("deliveryAddress")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstName")}</Label>
                      <Input id="firstName" value={addressDetails.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastName")}</Label>
                      <Input id="lastName" value={addressDetails.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={addressDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div id="location-section" className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium">{t("deliveryLocation")} <span className="text-red-500">*</span></h3>
                      </div>
                    </div>

                    {/* Map Location Picker Component */}
                    <div className="mb-4">
                      <MapLocationPicker 
                        onLocationChange={handleLocationChange} 
                        height="300px" 
                        language={language} 
                      />
                      {locationError && (
                        <p className="mt-2 text-sm text-red-600">{locationError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">{t("streetAddress")}</Label>
                      <Textarea
                        id="address"
                        placeholder={
                          language === "en" ? "Street address, apartment, etc." : "Adresse, appartement, etc."
                        }
                        value={addressDetails.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input 
                          id="city" 
                          value="Buea" 
                          readOnly 
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' 
                            ? 'Currently only delivering within Buea' 
                            : 'Livraison actuellement uniquement à Buea'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">{t("region")}</Label>
                        <Input 
                          id="region" 
                          value="Southwest" 
                          readOnly 
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' 
                            ? 'Buea is in the Southwest region' 
                            : 'Buea se trouve dans la région du Sud-Ouest'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">
                      {t("instructions")} ({t("optional")})
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder={
                        language === "en"
                          ? "Special instructions for delivery"
                          : "Instructions spéciales pour la livraison"
                      }
                      value={addressDetails.instructions}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t("paymentMethod")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-6 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      {language === "en" ? "Important Payment Information" : "Informations importantes sur le paiement"}
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">{t("paymentInfo")}</AlertDescription>
                  </Alert>

                  <div className="mb-6 border rounded-lg p-4 bg-green-50/50">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                        1
                      </div>
                      {t("deliveryFeePayment")}
                      <span className="text-sm text-green-600 font-normal ml-2">({t("required")})</span>
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      {language === "en"
                        ? `Pay the delivery fee (${deliveryFee} FCFA) to confirm your order and notify the store.`
                        : `Payez les frais de livraison (${deliveryFee} FCFA) pour confirmer votre commande et notifier le magasin.`}
                    </p>

                    {!deliveryPaymentComplete ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 border rounded-lg p-3 bg-white">
                          <div className="flex gap-2">
                            <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              MTN
                            </div>
                            <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              OM
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{t("mobileMoneyPayment")}</div>
                            <div className="text-sm text-muted-foreground">
                              {language === "en"
                                ? "MTN Mobile Money or Orange Money"
                                : "MTN Mobile Money ou Orange Money"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile-number">{t("phoneNumber")}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="mobile-number"
                              type="tel"
                              placeholder="+237 6XX XXX XXX"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              required
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={simulateDeliveryPayment}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={mobileNumber.length < 9}
                            >
                              {language === "en" ? `Pay ${deliveryFee} FCFA` : `Payer ${deliveryFee} FCFA`}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-100 border border-green-200 rounded-md p-3 text-green-700 flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        <div>
                          <p className="font-medium">
                            {language === "en"
                              ? "Delivery Fee Payment Complete"
                              : "Paiement des frais de livraison terminé"}
                          </p>
                          <p className="text-sm">
                            {language === "en"
                              ? "Your order will be sent to the store for processing."
                              : "Votre commande sera envoyée au magasin pour traitement."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs">
                        2
                      </div>
                      {t("productPayment")}
                      <span className="text-sm text-gray-600 font-normal ml-2">({subtotal} FCFA)</span>
                    </h3>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mt-4">
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="mobile-money" id="mobile-money" />
                        <Label htmlFor="mobile-money" className="flex-1 cursor-pointer">
                          <div className="font-medium">
                            {language === "en" ? "Pay Now with Mobile Money" : "Payer maintenant avec Mobile Money"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === "en"
                              ? "Complete your payment now with MTN or Orange Money"
                              : "Complétez votre paiement maintenant avec MTN ou Orange Money"}
                          </div>
                        </Label>
                        <div className="flex gap-2">
                          <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            MTN
                          </div>
                          <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            OM
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="font-medium">{t("cashOnDelivery")}</div>
                          <div className="text-sm text-muted-foreground">
                            {language === "en"
                              ? "Pay when you receive your order"
                              : "Payez à la réception de votre commande"}
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "mobile-money" && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-mobile-number">{t("phoneNumber")}</Label>
                          <Input
                            id="product-mobile-number"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            defaultValue={mobileNumber}
                            required={paymentMethod === "mobile-money"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!deliveryPaymentComplete}
              >
                {!deliveryPaymentComplete
                  ? language === "en"
                    ? "Complete Delivery Payment First"
                    : "Complétez d'abord le paiement de la livraison"
                  : language === "en"
                    ? `Place Order (${paymentMethod === "cash" ? "Pay " + subtotal + " FCFA on Delivery" : "Pay Now"})`
                    : `Passer la commande (${
                        paymentMethod === "cash" ? "Payer " + subtotal + " FCFA à la livraison" : "Payer maintenant"
                      })`}
              </Button>
            </form>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
                {currentStore && (
                  <div className="text-sm text-muted-foreground">
                    {language === "en" ? "From: " : "De: "}
                    <Link href={`/store/${cartItems[0]?.storeId}`} className="text-green-600 hover:underline">
                      {currentStore}
                    </Link>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{item.price * item.quantity} FCFA</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  <span>{subtotal} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("deliveryFee")}</span>
                  <span>{deliveryFee} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t("total")}</span>
                  <span>{total} FCFA</span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "By placing your order, you agree to our Terms of Service and Privacy Policy."
                    : "En passant votre commande, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité."}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been placed successfully. We'll notify you when it's on its way.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Order Number: {orderResult?.orderNumber}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Total: FCFA {total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Payment Method: {paymentMethod === 'mobile-money' ? 'Mobile Money' : 'Cash on Delivery'}
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={() => router.push(`/orders/${orderResult?.orderId}`)}
            >
              View Order Details
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
