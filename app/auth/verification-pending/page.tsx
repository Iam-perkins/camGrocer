"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Clock, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function VerificationPendingPage() {
  const router = useRouter()

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
        <Card className="w-full max-w-md border-2 border-green-100 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 rounded-full bg-amber-100 p-3 w-16 h-16 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Verification Pending</CardTitle>
            <CardDescription>Your store application is being reviewed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="rounded-md bg-amber-50 p-4 border border-amber-200 text-left">
              <p className="text-sm text-amber-800">
                Thank you for applying to become a store owner on CamGrocer. Your application has been received and is
                currently under review by our verification team.
              </p>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="text-sm font-medium">Application Submitted</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We have received your store application and documents.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="text-sm font-medium">Under Review</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Our team is currently reviewing your application and verifying your documents.
                  </p>
                </div>
              </div>
              <div className="flex items-start opacity-50">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="text-sm font-medium">Verification Complete</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Once approved, you'll receive full access to your store dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-blue-50 p-4 border border-blue-200 text-left">
              <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
              <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>Our verification team will review your application within 3-5 business days.</li>
                <li>You may be contacted if additional information or clarification is needed.</li>
                <li>Once approved, you'll receive an email notification with access to your store dashboard.</li>
                <li>
                  If your application is rejected, you'll receive feedback on why and instructions on how to reapply.
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={() => router.push("/")} className="w-full bg-green-600 hover:bg-green-700">
              Return to Homepage
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Have questions? Contact our support team at{" "}
              <a href="mailto:support@camgrocer.com" className="text-green-600 hover:underline">
                support@camgrocer.com
              </a>
            </p>
          </CardFooter>
        </Card>
      </ScrollReveal>
    </div>
  )
}
