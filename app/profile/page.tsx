"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Loader2, User, ShoppingBag, Package, MapPin, Phone, Mail, Edit2, CreditCard, Heart, History, Settings, Shield, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserData = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  type: "customer" | "store"
  avatar: string
  createdAt: string
  loyaltyPoints?: number
  preferredLanguage?: "en" | "fr"
  preferredCurrency?: "XAF" | "USD"
  hasStoreAccount?: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Check authentication and load user data
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkAuth = () => {
      const userDataString = localStorage.getItem("currentUser")
      const authToken = localStorage.getItem("authToken")
      
      if (userDataString && authToken) {
        try {
          const parsedUser = JSON.parse(userDataString)
          setUserData(parsedUser)
          setIsLoading(false)
        } catch (error) {
          console.error("Error parsing user data:", error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        localStorage.removeItem('currentUser')
        localStorage.removeItem('authToken')
        
        toast.success("Logged out successfully", {
          description: "You have been logged out of your account.",
        })
        
        window.location.href = '/'
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Logout Failed", {
        description: "Failed to log out. Please try again.",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to view your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You need to be logged in to access this page.</p>
              <Button onClick={() => router.push('/auth/login')} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
            <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone || 'Not provided'}</span>
                  </div>
                </div>
            </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/profile/edit')}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2"
            >
              {isLoggingOut ? (
                <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                      <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-col h-full w-full">
                      <TabsTrigger
                        value="overview"
                        className="w-full justify-start gap-2"
                      >
                        <User className="h-4 w-4" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="orders"
                        className="w-full justify-start gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </TabsTrigger>
                      <TabsTrigger
                        value="wishlist"
                        className="w-full justify-start gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </TabsTrigger>
                      <TabsTrigger
                        value="payment"
                        className="w-full justify-start gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Payment Methods
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="w-full justify-start gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
          </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsContent value="overview" className="space-y-4">
                  {/* Account Summary */}
            <Card>
              <CardHeader>
                      <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-sm text-green-600 font-medium">Loyalty Points</div>
                          <div className="text-2xl font-bold text-green-700 mt-1">
                            {userData.loyaltyPoints || 0}
                    </div>
                  </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium">Total Orders</div>
                          <div className="text-2xl font-bold text-blue-700 mt-1">0</div>
                    </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-purple-600 font-medium">Wishlist Items</div>
                          <div className="text-2xl font-bold text-purple-700 mt-1">0</div>
                  </div>
                </div>
              </CardContent>
            </Card>

                  {/* Delivery Address */}
            <Card>
              <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">{userData.address || 'No address provided'}</p>
                          <p className="text-sm text-muted-foreground">
                            {userData.city && userData.region 
                              ? `${userData.city}, ${userData.region}`
                              : 'Location not specified'}
                          </p>
                  </div>
                </div>
              </CardContent>
            </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <History className="h-4 w-4" />
                          <span>No recent activity</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                      <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your orders will appear here once you make a purchase.
                  </p>
                  <Button className="mt-4" onClick={() => router.push('/products')}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Save items you like to your wishlist for later.
                        </p>
                        <Button className="mt-4" onClick={() => router.push('/products')}>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Browse Products
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No payment methods</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Add a payment method to make checkout faster.
                        </p>
                        <Button className="mt-4" onClick={() => router.push('/profile/payment')}>
                          Add Payment Method
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Preferred Language</Label>
                          <div className="flex gap-2">
                            <Button variant={userData.preferredLanguage === 'en' ? 'default' : 'outline'}>
                              English
                            </Button>
                            <Button variant={userData.preferredLanguage === 'fr' ? 'default' : 'outline'}>
                              Français
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label>Preferred Currency</Label>
                          <div className="flex gap-2">
                            <Button variant={userData.preferredCurrency === 'XAF' ? 'default' : 'outline'}>
                              XAF
                            </Button>
                            <Button variant={userData.preferredCurrency === 'USD' ? 'default' : 'outline'}>
                              USD
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Store Owner Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Store Owner Account
                      </CardTitle>
                      <CardDescription>
                        Manage your store or create a new one
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.hasStoreAccount ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Shield className="h-4 w-4" />
                              <span>You have an active store account</span>
                            </div>
                            <Button 
                              className="w-full"
                              onClick={() => router.push('/store/dashboard')}
                            >
                              <Store className="h-4 w-4 mr-2" />
                              Continue as Store Owner
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Shield className="h-4 w-4" />
                              <span>You don't have a store account yet</span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                className="w-full"
                                asChild
                              >
                                <Link href="/auth/register">
                                  <Store className="h-4 w-4 mr-2" />
                                  Create Store Account
                                </Link>
                              </Button>
                              <Button 
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <Link href="/auth/login">
                                  <LogOut className="h-4 w-4 mr-2" />
                                  Login as Store Owner
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
