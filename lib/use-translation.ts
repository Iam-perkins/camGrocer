import { useLanguage } from "@/contexts/language-context"

export function useTranslation() {
  const { t, getTranslation, language } = useLanguage()

  // Helper function to get translations with dot notation
  const translate = (key: string, fallback?: string) => {
    const translation = getTranslation(key)
    return translation || fallback || key
  }

  // Helper function to format numbers with currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Helper function to format dates
  const formatDate = (date: Date | string | number) => {
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return {
    t,
    translate,
    formatCurrency,
    formatDate,
    language
  }
}
