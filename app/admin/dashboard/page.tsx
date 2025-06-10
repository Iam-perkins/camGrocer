"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Upload, X, Plus, ImageIcon, Package, Store, Users, ShoppingCart, LogOut, User as UserIcon, ChevronDown, Edit, Trash2, Home, Settings, BarChart, Bell, HelpCircle, Globe, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StoreProfileForm } from '@/components/store/store-profile-form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SiteFooter } from '@/components/site-footer';
import { categoryImages } from "@/lib/product-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Dimensions {
  length: string;
  width: string;
  height: string;
  unit: 'cm' | 'in';
}

interface ProductVariant {
  name: string; // e.g., 'Color', 'Size'
  options: string[]; // e.g., ['Red', 'Blue', 'Green']
  values: Record<string, string>; // e.g., { 'Red': '#FF0000' }
}

type Product = {
  _id: string;
  // Basic Information
  name: string;
  description: string;
  brand: string;
  barcode: string;
  sku: string;
  
  // Pricing
  costPrice: string;
  sellingPrice: string;
  taxRate: string;
  
  // Inventory
  stock: string;
  minStockLevel: string;
  isTrackInventory: boolean;
  
  // Product Details
  category: string;
  subcategory: string;
  tags: string[];
  
  // Media
  images: string[];
  
  // Physical Attributes
  weight: string;
  weightUnit: 'g' | 'kg' | 'lb' | 'oz';
  dimensions: Dimensions;
  
  // Variants
  hasVariants: boolean;
  variants: ProductVariant[];
  
  // Shipping
  isShippable: boolean;
  shippingWeight: string;
  shippingWeightUnit: 'g' | 'kg' | 'lb' | 'oz';
  
  // Supplier
  supplierName: string;
  supplierCode: string;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  isTaxable: boolean;
  
  // Dates
  availableFrom: string;
  availableTo: string;
  
  // System
  storeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type StoreInfo = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const user = session?.user;
  
  // Debug session data
  useEffect(() => {
    console.log('Session:', session);
    console.log('User:', user);
    if (user) {
      console.log('Store name from session:', user.storeName);
      console.log('User ID from session:', user.id);
    }
  }, [session, user]);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]); // Initialize with empty array
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const initialFormData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'storeId'> = {
    // Basic Information
    name: '',
    description: '',
    brand: '',
    barcode: '',
    sku: `SKU-${Date.now()}`,
    
    // Pricing
    costPrice: '0',
    sellingPrice: '0',
    taxRate: '0',
    
    // Inventory
    stock: '0',
    minStockLevel: '5',
    isTrackInventory: true,
    
    // Product Details
    category: '',
    subcategory: '',
    tags: [],
    
    // Media
    images: [],
    
    // Physical Attributes
    weight: '0',
    weightUnit: 'kg',
    dimensions: {
      length: '0',
      width: '0',
      height: '0',
      unit: 'cm' as const
    },
    
    // Variants
    hasVariants: false,
    variants: [],
    
    // Shipping
    isShippable: true,
    shippingWeight: '0',
    shippingWeightUnit: 'kg',
    
    // Supplier
    supplierName: '',
    supplierCode: '',
    
    // Status
    isActive: true,
    isFeatured: false,
    isTaxable: true,
    
    // Availability
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
  };

  const [formData, setFormData] = useState<Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'storeId'>>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  // Fetch store data and products
  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setIsLoading(true);
        
        // First get store info
        const storeResponse = await fetch('/api/store');
          if (storeResponse.ok) {
            const storeData = await storeResponse.json();
            setStore(storeData);
          setShowProfileAlert(false); // Hide alert if store exists
        } else if (storeResponse.status === 404) {
          setShowProfileAlert(true); // Show alert if store doesn't exist
          setStore(null);
          } else {
            console.error('Failed to fetch store:', await storeResponse.text());
          }
          
          // Fetch products for this store
        const storeId = session?.user?.storeId;
        if (storeId) {
          const productsResponse = await fetch(`/api/products?storeId=${storeId}`);
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            setProducts(Array.isArray(productsData) ? productsData : []);
          } else {
            console.error('Failed to fetch products:', await productsResponse.text());
            setProducts([]);
          }
        } else {
          console.log('No store ID found in session');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load store data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a session
    if (session?.user) {
      fetchStoreAndProducts();
    } else {
      // If no session, set loading to false
      setIsLoading(false);
    }
  }, [session?.user]); // Re-run when user changes

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const newImages: string[] = [];
    const errors: string[] = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!validTypes.includes(file.type)) {
        errors.push(`Skipped ${file.name}: Invalid file type (must be JPEG, PNG, WebP, or AVIF)`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        errors.push(`Skipped ${file.name}: File size exceeds 5MB`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      
      try {
        setIsUploading(true);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
        
        newImages.push(data.url);
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        errors.push(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update form data with new images
    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      
      toast({
        title: 'Success',
        description: `Uploaded ${newImages.length} image(s) successfully`,
      });
    }

    // Show any errors that occurred
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: 'Upload Warning',
          description: error,
          variant: 'destructive',
        });
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setIsUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (name.startsWith('dimensions.')) {
      const dimField = name.split('.')[1] as keyof Dimensions;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...(prev.dimensions || {
            length: '0',
            width: '0',
            height: '0',
            unit: 'cm'
          }),
          [dimField]: value
        }
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Form data:', formData);
      
      // Ensure required fields are present and have valid values
      const requiredFields = ['name','brand', 'sku', 'category', 'sellingPrice'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Parse numeric values with proper error handling
      const costPrice = parseFloat(formData.costPrice) || 0;
      const sellingPrice = parseFloat(formData.sellingPrice);
      const taxRate = parseFloat(formData.taxRate) || 0;
      const stock = parseInt(formData.stock, 10) || 0;
      const minStockLevel = parseInt(formData.minStockLevel, 10) || 0;
      const weight = parseFloat(formData.weight) || 0;
      const shippingWeight = parseFloat(formData.shippingWeight) || 0;
      
      // Use a default store ID if not available in session
      const storeId = session?.user?.storeId || '65d1a2b3e4f5a6b7c8d9e0f1';
      let storeName = 'Default Store';
      
      try {
        // First try to get store name from session if available
        if (session?.user?.storeName) {
          storeName = session.user.storeName;
          console.log('Using store name from session:', storeName);
        } 
        // If not in session, try to get from database
        else if (session?.user?.id) {
          const userId = session.user.id;
          console.log('Fetching store name for user ID:', userId);
          
          // Try to get store owner data
          const storeOwnerResponse = await fetch(`/api/store-owners?userId=${storeId}`);
          
          if (storeOwnerResponse.ok) {
            const storeOwnerData = await storeOwnerResponse.json();
            console.log('Store owner data:', storeOwnerData);
            
            if (storeOwnerData?.storeName) {
              storeName = storeOwnerData.storeName;
              console.log('Found store name from store owner:', storeName);
            } else if (storeOwnerData?.storeId) {
              // If we have a storeId but no name, try to get the store details
              console.log('No store name in owner data, trying to fetch store details');
              const storeResponse = await fetch(`/api/store-owners/${storeOwnerData.storeId}`);
              if (storeResponse.ok) {
                const storeData = await storeResponse.json();
                storeName = storeData.name || storeName;
                console.log('Found store name from stores collection:', storeName);
              }
            } else {
              console.log('No store data found for user, using default store name');
            }
          } else {
            console.error('Failed to fetch store owner:', await storeOwnerResponse.text());
          }
        } else {
          console.warn('No user ID found in session. Using default store name.');
          console.log('Session user:', session?.user);
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
        // Continue with default store name if there's an error
      }

      // Prepare the product data
      const productData = {
        name: formData.name,
        description: formData.description || '',
        brand: formData.brand || '',
        barcode: formData.barcode || '',
        sku: formData.sku,
        costPrice: costPrice.toString(),
        sellingPrice: sellingPrice.toString(),
        taxRate,
        stock,
        minStockLevel,
        isTrackInventory: formData.isTrackInventory !== false,
        category: formData.category,
        subcategory: formData.subcategory || '',
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        images: Array.isArray(formData.images) ? formData.images.filter(Boolean) : [],
        weight,
        weightUnit: formData.weightUnit || 'g',
        dimensions: {
          length: parseFloat(formData.dimensions?.length) || 0,
          width: parseFloat(formData.dimensions?.width) || 0,
          height: parseFloat(formData.dimensions?.height) || 0,
          unit: formData.dimensions?.unit || 'cm'
        },
        hasVariants: formData.hasVariants || false,
        variants: Array.isArray(formData.variants) ? formData.variants : [],
        isShippable: formData.isShippable !== false,
        shippingWeight,
        shippingWeightUnit: formData.shippingWeightUnit || 'g',
        supplierName: formData.supplierName || '',
        supplierCode: formData.supplierCode || '',
        isActive: formData.isActive !== false,
        isFeatured: formData.isFeatured || false,
        isTaxable: formData.isTaxable !== false,
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : new Date().toISOString(),
        availableTo: formData.availableTo || '',
        storeId: storeId,
        storeName: storeName,
        currency: 'XAF'
      };

      console.log('Submitting product data:', productData);

      const method = editingProduct ? 'PATCH' : 'POST';
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('API Error Response:', responseData);
          throw new Error(responseData.error || 'Failed to save product');
        }

        console.log('API Response:', responseData);

        // Update local state with the response data
        if (editingProduct) {
          setProducts(prevProducts => 
            prevProducts.map(p => p._id === editingProduct._id ? {
              ...responseData,
              _id: responseData.id || responseData._id // Ensure we have the correct ID
            } : p)
          );
        } else {
          setProducts(prevProducts => [...prevProducts, {
            ...responseData,
            _id: responseData.id || responseData._id // Ensure we have the correct ID
          }]);
        }

        toast({
          title: 'Success',
          description: editingProduct ? 'Product updated successfully' : 'Product added successfully',
        });
        
        setIsEditing(false);
        setEditingProduct(null);
        setFormData(initialFormData);

        // Refresh the products list to ensure we have the latest data
        const refreshResponse = await fetch(`/api/products?storeId=${storeId}`);
        if (refreshResponse.ok) {
          const refreshedProducts = await refreshResponse.json();
          setProducts(Array.isArray(refreshedProducts) ? refreshedProducts.map(product => ({
            ...product,
            _id: product.id || product._id // Ensure consistent ID field
          })) : []);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred while saving the product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...initialFormData, // Start with default values
      ...product, // Override with product data
      costPrice: product.costPrice?.toString() || '0',
      sellingPrice: product.sellingPrice?.toString() || '0',
      taxRate: product.taxRate?.toString() || '0',
      stock: product.stock?.toString() || '0',
      minStockLevel: product.minStockLevel?.toString() || '5',
      weight: product.weight?.toString() || '0',
      shippingWeight: product.shippingWeight?.toString() || '0',
      dimensions: {
        ...initialFormData.dimensions, // Start with default dimensions
        ...product.dimensions, // Override with product dimensions
        length: product.dimensions?.length?.toString() || '0',
        width: product.dimensions?.width?.toString() || '0',
        height: product.dimensions?.height?.toString() || '0',
        unit: product.dimensions?.unit || 'cm'
      },
      availableFrom: product.availableFrom?.split('T')[0] || initialFormData.availableFrom,
      availableTo: product.availableTo?.split('T')[0] || initialFormData.availableTo,
      tags: product.tags || [],
      images: product.images || []
    });
    setIsEditing(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Update local state
      setProducts(products.filter(p => p._id !== id));
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        window.location.href = '/auth/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const storeName = session?.user?.storeName || 'Your Store';
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || 'user@example.com';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">{storeName}</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                <span>{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-sm">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{user?.email || 'user@example.com'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r bg-muted/50 hidden md:block">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
              <div className="space-y-1">
                <Button 
                  variant={activeTab === 'products' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('products')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button 
                  variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button 
                  variant={activeTab === 'store' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('store')}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Store Profile
                </Button>
                <Button 
                  variant={activeTab === 'analytics' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
            <Separator />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Settings</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {userName}. Here's what's happening with your store.</p>
          </div>

          {/* Store Profile Alert */}
          {showProfileAlert && (
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Complete Your Store Profile</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Please set up your store profile to start managing your products and orders. Click the "Store Profile" tab to get started.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                    <div>
                <CardTitle>Products</CardTitle>
                      <CardDescription>Manage your product catalog</CardDescription>
                    </div>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setFormData(initialFormData);
                  setIsEditing(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">No products</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding a new product.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                        <Card key={product._id || `product-${product.sku}`} className="overflow-hidden group">
                          <div className="aspect-square w-full overflow-hidden relative">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-muted">
                                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <Button 
                                key={`edit-${product._id}`}
                                variant="secondary" 
                                size="icon" 
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                key={`delete-${product._id}`}
                                variant="destructive" 
                                size="icon" 
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                            <div>
                                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                                <div className="text-sm text-muted-foreground">
                                {product.brand && <span className="mr-2">{product.brand}</span>}
                                  {product.sku && <Badge variant="secondary">{product.sku}</Badge>}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg font-semibold">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'XAF',
                                  minimumFractionDigits: 0
                                }).format(parseFloat(product.sellingPrice))}
                                  </p>
                                {parseFloat(product.costPrice) > 0 && (
                                    <p className="text-sm text-muted-foreground line-through">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'XAF',
                                      minimumFractionDigits: 0
                                    }).format(parseFloat(product.costPrice))}
                              </p>
                                  )}
                            </div>
                                <Badge 
                                  variant={parseInt(product.stock) > 0 ? "default" : "destructive"}
                                  className="ml-2"
                                >
                                  {product.stock} in stock
                                </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and manage your store orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No orders yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your store hasn't received any orders yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <StoreProfileForm 
            initialData={store} 
            onSuccess={() => {
              toast({
                title: "Success",
                description: "Store profile updated successfully!",
              });
            }} 
          />
        </TabsContent>

        <TabsContent value="analytics">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <span className="h-4 w-4 text-muted-foreground">XAF</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">XAF0.00</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
          </Card>
              </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>

      {/* Site Footer */}
      <SiteFooter />

      {/* Add/Edit Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(90vh-180px)]">
                <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Cost Price (XAF)</Label>
                      <Input
                        id="costPrice"
                        name="costPrice"
                        type="number"
                        step="1"
                        min="0"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price (XAF) *</Label>
                      <Input
                        id="sellingPrice"
                        name="sellingPrice"
                        type="number"
                        step="1"
                        min="0"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-end h-full">
                        <div className="space-y-2 w-full">
                          <Label htmlFor="taxRate">Tax Rate (%)</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="taxRate"
                              name="taxRate"
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={formData.taxRate}
                              onChange={handleInputChange}
                              className="w-full"
                            />
                            <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                              <input
                                type="checkbox"
                                id="isTaxable"
                                name="isTaxable"
                                checked={formData.isTaxable}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label htmlFor="isTaxable">Taxable</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Current Stock *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStockLevel">Min Stock Level</Label>
                      <Input
                        id="minStockLevel"
                        name="minStockLevel"
                        type="number"
                        min="0"
                        value={formData.minStockLevel}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2 h-10 px-3 border rounded-md w-full">
                        <input
                          type="checkbox"
                          id="isTrackInventory"
                          name="isTrackInventory"
                          checked={formData.isTrackInventory}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isTrackInventory">Track Inventory</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                        <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                        >
                          <option value="">Select a category</option>
                          {Object.keys(categoryImages).map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-24 h-24 rounded-md overflow-hidden border">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...formData.images];
                            newImages.splice(index, 1);
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="relative group">
                      <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center bg-muted/50">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                        multiple
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Upload one or more images. First image will be used as the main product image.
                  </div>
                  {isUploading && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      Weight ({formData.dimensions?.unit === 'cm' ? 'kg' : 'lbs'})
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dimensions</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="dimensions.length" className="text-xs text-muted-foreground">Length</Label>
                      <Input
                        id="dimensions.length"
                        name="dimensions.length"
                        type="number"
                        step="0.01"
                        value={formData.dimensions?.length || '0'}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="dimensions.width" className="text-xs text-muted-foreground">Width</Label>
                      <Input
                        id="dimensions.width"
                        name="dimensions.width"
                        type="number"
                        step="0.01"
                        value={formData.dimensions?.width || '0'}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="dimensions.height" className="text-xs text-muted-foreground">Height</Label>
                      <Input
                        id="dimensions.height"
                        name="dimensions.height"
                        type="number"
                        step="0.01"
                        value={formData.dimensions?.height || '0'}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Unit:</span>
                      <select
                        name="dimensions.unit"
                        value={formData.dimensions?.unit || 'cm'}
                        onChange={(e) => {
                          const unit = e.target.value as 'cm' | 'in';
                          setFormData(prev => ({
                            ...prev,
                            dimensions: {
                              ...(prev.dimensions || {
                                length: '0',
                                width: '0',
                                height: '0',
                                unit: 'cm'
                              }),
                              unit
                            }
                          }));
                        }}
                        className="text-xs border rounded p-1"
                      >
                        <option value="cm">cm</option>
                        <option value="in">inches</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="isFeatured"
                      name="isFeatured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="isFeatured" className="text-sm font-medium">Featured</Label>
                  </div>
                </div>

                <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-background">
                        {formData.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = [...formData.tags];
                                newTags.splice(index, 1);
                                setFormData(prev => ({ ...prev, tags: newTags }));
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <input
                          type="text"
                    id="tags"
                    name="tags"
                          placeholder="Type and press Enter to add tags"
                          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const value = e.currentTarget.value.trim();
                              const tag = value.replace(/^#/, '').trim();
                              if (tag && !formData.tags.includes(tag)) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: [...prev.tags, tag]
                                }));
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter or comma to add tags. Tags will be displayed with # prefix.
                      </p>
                </div>
              </form>
            </CardContent>
              </ScrollArea>
            </div>
            <div className="border-t p-4 bg-muted/50">
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" form="product-form" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
