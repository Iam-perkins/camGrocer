"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, ShoppingBag, Upload, User, MapPin } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { bueaNeighborhoods } from "@/lib/product-data"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    birthCity: "",
    mothersMaidenName: "",
    firstPet: "",
    idType: "national_id",
    idNumber: "",
    address: "",
    neighborhood: bueaNeighborhoods[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      // In a real app, you would submit the verification data to your backend
      toast({
        title: "Verification submitted",
        description: "Your verification request has been submitted and is pending review.",
      })
      
      // Redirect to verification status page
      router.push("/auth/verify/status")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 container py-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 bg-green-50 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Account Verification</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-green-600" />
                  <span className="text-xs">Buea Only</span>
                </Badge>
              </div>
              <CardDescription>
                Complete the verification process to access your account. This helps us ensure the security of our platform.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === i
                          ? "bg-green-600 text-white"
                          : step > i
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {i}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">
                      {i === 1 ? "Security" : i === 2 ? "Identity" : "Location"}
                    </span>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthCity">City of Birth</Label>
                      <Input
                        id="birthCity"
                        name="birthCity"
                        value={formData.birthCity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mothersMaidenName">Mother's Maiden Name</Label>
                      <Input
                        id="mothersMaidenName"
                        name="mothersMaidenName"
                        value={formData.mothersMaidenName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstPet">Name of First Pet (if applicable)</Label>
                      <Input
                        id="firstPet"
                        name="firstPet"
                        value={formData.firstPet}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <select
                        id="idType"
                        name="idType"
                        value={formData.idType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="national_id">National ID</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="voter_card">Voter's Card</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idUpload">Upload ID Document (Front)</Label>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                        <Input
                          id="idUpload"
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,application/pdf"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="selfieUpload">Upload Selfie with ID</Label>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Take a selfie holding your ID</p>
                        <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB)</p>
                        <Input
                          id="selfieUpload"
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address in Buea</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Neighborhood in Buea</Label>
                      <select
                        id="neighborhood"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        {bueaNeighborhoods.map((neighborhood) => (
                          <option key={neighborhood} value={neighborhood}>
                            {neighborhood}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Verification Notice</Label>
                      <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        <p>By submitting this verification, you confirm that:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>You are currently located in Buea</li>
                          <li>All information provided is accurate and true</li>
                          <li>You consent to our verification process</li>
                          <li>You understand that false information may result in account termination</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => router.push("/")}>
                      Cancel
                    </Button>
                  )}
                  
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {step < 3 ? "Continue" : "Submit Verification"}
                  </Button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Need help? <Link href="/contact" className="text-green-600 hover:underline">Contact our support team</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
