"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, Loader2, Store } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("customer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const accountType = searchParams?.get('accountType')
    if (accountType === 'store') {
      setActiveTab('store')
    }
  }, [searchParams])

  // Add console log for debugging
  console.log('Current search params:', searchParams?.toString() || '')
  console.log('Active tab:', activeTab)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    console.log('Attempting login with:', { email: formData.email, type: activeTab });

    try {
      console.log('Sending login request...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          type: activeTab
        }),
      })

      const data = await response.json()
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Extract user data from response
      const user = data.user || data;
      const userType = data.userType || user.type;
      const verificationStatus = data.verificationStatus || user.verificationStatus || (userType === 'store' ? 'approved' : 'verified');
      
      if (user) {
        user.verificationStatus = verificationStatus;
      }

      // Save user data to localStorage
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name || user.storeName,
        type: userType,
        verificationStatus: verificationStatus,
        storeId: user.storeId,
        status: verificationStatus === 'approved' ? 'approved' : 'pending',
        role: userType === 'store' ? 'store' : 'customer'
      };
      
      try {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('authToken', data.token || 'dummy-token');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        localStorage.clear();
        localStorage.setItem('currentUser', JSON.stringify({
          id: user._id,
          email: user.email,
          type: userType
        }));
        localStorage.setItem('authToken', data.token || 'dummy-token');
      }

      // Show success message
      toast.success(`Welcome back, ${userData.name}!`, {
        description: `You have successfully logged in to CamGrocer as a ${userType === 'store' ? 'store owner' : 'customer'}.`,
        duration: 3000,
      });

      // Handle redirection after successful login
      const redirectTo = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        
        if (userType === 'store') {
          if (verificationStatus === 'pending') {
            toast.warning("Account Pending", {
              description: "Your store account is pending verification. We'll notify you once approved.",
              duration: 5000,
            });
            return '/auth/verification-pending';
          } else if (verificationStatus === 'approved') {
            if (from && from.startsWith('/admin')) {
              return from;
            }
            return '/admin/dashboard';
          } else {
            toast.info("Account Review", {
              description: "Your account is currently under review. Please check back later.",
              duration: 5000,
            });
            return '/';
          }
        } else {
          return '/';
        }
      };
      
      const redirectUrl = redirectTo();
      window.location.href = redirectUrl;

    } catch (error) {
      console.error('Login error:', error)
      toast.error("Login Failed", {
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
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
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="store">Store Owner</TabsTrigger>
                </TabsList>
                <TabsContent value="customer">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                          "Sign in as Customer"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
                <TabsContent value="store">
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Store Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="store@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <Store className="mr-2 h-4 w-4" />
                            Sign in as Store Owner
                          </>
                    )}
                  </Button>
                </motion.div>
              </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                Don't have an account?{" "}
                <Link 
                  href={activeTab === 'store' ? '/auth/register?accountType=store' : '/auth/register'} 
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </ScrollReveal>
    </div>
  )
}
