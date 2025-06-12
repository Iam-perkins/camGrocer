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
  plantains: "/images/products/plantains.jpg",
  cassava: "/images/products/cassava.jpg",
  redBeans: "/images/products/redBeans.jpg",
  egusi: "/images/products/egusi.jpg",
  palmOil: "/images/products/palmOil.jpg",
  yams: "/images/products/yams.jpg",
  peanuts: "/images/products/peanuts.jpg",
  bitterLeaf: "/images/products/bitterLeaf.jpg",
  palmWine: "/images/products/palmwine.jpg",
  cocoyams: "/images/products/cocoyams.jpg",
  njangsa: "/images/products/njangsa.jpg",
  mbongoTchobi: "/images/products/mbongotchobi.jpg",
  achuSpices: "/images/products/achuSpices.jpg",
  kokiBeans: "/images/products/kokibeans.jpg",
  fufuCorn: "/images/products/fufucorn.jpg",
  garri: "/images/products/garri.jpg",
  njamaNjama: "/images/products/njamanjama.jpg",
  okra: "/images/products/okra.jpg",
  ginger: "/images/products/ginger.jpg",
  pepper: "/images/products/pepper.jpg",
  groundnutOil: "/images/products/goil.jpg",
  coconut: "/images/products/coconut.jpg",
  sweetPotatoes: "/images/products/sweetPotatoes.jpg",
  tomatoes: "/images/products/tomatoes.jpg",
  onions: "/images/products/onions.jpg",
  driedFish: "/images/products/driedFish.jpg",
  smokedFish: "/images/products/dryfish.jpg",
  beef: "/images/products/beef.jpg",
  chicken: "/images/products/chicken.jpg",
  goatMeat: "/images/products/goatmeat.jpg",
  // Fallback to placeholder images
  default: "/images/placeholder-product.jpg"
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
  oils: "/images/products/goil.jpg",
  tubers: "https://images.unsplash.com/photo-1598515214146-dab39da1243d?q=80&w=2574&auto=format&fit=crop",
  nuts: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?q=80&w=2574&auto=format&fit=crop",
  grains: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2574&auto=format&fit=crop",
  beverages: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=2574&auto=format&fit=crop",
  "meat & fish": "/images/products/meat.jpg",
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
  try {
    // First try to get the full product by ID
    const product = getProductById(productId);
    
    // If we have a valid product, ensure it has a proper image
    if (product) {
      // Create a partial product with the available data
      const partialProduct: Partial<Product> = {
        id: product.id,
        name: product.name || productName,
        category: product.category,
        image: product.image
      };
      
      // Use our enhanced ensureProductImage function
      return ensureProductImage(partialProduct);
    }
  } catch (error) {
    console.warn(`Product with ID ${productId} not found:`, error);
  }

  // If we have a product name but no product by ID, try to match by name
  if (productName) {
    return ensureProductImage({ name: productName });
  }

  // Fallback to default product image
  console.warn(`Using default image for product ID ${productId}`);
  return productImages.default;
}

/**
 * Get a store image by store ID
 * @param storeId - The ID of the store
 * @returns A valid image URL for the store
 */
export function getStoreImage(storeId: number): string {
  if (!storeId || isNaN(storeId) || storeId < 1) {
    console.warn(`Invalid store ID: ${storeId}`);
    return storeImages.default;
  }
  
  // Ensure storeId is within valid range (1-8)
  const storeKey = `store${((storeId - 1) % 8) + 1}` as keyof typeof storeImages;
  const imageUrl = storeImages[storeKey] || storeImages.default;
  
  // Ensure the URL is valid
  if (!imageUrl || imageUrl.includes('undefined')) {
    console.warn(`Invalid image URL for store ${storeId}`);
    return storeImages.default;
  }
  
  return imageUrl;
}

/**
 * Get a category image by category name
 * @param category - The name of the category
 * @returns A valid image URL for the category
 */
