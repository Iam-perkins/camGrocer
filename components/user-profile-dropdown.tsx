"use client"

import { useState, useEffect, useRef } from "react"
import { getCartCount } from "@/lib/cart-utils"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  CreditCard,
  MapPin,
  Store,
  Package,
  Bell,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface UserData {
  id: string
  name?: string
  storeName?: string
  email: string
  type: "customer" | "store"
  avatar: string
  isVerified?: boolean
  verificationStatus?: "pending" | "approved" | "rejected"
}

export function UserProfileDropdown() {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // Get user data from localStorage
    const loadUserData = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const userDataString = localStorage.getItem("currentUser")
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString)
          setUserData(parsedUserData)
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }

    // Load cart count using the utility function
    const loadCartCount = () => {
      setCartItemCount(getCartCount())
    }

    // Initial load
    loadUserData()
    loadCartCount()

    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        loadUserData()
      } else if (e.key === 'cartItems') {
        loadCartCount()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Remove user data from localStorage
      localStorage.removeItem("currentUser")
      
      // Clear cart items
      localStorage.removeItem("cartItems")
      localStorage.removeItem("currentStore")
      
      // Reset states
      setUserData(null)
      setCartItemCount(0)
      
      // Show toast notification
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      
      // Redirect to home page
      router.push("/")
      
      // Close dropdown
      setIsOpen(false)
      
      // Force a refresh of the page to reset all states
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </motion.div>
        </Link>

        <Link href="/auth/register">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm">Sign Up</Button>
          </motion.div>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border p-1 focus:outline-none"
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src={userData.avatar || "/placeholder.svg"}
            alt={userData.name || userData.storeName || "User"}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
          {userData.type === "store" && userData.verificationStatus === "approved" && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
          )}
          {userData.type === "store" && userData.verificationStatus === "pending" && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-amber-500 border-2 border-white" />
          )}
        </div>
        <span className="hidden text-sm font-medium md:block">{userData.name || userData.storeName}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-lg border bg-background shadow-lg"
          >
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name || userData.storeName || "User"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{userData.name || userData.storeName}</p>
                    {userData.type === "store" && userData.verificationStatus === "approved" && (
                      <Badge className="ml-1 bg-blue-500 text-white text-xs">Verified</Badge>
                    )}
                    {userData.type === "store" && userData.verificationStatus === "pending" && (
                      <Badge className="ml-1 bg-amber-500 text-white text-xs">Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {userData.type === "customer" ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </motion.div>
                  </Link>
                  <Link href="/profile?tab=orders" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>My Orders</span>
                    </motion.div>
                  </Link>
                  <Link href="/profile?tab=wishlist" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>Wishlist</span>
                    </motion.div>
                  </Link>
                  <Link href="/profile?tab=addresses" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Addresses</span>
                    </motion.div>
                  </Link>
                  <Link href="/profile?tab=payment" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Payment Methods</span>
                    </motion.div>
                  </Link>
                </>
              ) : userData.verificationStatus === "pending" ? (
                <>
                  <Link href="/auth/verification-pending" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>Verification Status</span>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                    >
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span>Store Dashboard</span>
                    </motion.div>
                  </Link>
                </>
              )}

              <Link href="/notifications" onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                >
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>Notifications</span>
                </motion.div>
              </Link>

              <Link href="/profile?tab=account" onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </motion.div>
              </Link>

              <div className="my-1 border-t"></div>

              <motion.button
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
