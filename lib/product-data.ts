// This file contains all the product data and image URLs for the grocery platform

export type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  storeId: number
  store: string
  image: string
  longDescription?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  images?: string[]
  originalPrice?: number
}

export type Store = {
  id: number
  name: string
  description: string
  image: string
  location: string
  openingHours: string
  phone: string
  rating: number
  reviews: number
}

// Update the image URLs to ensure they're all accessible and working
export const productImages = {
  plantains: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=800&auto=format&fit=crop",
  cassava: "https://images.unsplash.com/photo-1598110327071-bb87d3f6a569?q=80&w=800&auto=format&fit=crop",
  redBeans: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?q=80&w=800&auto=format&fit=crop",
  egusi: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?q=80&w=800&auto=format&fit=crop",
  palmOil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop",
  yams: "https://images.unsplash.com/photo-1596264414066-9f31b07c7dad?q=80&w=800&auto=format&fit=crop",
  peanuts: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?q=80&w=800&auto=format&fit=crop",
  bitterLeaf: "https://images.unsplash.com/photo-1515872474884-c6a1e5147b5e?q=80&w=800&auto=format&fit=crop",
  palmWine: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=800&auto=format&fit=crop",
  cocoyams: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=800&auto=format&fit=crop",
  njangsa: "https://images.unsplash.com/photo-1599909366516-6c1b0b1b7e1a?q=80&w=800&auto=format&fit=crop",
  mbongoTchobi: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop",
  achuSpices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop",
  kokiBeans: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800&auto=format&fit=crop",
  fufuCorn: "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?q=80&w=800&auto=format&fit=crop",
  garri: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop",
  njamaNjama: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800&auto=format&fit=crop",
  okra: "https://images.unsplash.com/photo-1593629718768-e8860d848a15?q=80&w=800&auto=format&fit=crop",
  ginger: "https://images.unsplash.com/photo-1615485500704-8e990f9900f1?q=80&w=800&auto=format&fit=crop",
  pepper: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=800&auto=format&fit=crop",
  groundnutOil: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=800&auto=format&fit=crop",
  coconut: "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?q=80&w=800&auto=format&fit=crop",
  sweetPotatoes: "https://images.unsplash.com/photo-1596097635121-14b38c5d7a55?q=80&w=800&auto=format&fit=crop",
  tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop",
  onions: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=800&auto=format&fit=crop",
  driedFish: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?q=80&w=800&auto=format&fit=crop",
  smokedFish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
  beef: "https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=800&auto=format&fit=crop",
  chicken: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop",
  goatMeat: "https://images.unsplash.com/photo-1594044125854-3114696d4d8b?q=80&w=800&auto=format&fit=crop",
  // Add fallback images for any missing products
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
}

// Update store images to ensure they're all accessible
export const storeImages = {
  store1: "https://images.unsplash.com/photo-1573012663590-81901bf681c5?q=80&w=800&auto=format&fit=crop",
  store2: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
  store3: "https://images.unsplash.com/photo-1506484381205-f7945653044d?q=80&w=800&auto=format&fit=crop",
  store4: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop",
  store5: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop",
  store6: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=800&auto=format&fit=crop",
  store7: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop",
  store8: "https://images.unsplash.com/photo-1601599963565-b7f49beb6b8d?q=80&w=800&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
}

// Update category images to ensure they're all accessible
export const categoryImages = {
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800&auto=format&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=800&auto=format&fit=crop",
  spices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop",
  oils: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop",
  tubers: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=800&auto=format&fit=crop",
  nuts: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?q=80&w=800&auto=format&fit=crop",
  grains: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=800&auto=format&fit=crop",
  beverages: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=800&auto=format&fit=crop",
  "meat & fish": "https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=800&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
}

