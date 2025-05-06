import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocationProvider } from "@/contexts/location-context"
import { LanguageProvider } from "@/contexts/language-context"
import { Preloader } from "@/components/preloader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CameroonGrocer - Fresh Groceries Across Cameroon",
  description: "Shop for fresh groceries from local markets across Cameroon with 24-hour delivery",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <LocationProvider>
              <Preloader />
              {children}
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
