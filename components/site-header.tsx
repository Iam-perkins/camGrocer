"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, ShoppingCart, Search, Menu, User, ImageIcon, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/use-translation"
import { useSearch } from "@/contexts/search-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { getCartCount } from "@/lib/cart-utils"

interface SiteHeaderProps {
  cartItemCount?: number;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

// Default translations as fallback
export function SiteHeader({ cartItemCount: initialCartCount = 0 }: SiteHeaderProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(initialCartCount)
  // Safe access to translation context
  const { t, language } = useTranslation()
  const { query, search, results, loading } = useSearch()

  useEffect(() => {
    setMounted(true)
    // Check if user is admin - in a real app, this would come from your auth system
    // For demo purposes, we'll just set it to true
    setIsAdmin(true)

    // Load initial cart count
    setCartItemCount(getCartCount())

    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        setCartItemCount(getCartCount())
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [language])

  // Use t function directly for translations
  const translations = {
    home: t('home'),
    browse: t('browse'),
    about: t('about'),
    contact: t('contact'),
    profile: t('profile'),
    cart: t('cart'),
    search_placeholder: t('search_placeholder'),
    images: t('images'),
    master_admin: t('master_admin')
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    search(value)
  }

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/browse", label: t("browse") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
    // { href: "/profile", label: t("profile") },
    { href: "/cart", label: t("cart") },
  ]

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-green-600" />
            <span className="text-xl font-bold hidden md:inline-block">CamGrocer</span>
          </div>
          <div className="flex-1" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 min-w-[120px]">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600 flex-shrink-0" />
            <span className="text-xl font-bold hidden md:inline-block">CamGrocer</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1 px-4 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        </nav>

        <div className="hidden md:flex items-center justify-center flex-1 px-4 lg:px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search_placeholder")}
              className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>

        {isSearchOpen && results.length > 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background border rounded-lg shadow-md max-h-[400px] overflow-auto z-50 w-[90vw] max-w-2xl">
            {loading ? (
              <div className="p-4 text-center">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                <span className="ml-2">{t('searching')}</span>
              </div>
            ) : (
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/product/${result.id}`}
                    className="block p-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{result.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {mounted && <LanguageSwitcher />}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
              </Button>
          <UserProfileDropdown />
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">{t("cart")}</span>
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("search_placeholder")}
                    className="w-full pl-8"
                    value={query}
                    onChange={handleSearchChange}
                  />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
