// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocationProvider } from "@/contexts/location-context"
import { LanguageProvider } from "@/contexts/language-context"
import { SearchProvider } from "@/contexts/search-context"
import { SessionProvider } from "@/components/SessionProvider"
import { Preloader } from "@/components/preloader"
import { auth } from '@/lib/auth-server-helper'
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CameroonGrocer - Fresh Groceries Across Cameroon",
  description:
    "Shop for fresh groceries from local markets across Cameroon with 24-hour delivery",
  generator: "ME",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <LocationProvider>
              <SessionProvider session={session}>
                <SearchProvider>
                  <div className="relative flex min-h-screen flex-col">
                  <Preloader />
                    <div className="flex-1">
                  {children}
                    </div>
                    <Toaster 
                      position="top-right"
                      expand={true}
                      richColors
                      closeButton
                      theme="light"
                    />
                  </div>
                </SearchProvider>
              </SessionProvider>
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}