"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "fr"

type Translations = {
  [key: string]: {
    en: string
    fr: string
  }
}

// Common translations used throughout the app
const translations: Translations = {
  // Header
  home: { en: "Home", fr: "Accueil" },
  browse: { en: "Browse", fr: "Parcourir" },
  about: { en: "About", fr: "À propos" },
  contact: { en: "Contact", fr: "Contact" },
  login: { en: "Login", fr: "Connexion" },
  register: { en: "Register", fr: "S'inscrire" },
  search: { en: "Search", fr: "Rechercher" },

  // Checkout
  checkout: { en: "Checkout", fr: "Paiement" },
  orderSummary: { en: "Order Summary", fr: "Résumé de la commande" },
  deliveryAddress: { en: "Delivery Address", fr: "Adresse de livraison" },
  paymentMethod: { en: "Payment Method", fr: "Méthode de paiement" },
  firstName: { en: "First Name", fr: "Prénom" },
  lastName: { en: "Last Name", fr: "Nom" },
  phoneNumber: { en: "Phone Number", fr: "Numéro de téléphone" },
  address: { en: "Address", fr: "Adresse" },
  city: { en: "City", fr: "Ville" },
  region: { en: "Region", fr: "Région" },
  instructions: { en: "Delivery Instructions", fr: "Instructions de livraison" },
  optional: { en: "Optional", fr: "Optionnel" },
  placeOrder: { en: "Place Order", fr: "Passer la commande" },

  // Payment
  mobileMoneyPayment: { en: "Mobile Money Payment", fr: "Paiement Mobile Money" },
  cashOnDelivery: { en: "Cash on Delivery", fr: "Paiement à la livraison" },
  deliveryFee: { en: "Delivery Fee", fr: "Frais de livraison" },
  subtotal: { en: "Subtotal", fr: "Sous-total" },
  total: { en: "Total", fr: "Total" },
  required: { en: "Required", fr: "Obligatoire" },

  // Location
  useMyLocation: { en: "Use My Location", fr: "Utiliser ma position" },
  deliveryLocation: { en: "Delivery Location", fr: "Lieu de livraison" },
  streetAddress: { en: "Street Address", fr: "Adresse" },

  // Success
  orderSuccess: { en: "Order Placed Successfully!", fr: "Commande passée avec succès!" },
  orderConfirmation: {
    en: "Your order has been placed successfully. We have sent a confirmation email to you and the store.",
    fr: "Votre commande a été passée avec succès. Nous avons envoyé un email de confirmation à vous et au magasin.",
  },
  orderDetails: { en: "Order Details", fr: "Détails de la commande" },
  orderId: { en: "Order ID", fr: "ID de commande" },
  totalAmount: { en: "Total Amount", fr: "Montant total" },
  estimatedDelivery: { en: "Estimated Delivery", fr: "Livraison estimée" },
  backToHome: { en: "Back to Home", fr: "Retour à l'accueil" },

  // Cart
  emptyCart: { en: "Your cart is empty", fr: "Votre panier est vide" },
  addItems: {
    en: "You need to add items to your cart before checkout.",
    fr: "Vous devez ajouter des articles à votre panier avant de passer à la caisse.",
  },
  browseProducts: { en: "Browse Products", fr: "Parcourir les produits" },

  // Payment Info
  paymentInfo: {
    en: "Delivery fee payment via Mobile Money is required to process your order. For product payment, you can choose between Mobile Money or Cash on Delivery.",
    fr: "Le paiement des frais de livraison via Mobile Money est requis pour traiter votre commande. Pour le paiement du produit, vous pouvez choisir entre Mobile Money ou Paiement à la livraison.",
  },
  deliveryFeePayment: { en: "Delivery Fee Payment", fr: "Paiement des frais de livraison" },
  productPayment: { en: "Product Payment", fr: "Paiement du produit" },
  payNow: { en: "Pay Now", fr: "Payer maintenant" },

  // Language
  language: { en: "Language", fr: "Langue" },
  english: { en: "English", fr: "Anglais" },
  french: { en: "French", fr: "Français" },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
