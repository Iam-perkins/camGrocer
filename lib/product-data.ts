// This file contains all the product data and image URLs for the grocery platform
import { getCityById, getRandomNeighborhood } from "./location-data"

export type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  storeId: number
  store: string
  image: string
  cityId: number
  location: string
  longDescription?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  images?: string[]
  originalPrice?: number
  regionSpecific?: boolean
  unit?: string
  quantityDescription?: string
}

export type Store = {
  id: number
  name: string
  description: string
  image: string
  cityId: number
  location: string
  openingHours: string
  phone: string
  rating: number
  reviews: number
}

// Add this export near the top of the file, after the other exports
export const bueaNeighborhoods = [
  "Molyko",
  "Bomaka",
  "Great Soppo",
  "Small Soppo",
  "Bonduma",
  "Mile 16",
  "Mile 17",
  "Bokwango",
  "Clerks' Quarters",
  "Federal Quarters",
  "Bokwaongo",
  "Muea",
]

// Cameroonian product images
export const productImages = {
  // Fruits and vegetables
  plantains: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=2127&auto=format&fit=crop",
  cassava: "https://images.unsplash.com/photo-1598842403593-e4ecc4946f6a?q=80&w=2574&auto=format&fit=crop",
  redBeans: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?q=80&w=2574&auto=format&fit=crop",
  egusi: "https://images.unsplash.com/photo-1600692858924-b7a14f2c1c5a?q=80&w=2574&auto=format&fit=crop",
  palmOil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2574&auto=format&fit=crop",
  yams: "https://images.unsplash.com/photo-1598515214146-dab39da1243d?q=80&w=2574&auto=format&fit=crop",
  peanuts: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?q=80&w=2574&auto=format&fit=crop",
  bitterLeaf: "https://images.unsplash.com/photo-1515872474884-c6a1e5f724e3?q=80&w=2574&auto=format&fit=crop",
  palmWine: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=2574&auto=format&fit=crop",
  cocoyams: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=2574&auto=format&fit=crop",
  njangsa: "https://images.unsplash.com/photo-1599909366516-6c1d2b49bc21?q=80&w=2574&auto=format&fit=crop",
  mbongoTchobi: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2574&auto=format&fit=crop",
  achuSpices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2574&auto=format&fit=crop",
  kokiBeans: "https://images.unsplash.com/photo-1590769620285-6926a3e0d33e?q=80&w=2574&auto=format&fit=crop",
  fufuCorn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2574&auto=format&fit=crop",
  garri: "https://images.unsplash.com/photo-1604329756574-bda1f2cada6f?q=80&w=2574&auto=format&fit=crop",
  njamaNjama: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=2574&auto=format&fit=crop",
  okra: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?q=80&w=2574&auto=format&fit=crop",
  ginger: "https://images.unsplash.com/photo-1603431777007-61db4494a034?q=80&w=2574&auto=format&fit=crop",
  pepper: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=2574&auto=format&fit=crop",
  groundnutOil: "https://images.unsplash.com/photo-1474979087999-7c800e70d5a5?q=80&w=2574&auto=format&fit=crop",
  coconut:"/images/products/coconut.jpg",
  sweetPotatoes: "https://images.unsplash.com/photo-1596097635121-14b38c5d7a55?q=80&w=2574&auto=format&fit=crop",
  tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2574&auto=format&fit=crop",
  onions: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=2574&auto=format&fit=crop",
  driedFish: "https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?q=80&w=2574&auto=format&fit=crop",
  smokedFish: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=2574&auto=format&fit=crop",
  beef: "https://images.unsplash.com/photo-1551028150-64b9f398f678?q=80&w=2574&auto=format&fit=crop",
  chicken: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=2574&auto=format&fit=crop",
  goatMeat: "https://images.unsplash.com/photo-1594221708779-94832f4320d1?q=80&w=2574&auto=format&fit=crop",
  // Add fallback images for any missing products
  default: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2670&auto=format&fit=crop",
}

// Cameroonian market store images
export const storeImages = {
  store1: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2526&auto=format&fit=crop",
  store2: "https://images.unsplash.com/photo-1513125370-3460ebe3401b?q=80&w=2574&auto=format&fit=crop",
  store3: "https://images.unsplash.com/photo-1573012663599-7a1b1a19d8b6?q=80&w=2574&auto=format&fit=crop",
  store4: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=2670&auto=format&fit=crop",
  store5: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=2574&auto=format&fit=crop",
  store6: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2526&auto=format&fit=crop",
  store7: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2670&auto=format&fit=crop",
  store8: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2670&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2526&auto=format&fit=crop",
}

