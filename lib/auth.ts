// lib/auth-options.ts
// This file ONLY defines the NextAuth.js configuration (authOptions).

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// IMPORTANT: The 'declare module' blocks for 'next-auth' and 'next-auth/jwt'
// are NOT in this file. They should be in a separate file like next-auth.d.ts
// to avoid "All declarations of 'id' must have identical modifiers" errors.

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Authorize: Missing email or password.');
          return null; // Return null if credentials are missing
        }

        try {
          // --- THIS IS THE CRUCIAL PART: CALL YOUR CUSTOM LOGIN API ---
          // Ensure process.env.NEXTAUTH_URL is correctly set in your .env.local
          console.log(`Authorize: Calling custom login API at ${process.env.NEXTAUTH_URL}/api/auth/login`);
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Check if the custom API response was successful (e.g., status 200 OK)
          if (!res.ok) {
            const errorData = await res.json();
            console.error('Authorize: Custom login API returned error:', errorData.error);
            // Throw an error here so NextAuth can catch it and potentially display a message
            throw new Error(errorData.error || 'Login failed, please check your credentials.');
          }

          const responseBody = await res.json();
          // The 'user' property from your custom API's successful JSON response
          const user = responseBody.user; 

          console.log('Authorize: User object received from custom login API:', user);

          if (user) {
            // Return the user object. NextAuth will then pass this 'user' object
            // to the 'jwt' callback.
            return user;
          } else {
            console.log('Authorize: No user object in custom API response, returning null.');
            return null; // Authentication failed
          }
        } catch (error: any) {
          console.error('Authorize: Error during custom API call:', error.message);
          // Return null or re-throw the error to signify authentication failure
          throw new Error(error.message || 'An error occurred during login. Please try again.');
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Your custom sign-in page path
    signOut: "/auth/logout", // Your custom sign-out page path
    error: "/auth/error",   // Your custom error page path
  },
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 7 * 24 * 60 * 60, // Session duration (e.g., 7 days)
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Secret for signing JWTs
  },
  secret: process.env.NEXTAUTH_SECRET, // General secret for NextAuth.js (for older versions or general use)
  callbacks: {
    // The JWT callback: Called when a JWT is created (on sign-in) or updated
    async jwt({ token, user, account, trigger, session }) {
      // console.log('JWT Callback: token=', token, 'user=', user, 'account=', account, 'trigger=', trigger, 'session=', session); // Keep this for your own debugging if needed

      // 'user' is only available on the first sign-in (after authorize returns)
      if (user) {
        // Transfer all necessary properties from the 'user' object (from authorize) to the 'token'
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.type = user.type;
        token.verificationStatus = user.verificationStatus;
        token.storeId = user.storeId;       // Transfer custom storeId
        token.storeName = user.storeName;   // Transfer custom storeName
        token.status = user.status;
        token.role = user.role;
        // Add any other custom fields you want to pass through the token
      }

      // Handle updates to the session (e.g., from client-side useSession().update())
      if (trigger === 'update' && session) {
        // Here, 'session' contains the data passed to update()
        // Merge or update specific fields in the token based on the 'session' data
        return { ...token, ...session }; 
      }
      
      return token; // Return the modified token
    },

    // The Session callback: Called whenever a session is checked (e.g., on page load, useSession hook)
    async session({ session, token }) {
      // console.log('Session Callback: session=', session, 'token=', token); // Keep this for your own debugging if needed

      // Populate 'session.user' with data from the 'token'
      // This is what 'useSession()' on the frontend will receive
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.type = token.type;
        session.user.verificationStatus = token.verificationStatus;
        session.user.storeId = token.storeId;       // Populate session.user.storeId
        session.user.storeName = token.storeName;   // Populate session.user.storeName
        session.user.status = token.status;
        session.user.role = token.role;
        // Add any other custom fields you want to be available in session.user
      }
      return session; // Return the modified session
    },
  },
}