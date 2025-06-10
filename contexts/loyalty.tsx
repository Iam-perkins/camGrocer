import { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../models/user';
import { useSession } from 'next-auth/react';

interface LoyaltyContextType {
  points: number;
  tier: string;
  totalSpent: number;
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    redeemed: boolean;
  }>;
  redeemReward: (rewardId: string) => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  updateTotalSpent: (amount: number) => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: React.ReactNode }) {
  const [loyaltyState, setLoyaltyState] = useState({
    points: 0,
    tier: 'bronze',
    totalSpent: 0,
    rewards: [],
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Fetch loyalty data from API
      fetchLoyaltyData(session.user.email);
    }
  }, [session]);

  const fetchLoyaltyData = async (email: string) => {
    try {
      const response = await fetch(`/api/loyalty/${email}`);
      const data = await response.json();
      setLoyaltyState(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    }
  };

  const redeemReward = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/loyalty/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });
      const data = await response.json();
      setLoyaltyState(data);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const updatePoints = async (points: number) => {
    try {
      const response = await fetch(`/api/loyalty/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });
      const data = await response.json();
      setLoyaltyState(data);
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const updateTotalSpent = async (amount: number) => {
    try {
      const response = await fetch(`/api/loyalty/spent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      setLoyaltyState(data);
    } catch (error) {
      console.error('Error updating total spent:', error);
    }
  };

  return (
    <LoyaltyContext.Provider
      value={{
        ...loyaltyState,
        redeemReward,
        updatePoints,
        updateTotalSpent,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}