// Cameroonian category images
export const categoryImages = {
  fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2574&auto=format&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=2574&auto=format&fit=crop",
  spices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2574&auto=format&fit=crop",
  oils: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2574&auto=format&fit=crop",
  tubers: "https://images.unsplash.com/photo-1598515214146-dab39da1243d?q=80&w=2574&auto=format&fit=crop",
  nuts: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?q=80&w=2574&auto=format&fit=crop",
  grains: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2574&auto=format&fit=crop",
  beverages: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=2574&auto=format&fit=crop",
  "meat & fish": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=2574&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2670&auto=format&fit=crop",
}

// Define units and quantity descriptions for different product types with realistic quantities
export const productUnits: Record<string, { unit: string; quantityDescription: string; singlePrice: number }> = {
  plantains: { unit: "bunch", quantityDescription: "1 bunch (approximately 5-7 plantains)", singlePrice: 100 },
  cassava: { unit: "kg", quantityDescription: "1 kg (approximately 2-3 roots)", singlePrice: 200 },
  redBeans: { unit: "cup", quantityDescription: "1 cup (approximately 250g)", singlePrice: 100 },
  egusi: { unit: "cup", quantityDescription: "1 cup (approximately 200g)", singlePrice: 300 },
  palmOil: { unit: "liter", quantityDescription: "1 liter bottle", singlePrice: 800 },
  yams: { unit: "piece", quantityDescription: "1 medium-sized yam (approximately 1 kg)", singlePrice: 300 },
  peanuts: { unit: "cup", quantityDescription: "1 cup (approximately 150g)", singlePrice: 100 },
  bitterLeaf: { unit: "bundle", quantityDescription: "1 small bundle (approximately 100g)", singlePrice: 50 },
  palmWine: { unit: "liter", quantityDescription: "1 liter bottle", singlePrice: 500 },
  cocoyams: { unit: "piece", quantityDescription: "1 cocoyam (approximately 250g)", singlePrice: 100 },
  njangsa: { unit: "cup", quantityDescription: "1 cup (approximately 200g)", singlePrice: 200 },
  mbongoTchobi: { unit: "package", quantityDescription: "Small package (approximately 50g)", singlePrice: 100 },
  achuSpices: { unit: "package", quantityDescription: "Small package (approximately 50g)", singlePrice: 100 },
  kokiBeans: { unit: "cup", quantityDescription: "1 cup (approximately 250g)", singlePrice: 150 },
  fufuCorn: { unit: "cup", quantityDescription: "1 cup (approximately 250g)", singlePrice: 100 },
  garri: { unit: "cup", quantityDescription: "1 cup (approximately 250g)", singlePrice: 100 },
  njamaNjama: { unit: "bundle", quantityDescription: "1 small bundle (approximately 100g)", singlePrice: 50 },
  okra: { unit: "piece", quantityDescription: "5 pieces (approximately 100g)", singlePrice: 50 },
  ginger: { unit: "piece", quantityDescription: "1 piece (approximately 50g)", singlePrice: 50 },
  pepper: { unit: "cup", quantityDescription: "1 small cup (approximately 20 peppers)", singlePrice: 50 },
  groundnutOil: { unit: "liter", quantityDescription: "1 liter bottle", singlePrice: 800 },
  coconut: { unit: "piece", quantityDescription: "1 whole coconut", singlePrice: 200 },
  sweetPotatoes: { unit: "piece", quantityDescription: "1 sweet potato (approximately 300g)", singlePrice: 100 },
  tomatoes: { unit: "piece", quantityDescription: "1 tomato", singlePrice: 25 },
  onions: { unit: "piece", quantityDescription: "1 medium onion", singlePrice: 50 },
  driedFish: { unit: "piece", quantityDescription: "1 medium-sized dried fish", singlePrice: 200 },
  smokedFish: { unit: "piece", quantityDescription: "1 medium-sized smoked fish", singlePrice: 300 },
  beef: { unit: "kg", quantityDescription: "250g package", singlePrice: 500 },
  chicken: { unit: "piece", quantityDescription: "1 whole local chicken", singlePrice: 2000 },
  goatMeat: { unit: "kg", quantityDescription: "250g package", singlePrice: 600 },
}

