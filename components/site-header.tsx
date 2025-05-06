"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LocationSelector } from "@/components/location-selector"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

interface SiteHeaderProps {
  cartItemCount?: number
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function SiteHeader({ cartItemCount = 0, searchQuery = "", onSearchChange }: SiteHeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const prevScrollPosRef = useRef(0)
  const [visible, setVisible] = useState(true)
  const { t } = useLanguage()

  // Determine if we're on an admin page
  const isAdminPage = pathname.startsWith("/admin")

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // Determine if we've scrolled past a threshold
      setScrolled(currentScrollPos > 10)

      // Hide/show header based on scroll direction
      setVisible(prevScrollPosRef.current > currentScrollPos || currentScrollPos < 10)

      // Update the ref instead of state
      prevScrollPosRef.current = currentScrollPos
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-sm" : "bg-background"
      }`}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </motion.div>
            <motion.span
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              CameroonGrocer
            </motion.span>
          </Link>
          <div className="ml-2 hidden sm:flex items-center">
            <LocationSelector />
          </div>
        </motion.div>

        {!isAdminPage && (
          <>
            <motion.div
              className="hidden md:flex md:flex-1 md:items-center md:justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for groceries..."
                  className="w-full pl-8 md:w-[300px] lg:w-[400px] transition-all duration-300 focus:md:w-[350px] focus:lg:w-[450px]"
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.nav
              className="hidden md:flex items-center gap-6 mr-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { href: "/", label: t("home") },
                { href: "/browse", label: t("browse") },
                { href: "/about", label: t("about") },
                { href: "/contact", label: t("contact") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium relative ${
                    pathname === item.href ? "text-green-600" : "hover:text-green-600"
                  } transition-colors`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </motion.nav>

            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/cart">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="icon" className="relative">
                          <ShoppingCart className="h-4 w-4" />
                          <AnimatePresence>
                            {cartItemCount > 0 && (
                              <motion.span
                                key="cart-count"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                              >
                                {cartItemCount}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span className="sr-only">Cart</span>
                        </Button>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Shopping Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <UserProfileDropdown />
              </div>
            </motion.div>
          </>
        )}

        {isAdminPage && (
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Admin Panel</Badge>
            <UserProfileDropdown />
          </div>
        )}
      </div>
    </motion.header>
  )
}
