"use client"

import { Separator } from "@/components/ui/separator"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, ChevronRight, FileText, Loader2, MapPin, ShieldCheck, Store, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUploader } from "@/components/image-uploader"

interface StoreData {
  ownerName: string
  email: string
  phone: string
  storeName: string
  storeType: string
  description: string
  location: string
  businessRegNumber: string
  taxId: string
  idType: string
  idNumber: string
  idFrontImage: string
  idBackImage: string
  selfieWithId: string
  businessCertificate: string
  utilityBill: string
  bankStatement: string
  additionalDocuments: string[]
  termsAccepted: boolean
}

interface StoreVerificationFlowProps {
  initialData: {
    name: string
    email: string
    phone: string
    storeName: string
    storeType: string
    description: string
    location: string
  }
  onComplete: (storeData: StoreData) => void
}

export function StoreVerificationFlow({ initialData, onComplete }: StoreVerificationFlowProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 5

  // Store data state
  const [storeData, setStoreData] = useState<StoreData>({
    ownerName: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    storeName: initialData.storeName,
    storeType: initialData.storeType,
    description: initialData.description,
    location: initialData.location,
    businessRegNumber: "",
    taxId: "",
    idType: "national_id",
    idNumber: "",
    idFrontImage: "",
    idBackImage: "",
    selfieWithId: "",
    businessCertificate: "",
    utilityBill: "",
    bankStatement: "",
    additionalDocuments: [],
    termsAccepted: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStoreData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setStoreData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleImageSelected = (field: keyof StoreData, imageUrl: string) => {
    setStoreData((prev) => ({ ...prev, [field]: imageUrl }))
  }

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!storeData.businessRegNumber || !storeData.taxId) {
        toast({
          title: "Missing information",
          description: "Please fill in all required business information fields.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!storeData.idNumber || !storeData.idFrontImage || !storeData.idBackImage || !storeData.selfieWithId) {
        toast({
          title: "Missing information",
          description: "Please provide all required identity verification documents.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 3) {
      if (!storeData.businessCertificate || !storeData.utilityBill) {
        toast({
          title: "Missing information",
          description: "Please provide all required business verification documents.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 4) {
      if (!storeData.termsAccepted) {
        toast({
          title: "Terms not accepted",
          description: "You must accept the terms and conditions to continue.",
          variant: "destructive",
        })
        return
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      onComplete(storeData)
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > index + 1
                    ? "bg-green-600 border-green-600 text-white"
                    : currentStep === index + 1
                      ? "border-green-600 text-green-600"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {currentStep > index + 1 ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-full h-1 mx-2 ${currentStep > index + 1 ? "bg-green-600" : "bg-gray-300"}`}
                  style={{ width: "100px" }}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="text-center">Business Info</div>
          <div className="text-center">Identity Verification</div>
          <div className="text-center">Business Verification</div>
          <div className="text-center">Terms & Conditions</div>
          <div className="text-center">Review</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Store className="h-5 w-5" />
                  <span className="text-sm font-medium">Step 1 of 5</span>
                </div>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Please provide your business details for verification purposes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={storeData.storeName}
                      onChange={handleInputChange}
                      placeholder="Your Store Name"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeType">Store Type</Label>
                    <select
                      id="storeType"
                      name="storeType"
                      value={storeData.storeType}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled
                    >
                      <option value="general">General Grocery</option>
                      <option value="fruits">Fruits & Vegetables</option>
                      <option value="spices">Spices & Grains</option>
                      <option value="meat">Meat & Fish</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Store Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      name="location"
                      value={storeData.location}
                      onChange={handleInputChange}
                      placeholder="Store Address"
                      disabled
                    />
                    <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This address will be verified and displayed to customers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={storeData.description}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your store"
                    rows={3}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessRegNumber">
                      Business Registration Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="businessRegNumber"
                      name="businessRegNumber"
                      value={storeData.businessRegNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. RC12345"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Your official business registration number issued by the government
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">
                      Tax ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      value={storeData.taxId}
                      onChange={handleInputChange}
                      placeholder="e.g. TIN12345678"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Your business tax identification number</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Identity Verification */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Step 2 of 5</span>
                </div>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  Please provide your personal identification documents for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">
                      ID Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="idType"
                      name="idType"
                      value={storeData.idType}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="national_id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">
                      ID Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={storeData.idNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your ID number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <ImageUploader
                      onImageSelected={(url) => handleImageSelected("idFrontImage", url)}
                      defaultImage={storeData.idFrontImage}
                      label={
                        <>
                          ID Front <span className="text-red-500">*</span>
                        </>
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload a clear photo of the front of your ID</p>
                  </div>
                  <div>
                    <ImageUploader
                      onImageSelected={(url) => handleImageSelected("idBackImage", url)}
                      defaultImage={storeData.idBackImage}
                      label={
                        <>
                          ID Back <span className="text-red-500">*</span>
                        </>
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload a clear photo of the back of your ID</p>
                  </div>
                </div>

                <div>
                  <ImageUploader
                    onImageSelected={(url) => handleImageSelected("selfieWithId", url)}
                    defaultImage={storeData.selfieWithId}
                    label={
                      <>
                        Selfie with ID <span className="text-red-500">*</span>
                      </>
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Take a photo of yourself holding your ID next to your face
                  </p>
                </div>

                <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldCheck className="h-5 w-5 text-amber-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Security Notice</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Your identity documents are securely stored and only used for verification purposes. We follow
                          strict data protection protocols to ensure your information remains private.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleNextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Business Verification */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Step 3 of 5</span>
                </div>
                <CardTitle>Business Verification</CardTitle>
                <CardDescription>Please provide documents to verify your business operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <ImageUploader
                    onImageSelected={(url) => handleImageSelected("businessCertificate", url)}
                    defaultImage={storeData.businessCertificate}
                    label={
                      <>
                        Business Registration Certificate <span className="text-red-500">*</span>
                      </>
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a clear photo of your business registration certificate
                  </p>
                </div>

                <div>
                  <ImageUploader
                    onImageSelected={(url) => handleImageSelected("utilityBill", url)}
                    defaultImage={storeData.utilityBill}
                    label={
                      <>
                        Utility Bill or Lease Agreement <span className="text-red-500">*</span>
                      </>
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a recent utility bill or lease agreement showing your business address
                  </p>
                </div>

                <div>
                  <ImageUploader
                    onImageSelected={(url) => handleImageSelected("bankStatement", url)}
                    defaultImage={storeData.bankStatement}
                    label="Bank Statement (Optional)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a recent bank statement for your business account (optional but recommended)
                  </p>
                </div>

                <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Verification Process</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          All documents will be manually reviewed by our verification team. Clear, legible documents
                          help speed up the verification process. Your store will not be visible to customers until
                          verification is complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleNextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Terms and Conditions */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Step 4 of 5</span>
                </div>
                <CardTitle>Terms and Conditions</CardTitle>
                <CardDescription>Please review and accept our terms and conditions for store owners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4 h-64 overflow-y-auto text-sm">
                  <h3 className="font-medium mb-2">CamGrocer Store Owner Agreement</h3>
                  <p className="mb-2">
                    This Store Owner Agreement ("Agreement") is entered into between CamGrocer ("Platform") and you as a
                    Store Owner ("Merchant").
                  </p>

                  <h4 className="font-medium mt-4 mb-1">1. STORE VERIFICATION AND APPROVAL</h4>
                  <p className="mb-2">
                    1.1. All stores must undergo a verification process before being approved on the Platform.
                  </p>
                  <p className="mb-2">
                    1.2. The Platform reserves the right to reject any store application without providing reasons.
                  </p>
                  <p className="mb-2">
                    1.3. Verification may take up to 5 business days, and additional information may be requested.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">2. PRODUCT LISTINGS</h4>
                  <p className="mb-2">
                    2.1. Merchants must ensure all product information is accurate, including descriptions, prices, and
                    availability.
                  </p>
                  <p className="mb-2">
                    2.2. Products must comply with all applicable laws and regulations in Cameroon.
                  </p>
                  <p className="mb-2">
                    2.3. The Platform reserves the right to remove any product listings that violate our policies.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">3. FULFILLMENT AND DELIVERY</h4>
                  <p className="mb-2">
                    3.1. Merchants are responsible for maintaining accurate inventory and fulfilling orders promptly.
                  </p>
                  <p className="mb-2">
                    3.2. Orders must be prepared within the timeframe specified in the Merchant Guidelines.
                  </p>
                  <p className="mb-2">
                    3.3. Merchants may choose to use their own delivery service or the Platform's delivery partners.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">4. FEES AND PAYMENTS</h4>
                  <p className="mb-2">
                    4.1. The Platform charges a commission fee on each successful transaction as outlined in the
                    Merchant Guidelines.
                  </p>
                  <p className="mb-2">
                    4.2. Payments will be processed and transferred to Merchants according to the payment schedule in
                    the Merchant Guidelines.
                  </p>
                  <p className="mb-2">
                    4.3. The Platform reserves the right to modify the fee structure with 30 days' notice.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">5. ACCOUNT SUSPENSION AND TERMINATION</h4>
                  <p className="mb-2">
                    5.1. The Platform may suspend or terminate a Merchant's account for violations of this Agreement or
                    the Merchant Guidelines.
                  </p>
                  <p className="mb-2">
                    5.2. Merchants may terminate their participation on the Platform with 30 days' written notice.
                  </p>
                  <p className="mb-2">
                    5.3. Upon termination, Merchants must fulfill all pending orders before account closure.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">6. PRIVACY AND DATA PROTECTION</h4>
                  <p className="mb-2">
                    6.1. Merchants must comply with all applicable data protection and privacy laws.
                  </p>
                  <p className="mb-2">
                    6.2. Merchants may only use customer data for order fulfillment and not for marketing purposes
                    without explicit consent.
                  </p>
                  <p className="mb-2">
                    6.3. The Platform's Privacy Policy applies to all data collected through the Platform.
                  </p>

                  <h4 className="font-medium mt-4 mb-1">7. GOVERNING LAW</h4>
                  <p className="mb-2">7.1. This Agreement is governed by the laws of the Republic of Cameroon.</p>
                  <p className="mb-2">
                    7.2. Any disputes arising from this Agreement shall be resolved through arbitration in Yaoundé,
                    Cameroon.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={storeData.termsAccepted} onCheckedChange={handleCheckboxChange} />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the terms and conditions <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you agree to abide by our store owner policies and guidelines.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleNextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Review and Submit */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Step 5 of 5</span>
                </div>
                <CardTitle>Review and Submit</CardTitle>
                <CardDescription>
                  Please review your information before submitting your store verification request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Store Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Store Name:</span>
                        <span className="font-medium">{storeData.storeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Store Type:</span>
                        <span className="font-medium">
                          {storeData.storeType === "general"
                            ? "General Grocery"
                            : storeData.storeType === "fruits"
                              ? "Fruits & Vegetables"
                              : storeData.storeType === "spices"
                                ? "Spices & Grains"
                                : "Meat & Fish"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Business Reg Number:</span>
                        <span className="font-medium">{storeData.businessRegNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ID:</span>
                        <span className="font-medium">{storeData.taxId}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{storeData.location}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium">Owner Information</h3>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{storeData.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{storeData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{storeData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID Type:</span>
                        <span className="font-medium">
                          {storeData.idType === "national_id"
                            ? "National ID"
                            : storeData.idType === "passport"
                              ? "Passport"
                              : "Driver's License"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID Number:</span>
                        <span className="font-medium">{storeData.idNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium">Uploaded Documents</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">ID Front:</span>
                        {storeData.idFrontImage ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.idFrontImage || "/placeholder.svg"}
                              alt="ID Front"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-red-500">Not uploaded</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">ID Back:</span>
                        {storeData.idBackImage ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.idBackImage || "/placeholder.svg"}
                              alt="ID Back"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-red-500">Not uploaded</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Selfie with ID:</span>
                        {storeData.selfieWithId ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.selfieWithId || "/placeholder.svg"}
                              alt="Selfie with ID"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-red-500">Not uploaded</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Business Certificate:</span>
                        {storeData.businessCertificate ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.businessCertificate || "/placeholder.svg"}
                              alt="Business Certificate"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-red-500">Not uploaded</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Utility Bill:</span>
                        {storeData.utilityBill ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.utilityBill || "/placeholder.svg"}
                              alt="Utility Bill"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-red-500">Not uploaded</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Bank Statement:</span>
                        {storeData.bankStatement ? (
                          <div className="relative h-20 w-32 rounded-md overflow-hidden border">
                            <Image
                              src={storeData.bankStatement || "/placeholder.svg"}
                              alt="Bank Statement"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-500">Optional</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Verification Process</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          After submission, your application will be reviewed by our verification team within 3-5
                          business days. You will receive email updates on the status of your application. If additional
                          information is needed, our team will contact you directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Verification Request"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