// Regional specialties
export const regionalProducts = {
  // Southwest Region
  1: [
    { name: "Ekwang", category: "Vegetables", image: productImages.cassava },
    { name: "Mbanga Soup", category: "Soups", image: productImages.palmOil },
    { name: "Eru", category: "Vegetables", image: productImages.bitterLeaf },
  ],
  // Littoral Region
  2: [
    { name: "Fresh Seafood", category: "Meat & Fish", image: productImages.smokedFish },
    { name: "Coconut Oil", category: "Oils", image: productImages.coconut },
    { name: "Plantain Chips", category: "Snacks", image: productImages.plantains },
  ],
  // Central Region
  3: [
    { name: "Folong", category: "Vegetables", image: productImages.bitterLeaf },
    { name: "Koki", category: "Grains", image: productImages.kokiBeans },
    { name: "Okok", category: "Vegetables", image: productImages.njamaNjama },
  ],
  // Northwest Region
  4: [
    { name: "Achu", category: "Tubers", image: productImages.cocoyams },
    { name: "Nkui", category: "Soups", image: productImages.okra },
    { name: "Corn Fufu", category: "Grains", image: productImages.fufuCorn },
  ],
  // West Region
  5: [
    { name: "Nkui", category: "Soups", image: productImages.okra },
    { name: "Koki", category: "Grains", image: productImages.kokiBeans },
    { name: "Achu", category: "Tubers", image: productImages.cocoyams },
  ],
  // Adamawa Region
  6: [
    { name: "Kilishi", category: "Meat & Fish", image: productImages.beef },
    { name: "Folere", category: "Beverages", image: productImages.bitterLeaf },
    { name: "Massa", category: "Grains", image: productImages.fufuCorn },
  ],
  // North Region
  7: [
    { name: "Kilishi", category: "Meat & Fish", image: productImages.beef },
    { name: "Koki", category: "Grains", image: productImages.kokiBeans },
    { name: "Folere", category: "Beverages", image: productImages.bitterLeaf },
  ],
  // Far North Region
  8: [
    { name: "Kilishi", category: "Meat & Fish", image: productImages.beef },
    { name: "Massa", category: "Grains", image: productImages.fufuCorn },
    { name: "Folere", category: "Beverages", image: productImages.bitterLeaf },
  ],
  // East Region
  9: [
    { name: "Ndolé", category: "Vegetables", image: productImages.bitterLeaf },
    { name: "Bush Meat", category: "Meat & Fish", image: productImages.goatMeat },
    { name: "Mbongo Tchobi", category: "Spices", image: productImages.mbongoTchobi },
  ],
  // South Region
  10: [
    { name: "Fresh Fish", category: "Meat & Fish", image: productImages.driedFish },
    { name: "Ndolé", category: "Vegetables", image: productImages.bitterLeaf },
    { name: "Mbongo Tchobi", category: "Spices", image: productImages.mbongoTchobi },
  ],
}

// Categories
export const categories = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Spices",
  "Oils",
  "Tubers",
  "Nuts",
  "Meat & Fish",
  "Beverages",
  "Soups",
]

// Updated prices with realistic values for Cameroon (in CFA francs)
export const prices = [25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1500, 2000]

// Descriptions - updated for all regions
export const descriptions = [
  "Fresh from local farms",
  "High quality from regional farmers",
  "Fresh from nearby farms",
  "Premium quality for soups and stews",
  "Pure from the region",
  "From the fertile soils of Cameroon",
  "Roasted from local farmers",
  "Fresh for traditional soups",
  "For preparing traditional dishes",
  "From local farmers",
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

// Improve the getStoreImage function to handle any missing images
export function getStoreImage(storeId: number): string {
  const storeKey = `store${(storeId % 8) + 1}` as keyof typeof storeImages
  return storeImages[storeKey] || storeImages.default
}

// Improve the getCategoryImage function to handle any missing images
export function getCategoryImage(category: string): string {
  const categoryKey = category.toLowerCase() as keyof typeof categoryImages
  return categoryImages[categoryKey] || categoryImages.default
}

// Helper function to get unit information for a product
export function getProductUnitInfo(productName: string): {
  unit: string
  quantityDescription: string
  singlePrice: number
} {
  // Try to find exact match
  for (const [key, unitInfo] of Object.entries(productUnits)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return unitInfo
    }
  }

  // Default unit info if no match found
  return { unit: "item", quantityDescription: "1 item", singlePrice: 100 }
}

