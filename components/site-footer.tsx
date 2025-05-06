"use client"

import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
      className="bg-green-50 border-t"
    >
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-bold">BueaGrocer</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for fresh, local groceries in Buea. Supporting local farmers and vendors while
              bringing quality products to your doorstep.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-green-600 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Facebook className="h-5 w-5" />
                </motion.div>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-green-600 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Twitter className="h-5 w-5" />
                </motion.div>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-green-600 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Instagram className="h-5 w-5" />
                </motion.div>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/browse", label: "Browse Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/auth/register?type=store", label: "Become a Vendor" },
                { href: "/faq", label: "FAQ" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-green-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="space-y-3">
              <motion.div whileHover={{ x: 5 }} className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Molyko Street, Buea
                  <br />
                  South West Region, Cameroon
                </span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">+237 650 123 456</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">info@bueagrocer.com</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-bold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates on new products, vendors, and special offers in Buea.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-green-600 hover:bg-green-700">Subscribe</Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <Separator className="my-8 bg-green-200" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p variants={item} className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} BueaGrocer. All rights reserved. Service available only in Buea.
          </motion.p>
          <motion.div variants={item} className="flex gap-4">
            {[
              { href: "/terms", label: "Terms of Service" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/shipping", label: "Shipping Policy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-green-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}