// Fixed products with consistent IDs and real images
export const fixedProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Plantains",
    category: "Fruits",
    price: 1500,
    description: "Fresh plantains from Western Cameroon",
    storeId: 1,
    store: "Marché Central 1",
    image: productImages.plantains,
  },
  {
    id: 2,
    name: "Red Beans",
    category: "Grains",
    price: 2000,
    description: "High quality red beans from Northern Cameroon",
    storeId: 2,
    store: "Marché Central 2",
    image: productImages.redBeans,
  },
  {
    id: 3,
    name: "Cassava",
    category: "Vegetables",
    price: 1200,
    description: "Fresh cassava roots from Central Cameroon",
    storeId: 1,
    store: "Marché Central 1",
    image: productImages.cassava,
  },
  {
    id: 4,
    name: "Egusi Seeds",
    category: "Spices",
    price: 3500,
    description: "Premium quality egusi seeds for soups and stews",
    storeId: 3,
    store: "Marché Central 3",
    image: productImages.egusi,
  },
  {
    id: 5,
    name: "Palm Oil",
    category: "Oils",
    price: 2500,
    description: "Pure palm oil from the coastal region",
    storeId: 2,
    store: "Marché Central 2",
    image: productImages.palmOil,
  },
  {
    id: 6,
    name: "Yams",
    category: "Tubers",
    price: 1800,
    description: "Fresh yams from the fertile soils of Cameroon",
    storeId: 3,
    store: "Marché Central 3",
    image: productImages.yams,
  },
  {
    id: 7,
    name: "Peanuts",
    category: "Nuts",
    price: 1800,
    description: "Roasted peanuts from Northern Cameroon",
    storeId: 1,
    store: "Marché Central 1",
    image: productImages.peanuts,
  },
  {
    id: 8,
    name: "Bitter Leaf",
    category: "Vegetables",
    price: 1000,
    description: "Fresh bitter leaf for traditional soups",
    storeId: 2,
    store: "Marché Central 2",
    image: productImages.bitterLeaf,
  },
  {
    id: 9,
    name: "Palm Wine",
    category: "Beverages",
    price: 2500,
    description: "Fresh palm wine from the coastal region",
    storeId: 3,
    store: "Marché Central 3",
    image: productImages.palmWine,
  },
  {
    id: 10,
    name: "Cocoyams",
    category: "Vegetables",
    price: 1300,
    description: "Fresh cocoyams from the rainforest region",
    storeId: 1,
    store: "Marché Central 1",
    image: productImages.cocoyams,
  },
  {
    id: 11,
    name: "Njangsa",
    category: "Spices",
    price: 3000,
    description: "Traditional spice for soups and stews",
    storeId: 2,
    store: "Marché Central 2",
    image: productImages.njangsa,
  },
]

// Product names for dynamic generation
export const productNames = [
  "Mbongo Tchobi Spices",
  "Achu Spices",
  "Koki Beans",
  "Fufu Corn",
  "Garri",
  "Njama Njama",
  "Okra",
  "Ginger",
  "Pepper",
  "Groundnut Oil",
  "Coconut",
  "Sweet Potatoes",
  "Tomatoes",
  "Onions",
  "Dried Fish",
  "Smoked Fish",
  "Beef",
  "Chicken",
  "Goat Meat",
]

// Map product names to images
export const productNameToImage: Record<string, string> = {
  "Mbongo Tchobi Spices": productImages.mbongoTchobi,
  "Achu Spices": productImages.achuSpices,
  "Koki Beans": productImages.kokiBeans,
  "Fufu Corn": productImages.fufuCorn,
  Garri: productImages.garri,
  "Njama Njama": productImages.njamaNjama,
  Okra: productImages.okra,
  Ginger: productImages.ginger,
  Pepper: productImages.pepper,
  "Groundnut Oil": productImages.groundnutOil,
  Coconut: productImages.coconut,
  "Sweet Potatoes": productImages.sweetPotatoes,
  Tomatoes: productImages.tomatoes,
  Onions: productImages.onions,
  "Dried Fish": productImages.driedFish,
  "Smoked Fish": productImages.smokedFish,
  Beef: productImages.beef,
  Chicken: productImages.chicken,
  "Goat Meat": productImages.goatMeat,
}

// Categories
export const categories = ["Fruits", "Vegetables", "Grains", "Spices", "Oils", "Tubers", "Nuts", "Meat & Fish"]

// Prices
export const prices = [800, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000]

// Descriptions
export const descriptions = [
  "Fresh from Western Cameroon",
  "High quality from Northern Cameroon",
  "Fresh from Central Cameroon",
  "Premium quality for soups and stews",
  "Pure from the coastal region",
  "From the fertile soils of Cameroon",
  "Roasted from Northern Cameroon",
  "Fresh for traditional soups",
  "For preparing traditional dishes",
  "From local farmers",
]

// Improve the getStoreImage function to handle any missing images
export function getStoreImage(storeId: number): string {
  const storeKey = `store${storeId}` as keyof typeof storeImages
  return storeImages[storeKey] || storeImages.default
}

// Improve the getCategoryImage function to handle any missing images
export function getCategoryImage(category: string): string {
  const categoryKey = category.toLowerCase() as keyof typeof categoryImages
  return categoryImages[categoryKey] || categoryImages.default
}