// Fixed products with consistent IDs and real images - updated with realistic prices
export const fixedProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Plantains",
    category: "Fruits",
    price: 500,
    description: "Fresh plantains from local farms",
    storeId: 1,
    store: "Central Market Store 1",
    image: productImages.plantains,
    cityId: 101,
    location: "Molyko, Buea",
    unit: "bunch",
    quantityDescription: "1 bunch (approximately 5-7 plantains)",
  },
  {
    id: 2,
    name: "Red Beans",
    category: "Grains",
    price: 400,
    description: "High quality red beans from local farmers",
    storeId: 2,
    store: "Bomaka Market Store 2",
    image: productImages.redBeans,
    cityId: 101,
    location: "Bomaka, Buea",
    unit: "cup",
    quantityDescription: "4 cups (approximately 1 kg)",
  },
  {
    id: 3,
    name: "Cassava",
    category: "Vegetables",
    price: 200,
    description: "Fresh cassava roots from local farms",
    storeId: 1,
    store: "Central Market Store 1",
    image: productImages.cassava,
    cityId: 101,
    location: "Molyko, Buea",
    unit: "kg",
    quantityDescription: "1 kg (approximately 2-3 roots)",
  },
  {
    id: 4,
    name: "Egusi Seeds",
    category: "Spices",
    price: 600,
    description: "Premium quality egusi seeds for soups and stews",
    storeId: 3,
    store: "Akwa Market Store 3",
    image: productImages.egusi,
    cityId: 201,
    location: "Akwa, Douala",
    unit: "cup",
    quantityDescription: "2 cups (approximately 400g)",
  },
  {
    id: 5,
    name: "Palm Oil",
    category: "Oils",
    price: 800,
    description: "Pure palm oil from the region",
    storeId: 2,
    store: "Bonanjo Market Store 2",
    image: productImages.palmOil,
    cityId: 201,
    location: "Bonanjo, Douala",
    unit: "liter",
    quantityDescription: "1 liter bottle",
  },
  {
    id: 6,
    name: "Yams",
    category: "Tubers",
    price: 300,
    description: "Fresh yams from the fertile soils of Cameroon",
    storeId: 3,
    store: "Bastos Market Store 3",
    image: productImages.yams,
    cityId: 301,
    location: "Bastos, Yaoundé",
    unit: "piece",
    quantityDescription: "1 medium-sized yam (approximately 1 kg)",
  },
  {
    id: 7,
    name: "Peanuts",
    category: "Nuts",
    price: 200,
    description: "Roasted peanuts from local farmers",
    storeId: 1,
    store: "Mvog-Mbi Market Store 1",
    image: productImages.peanuts,
    cityId: 301,
    location: "Mvog-Mbi, Yaoundé",
    unit: "cup",
    quantityDescription: "2 cups (approximately 300g)",
  },
  {
    id: 8,
    name: "Bitter Leaf",
    category: "Vegetables",
    price: 50,
    description: "Fresh bitter leaf for traditional soups from local farms",
    storeId: 2,
    store: "Commercial Avenue Store 2",
    image: productImages.bitterLeaf,
    cityId: 401,
    location: "Commercial Avenue, Bamenda",
    unit: "bundle",
    quantityDescription: "1 small bundle (approximately 100g)",
  },
  {
    id: 9,
    name: "Palm Wine",
    category: "Beverages",
    price: 500,
    description: "Fresh palm wine from the region",
    storeId: 3,
    store: "Marché A Store 3",
    image: productImages.palmWine,
    cityId: 501,
    location: "Marché A, Bafoussam",
    unit: "liter",
    quantityDescription: "1 liter bottle",
  },
  {
    id: 10,
    name: "Cocoyams",
    category: "Vegetables",
    price: 300,
    description: "Fresh cocoyams from local farms",
    storeId: 1,
    store: "Bamyanga Market Store 1",
    image: productImages.cocoyams,
    cityId: 601,
    location: "Bamyanga, Ngaoundéré",
    unit: "piece",
    quantityDescription: "3 cocoyams (approximately 750g)",
  },
  {
    id: 11,
    name: "Njangsa",
    category: "Spices",
    price: 400,
    description: "Traditional spice for soups and stews",
    storeId: 2,
    store: "Roumdé Adjia Market Store 2",
    image: productImages.njangsa,
    cityId: 701,
    location: "Roumdé Adjia, Garoua",
    unit: "cup",
    quantityDescription: "2 cups (approximately 400g)",
  },
]

