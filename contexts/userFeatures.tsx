import { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../models/user';
import { useSession } from 'next-auth/react';

interface UserFeaturesContextType {
  // Wishlist
  wishlist: Array<{
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    addedAt: Date;
    notes: string;
  }>;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  updateWishlistNotes: (productId: string, notes: string) => Promise<void>;

  // Order History
  orderHistory: Array<{
    orderId: string;
    products: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    orderDate: Date;
    status: string;
    shippingAddress: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  }>;
  getOrderDetails: (orderId: string) => Promise<any>;

  // Search History
  searchHistory: Array<{
    query: string;
    timestamp: Date;
    resultsCount: number;
  }>;
  addSearchQuery: (query: string, resultsCount: number) => Promise<void>;

  // Price Comparison
  priceComparison: Array<{
    productId: string;
    name: string;
    prices: Array<{
      retailer: string;
      price: number;
      url: string;
      lastChecked: Date;
    }>;
    lastUpdated: Date;
  }>;
  comparePrices: (productId: string) => Promise<void>;
}

const UserFeaturesContext = createContext<UserFeaturesContextType | undefined>(undefined);

export function UserFeaturesProvider({ children }: { children: React.ReactNode }) {
  const [userFeatures, setUserFeatures] = useState({
    wishlist: [],
    orderHistory: [],
    searchHistory: [],
    priceComparison: [],
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetchUserFeatures(session.user.email);
    }
  }, [session]);

  const fetchUserFeatures = async (email: string) => {
    try {
      const response = await fetch(`/api/user/features/${email}`);
      const data = await response.json();
      setUserFeatures(data);
    } catch (error) {
      console.error('Error fetching user features:', error);
    }
  };

  const addToWishlist = async (product: any) => {
    try {
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      setUserFeatures((prev) => ({ ...prev, wishlist: data.wishlist }));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setUserFeatures((prev) => ({ ...prev, wishlist: data.wishlist }));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const updateWishlistNotes = async (productId: string, notes: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${productId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      setUserFeatures((prev) => ({ ...prev, wishlist: data.wishlist }));
    } catch (error) {
      console.error('Error updating wishlist notes:', error);
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/user/orders/${orderId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  const addSearchQuery = async (query: string, resultsCount: number) => {
    try {
      const response = await fetch('/api/user/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, resultsCount }),
      });
      const data = await response.json();
      setUserFeatures((prev) => ({ ...prev, searchHistory: data.searchHistory }));
    } catch (error) {
      console.error('Error adding search query:', error);
    }
  };

  const comparePrices = async (productId: string) => {
    try {
      const response = await fetch(`/api/user/compare-prices/${productId}`);
      const data = await response.json();
      setUserFeatures((prev) => ({ ...prev, priceComparison: data.priceComparison }));
    } catch (error) {
      console.error('Error comparing prices:', error);
    }
  };

  return (
    <UserFeaturesContext.Provider
      value={{
        ...userFeatures,
        addToWishlist,
        removeFromWishlist,
        updateWishlistNotes,
        getOrderDetails,
        addSearchQuery,
        comparePrices,
      }}
    >
      {children}
    </UserFeaturesContext.Provider>
  );
}

export function useUserFeatures() {
  const context = useContext(UserFeaturesContext);
  if (context === undefined) {
    throw new Error('useUserFeatures must be used within a UserFeaturesProvider');
  }
  return context;
}
