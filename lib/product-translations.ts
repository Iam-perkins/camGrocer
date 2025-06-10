export type ProductTranslation = {
  fruits: string;
  vegetables: string;
  dairy: string;
  meat: string;
  seafood: string;
  organic: string;
  fresh: string;
  local: string;
  imported: string;
  in_stock: string;
  out_of_stock: string;
  available: string;
  add_to_cart: string;
  view_details: string;
  kg: string;
  lb: string;
  piece: string;
  bunch: string;
  pack: string;
};

export type LanguageCode = 'en' | 'fr';

export const productTranslations: Record<LanguageCode, ProductTranslation> = {
  en: {
    // Product Categories
    fruits: "Fruits",
    vegetables: "Vegetables",
    dairy: "Dairy",
    meat: "Meat",
    seafood: "Seafood",
    
    // Product Types
    organic: "Organic",
    fresh: "Fresh",
    local: "Local",
    imported: "Imported",
    
    // Product Details
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    available: "Available",
    
    // Actions
    add_to_cart: "Add to Cart",
    view_details: "View Details",
    
    // Units
    kg: "kg",
    lb: "lb",
    piece: "piece",
    bunch: "bunch",
    pack: "pack"
  },
  fr: {
    // Product Categories
    fruits: "Fruits",
    vegetables: "Légumes",
    dairy: "Produits laitiers",
    meat: "Viande",
    seafood: "Produits de la mer",
    
    // Product Types
    organic: "Bio",
    fresh: "Frais",
    local: "Local",
    imported: "Importé",
    
    // Product Details
    in_stock: "En stock",
    out_of_stock: "Hors stock",
    available: "Disponible",
    
    // Actions
    add_to_cart: "Ajouter au panier",
    view_details: "Voir les détails",
    
    // Units
    kg: "kg",
    lb: "lb",
    piece: "pièce",
    bunch: "botte",
    pack: "paquet"
  }
};
