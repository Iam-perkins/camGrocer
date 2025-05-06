"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { StoreVerificationFlow } from "@/components/store-verification-flow"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "customer"
  const [accountType, setAccountType] = useState(defaultType)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showVerification, setShowVerification] = useState(false)

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    region: "",
  })

  // Store form state
  const [storeForm, setStoreForm] = useState({
    storeName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    storeType: "general",
    description: "",
  })

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCustomerForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setStoreForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleStoreTypeChange = (value: string) => {
    setStoreForm((prev) => ({ ...prev, storeType: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleStoreInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate store form
    if (!storeForm.storeName || !storeForm.email || !storeForm.password || !storeForm.phone || !storeForm.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Show verification flow
    setShowVerification(true)
  }

  const handleVerificationComplete = (storeData: any) => {
    // Save store data to localStorage (simulating database)
    const storeUserData = {
      ...storeForm,
      ...storeData,
      id: `store_${Date.now()}`,
      type: "store",
      createdAt: new Date().toISOString(),
      isVerified: false,
      verificationStatus: "pending",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(storeForm.storeName)}&background=27AE60&color=fff`,
    }

    localStorage.setItem("currentUser", JSON.stringify(storeUserData))
    localStorage.setItem(`user_${storeUserData.id}`, JSON.stringify(storeUserData))

    toast({
      title: "Verification submitted",
      description: "Your store verification request has been submitted for review.",
    })

    // Redirect to verification pending page
    router.push("/auth/verification-pending")
  }

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      // Save customer data to localStorage (simulating database)
      const userData = {
        ...customerForm,
        id: `user_${Date.now()}`,
        type: "customer",
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerForm.name)}&background=0D8ABC&color=fff`,
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))
      localStorage.setItem(`user_${userData.id}`, JSON.stringify(userData))

      toast({
        title: "Account created successfully",
        description: "Welcome to CamGrocer! You are now logged in.",
      })

      setIsSubmitting(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </motion.div>
        <span className="text-lg font-bold">CamGrocer</span>
      </Link>

      <ScrollReveal>
        {showVerification ? (
          <StoreVerificationFlow
            initialData={{
              name: storeForm.storeName,
              email: storeForm.email,
              phone: storeForm.phone,
              storeName: storeForm.storeName,
              storeType: storeForm.storeType,
              description: storeForm.description,
              location: storeForm.location,
            }}
            onComplete={handleVerificationComplete}
          />
        ) : (
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                  Sign up to {accountType === "store" ? "sell your groceries" : "start shopping"} on CamGrocer
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Tabs defaultValue={accountType} onValueChange={setAccountType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                    <TabsTrigger value="store">Store Owner</TabsTrigger>
                  </TabsList>

                  {/* Customer Registration Form */}
                  <TabsContent value="customer">
                    {currentStep === 1 ? (
                      <form onSubmit={handleNextStep} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={customerForm.name}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={customerForm.email}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={customerForm.password}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            value={customerForm.phone}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Next: Delivery Information
                          </Button>
                        </motion.div>
                      </form>
                    ) : (
                      <form onSubmit={handleCustomerSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="address">Delivery Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street"
                            value={customerForm.address}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Yaoundé"
                            value={customerForm.city}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            placeholder="Centre Region"
                            value={customerForm.region}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                            Back
                          </Button>
                          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating Account...
                                </>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </form>
                    )}
                  </TabsContent>

                  {/* Store Registration Form */}
                  <TabsContent value="store">
                    <form onSubmit={handleStoreInitialSubmit} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                          id="storeName"
                          placeholder="My Grocery Store"
                          value={storeForm.storeName}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="store@example.com"
                          value={storeForm.email}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={storeForm.password}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+237 6XX XXX XXX"
                          value={storeForm.phone}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Store Location</Label>
                        <Input
                          id="location"
                          placeholder="Yaoundé, Cameroon"
                          value={storeForm.location}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Store Description</Label>
                        <Input
                          id="description"
                          placeholder="Tell customers about your store"
                          value={storeForm.description}
                          onChange={handleStoreChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Store Type</Label>
                        <RadioGroup defaultValue={storeForm.storeType} onValueChange={handleStoreTypeChange}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="general" id="general" />
                            <Label htmlFor="general">General Grocery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fruits" id="fruits" />
                            <Label htmlFor="fruits">Fruits & Vegetables</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spices" id="spices" />
                            <Label htmlFor="spices">Spices & Grains</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="meat" id="meat" />
                            <Label htmlFor="meat">Meat & Fish</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                          Continue to Verification
                        </Button>
                      </motion.div>
                      <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
                        <p className="text-xs text-amber-800">
                          <strong>Note:</strong> Store owners must complete a verification process before being
                          approved. Please have your business registration documents and ID ready for verification.
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  )
}
