'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Loader2, Power, Store } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Store {
  id: string;
  name: string;
  owner: string;
  type: string;
  status: 'active' | 'inactive' | 'suspended';
  productsCount: number;
  ordersCount: number;
  rating: number;
  createdAt: string;
}

export default function StoresTab() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchActiveStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/store-owners?status=approved');
      if (!response.ok) throw new Error('Failed to fetch stores');
      const data = await response.json();
      
      // Transform the data to match the Store interface
      const activeStores = data.map((store: any) => ({
        id: store._id,
        name: store.storeName,
        owner: store.ownerName,
        type: store.storeType || 'general',
        status: 'active' as const,
        productsCount: store.productsCount || 0,
        ordersCount: store.ordersCount || 0,
        rating: store.rating || 0,
        createdAt: store.createdAt
      }));
      
      setStores(activeStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stores. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to deactivate this store?')) return;
    
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/admin/store-owners/${storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' })
      });
      
      if (!response.ok) throw new Error('Failed to update store status');
      
      await fetchActiveStores();
      toast({
        title: 'Success',
        description: 'Store has been deactivated',
      });
    } catch (error) {
      console.error('Error deactivating store:', error);
      toast({
        title: 'Error',
        description: 'Failed to deactivate store',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchActiveStores();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading stores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Active Stores
              </CardTitle>
              <CardDescription>Manage stores currently operating on the platform</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Store className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No active stores found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no active stores at the moment
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 bg-muted p-4 text-sm font-medium">
                <div className="col-span-3">Store Name</div>
                <div className="col-span-2">Owner</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Products</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
              <div className="divide-y">
                {stores.map((store) => (
                  <div key={store.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center">
                    <div className="col-span-3 font-medium">{store.name}</div>
                    <div className="col-span-2">{store.owner}</div>
                    <div className="col-span-2">
                      {store.type === 'general' ? 'General Grocery' : 
                       store.type === 'fruits' ? 'Fruits & Vegetables' : 
                       store.type === 'spices' ? 'Spices & Grains' : 
                       store.type === 'meat' ? 'Meat & Fish' : store.type}
                    </div>
                    <div className="col-span-2">{store.productsCount} products</div>
                    <div className="col-span-2">
                      <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                        {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push(`/store/${store.id}`)}
                        title="View store details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeactivateStore(store.id)}
                        disabled={isProcessing}
                        title="Deactivate store"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                        <span className="sr-only">Deactivate</span>
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
  );
}
