import { z } from 'zod';

export const productSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Product name is required').max(100, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  brand: z.string().max(100, 'Brand name is too long').optional(),
  barcode: z.string().max(50, 'Barcode is too long').optional(),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU is too long'),
  
  // Pricing
  costPrice: z.coerce.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative'),
  taxRate: z.coerce.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%'),
  isTaxable: z.boolean().default(true),
  
  // Inventory
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  minStockLevel: z.coerce.number().int().min(0, 'Minimum stock level cannot be negative'),
  isTrackInventory: z.boolean().default(true),
  
  // Product Details
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  
  // Media
  images: z.array(z.string().url('Invalid image URL')).default([]),
  
  // Physical Attributes
  weight: z.coerce.number().min(0, 'Weight cannot be negative'),
  weightUnit: z.enum(['g', 'kg', 'lb', 'oz']).default('g'),
  dimensions: z.object({
    length: z.coerce.number().min(0, 'Length cannot be negative'),
    width: z.coerce.number().min(0, 'Width cannot be negative'),
    height: z.coerce.number().min(0, 'Height cannot be negative'),
    unit: z.enum(['cm', 'in']).default('cm'),
  }).optional(),
  
  // Variants
  hasVariants: z.boolean().default(false),
  variants: z.array(z.any()).default([]),
  
  // Shipping
  isShippable: z.boolean().default(true),
  shippingWeight: z.coerce.number().min(0, 'Shipping weight cannot be negative'),
  shippingWeightUnit: z.enum(['g', 'kg', 'lb', 'oz']).default('g'),
  
  // Supplier
  supplierName: z.string().max(100, 'Supplier name is too long').optional(),
  supplierCode: z.string().max(50, 'Supplier code is too long').optional(),
  
  // Status
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  
  // Availability
  availableFrom: z.string().datetime().optional(),
  availableTo: z.string().datetime().optional(),
  
  // Store
  storeId: z.string().min(1, 'Store ID is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export function validateProductData(data: unknown): ProductFormData {
  return productSchema.parse(data);
}

export function validatePartialProductData(data: unknown): Partial<ProductFormData> {
  return productSchema.partial().parse(data);
}
