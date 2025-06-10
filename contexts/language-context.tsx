"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "fr"

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  getTranslation: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Initialize language from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
        setLanguageState(savedLanguage)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Update localStorage whenever language changes
  useEffect(() => {
    try {
      localStorage.setItem("language", language)
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }, [language])

  // Handle language changes from child components
  const setLanguage = (lang: Language) => {
    if (lang !== language) {
      setLanguageState(lang)
    }
  }

  const t = (key: string): string => {
    return getTranslation(key)
  }

  const getTranslation = (key: string): string => {
    // Split nested keys with dot notation
    const keys = key.split('.')
    let current: any = translations[language]
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return key // Return original key if translation not found
      }
    }

    return typeof current === 'string' ? current : key
  }

  // Provide a default value even when not mounted to prevent errors
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    getTranslation,
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
