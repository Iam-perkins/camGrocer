"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// UI Components
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip as TooltipComponent, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  Search,
  Settings,
  User,
  LogOut,
  Bell,
  BarChart2,
  Home,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  AlertCircle,
  FileText,
  Building2,
  CreditCard,
  FileCheck,
  Eye,
  Check,
  X,
  RefreshCw,
  Package as PackageIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProductRejectionDialog } from './components/ProductRejectionDialog';
import { StoreOwnerDetailsModal } from './components/StoreOwnerDetailsModal';
import { RejectionDialog } from './components/RejectionDialog';

// Types
type DashboardStats = {
  counts: {
    users: number;
    storeOwners: number;
    products: number;
    orders: number;
    pendingApprovals: number;
  };
  recent: {
    users: any[];
    storeOwners: any[];
    products: any[];
    orders: any[];
  };
};

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
    approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
    completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    processing: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-3 w-3" /> },
    cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
  };

  const statusInfo = statusMap[status.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', icon: null };

  return (
    <Badge className={`inline-flex items-center gap-1 ${statusInfo.color}`}>
      {statusInfo.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// Stats Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = 'primary'
}: { 
  title: string; 
  value: string | number; 
  change?: number;
  icon: React.ElementType;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    green: 'text-green-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change !== undefined && (
              <div className="mt-1 flex items-center">
                <TrendingUp className={`h-4 w-4 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`ml-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={`rounded-lg p-3 ${colorMap[color] || 'bg-primary/10'} ${colorMap[color] || 'text-primary'}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Product approval states
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductRejectionDialog, setShowProductRejectionDialog] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Store owner approval states
  const [selectedStoreOwner, setSelectedStoreOwner] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [currentActionOwner, setCurrentActionOwner] = useState<any>(null);
  
  // Fetch pending products
  const fetchPendingProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch('/api/admin/products/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending products');
      }
      const data = await response.json();
      setPendingProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending products',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle product approval
  const handleApproveProduct = async (productId: string) => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (!response.ok) throw new Error('Failed to approve product');
      
      // Refresh the pending products list
      await fetchPendingProducts();
      
      toast({
        title: 'Success',
        description: 'Product has been approved successfully',
      });
      
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve product',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle product rejection
  const handleRejectProduct = async (product: any) => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject',
          reason: rejectionReason
        }),
      });

      if (!response.ok) throw new Error('Failed to reject product');
      
      // Refresh the pending products list
      await fetchPendingProducts();
      
      toast({
        title: 'Success',
        description: 'Product has been rejected',
      });
      
      setSelectedProduct(null);
      setShowProductRejectionDialog(false);
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject product',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleStoreOwnerClick = async (owner: any) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(`/api/admin/store-owners/${owner._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch store owner details');
      }
      const data = await response.json();
      setSelectedStoreOwner(data);
    } catch (error) {
      console.error('Error fetching store owner details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load store owner details',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleStatusUpdate = async (ownerId: string, status: 'approve' | 'reject') => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(`/api/admin/store-owners/${ownerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the data
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }

      toast({
        title: `Application ${status === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The store owner application has been ${status === 'approve' ? 'approved' : 'rejected'}.`,
      });

      setSelectedStoreOwner(null);
      setShowRejectionDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error(`Error ${status}ing application:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${status} application. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    const initializeData = async () => {
      if (status === 'authenticated') {
        await Promise.all([
          fetchStats(),
          fetchPendingProducts()
        ]);
      } else if (status === 'unauthenticated') {
        router.push('/auth/signin');
      }
    };

    initializeData();
  }, [status, router]);

  // Navigation items
  const navItems = [
    { name: 'Overview', icon: Home, href: '#', current: activeTab === 'overview' },
    { name: 'Products', icon: Package, href: '#', current: activeTab === 'products' },
    { name: 'Store Owners', icon: ShieldCheck, href: '#', current: activeTab === 'store-owners', count: stats?.counts.pendingApprovals },
    { name: 'Users', icon: Users, href: '#', current: activeTab === 'users' },
    { name: 'Orders', icon: ShoppingCart, href: '#', current: activeTab === 'orders' },
    { name: 'Analytics', icon: BarChart2, href: '#', current: activeTab === 'analytics' },
    { name: 'Settings', icon: Settings, href: '#', current: activeTab === 'settings' },
  ];

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading dashboard</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <StoreOwnerDetailsModal
        owner={selectedStoreOwner}
        onClose={() => setSelectedStoreOwner(null)}
        onApprove={(id) => handleStatusUpdate(id, 'approve')}
        onReject={handleRejectClick}
        isLoading={isLoadingDetails}
      />
      
      <RejectionDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
        onReject={() => {
          if (currentActionOwner) {
            handleStatusUpdate(currentActionOwner._id, 'reject');
          }
        }}
        reason={rejectionReason}
        setReason={setRejectionReason}
        isLoading={isLoadingDetails}
      />
      
      <ProductRejectionDialog
        open={showProductRejectionDialog}
        onOpenChange={setShowProductRejectionDialog}
        onReject={() => {
          if (selectedProduct) {
            handleRejectProduct(selectedProduct);
          }
        }}
        reason={selectedProduct?.rejectionReason || ''}
        setReason={(reason) => setSelectedProduct({ ...selectedProduct, rejectionReason: reason })}
        isLoading={isLoadingProducts}
      />
      
      <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 md:flex-col w-64 border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-background">
          <div className="flex items-center flex-shrink-0 px-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">Grocer Admin</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <div className="flex-1 px-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                    item.current
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                    }`}
                  />
                  {item.name}
                  {item.count ? (
                    <span className="ml-auto inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">Master Admin</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-background border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {navItems.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">View notifications</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">
                Products
                {pendingProducts.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                    {pendingProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="store-owners">
                Store Owners
                {stats?.counts?.pendingApprovals > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                    {stats.counts.pendingApprovals}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Total Users" 
                  value={stats?.counts.users || 0} 
                  change={5.7} 
                  icon={Users}
                  color="blue"
                />
                <StatCard 
                  title="Store Owners" 
                  value={stats?.counts.storeOwners || 0} 
                  change={12.5} 
                  icon={ShieldCheck}
                  color="purple"
                />
                <StatCard 
                  title="Total Products" 
                  value={stats?.counts.products || 0} 
                  change={8.2} 
                  icon={Package}
                  color="green"
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats?.counts.orders || 0} 
                  change={15.3} 
                  icon={ShoppingCart}
                  color="orange"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Users */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Newly registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.recent.users.map((user) => (
                        <div key={user._id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="text-sm font-medium">{user.name || 'Unknown User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="ml-auto text-sm text-muted-foreground">
                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ))}
                      {(!stats?.recent.users || stats.recent.users.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent users found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Pending Approvals</CardTitle>
                        <CardDescription>Store owner applications</CardDescription>
                      </div>
                      {stats?.counts.pendingApprovals > 0 && (
                        <Badge variant="destructive" className="px-2 py-1">
                          {stats.counts.pendingApprovals} pending
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.recent.storeOwners
                        .filter(owner => owner.verificationStatus === 'pending')
                        .slice(0, 3)
                        .map((owner) => (
                          <div 
                            key={owner._id} 
                            className="flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => handleStoreOwnerClick(owner)}
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {owner.name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <p className="text-sm font-medium">{owner.store?.storeName || 'New Store'}</p>
                              <p className="text-sm text-muted-foreground">{owner.name}</p>
                            </div>
                            <div className="ml-auto">
                              <StatusBadge status={owner.verificationStatus} />
                            </div>
                          </div>
                        ))}
                      {(!stats?.recent.storeOwners || 
                        stats.recent.storeOwners.filter(owner => owner.verificationStatus === 'pending').length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
                      )}
                    </div>
                  </CardContent>
                  {stats?.counts.pendingApprovals > 0 && (
                    <CardFooter className="border-t p-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/admin/verifications')}
                      >
                        View All Pending Approvals
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.recent.orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">#{order._id.slice(-6).toUpperCase()}</TableCell>
                          <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell className="text-right">
                            <StatusBadge status={order.status || 'processing'} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!stats?.recent.orders || stats.recent.orders.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No recent orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Product Approvals</h2>
              </div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Pending Product Approvals</CardTitle>
                      <CardDescription>
                        Review and approve or reject products submitted by store owners
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchPendingProducts}
                      disabled={isLoadingProducts}
                    >
                      {isLoadingProducts ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : pendingProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <PackageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No products pending approval</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingProducts.map((product) => (
                        <Card key={product._id} className="overflow-hidden">
                          <div className="p-4 flex items-start space-x-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.images[0].alt || product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                  <PackageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h3 className="font-medium text-sm">
                                  <button 
                                    onClick={() => setSelectedProduct(product)}
                                    className="hover:underline text-left"
                                  >
                                    {product.name}
                                  </button>
                                </h3>
                                <p className="font-medium">${product.price?.toFixed(2)}</p>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3 mr-1" />
                                <span>{product.store?.storeName || 'Unknown Store'}</span>
                                <span className="mx-2">•</span>
                                <span>Added {format(new Date(product.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setSelectedProduct(product)}
                                className="w-full"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveProduct(product._id)}
                                disabled={isLoadingProducts}
                                className="w-full"
                              >
                                {isLoadingProducts ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowProductRejectionDialog(true);
                                }}
                                disabled={isLoadingProducts}
                                className="w-full"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Store Owners Tab */}
            <TabsContent value="store-owners" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Store Owner Applications</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>
                    Review and approve or reject store owner applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recent.storeOwners
                      .filter(owner => owner.verificationStatus === 'pending')
                      .slice(0, 3)
                      .map((owner) => (
                        <div 
                          key={owner._id} 
                          className="flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => handleStoreOwnerClick(owner)}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {owner.name?.charAt(0) || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="text-sm font-medium">{owner.store?.storeName || 'New Store'}</p>
                            <p className="text-sm text-muted-foreground">{owner.name}</p>
                          </div>
                          <div className="ml-auto">
                            <StatusBadge status={owner.verificationStatus} />
                          </div>
                        </div>
                      ))}
                    {(!stats?.recent.storeOwners || 
                      stats.recent.storeOwners.filter(owner => owner.verificationStatus === 'pending').length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
                    )}
                  </div>
                </CardContent>
                {stats?.counts.pendingApprovals > 0 && (
                  <CardFooter className="border-t p-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/admin/verifications')}
                    >
                      View All Pending Approvals
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Users</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Newly registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recent.users.map((user) => (
                      <div key={user._id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {user.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{user.name || 'Unknown User'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    ))}
                    {(!stats?.recent.users || stats.recent.users.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent users found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.recent.orders?.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">#{order._id?.slice(-6).toUpperCase()}</TableCell>
                          <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell className="text-right">
                            <StatusBadge status={order.status || 'processing'} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!stats?.recent.orders || stats.recent.orders.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No recent orders found
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
    </>
  );
}
