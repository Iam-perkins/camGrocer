"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"

export function CartButton() {
  const { cartCount } = useCart()

  return (
    <Link href="/cart" className="relative">
      <Button variant="outline" size="icon">
        <ShoppingCart className="h-4 w-4" />
        <span className="sr-only">Cart</span>
      </Button>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  )
}
