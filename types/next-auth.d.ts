// types/next-auth.d.ts
// This file extends NextAuth.js types to include ALL custom properties in User, Session, and JWT

import 'next-auth'; // Required to extend the default types
import { DefaultJWT } from 'next-auth/jwt'; // Required to extend the default JWT type

// Extend the default NextAuth 'User' type
declare module 'next-auth' {
  interface User {
    id: string; // Ensure 'id' is consistent; it should always be a string from your API
    email: string;
    name: string;
    type: 'customer' | 'store'; // <-- Added
    verificationStatus: 'pending' | 'approved' | 'rejected'; // <-- Added
    storeId?: string; // Optional because not all users might have a storeId
    storeName?: string; // Optional
    status: 'approved' | 'pending'; // Reflects verification status; <-- Added
    role: 'customer' | 'store' | 'admin'; // <-- Added
    // Add any other custom fields that are part of your User document returned by your API
  }

  // Extend the default NextAuth 'Session' type
  interface Session {
    user: User; // Ensure session.user matches your extended User type
  }
}

// Extend the default NextAuth 'JWT' type
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT { // Extend DefaultJWT to keep standard JWT properties
    id: string; // Ensure 'id' is consistent
    email: string;
    name: string;
    type: 'customer' | 'store'; // <-- Added
    verificationStatus: 'pending' | 'approved' | 'rejected'; // <-- Added
    storeId?: string;
    storeName?: string;
    status: 'approved' | 'pending'; // <-- Added
    role: 'customer' | 'store' | 'admin'; // <-- Added
    // Add any other custom fields you pass through the token
  }
}