// Improve the generateProductsFromStore function to use real images
export function generateProductsFromStore(storeId: number, count: number, startId: number): Product[] {
  // Use fixed products first, then generate dynamic ones if needed
  const result: Product[] = []

  // Add products from the fixed list that belong to this store
  for (let i = 0; i < fixedProducts.length; i++) {
    if (fixedProducts[i].storeId === storeId && result.length < count) {
      result.push({
        ...fixedProducts[i],
      })
    }
  }

  // If we still need more products, generate dynamic ones
  const remainingCount = count - result.length
  if (remainingCount > 0) {
    for (let i = 0; i < remainingCount; i++) {
      const id = 12 + startId + i // Start dynamic IDs after the fixed ones
      const nameIndex = (id - 12) % productNames.length
      const productName = productNames[nameIndex]
      const storeName = `Marché Central ${storeId}`
      const category = categories[id % categories.length]

      result.push({
        id,
        name: productName,
        category,
        price: prices[id % prices.length],
        storeId,
        store: storeName,
        image: productNameToImage[productName] || getCategoryImage(category) || productImages.default,
        description: descriptions[id % descriptions.length],
      })
    }
  }

  return result
}

// Improve the getProductById function to ensure all products have images
export function getProductById(id: number): Product {
  // First check fixed products
  const fixedProduct = fixedProducts.find((p) => p.id === id)
  if (fixedProduct) {
    return {
      ...fixedProduct,
      longDescription:
        "This product is sourced directly from local farmers in Cameroon. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.",
      rating: 4.5,
      reviews: 28,
      inStock: true,
      images: [
        fixedProduct.image,
        fixedProduct.image, // Use same image for all views for now
        fixedProduct.image,
      ],
    }
  }

  // For dynamic products (IDs 12 and above)
  if (id >= 12) {
    // Determine which store this product belongs to based on ID
    const storeId = ((id - 12) % 3) + 1
    const storeName = `Marché Central ${storeId}`

    // Generate product name and other details
    const nameIndex = (id - 12) % productNames.length
    const name = productNames[nameIndex]
    const category = categories[id % categories.length]
    const price = prices[id % prices.length]
    const image = productNameToImage[name] || getCategoryImage(category) || productImages.default

    return {
      id,
      name,
      category,
      price,
      description: `Quality ${name.toLowerCase()} from Cameroon`,
      storeId,
      store: storeName,
      image,
      longDescription: `This ${name.toLowerCase()} is sourced directly from local farmers in Cameroon. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.`,
      rating: 4.5,
      reviews: 28,
      inStock: true,
      images: [
        image,
        image, // Use same image for all views for now
        image,
      ],
    }
  }

  // If product is not found, return a default product
  return {
    id: id,
    name: `Product ${id}`,
    category: "Category",
    price: 2000,
    description: "Product description goes here.",
    storeId: id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1,
    store: id % 3 === 0 ? "Marché Central 3" : id % 2 === 0 ? "Marché Central 2" : "Marché Central 1",
    image: productImages.default,
    longDescription:
      "This product is sourced directly from local farmers in Cameroon. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.",
    rating: 4.5,
    reviews: 28,
    inStock: true,
    images: [productImages.default, productImages.default, productImages.default],
  }
}

// Add a fallback function to ensure we always have an image
export function getProductImage(productId: number, productName?: string): string {
  const product = getProductById(productId)

  if (product && product.image) {
    return product.image
  }

  // Try to find by name if provided
  if (productName) {
    const nameKey = productName.toLowerCase().replace(/\s+/g, "")
    for (const [key, url] of Object.entries(productImages)) {
      if (key.toLowerCase().includes(nameKey) || nameKey.includes(key.toLowerCase())) {
        return url
      }
    }
  }

  // Return default image if nothing else works
  return productImages.default
}

// Add a helper function to ensure all products have proper images
export function ensureProductImage(product: Partial<Product>): string {
  if (product.image && !product.image.includes("placeholder.svg")) {
    return product.image
  }

  if (product.id) {
    const fullProduct = getProductById(product.id)
    if (fullProduct.image) {
      return fullProduct.image
    }
  }

  if (product.name) {
    const nameKey = product.name.toLowerCase().replace(/\s+/g, "")
    for (const [key, url] of Object.entries(productImages)) {
      if (key.toLowerCase().includes(nameKey) || nameKey.includes(key.toLowerCase())) {
        return url
      }
    }
  }

  if (product.category) {
    return getCategoryImage(product.category)
  }

  return productImages.default
}
