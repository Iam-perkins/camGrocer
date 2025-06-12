"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface CartContextType {
  cartCount: number
  updateCartCount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  // Load cart count from localStorage on mount
  useEffect(() => {
    updateCartCount()
  }, [])

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    } catch (error) {
      console.error("Error updating cart count:", error)
      setCartCount(0)
    }
  }

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
