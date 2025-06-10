import { ObjectId } from 'mongodb';

export interface PendingStoreOwner {
  _id?: ObjectId;
  storeName: string;
  ownerName: string;
  email: string;
  password: string; // Hashed password
  phone: string;
  address: string;
  storeType: string;
  description?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add any additional fields you need for store owners
}