export function getCategoryImage(category: string): string {
  if (!category) {
    console.warn('No category provided, using default image');
    return categoryImages.default;
  }
  
  // Clean up the category name for matching
  const cleanCategory = category.toLowerCase().trim();
  
  // Try exact match first
  if (categoryImages[cleanCategory as keyof typeof categoryImages]) {
    return categoryImages[cleanCategory as keyof typeof categoryImages];
  }
  
  // Try partial matches
  for (const [key, url] of Object.entries(categoryImages)) {
    if (cleanCategory.includes(key) || key.includes(cleanCategory)) {
      return url;
    }
  }
  
  // Fallback to default
  console.warn(`No matching image found for category: ${category}`);
  return categoryImages.default;
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
    category: "Tubers",
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

/**
 * Generate products for a specific store, ensuring all have proper image paths
 * @param storeId - The ID of the store
 * @param count - Number of products to generate
 * @param startId - Starting ID for generated products
 * @param cityId - Optional city ID to filter products by city
 * @returns Array of Product objects with proper image paths
 */
export function generateProductsFromStore(storeId: number, count: number, startId: number, cityId?: number): Product[] {
  const result: Product[] = [];
  
  // Helper function to ensure product has proper image and other required fields
  const processProduct = (product: Product): Product => {
    // Ensure the product has a valid image
    const image = ensureProductImage(product);
    
    // Get unit information if not already set
    const unitInfo = getProductUnitInfo(product.name);
    
    return {
      ...product,
      image,
      unit: product.unit || unitInfo.unit,
      quantityDescription: product.quantityDescription || unitInfo.quantityDescription,
      // Ensure price is a number and has a reasonable minimum value
      price: Math.max(100, typeof product.price === 'number' ? product.price : 1000),
      // Ensure category is set
      category: product.category || 'Groceries',
      // Ensure store ID is set
      storeId: product.storeId || storeId,
      // Ensure inStock is set
      inStock: product.inStock !== false,
    };
  };

  // If cityId is provided, filter fixed products by cityId
  if (cityId) {
    for (const product of fixedProducts) {
      if (product.storeId === storeId && product.cityId === cityId && result.length < count) {
        result.push(processProduct({ ...product }));
      }
    }
  } else {
    // Add products from the fixed list that belong to this store
    for (const product of fixedProducts) {
      if (product.storeId === storeId && result.length < count) {
        result.push(processProduct({ ...product }));
      }
    }
  }

  // If we still need more products, generate dynamic ones
  const remainingCount = count - result.length;
  if (remainingCount > 0) {
    // Use provided cityId or generate a random one
    const productCityId = cityId || Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 3) + 1;
    const city = getCityById(productCityId);

    for (let i = 0; i < remainingCount; i++) {
      const id = 12 + startId + i; // Start dynamic IDs after the fixed ones
      const nameIndex = (id - 12) % productNames.length;
      const productName = productNames[nameIndex];

      // Get city-specific store name and location
      const neighborhood = city ? getRandomNeighborhood(productCityId) : "Central";
      const storeName = `${neighborhood} Market Store ${storeId}`;
      const location = city ? `${neighborhood}, ${city.name}` : "Unknown Location";

      const category = categories[id % categories.length];
      
      // Get unit information for this product
      const unitInfo = getProductUnitInfo(productName);
      
      // Create a partial product
      const partialProduct: Partial<Product> = {
        id,
        name: productName,
        category,
        price: Math.floor(Math.random() * 5000) + 500, // Random price between 500 and 5500
        description: `Fresh ${productName.toLowerCase()} from local farms`,
        storeId,
        store: storeName,
        cityId: productCityId,
        location,
        inStock: true,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        reviews: Math.floor(Math.random() * 100),
        ...unitInfo
      };
      
      // Ensure the product has a proper image
      const product = processProduct(partialProduct as Product);
      result.push(product);
    }
  }

  return result;
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

// Helper function to ensure all products have proper images
export function ensureProductImage(product: Partial<Product>): string {
  // If product already has a valid image, return it
  if (product.image && !product.image.includes("placeholder") && !product.image.startsWith('http')) {
    // Ensure the image path is valid
    if (product.image.startsWith('/images/')) {
      return product.image;
    }
    return `/images/products/${product.image}`;
  }

  // Try to find a matching image by product ID
  if (product.id) {
    try {
      const fullProduct = getProductById(product.id);
      if (fullProduct?.image) {
        return fullProduct.image.startsWith('/images/') 
          ? fullProduct.image 
          : `/images/products/${fullProduct.image}`;
      }
    } catch (error) {
      console.warn(`Error getting product by ID ${product.id}:`, error);
    }
  }

  // Try to find a matching image by product name
  if (product.name) {
    const nameKey = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // First try exact matches
    for (const [key, url] of Object.entries(productImages)) {
      if (key.toLowerCase() === nameKey) {
        return url;
      }
    }
    
    // Then try partial matches
    for (const [key, url] of Object.entries(productImages)) {
      if (nameKey.includes(key.toLowerCase()) || key.toLowerCase().includes(nameKey)) {
        return url;
      }
    }
  }

  // Try to find by category
  if (product.category) {
    const categoryKey = product.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    const categoryImage = getCategoryImage(categoryKey);
    if (categoryImage && !categoryImage.includes('placeholder')) {
      return categoryImage;
    }
  }

  // Fallback to default product image
  console.warn(`Using default image for product: ${product.name || 'Unknown'}`);
  return productImages.default;
}

export const getStoreLocation = (storeId: number): string => {
  const neighborhoodIndex = storeId % 3
  return `Neighborhood ${neighborhoodIndex + 1}`
}
