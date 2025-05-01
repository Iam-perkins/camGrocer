"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Box,
  CheckCircle,
  Clock,
  Filter,
  Home,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function VerificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Mock verification data
  const verifications = [
    {
      id: "VER-001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+237 612 345 678",
      type: "Customer",
      status: "pending",
      submittedAt: "2025-04-25 10:30 AM",
    },
    {
      id: "VER-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+237 623 456 789",
      type: "Store Owner",
      status: "pending",
      submittedAt: "2025-04-25 11:45 AM",
    },
    {
      id: "VER-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+237 634 567 890",
      type: "Customer",
      status: "approved",
      submittedAt: "2025-04-24 09:15 AM",
      reviewedAt: "2025-04-25 14:30 PM",
      reviewedBy: "Admin User",
    },
    {
      id: "VER-004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+237 645 678 901",
      type: "Store Owner",
      status: "rejected",
      submittedAt: "2025-04-24 13:20 PM",
      reviewedAt: "2025-04-25 10:45 AM",
      reviewedBy: "Admin User",
      rejectionReason: "Unclear documentation provided",
    },
    {
      id: "VER-005",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "+237 656 789 012",
      type: "Customer",
      status: "approved",
      submittedAt: "2025-04-23 15:10 PM",
      reviewedAt: "2025-04-24 11:30 AM",
      reviewedBy: "Admin User",
    },
  ]

  const filteredVerifications = verifications.filter((verification) => {
    // Filter by status
    if (activeTab !== "all" && verification.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        verification.id.toLowerCase().includes(query) ||
        verification.name.toLowerCase().includes(query) ||
        verification.email.toLowerCase().includes(query) ||
        verification.phone.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewVerification = (verification: any) => {
    setSelectedVerification(verification)
    setViewDialogOpen(true)
  }

  const handleApproveVerification = () => {
    // In a real app, you would call your API to approve the verification
    toast({
      title: "Verification approved",
      description: `${selectedVerification.name}'s verification has been approved.`,
    })
    setViewDialogOpen(false)
  }

  const handleRejectVerification = () => {
    // In a real app, you would call your API to reject the verification
    toast({
      title: "Verification rejected",
      description: `${selectedVerification.name}'s verification has been rejected.`,
    })
    setViewDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">CamGrocer Admin</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/products")}>
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/orders")}>
                  <Box className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/users")}>
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
                <Button variant="default" className="justify-start" onClick={() => router.push("/admin/verifications")}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verifications
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/analytics")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">User Verifications</h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search verifications..."
                    className="w-[200px] pl-8 md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">
                  Pending
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1.5 py-0.5">
                    {verifications.filter((v) => v.status === "pending").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1.5 py-0.5">
                    {verifications.filter((v) => v.status === "approved").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                  <Badge variant="secondary" className="ml-1 rounded-sm px-1.5 py-0.5">
                    {verifications.filter((v) => v.status === "rejected").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Pending Verifications</CardTitle>
                    <CardDescription>Review and process user verification requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVerifications.map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell className="font-medium">{verification.id}</TableCell>
                            <TableCell>{verification.name}</TableCell>
                            <TableCell>{verification.email}</TableCell>
                            <TableCell>{verification.phone}</TableCell>
                            <TableCell>{verification.type}</TableCell>
                            <TableCell>{verification.submittedAt}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  verification.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : verification.status === "approved"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                                variant="outline"
                              >
                                {verification.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                {verification.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                                {verification.status === "rejected" && <X className="mr-1 h-3 w-3" />}
                                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewVerification(verification)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredVerifications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              No pending verifications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Approved Verifications</CardTitle>
                    <CardDescription>Users with approved verification status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Approved On</TableHead>
                          <TableHead>Approved By</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVerifications.map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell className="font-medium">{verification.id}</TableCell>
                            <TableCell>{verification.name}</TableCell>
                            <TableCell>{verification.email}</TableCell>
                            <TableCell>{verification.phone}</TableCell>
                            <TableCell>{verification.type}</TableCell>
                            <TableCell>{verification.reviewedAt}</TableCell>
                            <TableCell>{verification.reviewedBy}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewVerification(verification)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredVerifications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              No approved verifications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Rejected Verifications</CardTitle>
                    <CardDescription>Users with rejected verification status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Rejected On</TableHead>
                          <TableHead>Rejected By</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVerifications.map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell className="font-medium">{verification.id}</TableCell>
                            <TableCell>{verification.name}</TableCell>
                            <TableCell>{verification.email}</TableCell>
                            <TableCell>{verification.phone}</TableCell>
                            <TableCell>{verification.type}</TableCell>
                            <TableCell>{verification.reviewedAt}</TableCell>
                            <TableCell>{verification.reviewedBy}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewVerification(verification)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredVerifications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              No rejected verifications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>All Verifications</CardTitle>
                    <CardDescription>View all user verification requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVerifications.map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell className="font-medium">{verification.id}</TableCell>
                            <TableCell>{verification.name}</TableCell>
                            <TableCell>{verification.email}</TableCell>
                            <TableCell>{verification.phone}</TableCell>
                            <TableCell>{verification.type}</TableCell>
                            <TableCell>{verification.submittedAt}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  verification.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : verification.status === "approved"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                                variant="outline"
                              >
                                {verification.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                {verification.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                                {verification.status === "rejected" && <X className="mr-1 h-3 w-3" />}
                                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewVerification(verification)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredVerifications.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              No verifications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Verification Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>Review user verification information</DialogDescription>
          </DialogHeader>

          {selectedVerification && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Personal Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{selectedVerification.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium">{selectedVerification.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <span className="text-sm font-medium">{selectedVerification.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Type:</span>
                      <span className="text-sm font-medium">{selectedVerification.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Verification Status</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge
                        className={
                          selectedVerification.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : selectedVerification.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                        variant="outline"
                      >
                        {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Submitted:</span>
                      <span className="text-sm font-medium">{selectedVerification.submittedAt}</span>
                    </div>
                    {selectedVerification.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reviewed:</span>
                        <span className="text-sm font-medium">{selectedVerification.reviewedAt}</span>
                      </div>
                    )}
                    {selectedVerification.reviewedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reviewed By:</span>
                        <span className="text-sm font-medium">{selectedVerification.reviewedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium">ID Documents</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">ID Front</p>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
                      <Image
                        src="/placeholder.svg?height=300&width=400&text=ID+Front"
                        alt="ID Front"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">ID Back</p>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
                      <Image
                        src="/placeholder.svg?height=300&width=400&text=ID+Back"
                        alt="ID Back"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Selfie with ID</h3>
                <div className="mt-4">
                  <div className="relative aspect-[4/3] max-w-[300px] overflow-hidden rounded-md border">
                    <Image
                      src="/placeholder.svg?height=300&width=400&text=Selfie+with+ID"
                      alt="Selfie with ID"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {selectedVerification.status === "rejected" && selectedVerification.rejectionReason && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
                  <p className="mt-2 text-sm text-red-700">{selectedVerification.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedVerification && selectedVerification.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => handleRejectVerification()}>
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveVerification()}>
                  Approve
                </Button>
              </>
            )}
            {selectedVerification && selectedVerification.status !== "pending" && (
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
