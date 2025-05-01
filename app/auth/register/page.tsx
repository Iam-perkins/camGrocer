"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "customer"
  const [accountType, setAccountType] = useState(defaultType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle registration here
    toast({
      title: "Account created",
      description: "Please complete the verification process to access your account.",
    })
    // Redirect to verification page instead of dashboard/browse
    router.push("/auth/verify")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-green-600" />
        <span className="text-lg font-bold">CamGrocer</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Sign up to {accountType === "store" ? "sell your groceries" : "start shopping"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Tabs defaultValue={accountType} onValueChange={setAccountType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="store">Store Owner</TabsTrigger>
              </TabsList>
              <TabsContent value="customer">
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+237 6XX XXX XXX" required />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="store">
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" placeholder="My Grocery Store" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="store-email">Email</Label>
                    <Input id="store-email" type="email" placeholder="store@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="store-password">Password</Label>
                    <Input id="store-password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="store-phone">Phone Number</Label>
                    <Input id="store-phone" type="tel" placeholder="+237 6XX XXX XXX" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="store-location">Store Location</Label>
                    <Input id="store-location" placeholder="Yaoundé, Cameroon" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Store Type</Label>
                    <RadioGroup defaultValue="general">
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
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Register Store
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
