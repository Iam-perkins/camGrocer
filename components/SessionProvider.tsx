// components/SessionProvider.tsx
"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { type Session } from "next-auth" // Import the Session type for proper type checking

// Define the props that your custom SessionProvider will accept
interface CustomSessionProviderProps {
  children: React.ReactNode;
  // Declare that it accepts a 'session' prop, which can be a Session object or null/undefined
  session?: Session | null; 
}

// Update your SessionProvider component to accept the 'session' prop
export function SessionProvider({ children, session }: CustomSessionProviderProps) {
  return (
    // Pass the 'session' prop down to NextAuth.js's official SessionProvider
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}