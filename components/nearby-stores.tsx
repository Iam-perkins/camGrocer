'use client';

import { useState, useEffect } from 'react';
import { MapPin, Store, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Store {
  id: number;
  name: string;
  distance: string;
  address: string;
  rating: number;
  image: string;
}

interface NearbyStoresProps {
  currentStoreId: number;
  onSelectStore: (store: Store) => void;
}

export function NearbyStores({ currentStoreId, onSelectStore }: NearbyStoresProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Mock data - in a real app, this would come from your API with actual distances
  const mockStores: Store[] = [
    {
      id: 1,
      name: 'Fresh Mart',
      distance: '0.3 km',
      address: '123 Market St, City',
      rating: 4.5,
      image: '/images/stores/store1.jpg'
    },
    {
      id: 2,
      name: 'Green Grocer',
      distance: '0.7 km',
      address: '456 Center Ave, City',
      rating: 4.2,
      image: '/images/stores/store2.jpg'
    },
    {
      id: 3,
      name: 'Local Market',
      distance: '1.1 km',
      address: '789 Oak Rd, City',
      rating: 4.0,
      image: '/images/stores/store3.jpg'
    },
    {
      id: 4,
      name: 'Quick Stop',
      distance: '1.4 km',
      address: '321 Pine St, City',
      rating: 4.3,
      image: '/images/stores/store4.jpg'
    }
  ];
  
  // Filter to show only very close stores (within 1.5 km)
  const veryCloseStores = mockStores.filter(store => {
    // Extract the numeric distance value
    const distance = parseFloat(store.distance.split(' ')[0]);
    return distance <= 1.5;
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Filter out the current store and get nearby stores
      const stores = veryCloseStores.filter(store => store.id !== currentStoreId);
      setNearbyStores(stores);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStoreId]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    onSelectStore(store);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <MapPin className="w-4 h-4 mr-2" />
          Buy from Nearby Store
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Nearby Stores
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : nearbyStores.length > 0 ? (
            nearbyStores.map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={store.image} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-store.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{store.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{store.distance} away</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{store.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {store.address}
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleSelectStore(store)}
                      >
                        Select Store
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No nearby stores found</h3>
              <p className="mt-1 text-sm text-gray-500">We couldn't find any stores within 1.5 km of your location.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
