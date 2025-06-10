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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Filter,
  Download,
  RefreshCw,
  Settings,
  User,
  LogOut,
  Bell,
  HelpCircle,
  BarChart2,
  CreditCard,
  FileText,
  Calendar,
  Tag,
  Box,
  Truck,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  ShoppingBag,
  Activity,
  PieChart
} from 'lucide-react';

// Mock Data
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', date: '2025-06-10', amount: 149.99, status: 'completed' },
  { id: '#ORD-002', customer: 'Jane Smith', date: '2025-06-09', amount: 89.99, status: 'processing' },
  { id: '#ORD-003', customer: 'Robert Johnson', date: '2025-06-08', amount: 210.00, status: 'completed' },
  { id: '#ORD-004', customer: 'Emily Davis', date: '2025-06-07', amount: 65.50, status: 'pending' },
  { id: '#ORD-005', customer: 'Michael Brown', date: '2025-06-06', amount: 175.25, status: 'completed' },
];

const topProducts = [
  { name: 'Organic Bananas', category: 'Fruits', price: 2.99, stock: 45, sales: 128 },
  { name: 'Free Range Eggs', category: 'Dairy', price: 4.99, stock: 32, sales: 98 },
  { name: 'Whole Grain Bread', category: 'Bakery', price: 3.49, stock: 28, sales: 87 },
  { name: 'Almond Milk', category: 'Beverages', price: 3.29, stock: 15, sales: 76 },
  { name: 'Organic Spinach', category: 'Vegetables', price: 2.49, stock: 22, sales: 65 },
];

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' }> = {
    completed: { text: 'Completed', variant: 'success' },
    processing: { text: 'Processing', variant: 'default' },
    pending: { text: 'Pending', variant: 'secondary' },
    cancelled: { text: 'Cancelled', variant: 'destructive' },
  };

  const { text, variant } = statusMap[status.toLowerCase()] || { text: status, variant: 'outline' };

  return (
    <Badge variant={variant} className="capitalize">
      {text}
    </Badge>
  );
};

// Stats Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = 'primary'
}: { 
  title: string; 
  value: string; 
  change?: number;
  icon: React.ElementType;
  color?: string;
}) => (
  <Card className="transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
              )}
              {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'} from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function NewDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stats data
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$12,345', 
      change: 12.5, 
      icon: DollarSign,
      color: 'green'
    },
    { 
      title: 'Total Orders', 
      value: '1,234', 
      change: 8.2, 
      icon: ShoppingBag,
      color: 'blue'
    },
    { 
      title: 'Total Products', 
      value: '456', 
      change: 5.7, 
      icon: Package,
      color: 'purple'
    },
    { 
      title: 'Total Customers', 
      value: '2,345', 
      change: 15.3, 
      icon: Users,
      color: 'orange'
    },
  ];

  // Mock data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '#', current: activeTab === 'overview' },
    { name: 'Products', icon: Package, href: '#', current: activeTab === 'products' },
    { name: 'Orders', icon: ShoppingCart, href: '#', count: recentOrders.length, current: activeTab === 'orders' },
    { name: 'Customers', icon: Users, href: '#', current: activeTab === 'customers' },
    { name: 'Analytics', icon: BarChart2, href: '#', current: activeTab === 'analytics' },
    { name: 'Discounts', icon: Tag, href: '#', current: activeTab === 'discounts' },
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 md:flex-col w-64 border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-background">
          <div className="flex items-center flex-shrink-0 px-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">Grocer Admin</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col
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
                  aria-hidden="true"
                />
                {item.name}
                {item.count && (
                  <span className="ml-auto inline-block py-0.5 px-2.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Total sales over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888' }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling products this month</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {topProducts.map((product) => (
                      <div key={product.name} className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center mr-4">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${product.price}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
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
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>${order.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <StatusBadge status={order.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
