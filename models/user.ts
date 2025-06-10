import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["buyer", "vendor"], default: "buyer" },
    loyalty: {
      points: { type: Number, default: 0 },
      tier: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" },
      totalSpent: { type: Number, default: 0 },
      lastPurchase: Date,
      lifetimePoints: { type: Number, default: 0 },
      rewards: [{
        id: String,
        name: String,
        description: String,
        pointsRequired: Number,
        redeemed: Boolean,
        redeemedAt: Date
      }]
    },
    wishlist: [{
      productId: String,
      name: String,
      price: Number,
      imageUrl: String,
      addedAt: { type: Date, default: Date.now },
      notes: String
    }],
    orderHistory: [{
      orderId: String,
      products: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
      }],
      totalAmount: Number,
      orderDate: { type: Date, default: Date.now },
      status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
      shippingAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
      }
    }],
    searchHistory: [{
      query: String,
      timestamp: { type: Date, default: Date.now },
      resultsCount: Number
    }],
    priceComparison: [{
      productId: String,
      name: String,
      prices: [{
        retailer: String,
        price: Number,
        url: String,
        lastChecked: Date
      }],
      lastUpdated: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model("User", UserSchema)

export type UserType = {
  _id: string
  name: string
  email: string
  password: string
  role: "buyer" | "vendor"
  loyalty: {
    points: number
    tier: "bronze" | "silver" | "gold" | "platinum"
    totalSpent: number
    lastPurchase: Date
    lifetimePoints: number
    rewards: Array<{
      id: string
      name: string
      description: string
      pointsRequired: number
      redeemed: boolean
      redeemedAt: Date
    }>
  }
  wishlist: Array<{
    productId: string
    name: string
    price: number
    imageUrl: string
    addedAt: Date
    notes: string
  }>
  orderHistory: Array<{
    orderId: string
    products: Array<{
      productId: string
      name: string
      price: number
      quantity: number
    }>
    totalAmount: number
    orderDate: Date
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    shippingAddress: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      country: string
    }
  }>
  searchHistory: Array<{
    query: string
    timestamp: Date
    resultsCount: number
  }>
  priceComparison: Array<{
    productId: string
    name: string
    prices: Array<{
      retailer: string
      price: number
      url: string
      lastChecked: Date
    }>
    lastUpdated: Date
  }>
  createdAt: Date
  updatedAt: Date
}
export type UserWithoutPassword = Omit<UserType, "password"> & {
  password: undefined
}
export type UserWithoutId = Omit<UserType, "_id">