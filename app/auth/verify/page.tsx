"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, ShoppingBag, Upload, User, MapPin, X, Image as ImageIcon } from 'lucide-react'
import Image from "next/image"

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
import { Loader2 } from "lucide-react"

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
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null)
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const idFrontRef = useRef<HTMLInputElement>(null)
  const idBackRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idFront' | 'idBack' | 'selfie') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, or JPEG)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      switch (type) {
        case 'idFront':
          setIdFrontPreview(result)
          break
        case 'idBack':
          setIdBackPreview(result)
          break
        case 'selfie':
          setSelfiePreview(result)
          break
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (type: 'idFront' | 'idBack' | 'selfie') => {
    switch (type) {
      case 'idFront':
        setIdFrontPreview(null)
        if (idFrontRef.current) idFrontRef.current.value = ''
        break
      case 'idBack':
        setIdBackPreview(null)
        if (idBackRef.current) idBackRef.current.value = ''
        break
      case 'selfie':
        setSelfiePreview(null)
        if (selfieRef.current) selfieRef.current.value = ''
        break
    }
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
                  <div className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="idFront">ID Front</Label>
                        <div className="relative">
                          {idFrontPreview ? (
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
                              <Image
                                src={idFrontPreview}
                                alt="ID Front"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage('idFront')}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => idFrontRef.current?.click()}
                              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
                            </div>
                          )}
                          <input
                            ref={idFrontRef}
                            type="file"
                            id="idFront"
                            accept="image/png,image/jpeg,image/jpg"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'idFront')}
                            required={!idFrontPreview}
                          />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="idBack">ID Back</Label>
                        <div className="relative">
                          {idBackPreview ? (
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
                              <Image
                                src={idBackPreview}
                                alt="ID Back"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage('idBack')}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => idBackRef.current?.click()}
                              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                            >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
                            </div>
                          )}
                          <input
                            ref={idBackRef}
                          type="file"
                            id="idBack"
                            accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                            onChange={(e) => handleFileChange(e, 'idBack')}
                            required={!idBackPreview}
                        />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="selfie">Selfie with ID</Label>
                      <div className="relative">
                        {selfiePreview ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden border">
                            <Image
                              src={selfiePreview}
                              alt="Selfie with ID"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage('selfie')}
                              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => selfieRef.current?.click()}
                            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                          >
                        <User className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">Take a selfie holding your ID</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
                          </div>
                        )}
                        <input
                          ref={selfieRef}
                          type="file"
                          id="selfie"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'selfie')}
                          required={!selfiePreview}
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
                  
                  <Button
                    type={step === 3 ? "submit" : "button"}
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => step < 3 && setStep(step + 1)}
                    disabled={isUploading}
                  >
                    {step === 3 ? (
                      isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Verification"
                      )
                    ) : (
                      "Next"
                    )}
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
