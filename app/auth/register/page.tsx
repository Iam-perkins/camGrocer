"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { StoreVerificationFlow } from "@/components/store-verification-flow"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams?.get("type") || "customer"
  const [accountType, setAccountType] = useState(defaultType)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showVerification, setShowVerification] = useState(false)

  // Customer form state and validation
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "Buea",
    region: "Southwest Region",
  });
  
  const [validation, setValidation] = useState({
    email: { error: "", loading: false, valid: false },
    phone: { error: "", loading: false, valid: false },
  });
  
  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  // Check if email or phone already exists
  const checkAvailability = async (field: 'email' | 'phone', value: string) => {
    if (!value) return;
    
    try {
      setValidation(prev => ({
        ...prev,
        [field]: { ...prev[field], loading: true, error: "", valid: false }
      }));
      
      const response = await fetch('/api/auth/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      const data = await response.json();
      
      if (data[field]?.exists) {
        setValidation(prev => ({
          ...prev,
          [field]: { 
            ...prev[field], 
            error: data[field].message,
            loading: false,
            valid: false
          }
        }));
      } else {
        setValidation(prev => ({
          ...prev,
          [field]: { 
            ...prev[field], 
            error: "", 
            loading: false, 
            valid: true 
          }
        }));
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setValidation(prev => ({
        ...prev,
        [field]: { 
          ...prev[field], 
          error: 'Error checking availability',
          loading: false 
        }
      }));
    }
  };
  
  // Debounced version of checkAvailability
  const debouncedCheckEmail = debounce((value: string) => checkAvailability('email', value), 500);
  const debouncedCheckPhone = debounce((value: string) => checkAvailability('phone', value), 500);
  
  // Handle customer input changes with validation
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [id]: value }));
    
    // Check email availability when email changes
    if (id === 'email' && value) {
      debouncedCheckEmail(value);
    }
    
    // Check phone availability when phone changes
    if (id === 'phone' && value) {
      debouncedCheckPhone(value);
    }
  };

  // Store form state
  const [storeForm, setStoreForm] = useState({
    storeName: "",
    email: "",
    password: "",
    phone: "",
    location: "Buea, Southwest Region, Cameroon",
    storeType: "general",
    description: "",
  })



  // Handle store form changes with validation
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setStoreForm(prev => ({ ...prev, [id]: value }));
    
    // Check email availability when email changes
    if (id === 'email' && value) {
      debouncedCheckEmail(value);
    }
    
    // Check phone availability when phone changes
    if (id === 'phone' && value) {
      debouncedCheckPhone(value);
    }
  };

  const handleStoreTypeChange = (value: string) => {
    setStoreForm((prev) => ({ ...prev, storeType: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleStoreInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure location includes Buea, Cameroon
    if (!storeForm.location.toLowerCase().includes('buea')) {
      toast.warning("Invalid Location", {
        description: "Store location must be in Buea, Cameroon.",
        duration: 5000,
      });
      return;
    }

    // Validate store form
    if (!storeForm.storeName || !storeForm.email || !storeForm.password || !storeForm.phone || !storeForm.location) {
      toast.warning("Missing Information", {
        description: "Please fill in all required fields to continue.",
        duration: 5000,
      });
      return;
    }

    // Show verification flow
    setShowVerification(true)
  }

  const handleVerificationComplete = (storeData: any) => {
    // Show success message
    toast.success("Verification Submitted", {
      description: "Your store verification request has been submitted for review. You will receive an email once your account is approved.",
      duration: 5000,
    });

    // Redirect to login page
    router.push("/auth/login")
  }

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure address includes Buea, Cameroon
    const fullAddress = `${customerForm.address}, Buea, Southwest Region, Cameroon`;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'customer',
          ...customerForm,
          address: fullAddress,
          city: 'Buea',
          region: 'Southwest Region',
          country: 'Cameroon'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()

      toast.success("Account Created", {
        description: "Your account has been created successfully. Please log in to continue.",
        duration: 5000,
      });

      setIsSubmitting(false)
      router.push("/auth/login")
    } catch (error) {
      toast.error("Registration Failed", {
        description: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        duration: 5000,
      });
      setIsSubmitting(false)
    }
  }

  // Check if we should disable the next/submit button
  const isCustomerFormValid = () => {
    if (currentStep === 1) {
      return (
        !customerForm.name || 
        !customerForm.email || 
        !customerForm.password || 
        !customerForm.phone ||
        validation.email.loading ||
        validation.phone.loading ||
        !!validation.email.error ||
        !!validation.phone.error
      );
    }
    return !customerForm.address;
  };

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
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={customerForm.email}
                              onChange={handleCustomerChange}
                              className={validation.email.error ? 'border-red-500' : ''}
                              required
                            />
                            <div className="absolute right-3 top-3 flex items-center">
                              {validation.email.loading && (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              )}
                              {validation.email.valid && !validation.email.error && !validation.email.loading && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            {validation.email.error && (
                              <p className="mt-1 text-sm text-red-500">{validation.email.error}</p>
                            )}
                          </div>
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
                          <div className="relative">
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+237 6XX XXX XXX"
                              value={customerForm.phone}
                              onChange={handleCustomerChange}
                              className={validation.phone.error ? 'border-red-500' : ''}
                              required
                            />
                            <div className="absolute right-3 top-3 flex items-center">
                              {validation.phone.loading && (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              )}
                              {validation.phone.valid && !validation.phone.error && !validation.phone.loading && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            {validation.phone.error && (
                              <p className="mt-1 text-sm text-red-500">{validation.phone.error}</p>
                            )}
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isCustomerFormValid()}>
                            Next: Delivery Information
                          </Button>
                        </motion.div>
                      </form>
                    ) : (
                      <form onSubmit={handleCustomerSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="address">Delivery Address in Buea</Label>
                          <Input
                            id="address"
                            placeholder="e.g., 123 Molyko Street"
                            value={customerForm.address}
                            onChange={handleCustomerChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value="Buea"
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            value="Southwest Region"
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          We currently only serve Buea, Southwest Region, Cameroon
                        </p>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                            Back
                          </Button>
                          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={isSubmitting || isCustomerFormValid()}
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
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="contact@yourstore.com"
                            value={storeForm.email}
                            onChange={handleStoreChange}
                            className={validation.email.error ? 'border-red-500' : ''}
                            required
                          />
                          <div className="absolute right-3 top-3 flex items-center">
                            {validation.email.loading && (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            )}
                            {validation.email.valid && !validation.email.error && !validation.email.loading && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {validation.email.error && (
                            <p className="mt-1 text-sm text-red-500">{validation.email.error}</p>
                          )}
                        </div>
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
                        <div className="relative">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+237 6XX XXX XXX"
                            value={storeForm.phone}
                            onChange={handleStoreChange}
                            className={validation.phone.error ? 'border-red-500' : ''}
                            required
                          />
                          <div className="absolute right-3 top-3 flex items-center">
                            {validation.phone.loading && (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            )}
                            {validation.phone.valid && !validation.phone.error && !validation.phone.loading && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {validation.phone.error && (
                            <p className="mt-1 text-sm text-red-500">{validation.phone.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Store Location in Buea</Label>
                        <Input
                          id="location"
                          placeholder="e.g., 123 Molyko Street, Buea"
                          value={storeForm.location}
                          onChange={handleStoreChange}
                          required
                        />
                        <p className="text-sm text-gray-500">
                          Your store must be located in Buea, Southwest Region, Cameroon
                        </p>
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
