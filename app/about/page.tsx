"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ChevronRight, Shield, Users, TrendingUp, MapPin, Award, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getStoreImage } from "@/lib/product-data"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { ParallaxSection } from "@/components/ui/parallax-section"
import { FloatingElement } from "@/components/ui/floating-element"
import { AnimatedButton } from "@/components/ui/animated-button"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const stats = [
  { value: "25+", label: "Regions Covered", icon: MapPin },
  { value: "500+", label: "Local Vendors", icon: Users },
  { value: "50,000+", label: "Monthly Customers", icon: TrendingUp },
  { value: "10,000+", label: "Products Available", icon: Globe },
]

const values = [
  {
    title: "Quality & Authenticity",
    description:
      "We ensure all products on our platform are authentic Cameroonian groceries of the highest quality, sourced directly from local farmers and vendors.",
    icon: Shield,
  },
  {
    title: "Community Empowerment",
    description:
      "We are committed to supporting local communities across Cameroon by providing a platform for small grocery stores to reach more customers and grow their businesses.",
    icon: Users,
  },
  {
    title: "Innovation & Accessibility",
    description:
      "We leverage technology to make Cameroon's traditional groceries more accessible to everyone, while preserving our rich cultural food heritage.",
    icon: TrendingUp,
  },
  {
    title: "National Excellence",
    description:
      "We strive to be the premier grocery platform in Cameroon, connecting consumers with the best products from every region of our diverse country.",
    icon: Award,
  },
]

export default function AboutPage() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxSection className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden relative">
          <FloatingElement className="absolute top-20 right-10 w-24 h-24 bg-green-500 opacity-20 rounded-full" />
          <FloatingElement
            className="absolute bottom-10 left-20 w-16 h-16 bg-green-400 opacity-10 rounded-full"
            delay={0.5}
          />

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Connecting Cameroon Through Fresh Local Groceries
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl">
                From Douala to Yaoundé, Bamenda to Buea, we're bringing the best of Cameroon's local markets to your
                doorstep.
              </p>
              <AnimatedButton asChild>
                <Link href="/browse">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-100 hover:text-green-900 group">
                    Explore Our Products
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </AnimatedButton>
            </motion.div>
          </div>
        </ParallaxSection>

        {/* Stats Section */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6">
            <motion.div
              ref={statsRef}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={fadeIn} className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-green-100">
                    <stat.icon className="h-6 w-6 text-green-700" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <ScrollReveal>
          <section className="w-full py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                    Our Journey
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                    From Local Markets to Digital Marketplace
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg">
                      Founded in 2021, CamGrocer began with a vision to transform how Cameroonians access fresh, local
                      groceries. What started as a small operation in Buea has now expanded to serve communities across
                      the entire nation.
                    </p>
                    <p className="text-lg">
                      We recognized that many Cameroonians struggled to find time to visit multiple markets for their
                      groceries, especially during busy weekdays. At the same time, local farmers and vendors had
                      limited reach to potential customers beyond their immediate vicinity.
                    </p>
                    <p className="text-lg">
                      Our platform bridges this gap by connecting consumers directly with local grocery stores
                      throughout Cameroon, creating a marketplace where traditional foods and ingredients from all
                      regions are just a click away.
                    </p>
                  </div>
                  <AnimatedButton asChild>
                    <Link href="/browse">
                      <Button className="bg-green-700 hover:bg-green-800">Discover Our Products</Button>
                    </Link>
                  </AnimatedButton>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-lg -z-10"></div>
                  <Image
                    src={getStoreImage(1) || "/placeholder.svg"}
                    alt="CamGrocer Story"
                    width={600}
                    height={600}
                    className="rounded-xl shadow-xl object-cover w-full aspect-square"
                  />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-100 rounded-lg -z-10"></div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Our Values Section */}
        <ScrollReveal>
          <section className="w-full py-20 bg-white">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-4">
                  Our Core Values
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl mb-6">
                  What Drives Us Forward
                </h2>
                <p className="text-lg text-gray-600">
                  Our values shape everything we do, from how we select vendors to how we deliver groceries to your
                  doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-green-100 p-4 rounded-full">
                          <value.icon className="h-8 w-8 text-green-700" />
                        </div>
                        <h3 className="text-xl font-bold">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Team Section */}
        <ScrollReveal>
          <section className="w-full py-20 bg-gradient-to-br from-green-50 to-white">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-lg -z-10"></div>
                  <Image
                    src={getStoreImage(4) || "/placeholder.svg"}
                    alt="CamGrocer Team"
                    width={600}
                    height={600}
                    className="rounded-xl shadow-xl object-cover w-full aspect-square"
                  />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-100 rounded-lg -z-10"></div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                    Our Team
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                    The People Behind CamGrocer
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg">
                      Our diverse team is made up of passionate Cameroonians who understand the importance of preserving
                      our food culture while embracing innovation.
                    </p>
                    <p className="text-lg">
                      With team members from all regions of Cameroon, we bring together a wealth of knowledge about
                      local foods, markets, and traditions. This diversity allows us to better serve our nationwide
                      customer base.
                    </p>
                    <p className="text-lg">
                      From tech experts to food enthusiasts, our team works tirelessly to ensure that CamGrocer provides
                      the best possible experience for both customers and vendors across Cameroon.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <AnimatedButton asChild>
                      <Link href="/contact">
                        <Button size="lg" className="bg-green-700 hover:bg-green-800">
                          Contact Our Team
                        </Button>
                      </Link>
                    </AnimatedButton>
                    <AnimatedButton asChild>
                      <Link href="/browse">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-green-700 text-green-700 hover:bg-green-50"
                        >
                          Browse Products
                        </Button>
                      </Link>
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA Section */}
        <section className="w-full py-20 bg-green-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Experience the Best of Cameroon's Groceries?
              </h2>
              <p className="text-lg text-green-100">
                Join thousands of Cameroonians who are already enjoying fresh, local groceries delivered to their
                doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton asChild>
                  <Link href="/browse">
                    <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                      Start Shopping
                    </Button>
                  </Link>
                </AnimatedButton>
                <AnimatedButton asChild>
                  <Link href="/auth/register">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                      Register as a Vendor
                    </Button>
                  </Link>
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
