'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface WhatsAppChatProps {
  phoneNumber: string;
  productName: string;
  storeName: string;
}

export function WhatsAppChat({ phoneNumber, productName, storeName }: WhatsAppChatProps) {
  // Format the phone number (remove any non-numeric characters)
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  // Create the WhatsApp message with product and store details
  const createMessage = () => {
    return encodeURIComponent(
      `Hello ${storeName}, I'm interested in your product: ${productName}. ` +
      'Could you please provide me with more information?'
    );
  };

  const handleClick = () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const message = createMessage();
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Chat with Vendor
    </Button>
  );
}
