"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, ShieldCheck, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function VerificationStatusPage() {
  const router = useRouter()
  // In a real app, you would fetch the verification status from your backend
  const verificationStatus = "pending_review" // Options: pending_review, approved, rejected

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-10">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-green-600" />
        <span className="text-lg font-bold">CamGrocer</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              {verificationStatus === "pending_review" && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
              )}
              {verificationStatus === "approved" && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              )}
              {verificationStatus === "rejected" && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                  <ShieldCheck className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl text-center">
              {verificationStatus === "pending_review" && "Verification In Progress"}
              {verificationStatus === "approved" && "Verification Approved"}
              {verificationStatus === "rejected" && "Verification Rejected"}
            </CardTitle>
            <CardDescription className="text-center">
              {verificationStatus === "pending_review" && "Your verification is being reviewed by our team"}
              {verificationStatus === "approved" && "Your account has been fully verified"}
              {verificationStatus === "rejected" && "Unfortunately, your verification was not approved"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Verification Status</h3>
                <div className="mt-2 flex items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full mr-2 ${
                      verificationStatus === "pending_review"
                        ? "bg-yellow-500"
                        : verificationStatus === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span>
                    {verificationStatus === "pending_review" && "Pending Review"}
                    {verificationStatus === "approved" && "Approved"}
                    {verificationStatus === "rejected" && "Rejected"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Verification Timeline</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="h-full w-0.5 bg-green-100 mt-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Verification Submitted</p>
                      <p className="text-sm text-muted-foreground">April 25, 2025 - 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      {verificationStatus !== "pending_review" ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                          <Clock className="h-3 w-3 text-yellow-600" />
                        </div>
                      )}
                      <div
                        className={`h-full w-0.5 ${verificationStatus !== "pending_review" ? "bg-green-100" : "bg-yellow-100"} mt-1`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium">Review in Progress</p>
                      <p className="text-sm text-muted-foreground">April 25, 2025 - 11:45 AM</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      {verificationStatus === "approved" ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                      ) : verificationStatus === "rejected" ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                          <ShieldCheck className="h-3 w-3 text-red-600" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                          <span className="h-3 w-3"></span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Final Decision</p>
                      <p className="text-sm text-muted-foreground">
                        {verificationStatus === "approved" && "April 26, 2025 - 9:15 AM"}
                        {verificationStatus === "rejected" && "April 26, 2025 - 9:15 AM"}
                        {verificationStatus === "pending_review" && "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            {verificationStatus === "pending_review" && (
              <div className="text-sm text-muted-foreground">
                <p>Your verification is being reviewed by our team. This process typically takes 1-2 business days.</p>
                <p className="mt-2">You will receive an email notification once the review is complete.</p>
              </div>
            )}
            {verificationStatus === "approved" && (
              <div className="text-sm text-muted-foreground">
                <p>
                  Congratulations! Your account has been fully verified. You now have access to all features of
                  CamGrocer.
                </p>
              </div>
            )}
            {verificationStatus === "rejected" && (
              <div className="text-sm text-muted-foreground">
                <p>Unfortunately, your verification was not approved. This could be due to:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Unclear or missing documentation</li>
                  <li>Information mismatch</li>
                  <li>Suspicious activity</li>
                </ul>
                <p className="mt-2">Please contact our support team for more information.</p>
              </div>
            )}

            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              {verificationStatus === "pending_review" && (
                <Button onClick={() => router.push("/auth/verify/status")}>Refresh Status</Button>
              )}
              {verificationStatus === "approved" && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/browse")}>
                  Start Shopping
                </Button>
              )}
              {verificationStatus === "rejected" && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/auth/verify")}>
                  Try Again
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
