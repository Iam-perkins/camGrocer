"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [verificationStatus, setVerificationStatus] = useState("pending")

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleSubmitStep3 = (e: React.FormEvent) => {
    e.preventDefault()
    setVerificationStatus("pending_review")
    toast({
      title: "Verification submitted",
      description: "Your verification information has been submitted for review.",
    })
    // In a real app, you would submit the verification data to your backend
    setTimeout(() => {
      router.push("/auth/verify/status")
    }, 2000)
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-10">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-green-600" />
        <span className="text-lg font-bold">CamGrocer</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
            >
              {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
            </div>
            <span className="mt-2 text-xs">Security Questions</span>
          </div>
          <div className="h-0.5 w-16 bg-muted sm:w-24" />
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
            >
              {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
            </div>
            <span className="mt-2 text-xs">Identity Verification</span>
          </div>
          <div className="h-0.5 w-16 bg-muted sm:w-24" />
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
            >
              {step > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
            </div>
            <span className="mt-2 text-xs">Submission</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Security Verification</CardTitle>
              <CardDescription>Please answer these security questions to verify your identity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitStep1} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="security-question-1">What city were you born in?</Label>
                    <Input id="security-question-1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-question-2">What is your mother's maiden name?</Label>
                    <Input id="security-question-2" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Have you ever operated a grocery business before?</Label>
                    <RadioGroup defaultValue="no">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="business-yes" />
                        <Label htmlFor="business-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="business-no" />
                        <Label htmlFor="business-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-question-3">What is the name of your first pet?</Label>
                    <Input id="security-question-3" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Identity Verification</CardTitle>
              <CardDescription>Please provide the following information to verify your identity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitStep2} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id-type">ID Type</Label>
                    <select
                      id="id-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select ID Type</option>
                      <option value="national-id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver's License</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input id="id-number" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-photo">Upload ID Photo (Front)</Label>
                    <Input id="id-photo" type="file" accept="image/*" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-photo-back">Upload ID Photo (Back)</Label>
                    <Input id="id-photo-back" type="file" accept="image/*" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selfie">Upload a Selfie</Label>
                    <Input id="selfie" type="file" accept="image/*" required />
                    <p className="text-xs text-muted-foreground">
                      Please upload a clear photo of yourself holding your ID
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Additional Information</CardTitle>
              <CardDescription>Please provide some additional information about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitStep3} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea id="address" rows={3} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input id="phone-number" type="tel" placeholder="+237 6XX XXX XXX" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of using CamGrocer</Label>
                    <select
                      id="purpose"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select Purpose</option>
                      <option value="personal">Personal Shopping</option>
                      <option value="business">Business/Reselling</option>
                      <option value="store">Operating a Store</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral">How did you hear about us?</Label>
                    <Input id="referral" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Submit Verification
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  By submitting this form, you agree to our verification process. Your information will be reviewed by
                  our team.
                </p>
                <p className="mt-2">This process typically takes 1-2 business days.</p>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