// Updated to generate products for specific cities
export function generateProductsFromStore(storeId: number, count: number, startId: number, cityId?: number): Product[] {
  // Use fixed products first, then generate dynamic ones if needed
  const result: Product[] = []

  // If cityId is provided, filter fixed products by cityId
  if (cityId) {
    // Add products from the fixed list that belong to this store and city
    for (let i = 0; i < fixedProducts.length; i++) {
      if (fixedProducts[i].storeId === storeId && fixedProducts[i].cityId === cityId && result.length < count) {
        result.push({
          ...fixedProducts[i],
        })
      }
    }
  } else {
    // Add products from the fixed list that belong to this store
    for (let i = 0; i < fixedProducts.length; i++) {
      if (fixedProducts[i].storeId === storeId && result.length < count) {
        result.push({
          ...fixedProducts[i],
        })
      }
    }
  }

  // If we still need more products, generate dynamic ones
  const remainingCount = count - result.length
  if (remainingCount > 0) {
    // Use provided cityId or generate a random one
    const productCityId = cityId || Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 3) + 1
    const city = getCityById(productCityId)
    const regionId = Math.floor(productCityId / 100)

    for (let i = 0; i < remainingCount; i++) {
      const id = 12 + startId + i // Start dynamic IDs after the fixed ones
      const nameIndex = (id - 12) % productNames.length
      const productName = productNames[nameIndex]

      // Get city-specific store name and location
      const neighborhood = city ? getRandomNeighborhood(productCityId) : "Central"
      const storeName = `${neighborhood} Market Store ${storeId}`
      const location = city ? `${neighborhood}, ${city.name}` : "Unknown Location"

      const category = categories[id % categories.length]

      // Add some region-specific products
      let image = productNameToImage[productName] || getCategoryImage(category) || productImages.default
      let regionSpecific = false

      // 30% chance of being a regional specialty
      if (Math.random() < 0.3 && regionalProducts[regionId]) {
        const regionalProduct =
          regionalProducts[regionId][Math.floor(Math.random() * regionalProducts[regionId].length)]
        image = regionalProduct.image
        regionSpecific = true
      }

      // Get unit information for this product
      const unitInfo = getProductUnitInfo(productName)

      result.push({
        id,
        name: productName,
        category,
        price: unitInfo.singlePrice * (1 + Math.floor(Math.random() * 4)), // Realistic price based on single price
        storeId,
        store: storeName,
        location,
        cityId: productCityId,
        image,
        description: descriptions[id % descriptions.length],
        regionSpecific,
        unit: unitInfo.unit,
        quantityDescription: unitInfo.quantityDescription,
      })
    }
  }

  return result
}

// Improve the getProductById function to ensure all products have images and locations
export function getProductById(id: number): Product {
  // First check fixed products
  const fixedProduct = fixedProducts.find((p) => p.id === id)
  if (fixedProduct) {
    return {
      ...fixedProduct,
      longDescription: `This product is sourced directly from local farmers. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.`,
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

    // Generate a random city ID
    const productCityId = Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 3) + 1
    const city = getCityById(productCityId)

    // Get city-specific store name and location
    const neighborhood = city ? getRandomNeighborhood(productCityId) : "Central"
    const storeName = `${neighborhood} Market Store ${storeId}`
    const location = city ? `${neighborhood}, ${city.name}` : "Unknown Location"

    // Generate product name and other details
    const nameIndex = (id - 12) % productNames.length
    const name = productNames[nameIndex]
    const category = categories[id % categories.length]
    const unitInfo = getProductUnitInfo(name)
    const price = unitInfo.singlePrice * (1 + Math.floor(Math.random() * 4)) // Realistic price based on single price
    const image = productNameToImage[name] || getCategoryImage(category) || productImages.default

    return {
      id,
      name,
      category,
      price,
      description: `Quality ${name.toLowerCase()} from local farms`,
      storeId,
      store: storeName,
      location,
      cityId: productCityId,
      image,
      longDescription: `This ${name.toLowerCase()} is sourced directly from local farmers. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.`,
      rating: 4.5,
      reviews: 28,
      inStock: true,
      images: [
        image,
        image, // Use same image for all views for now
        image,
      ],
      unit: unitInfo.unit,
      quantityDescription: unitInfo.quantityDescription,
    }
  }

  // If product is not found, return a default product
  return {
    id: id,
    name: `Product ${id}`,
    category: "Category",
    price: 100,
    description: "Product description goes here.",
    storeId: id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1,
    store: "Central Market Store",
    location: "Unknown Location",
    cityId: 101,
    image: productImages.default,
    longDescription:
      "This product is sourced directly from local farmers. It is harvested at the peak of freshness and delivered to our store within 24 hours. We ensure that all our products meet the highest quality standards and are free from harmful chemicals. Our commitment to quality and freshness is what sets us apart from other grocery stores.",
    rating: 4.5,
    reviews: 28,
    inStock: true,
    images: [productImages.default, productImages.default, productImages.default],
    unit: "item",
    quantityDescription: "1 item",
  }
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

  return productImages.default
}

export const getStoreLocation = (storeId: number): string => {
  const neighborhoodIndex = storeId % 3
  return `Neighborhood ${neighborhoodIndex + 1}`
}
