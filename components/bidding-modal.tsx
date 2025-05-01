"use client"

import { DialogTitle } from "@/components/ui/dialog"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import { getProductById } from "@/lib/product-data"

type Message = {
  role: "user" | "bot"
  content: string
}

type BiddingModalProps = {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    price: number
    storeId: number
    image?: string
  }
  isPremiumUser: boolean
  onBidAccepted: (productId: number, newPrice: number) => void
}

export default function BiddingModal({ isOpen, onClose, product, isPremiumUser, onBidAccepted }: BiddingModalProps) {
  // Ensure the product has a proper image
  const productWithImage = product.image
    ? product
    : {
        ...product,
        image: getProductById(product.id).image,
      }
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [language, setLanguage] = useState("english")
  const [currentBid, setCurrentBid] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isConfirming, setIsConfirming] = useState(false)

  // Calculate minimum acceptable price (70% of original)
  const minPrice = Math.floor(product.price * 0.7)

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen) {
      // Ensure the product has a proper image
      if (!productWithImage.image) {
        productWithImage.image = getProductById(productWithImage.id).image
      }

      const welcomeMessage = getWelcomeMessage(language, productWithImage.name, productWithImage.price)
      setMessages([{ role: "bot", content: welcomeMessage }])
      setCurrentBid(null)
    }
  }, [isOpen, language, productWithImage.name, productWithImage.price, productWithImage])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get welcome message based on selected language
  const getWelcomeMessage = (lang: string, productName: string, price: number) => {
    switch (lang) {
      case "french":
        return `Bonjour! Je suis votre assistant de négociation pour ${productName}. Le prix actuel est de ${price} FCFA. Vous pouvez négocier jusqu'à 30% de réduction. Quelle est votre offre?`
      case "pidgin":
        return `How now! I be your bargain assistant for ${productName}. The price na ${price} FCFA. You fit negotiate up to 30% discount. How much you wan pay?`
      default:
        return `Hello! I'm your negotiation assistant for ${productName}. The current price is ${price} FCFA. You can negotiate up to 30% discount. What's your offer?`
    }
  }

  // Extract price from user message
  const extractPrice = (message: string): number | null => {
    const priceMatch = message.match(/\b(\d{3,4})\b/)
    return priceMatch ? Number.parseInt(priceMatch[1]) : null
  }

  // Get bot response based on bid and language
  const getBotResponse = (bid: number | null, lang: string): string => {
    if (bid === null) {
      switch (lang) {
        case "french":
          return "Je n'ai pas compris votre offre. Veuillez indiquer un prix en FCFA."
        case "pidgin":
          return "I no understand your offer. Abeg tell me the price for FCFA."
        default:
          return "I didn't understand your offer. Please provide a price in FCFA."
      }
    }

    // If bid is too low (below 70% of original price)
    if (bid < minPrice) {
      const discount = Math.round(((product.price - minPrice) / product.price) * 100)

      switch (lang) {
        case "french":
          return `Désolé, votre offre est trop basse. Je ne peux pas accepter moins de ${minPrice} FCFA (${discount}% de réduction). Veuillez faire une autre offre.`
        case "pidgin":
          return `Sorry o, your offer too low. I no fit accept less than ${minPrice} FCFA (${discount}% discount). Make you try another price.`
        default:
          return `Sorry, your offer is too low. I cannot accept less than ${minPrice} FCFA (${discount}% discount). Please make another offer.`
      }
    }

    // If bid is acceptable but not the best deal
    if (bid > minPrice && bid < product.price) {
      const discount = Math.round(((product.price - bid) / product.price) * 100)
      const counterOffer = Math.max(minPrice, Math.floor(bid * 0.95))

      // If close to minimum price, accept the offer
      if (bid <= minPrice + (product.price - minPrice) * 0.2) {
        switch (lang) {
          case "french":
            return `Félicitations! J'accepte votre offre de ${bid} FCFA (${discount}% de réduction). Cliquez sur "Accepter l'offre" pour confirmer.`
          case "pidgin":
            return `Correct! I accept your offer of ${bid} FCFA (${discount}% discount). Click "Accept Offer" to confirm.`
          default:
            return `Great! I accept your offer of ${bid} FCFA (${discount}% discount). Click "Accept Offer" to confirm.`
        }
      }

      // Otherwise counter offer
      switch (lang) {
        case "french":
          return `Hmm, que diriez-vous de ${counterOffer} FCFA? C'est une meilleure offre.`
        case "pidgin":
          return `Hmm, wetin you think about ${counterOffer} FCFA? Na better offer o.`
        default:
          return `Hmm, how about ${counterOffer} FCFA? That's a better deal.`
      }
    }

    // If bid is the original price or higher
    if (bid >= product.price) {
      switch (lang) {
        case "french":
          return `Vous n'avez pas besoin de payer le prix complet! Je peux vous offrir une réduction. Que diriez-vous de ${Math.floor(product.price * 0.9)} FCFA?`
        case "pidgin":
          return `You no need pay full price! I fit give you discount. Wetin you think about ${Math.floor(product.price * 0.9)} FCFA?`
        default:
          return `You don't need to pay the full price! I can offer you a discount. How about ${Math.floor(product.price * 0.9)} FCFA?`
      }
    }

    // If bid is exactly the minimum price
    if (bid === minPrice) {
      const discount = Math.round(((product.price - minPrice) / product.price) * 100)

      switch (lang) {
        case "french":
          return `Vous avez trouvé mon meilleur prix! J'accepte votre offre de ${bid} FCFA (${discount}% de réduction). Cliquez sur "Accepter l'offre" pour confirmer.`
        case "pidgin":
          return `You don find my best price! I accept your offer of ${bid} FCFA (${discount}% discount). Click "Accept Offer" to confirm.`
        default:
          return `You've found my best price! I accept your offer of ${bid} FCFA (${discount}% discount). Click "Accept Offer" to confirm.`
      }
    }

    return "Let me think about your offer..."
  }

  // Handle user message submission
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const newMessages = [...messages, { role: "user", content: inputValue }]
    setMessages(newMessages)
    setInputValue("")
    setIsProcessing(true)

    // Extract price from user message
    const extractedPrice = extractPrice(inputValue)
    setCurrentBid(extractedPrice)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(extractedPrice, language)
      setMessages([...newMessages, { role: "bot", content: botResponse }])
      setIsProcessing(false)

      // Check if this is an acceptance message
      if (
        extractedPrice !== null &&
        extractedPrice >= minPrice &&
        extractedPrice < product.price &&
        (botResponse.includes("accept your offer") ||
          botResponse.includes("accepte votre offre") ||
          botResponse.includes("accept your offer"))
      ) {
        setCurrentBid(extractedPrice)
      }
    }, 1000)
  }

  // Update the handleAcceptBid function to be more prominent and show a confirmation step
  const handleAcceptBid = () => {
    if (currentBid !== null && currentBid >= minPrice) {
      // Add a confirmation message before closing
      setMessages([
        ...messages,
        {
          role: "bot",
          content:
            language === "french"
              ? `Prix confirmé! Votre nouveau prix pour ${product.name} est ${currentBid} FCFA.`
              : language === "pidgin"
                ? `Price don confirm! Your new price for ${product.name} na ${currentBid} FCFA.`
                : `Price confirmed! Your new price for ${product.name} is ${currentBid} FCFA.`,
        },
      ])

      // Show success animation
      setIsConfirming(true)

      // Update the price
      onBidAccepted(product.id, currentBid)

      // Show success toast
      toast({
        title: "Bid accepted!",
        description: `Your negotiated price of ${currentBid} FCFA for ${product.name} has been saved.`,
      })

      // Close the modal after a short delay to show the confirmation
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Negotiate Price
            <Badge variant="outline" className="ml-2">
              Premium Feature
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Negotiate the price for {product.name} - Current price: {product.price} FCFA
          </DialogDescription>
        </DialogHeader>

        {!isPremiumUser ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Price negotiation is available exclusively for premium users. Upgrade your account to access this feature.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">Upgrade to Premium</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Language:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="pidgin">Pidgin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">Min price:</span>
                <span className="font-medium">{minPrice} FCFA</span>
                <span className="text-muted-foreground ml-1">(30% off)</span>
              </div>
            </div>

            <div className="h-[300px] overflow-y-auto border rounded-md p-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex mb-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === "user" ? "bg-green-600 text-white" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter your offer..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isConfirming && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Price Updated!</h3>
                <p className="text-center text-green-600 max-w-xs">
                  {language === "french"
                    ? `Votre nouveau prix pour ${product.name} est ${currentBid} FCFA.`
                    : language === "pidgin"
                      ? `Your new price for ${product.name} na ${currentBid} FCFA.`
                      : `Your new price for ${product.name} is ${currentBid} FCFA.`}
                </p>
              </div>
            )}
            <DialogFooter className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-1">
                {currentBid !== null && currentBid >= minPrice && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Offer acceptable
                  </div>
                )}
                {currentBid !== null && currentBid < minPrice && (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Offer too low
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} disabled={isConfirming}>
                  Cancel
                </Button>
                <Button
                  className={`${isConfirming ? "bg-green-700" : "bg-green-600 hover:bg-green-700"} relative`}
                  disabled={currentBid === null || currentBid < minPrice || isConfirming}
                  onClick={handleAcceptBid}
                  size="lg"
                >
                  {isConfirming ? (
                    <>
                      <span className="opacity-0">Accept Offer</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />
                        Price Updated!
                      </span>
                    </>
                  ) : (
                    <>Accept Offer</>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
