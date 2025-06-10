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
        {/* Hero Section - Cameroon Flag Inspired */}
        <ParallaxSection className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white overflow-hidden relative">
          {/* Decorative elements inspired by Cameroon patterns */}
          <FloatingElement className="absolute top-20 right-10 w-32 h-32 bg-yellow-400 opacity-10 rounded-full border-4 border-yellow-300">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-20"></div>
          </FloatingElement>
          <FloatingElement
            className="absolute bottom-10 left-20 w-20 h-20 bg-red-500 opacity-15 rounded-full border-2 border-red-400"
            delay={0.5}
          >
            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-full opacity-30"></div>
          </FloatingElement>
          <FloatingElement
            className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-500 opacity-20"
            delay={1}
          >
            <div className="w-full h-full bg-yellow-500 transform rotate-45 opacity-40"></div>
          </FloatingElement>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-6 h-4 bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
                <div className="w-6 h-4 bg-gradient-to-b from-red-500 to-red-600"></div>
                <div className="w-6 h-4 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                Connecting Cameroon Through Fresh Local Groceries
              </h1>
              <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl font-medium">
                From Douala to Yaoundé, Bamenda to Buea, we're bringing the best of Cameroon's local markets to your
                doorstep.
              </p>
              <Link href="/browse" legacyBehavior>
                <AnimatedButton asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-white text-green-800 hover:bg-green-100 hover:text-green-900 px-4 py-2 text-sm font-medium transition-colors">
                      <span className="flex items-center">
                        Explore Our Products
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                </AnimatedButton>
              </Link>

            </motion.div>
          </div>
        </ParallaxSection>

        {/* Stats Section - Enhanced with Cameroon colors */}
        <section className="w-full py-16 bg-gradient-to-b from-yellow-50 to-white relative">
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              ref={statsRef}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`mb-4 p-4 rounded-full shadow-md transition-all duration-300
                  ${index === 0
                        ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300"
                        : index === 1
                          ? "bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-200"
                          : index === 2
                            ? "bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200"
                            : "bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-200"
                      }
                  group-hover:scale-105
                  `}
                  >
                    <stat.icon
                      className={`h-8 w-8 transition-colors duration-300
                    ${index === 0
                          ? "text-yellow-700"
                          : index === 1
                            ? "text-red-700"
                            : index === 2
                              ? "text-amber-700"
                              : "text-emerald-700"
                        }
                  `}
                    />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-emerald-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    {stat.value}
                  </h3>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section - Enhanced Cameroon styling */}
        <ScrollReveal>
          <section className="w-full py-20 bg-gradient-to-br from-emerald-50 via-white to-yellow-50">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200">
                    <span className="text-emerald-800 font-semibold text-sm">Notre Histoire</span>
                    <span className="mx-2 text-emerald-600">•</span>
                    <span className="text-emerald-700 font-medium text-sm">Our Journey</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-emerald-800">
                    From Local Markets to Digital Marketplace
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg border-l-4 border-yellow-400 pl-4 bg-yellow-50 p-4 rounded-r-lg">
                      Founded in 2025, CamGrocer began with a vision to transform how Cameroonians access fresh, local
                      groceries. What started as a small operation in Buea has now expanded to serve communities across
                      the entire nation.
                    </p>
                    <p className="text-lg">
                      We recognized that many Cameroonians struggled to find time to visit multiple markets for their
                      groceries, especially during busy weekdays. At the same time, local farmers and vendors had
                      limited reach to potential customers beyond their immediate vicinity.
                    </p>
                    <p className="text-lg border-l-4 border-red-400 pl-4 bg-red-50 p-4 rounded-r-lg">
                      Our platform bridges this gap by connecting consumers directly with local grocery stores
                      throughout Cameroon, creating a marketplace where traditional foods and ingredients from all
                      regions are just a click away.
                    </p>
                  </div>
                  <Link href="/browse" passHref>
                    <AnimatedButton asChild>
                      <Button size="lg" className="bg-white text-green-800 hover:bg-green-100 hover:text-green-900 group">
                        <span className="flex items-center">
                          Explore Our Products
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </AnimatedButton>
                  </Link>

                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-lg -z-10 opacity-20"></div>
                  <div className="absolute -top-3 -left-3 w-32 h-32 bg-gradient-to-br from-red-300 to-red-400 rounded-lg -z-10 opacity-15"></div>
                  <Image
                    src={getStoreImage(1) || "/placeholder.svg"}
                    alt="CamGrocer Story"
                    width={600}
                    height={600}
                    className="rounded-xl shadow-2xl object-cover w-full aspect-square border-4 border-white"
                  />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-300 to-green-400 rounded-lg -z-10 opacity-20"></div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Our Values Section - Cameroon flag color scheme */}
        <ScrollReveal>
          <section className="w-full py-20 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-yellow-50/30"></div>
            <div className="container px-4 md:px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-50 border border-red-200 mb-4">
                  <span className="text-red-800 font-semibold text-sm">Nos Valeurs</span>
                  <span className="mx-2 text-red-600">•</span>
                  <span className="text-red-700 font-medium text-sm">Our Core Values</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl mb-6 text-emerald-800">
                  What Drives Us Forward
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our values shape everything we do, from how we select vendors to how we deliver groceries to your
                  doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-full shadow-md ${index === 0 ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-200' :
                          index === 1 ? 'bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-200' :
                            index === 2 ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-200' :
                              'bg-gradient-to-br from-emerald-100 to-yellow-100 border-2 border-emerald-200'
                          }`}>
                          <value.icon className={`h-8 w-8 ${index === 0 ? 'text-emerald-700' :
                            index === 1 ? 'text-red-700' :
                              index === 2 ? 'text-amber-700' :
                                'text-emerald-700'
                            }`} />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-800">{value.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Team Section - Enhanced with cultural elements */}
        <ScrollReveal>
          <section className="w-full py-20 bg-gradient-to-br from-yellow-50 via-amber-50 to-emerald-50">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-300 to-red-400 rounded-lg -z-10 opacity-20"></div>
                  <div className="absolute -top-3 -right-3 w-32 h-32 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-lg -z-10 opacity-25"></div>
                  <Image
                    src={getStoreImage(4) || "/placeholder.svg"}
                    alt="CamGrocer Team"
                    width={600}
                    height={600}
                    className="rounded-xl shadow-2xl object-cover w-full aspect-square border-4 border-white"
                  />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-300 to-green-400 rounded-lg -z-10 opacity-20"></div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200">
                    <span className="text-amber-800 font-semibold text-sm">Notre Équipe</span>
                    <span className="mx-2 text-amber-600">•</span>
                    <span className="text-amber-700 font-medium text-sm">Our Team</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-emerald-800">
                    The People Behind CamGrocer
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg border-l-4 border-emerald-400 pl-4 bg-emerald-50 p-4 rounded-r-lg">
                      Our diverse team is made up of passionate Cameroonians who understand the importance of preserving
                      our food culture while embracing innovation.
                    </p>
                    <p className="text-lg">
                      With team members from all regions of Cameroon, we bring together a wealth of knowledge about
                      local foods, markets, and traditions. This diversity allows us to better serve our nationwide
                      customer base.
                    </p>
                    <p className="text-lg border-l-4 border-yellow-400 pl-4 bg-yellow-50 p-4 rounded-r-lg">
                      From tech experts to food enthusiasts, our team works tirelessly to ensure that CamGrocer provides
                      the best possible experience for both customers and vendors across Cameroon.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/contact" passHref>
                      <AnimatedButton asChild>

                        <Button size="lg" className="bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 text-white font-semibold shadow-lg">
                          <span className="flex items-center">
                            Contact Our Team
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Button>

                      </AnimatedButton>
                    </Link>
                    <Link href="/browse" passHref>
                      <AnimatedButton asChild>

                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold"
                        >
                          <span className="flex items-center">
                            Browse Products
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Button>

                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA Section */}
        <section className="w-full py-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-red-50/30"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-6 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-sm"></div>
                <div className="w-8 h-6 bg-gradient-to-b from-red-400 to-red-500 rounded-sm"></div>
                <div className="w-8 h-6 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-sm"></div>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                Ready to Experience the Best of Cameroon's Groceries?
              </h2>
              <p className="text-lg text-emerald-100 font-medium leading-relaxed">
                Join thousands of Cameroonians who are already enjoying fresh, local groceries delivered to their
                doorstep. <em>Ensemble pour un Cameroun plus connecté!</em>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse" passHref>
                  <AnimatedButton asChild>

                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-900 hover:from-yellow-300 hover:to-amber-400 font-semibold shadow-lg border-2 border-yellow-300">
                      <span className="flex items-center">
                        Start Shopping
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>

                  </AnimatedButton>
                </Link>
                <Link href="/auth/register" passHref>
                  <AnimatedButton asChild>

                    <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-emerald-700 font-semibold">
                      <span className="flex items-center">
                        Register as Vendor
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>

                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}