"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import StoresTab from './stores-tab';
import UsersTab from './users-tab';
import {
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShoppingBag,
  StoreIcon,
  Users,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Types
interface StoreApplication {
  _id: string
  storeName: string
  ownerName: string
  email: string
  phone: string
  address: string
  storeType: string
  description: string
  businessRegNumber: string
  taxId: string
  idType: string
  idNumber: string
  documents: {
    idFront: string
    idBack: string
    selfie: string
    businessCertificate: string
    utilityBill: string
    bankStatement?: string
  }
  verificationStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  name: string
  email: string
  type: string
  status: string
  joinedAt: string
  avatar: string
}

interface Store {
  id: string
  name: string
  owner: string
  type: string
  location: string
  status: string
  productsCount: number
  ordersCount: number
  rating: number
  createdAt: string
}

interface SystemSetting {
  id: string
  name: string
  value: string
  description: string
  category: string
  lastUpdated: string
}

// Dashboard component
export default function MasterAdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('applications')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<StoreApplication | null>(null)
  const [isViewingApplication, setIsViewingApplication] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [storeApplications, setStoreApplications] = useState<StoreApplication[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [isLoadingStores, setIsLoadingStores] = useState(false)

  // Mock data for other sections
  const usersData: User[] = []
  
  // Fetch store applications
  const fetchStoreApplications = async () => {
    try {
      const response = await fetch('/api/admin/store-owners?status=pending')
      if (!response.ok) {
        throw new Error('Failed to fetch store applications')
      }
      const data = await response.json()
      setStoreApplications(data)
    } catch (error) {
      console.error('Error fetching store applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load store applications',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch active stores
  const fetchActiveStores = async () => {
    try {
      setIsLoadingStores(true)
      const response = await fetch('/api/admin/store-owners?status=approved')
      if (!response.ok) {
        throw new Error('Failed to fetch active stores')
      }
      const data = await response.json()
      
      // Transform the data to match the Store interface
      const activeStores = data.map((store: any) => ({
        id: store._id,
        name: store.storeName,
        owner: store.ownerName,
        type: store.storeType,
        location: store.businessAddress || 'Not specified',
        status: 'active',
        productsCount: store.productsCount || 0,
        ordersCount: store.ordersCount || 0,
        rating: store.rating || 0,
        createdAt: store.createdAt
      }))
      
      setStores(activeStores)
    } catch (error) {
      console.error('Error fetching active stores:', error)
      toast({
        title: 'Error',
        description: 'Failed to load active stores',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingStores(false)
    }
  }

  // Load data when tab changes or on authentication
  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'applications') {
        await fetchStoreApplications()
      } else if (activeTab === 'stores') {
        await fetchActiveStores()
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, activeTab])

  // Authentication handler
  const handleAuthenticate = () => {
    setIsAuthenticating(true)
    // Simulate API call
    setTimeout(() => {
      if (password === "admin123") {
        setIsAuthenticated(true)
        toast({
          title: "Authentication successful",
          description: "Welcome to the Master Admin Dashboard",
        })
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
      }
      setIsAuthenticating(false)
    }, 1500)
  }

  // Application handlers
  const handleViewApplication = (application: StoreApplication) => {
    setSelectedApplication(application)
    setIsViewingApplication(true)
  }

  const handleApproveApplication = async () => {
    if (!selectedApplication) return

    setIsProcessingAction(true)

    try {
      const response = await fetch('/api/admin/store-owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          storeOwnerId: selectedApplication._id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve application')
      }

      // Update local state
      setStoreApplications(prev => 
        prev.filter(app => app._id !== selectedApplication._id)
      )

      toast({
        title: "Application approved",
        description: data.message || `${selectedApplication.storeName} has been approved and can now operate on the platform.`,
      })
    } catch (error) {
      console.error("Error approving application:", error)
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingAction(false)
      setIsViewingApplication(false)
    }
  }

  const handleRejectApplication = async () => {
    if (!selectedApplication) return

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return

    setIsProcessingAction(true)

    try {
      const response = await fetch('/api/admin/store-owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          storeOwnerId: selectedApplication._id,
          reason
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject application')
      }

      // Update local state
      setStoreApplications(prev => 
        prev.filter(app => app._id !== selectedApplication._id)
      )

      toast({
        title: "Application rejected",
        description: data.message || `${selectedApplication.storeName}'s application has been rejected.`,
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingAction(false)
      setIsViewingApplication(false)
    }
  }

  // Filter applications based on search term
  const filteredApplications = storeApplications.filter(
    (app) =>
      app.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Master Admin Dashboard</CardTitle>
            <CardDescription>Enter your password to access the master admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAuthenticate()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  // Main dashboard
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">CamGrocer Master Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Store
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span>Admin</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsAuthenticated(false)
                    setPassword("")
                    router.push("/")
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="applications" onValueChange={setActiveTab} value={activeTab}>
          <div className="mb-6 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="applications" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Store Applications</span>
                {storeApplications.filter((app) => app.verificationStatus === "pending").length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {storeApplications.filter((app) => app.verificationStatus === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="stores" className="flex items-center gap-1">
                <StoreIcon className="h-4 w-4" />
                <span>Stores</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Store Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Store Owner Applications</CardTitle>
                  <CardDescription>
                    Review and manage applications from store owners requesting to join the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredApplications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No applications found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchTerm
                          ? "No applications match your search criteria"
                          : "There are no store applications to review at this time"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 bg-muted p-4 text-sm font-medium">
                        <div className="col-span-3">Store Name</div>
                        <div className="col-span-2">Owner</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Submitted</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Action</div>
                      </div>
                      <div className="divide-y">
                        {filteredApplications.map((application) => (
                          <div key={application._id} className="grid grid-cols-12 gap-4 p-4 text-sm">
                            <div className="col-span-3 font-medium">{application.storeName}</div>
                            <div className="col-span-2">{application.ownerName}</div>
                            <div className="col-span-2">
                              {application.storeType === "general"
                                ? "General Grocery"
                                : application.storeType === "fruits"
                                  ? "Fruits & Vegetables"
                                  : application.storeType === "spices"
                                    ? "Spices & Grains"
                                    : "Meat & Fish"}
                            </div>
                            <div className="col-span-2">{new Date(application.createdAt).toLocaleDateString()}</div>
                            <div className="col-span-2">
                              {application.verificationStatus === "pending" ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              ) : application.verificationStatus === "approved" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Rejected
                                </Badge>
                              )}
                            </div>
                            <div className="col-span-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewApplication(application)}>
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores" className="space-y-4">
            <StoresTab />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UsersTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 bg-muted p-4 text-sm font-medium">
                      <div className="col-span-3">Setting</div>
                      <div className="col-span-2">Value</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-2">Last Updated</div>
                      <div className="col-span-1">Action</div>
                    </div>
                    <div className="divide-y">
                      {settings.map((setting) => (
                        <div key={setting.id} className="grid grid-cols-12 gap-4 p-4 text-sm">
                          <div className="col-span-3 font-medium">{setting.name}</div>
                          <div className="col-span-2">
                            <Badge variant="outline">{setting.value}</Badge>
                          </div>
                          <div className="col-span-4">{setting.description}</div>
                          <div className="col-span-2">{new Date(setting.lastUpdated).toLocaleDateString()}</div>
                          <div className="col-span-1 flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-muted/50"
                              title="Edit setting"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={isViewingApplication} onOpenChange={setIsViewingApplication}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Store Application Details</DialogTitle>
              <DialogDescription>Review the application details for {selectedApplication.storeName}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-2">
                {/* Store Information */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Store Information</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Store Name</p>
                        <p className="font-medium">{selectedApplication.storeName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Store Type</p>
                        <p className="font-medium">
                          {selectedApplication.storeType === "general"
                            ? "General Grocery"
                            : selectedApplication.storeType === "fruits"
                              ? "Fruits & Vegetables"
                              : selectedApplication.storeType === "spices"
                                ? "Spices & Grains"
                                : "Meat & Fish"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Registration Number</p>
                        <p className="font-medium">{selectedApplication.businessRegNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax ID</p>
                        <p className="font-medium">{selectedApplication.taxId}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Store Description</p>
                        <p>{selectedApplication.description}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedApplication.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Owner Information</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Owner Name</p>
                        <p className="font-medium">{selectedApplication.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Type</p>
                        <p className="font-medium">
                          {selectedApplication.idType === "national_id"
                            ? "National ID"
                            : selectedApplication.idType === "passport"
                              ? "Passport"
                              : "Driver's License"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Number</p>
                        <p className="font-medium">{selectedApplication.idNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Verification Documents</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">ID Front</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.idFront ? (
                            <Image
                              src={selectedApplication.documents.idFront || "/placeholder.svg"}
                              alt="ID Front"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No image provided
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">ID Back</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.idBack ? (
                            <Image
                              src={selectedApplication.documents.idBack || "/placeholder.svg"}
                              alt="ID Back"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No image provided
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Selfie with ID</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.selfie ? (
                            <Image
                              src={selectedApplication.documents.selfie || "/placeholder.svg"}
                              alt="Selfie with ID"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No image provided
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Business Certificate</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.businessCertificate ? (
                            <Image
                              src={selectedApplication.documents.businessCertificate || "/placeholder.svg"}
                              alt="Business Certificate"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No image provided
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Utility Bill</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.utilityBill ? (
                            <Image
                              src={selectedApplication.documents.utilityBill || "/placeholder.svg"}
                              alt="Utility Bill"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No image provided
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Bank Statement (Optional)</p>
                        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
                          {selectedApplication.documents.bankStatement ? (
                            <Image
                              src={selectedApplication.documents.bankStatement || "/placeholder.svg"}
                              alt="Bank Statement"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              Not provided (optional)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Application Status</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <div className="mt-1">
                          {selectedApplication.verificationStatus === "pending" ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending Review
                            </Badge>
                          ) : selectedApplication.verificationStatus === "approved" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submission Date</p>
                        <p className="font-medium">
                          {new Date(selectedApplication.createdAt).toLocaleDateString()} at {" "}
                          {new Date(selectedApplication.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex items-center justify-between">
              <div>
                {selectedApplication.verificationStatus === "pending" ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                  </Badge>
                ) : selectedApplication.verificationStatus === "approved" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    <XCircle className="mr-1 h-3 w-3" />
                    Rejected
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {selectedApplication.verificationStatus === "pending" && (
                  <>
                    <Button variant="outline" onClick={handleRejectApplication} disabled={isProcessingAction}>
                      {isProcessingAction ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button onClick={handleApproveApplication} disabled={isProcessingAction}>
                      {isProcessingAction ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                  </>
                )}
                {selectedApplication.verificationStatus !== "pending" && (
                  <Button variant="outline" onClick={() => setIsViewingApplication(false)}>
                    Close
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
