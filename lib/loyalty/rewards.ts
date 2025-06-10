export const REWARDS = {
  shipping: [
    {
      id: 'free_shipping_500',
      name: 'Free Shipping',
      description: 'Get free shipping on your next order',
      pointsRequired: 500,
      tier: 'bronze',
      type: 'shipping',
      value: 0,
    },
    {
      id: 'free_shipping_1000',
      name: 'Free Shipping + 10% Discount',
      description: 'Get free shipping and 10% off your next order',
      pointsRequired: 1000,
      tier: 'silver',
      type: 'shipping',
      value: 10,
    },
    {
      id: 'free_shipping_2000',
      name: 'Free Shipping + 15% Discount',
      description: 'Get free shipping and 15% off your next order',
      pointsRequired: 2000,
      tier: 'gold',
      type: 'shipping',
      value: 15,
    },
  ],
  discounts: [
    {
      id: 'discount_10',
      name: '10% Discount Coupon',
      description: '10% off your next purchase',
      pointsRequired: 250,
      tier: 'bronze',
      type: 'discount',
      value: 10,
    },
    {
      id: 'discount_15',
      name: '15% Discount Coupon',
      description: '15% off your next purchase',
      pointsRequired: 500,
      tier: 'silver',
      type: 'discount',
      value: 15,
    },
    {
      id: 'discount_20',
      name: '20% Discount Coupon',
      description: '20% off your next purchase',
      pointsRequired: 1000,
      tier: 'gold',
      type: 'discount',
      value: 20,
    },
    {
      id: 'discount_25',
      name: '25% Discount Coupon',
      description: '25% off your next purchase',
      pointsRequired: 2000,
      tier: 'platinum',
      type: 'discount',
      value: 25,
    },
  ],
  products: [
    {
      id: 'product_gift_1000',
      name: 'Free Product Gift',
      description: 'Choose a free product from our selection',
      pointsRequired: 1000,
      tier: 'gold',
      type: 'product',
      value: 0,
    },
    {
      id: 'product_gift_2000',
      name: 'Premium Product Gift',
      description: 'Choose a premium product from our selection',
      pointsRequired: 2000,
      tier: 'platinum',
      type: 'product',
      value: 0,
    },
  ],
  special: [
    {
      id: 'birthday_discount',
      name: 'Birthday Special',
      description: '20% off on your birthday',
      pointsRequired: 0,
      tier: 'bronze',
      type: 'special',
      value: 20,
    },
    {
      id: 'anniversary_gift',
      name: '1-Year Anniversary Gift',
      description: 'Special gift for your 1-year anniversary',
      pointsRequired: 0,
      tier: 'silver',
      type: 'special',
      value: 0,
    },
  ],
} as const;

export type RewardType = keyof typeof REWARDS;
export type Reward = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: RewardType;
  value: number;
};

export const POINTS_SYSTEM = {
  // Points earned per dollar spent
  pointsPerDollar: {
    bronze: 1,
    silver: 1.2,
    gold: 1.5,
    platinum: 2,
  },
  // Bonus points for special actions
  bonusPoints: {
    referral: 500,
    review: 100,
    socialShare: 50,
    newsletterSignup: 100,
  },
  // Points expiration (in days)
  expiration: {
    bronze: 365,
    silver: 730,
    gold: 1095,
    platinum: 1825,
  },
};
