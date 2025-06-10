"use client"

import Link from "next/link"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, MapPin, Phone, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

// Office locations
const offices = [
  {
    city: "Yaoundé",
    address: "123 Avenue Kennedy, Yaoundé, Centre Region",
    phone: "+237 655 123 456",
    email: "yaounde@camgrocer.com",
    hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm",
  },
  {
    city: "Douala",
    address: "45 Boulevard de la Liberté, Akwa, Douala, Littoral Region",
    phone: "+237 655 789 012",
    email: "douala@camgrocer.com",
    hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm",
  },
  {
    city: "Buea",
    address: "78 Molyko Street, Buea, South West Region",
    phone: "+237 655 345 678",
    email: "buea@camgrocer.com",
    hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm",
  },
  {
    city: "Bamenda",
    address: "25 Commercial Avenue, Bamenda, North West Region",
    phone: "+237 655 901 234",
    email: "bamenda@camgrocer.com",
    hours: "Mon-Fri: 8am-6pm, Sat: 9am-3pm",
  },
]

// FAQ items
const faqItems = [
  {
    question: "How does delivery work across Cameroon?",
    answer:
      "We partner with local delivery services in each city we operate in to bring your groceries directly to your doorstep. Delivery times typically range from 1-3 hours, depending on your location and the store's availability. For remote areas, we offer scheduled deliveries on specific days of the week.",
  },
  {
    question: "Can I become a vendor on CamGrocer?",
    answer:
      "Yes! We welcome grocery store owners from all regions of Cameroon to join our platform. Simply sign up as a store owner, and our team will guide you through the verification process to get your store listed on CamGrocer. We provide training and support to help you succeed on our platform.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently accept Mobile Money (MTN Mobile Money, Orange Money, and YooMee Money), bank transfers, and Cash on Delivery as payment methods for deliveries across Cameroon. We're working on adding more payment options including credit/debit cards in the near future.",
  },
  {
    question: "Which regions of Cameroon do you serve?",
    answer:
      "We currently operate in all major cities across Cameroon, including Yaoundé, Douala, Buea, Bamenda, Bafoussam, Limbe, Kribi, Garoua, Maroua, and Ngaoundéré. We're continuously expanding our network to reach more communities throughout the country.",
  },
  {
    question: "How do you ensure product quality?",
    answer:
      "We have a rigorous vendor verification process and regular quality checks. All vendors must meet our quality standards before joining the platform. Additionally, we have a rating system that allows customers to provide feedback on product quality, and we regularly audit vendors to ensure they maintain our standards.",
  },
  {
    question: "Can I schedule deliveries in advance?",
    answer:
      "Yes, you can schedule deliveries up to two weeks in advance. This is especially useful for planning your grocery shopping or for special occasions. Simply select your preferred delivery date and time during checkout.",
  },
]

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("general")

  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.3 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormStatus("idle")
      }, 5000)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Get In Touch</h1>
              <p className="text-xl text-green-100 max-w-2xl">
                We're here to help you with any questions about our platform, products, or services across Cameroon.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Options Section */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="general">General Inquiries</TabsTrigger>
                  <TabsTrigger value="business">Business Relations</TabsTrigger>
                  <TabsTrigger value="support">Customer Support</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="general" className="mt-0">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-green-50 rounded-t-lg">
                    <CardTitle className="text-2xl">General Inquiries</CardTitle>
                    <CardDescription>
                      For general questions about our services, coverage areas, or other information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Email Us</h3>
                        <p className="text-gray-600">info@camgrocer.com</p>
                        <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Phone className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Call Us</h3>
                        <p className="text-gray-600">+237 655 123 456</p>
                        <p className="text-sm text-gray-500 mt-1">Available Mon-Fri, 8am-6pm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="mt-0">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-green-50 rounded-t-lg">
                    <CardTitle className="text-2xl">Business Relations</CardTitle>
                    <CardDescription>
                      For vendor partnerships, business opportunities, and collaborations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Email Our Business Team</h3>
                        <p className="text-gray-600">partners@camgrocer.com</p>
                        <p className="text-sm text-gray-500 mt-1">For vendor onboarding and partnerships</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Phone className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Business Line</h3>
                        <p className="text-gray-600">+237 655 789 012</p>
                        <p className="text-sm text-gray-500 mt-1">Available Mon-Fri, 9am-5pm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-0">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-green-50 rounded-t-lg">
                    <CardTitle className="text-2xl">Customer Support</CardTitle>
                    <CardDescription>For help with orders, deliveries, refunds, and technical issues.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <MessageSquare className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Live Chat</h3>
                        <p className="text-gray-600">Available in our app and website</p>
                        <p className="text-sm text-gray-500 mt-1">Fastest way to get help</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Support Email</h3>
                        <p className="text-gray-600">support@camgrocer.com</p>
                        <p className="text-sm text-gray-500 mt-1">24/7 support for urgent issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Office Locations */}
        <ScrollReveal>
          <section className="w-full py-16 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Offices Across Cameroon</h2>
                <p className="text-gray-600 mt-4">Visit us at one of our regional offices throughout Cameroon</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {offices.map((office, index) => (
                  <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-green-700">{office.city}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 text-sm">{office.address}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 text-sm">{office.phone}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 text-sm">{office.email}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 text-sm">{office.hours}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Contact Form Section */}
        <ScrollReveal>
          <section className="w-full py-16 bg-white">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                    Reach Out
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Send Us a Message</h2>
                  <p className="text-gray-600">
                    Have questions about our platform, products, or services across Cameroon? Our team is here to help.
                    Fill out the form and we'll get back to you as soon as possible.
                  </p>

                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-semibold">What happens next?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">We'll review your message</h4>
                          <p className="text-gray-600 text-sm">Our team will carefully review your inquiry</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">We'll get back to you</h4>
                          <p className="text-gray-600 text-sm">A team member will respond within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">Problem solved</h4>
                          <p className="text-gray-600 text-sm">We'll work with you until your issue is resolved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  ref={formRef}
                  initial="hidden"
                  animate={formInView ? "visible" : "hidden"}
                  variants={fadeIn}
                >
                  <Card className="border-none shadow-xl">
                    <CardContent className="p-6">
                      {formStatus === "success" && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <AlertTitle>Message Sent!</AlertTitle>
                          <AlertDescription>
                            Thank you for contacting us. We'll get back to you shortly.
                          </AlertDescription>
                        </Alert>
                      )}

                      {formStatus === "error" && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <AlertTitle>Something went wrong</AlertTitle>
                          <AlertDescription>
                            There was an error sending your message. Please try again.
                          </AlertDescription>
                        </Alert>
                      )}

                      <form className="grid gap-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="first-name" className="text-sm font-medium">
                              First name
                            </Label>
                            <Input
                              id="first-name"
                              placeholder="John"
                              required
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name" className="text-sm font-medium">
                              Last name
                            </Label>
                            <Input
                              id="last-name"
                              placeholder="Doe"
                              required
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <Input
                            id="email"
                            placeholder="john.doe@example.com"
                            type="email"
                            required
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            placeholder="+237 6XX XXX XXX"
                            type="tel"
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </Label>
                          <Input
                            id="subject"
                            placeholder="How can we help you?"
                            required
                            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium">
                            Message
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Please provide as much detail as possible..."
                            className="min-h-[150px] border-gray-300 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                        <AnimatedButton
                            type="submit"
                            className="w-full bg-green-700 hover:bg-green-800"
                            disabled={formStatus !== "idle"}
                          >
                            {formStatus === "idle" ? "Send Message" : "Sending..."}
                        </AnimatedButton>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ Section */}
        <ScrollReveal>
          <section className="w-full py-16 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-4">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
                <p className="text-gray-600 mt-4">
                  Find answers to common questions about our services across Cameroon
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                      <AccordionTrigger className="text-left font-medium py-4 hover:text-green-700 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Still have questions?</p>
                  <AnimatedButton asChild>
                    <Link href="#contact-form">
                      <Button className="bg-green-700 hover:bg-green-800">Contact Our Support Team</Button>
                    </Link>
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </div>
  )
}
