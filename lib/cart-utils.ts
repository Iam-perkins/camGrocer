// Helper functions for cart operations
type CartItem = {
  id: number;
  quantity: number;
  price: number;
  // Add other cart item properties as needed
};

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
    // Dispatch storage event to sync across components and tabs
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
};

export const getCartCount = (): number => {
  const items = getCartItems();
  return items.reduce((total, item) => total + (item.quantity || 1), 0);
};

export const addToCart = (product: any, quantity: number = 1): { success: boolean; message: string } => {
  try {
    const items = getCartItems();
    const existingItemIndex = items.findIndex((item: any) => item.id === product.id);
    const currentStore = localStorage.getItem('currentStore');
    
    // If cart is empty, set the current store
    if (items.length === 0 && product.store) {
      localStorage.setItem('currentStore', product.store);
    } 
    // Check if product is from a different store
    else if (currentStore && product.store !== currentStore) {
      return {
        success: false,
        message: `You can only add items from ${currentStore} to your current cart.`
      };
    }

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].price = product.price; // Update price in case of negotiation
      saveCartItems(updatedItems);
      return {
        success: true,
        message: `Added ${quantity} more ${product.name} to your cart.`
      };
    } else {
      // Add new item
      const newItem = {
        ...product,
        quantity,
        originalPrice: product.price,
      };
      saveCartItems([...items, newItem]);
      return {
        success: true,
        message: `${product.name} has been added to your cart.`
      };
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'Failed to add item to cart. Please try again.'
    };
  }
};
