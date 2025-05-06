"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Check if user exists in localStorage
      let foundUser = null

      // Iterate through localStorage to find matching user
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("user_")) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || "")
            if (userData.email === formData.email) {
              // In a real app, you would check password hash
              // For demo, we're just checking if email exists
              foundUser = userData
              break
            }
          } catch (error) {
            console.error("Failed to parse user data:", error)
          }
        }
      }

      if (foundUser) {
        // Check verification status for store owners
        if (foundUser.type === "store" && foundUser.verificationStatus === "pending") {
          // Store owner with pending verification
          localStorage.setItem("currentUser", JSON.stringify(foundUser))
          toast({
            title: "Login successful",
            description: "Your store account is still pending verification.",
          })
          router.push("/auth/verification-pending")
        } else {
          // Regular customer or verified store
          localStorage.setItem("currentUser", JSON.stringify(foundUser))
          toast({
            title: "Login successful",
            description: "Welcome back to CamGrocer!",
          })
          router.push("/")
        }
      } else {
        // User not found
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }

      setIsLoading(false)
    }, 1500)
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
                      "Sign in"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                Don't have an account?{" "}
                <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
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
