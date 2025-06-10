// app/api/auth/[...nextauth]/route.ts
// This file handles the API endpoints for NextAuth.js.

import NextAuth from "next-auth";
// IMPORTANT: Updated import path to match your project's filename: lib/auth.ts
import { authOptions } from "@/lib/auth"; 

// The NextAuth function is called with your authOptions to create the handlers.
const handler = NextAuth(authOptions);

// Export the GET and POST handlers for Next.js API routes.
export { handler as GET, handler as POST };