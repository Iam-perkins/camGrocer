import { ObjectId, WithId, Document, Collection, OptionalUnlessRequiredId } from 'mongodb';
import clientPromise from './mongodb';

// Define the product interface
export interface IProduct extends Document {
  _id: ObjectId;
  // Basic Information
  name: string;
  description: string;
  brand: string;
  barcode: string;
  sku: string;
  
  // Pricing
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  isTaxable: boolean;
  
  // Inventory
  stock: number;
  minStockLevel: number;
  isTrackInventory: boolean;
  
  // Product Details
  category: string;
  subcategory: string;
  tags: string[];
  
  // Media
  images: string[];
  
  // Physical Attributes
  weight: number;
  weightUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  
  // Variants
  hasVariants: boolean;
  variants: any[]; // You might want to define a proper type for variants
  
  // Shipping
  isShippable: boolean;
  shippingWeight: number;
  shippingWeightUnit: string;
  
  // Supplier
  supplierName: string;
  supplierCode: string;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  
  // Availability
  availableFrom: string;
  availableTo: string;
  
  // Store
  storeId: ObjectId;
  storeName: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new product
export interface CreateProductDTO extends Omit<IProduct, '_id' | 'storeId' | 'createdAt' | 'updatedAt'> {
  storeId: string; // Will be converted to ObjectId
}

// Type for updating a product
export type UpdateProductDTO = Partial<Omit<CreateProductDTO, 'storeId'>>;

// Helper function to get the products collection
async function getProductsCollection() {
  const client = await clientPromise;
  return client.db().collection<IProduct>('products');
}

export async function getProducts(storeId: string): Promise<IProduct[]> {
  try {
    const productsCollection = await getProductsCollection();
    return await productsCollection
      .find({ storeId: new ObjectId(storeId) })
      .toArray();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Helper type for new product data without _id
type NewProduct = Omit<IProduct, '_id'> & { _id?: never };

export async function createProduct(productData: CreateProductDTO): Promise<IProduct> {
  try {
    console.log('Starting createProduct with data:', JSON.stringify(productData, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'sku', 'category', 'storeId'];
    const missingFields = requiredFields.filter(field => !productData[field as keyof CreateProductDTO]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    const productsCollection = await getProductsCollection();
    const now = new Date();
    
    // Create the product document with all fields
    const productDoc: NewProduct = {
      // Basic Information
      name: String(productData.name || '').trim(),
      description: String(productData.description || '').trim(),
      brand: String(productData.brand || '').trim(),
      barcode: String(productData.barcode || '').trim(),
      sku: String(productData.sku || `SKU-${Date.now()}`).trim(),
      
      // Pricing
      costPrice: Number(productData.costPrice) || 0,
      sellingPrice: Number(productData.sellingPrice) || 0,
      taxRate: Number(productData.taxRate) || 0,
      isTaxable: productData.isTaxable !== false, // default to true if not specified
      
      // Inventory
      stock: Math.max(0, Math.floor(Number(productData.stock) || 0)),
      minStockLevel: Math.max(0, Math.floor(Number(productData.minStockLevel) || 0)),
      isTrackInventory: productData.isTrackInventory !== false, // default to true
      
      // Product Details
      category: String(productData.category || '').trim(),
      subcategory: String(productData.subcategory || '').trim(),
      tags: Array.isArray(productData.tags) 
        ? productData.tags.map(tag => String(tag).trim()).filter(Boolean) 
        : [],
      
      // Media
      images: Array.isArray(productData.images) 
        ? productData.images.map(img => String(img).trim()).filter(Boolean) 
        : [],
      
      // Physical Attributes
      weight: Math.max(0, Number(productData.weight) || 0),
      weightUnit: ['g', 'kg', 'lb', 'oz'].includes(String(productData.weightUnit || '').toLowerCase())
        ? String(productData.weightUnit).toLowerCase()
        : 'g', // default to grams
      
      dimensions: {
        length: Math.max(0, Number(productData.dimensions?.length) || 0),
        width: Math.max(0, Number(productData.dimensions?.width) || 0),
        height: Math.max(0, Number(productData.dimensions?.height) || 0),
        unit: ['cm', 'in'].includes(String(productData.dimensions?.unit || '').toLowerCase())
          ? String(productData.dimensions?.unit).toLowerCase()
          : 'cm' // default to centimeters
      },
      
      // Variants
      hasVariants: Boolean(productData.hasVariants),
      variants: Array.isArray(productData.variants) ? productData.variants : [],
      
      // Shipping
      isShippable: productData.isShippable !== false, // default to true
      shippingWeight: Math.max(0, Number(productData.shippingWeight) || 0),
      shippingWeightUnit: ['g', 'kg', 'lb', 'oz'].includes(String(productData.shippingWeightUnit || '').toLowerCase())
        ? String(productData.shippingWeightUnit).toLowerCase()
        : 'g', // default to grams
      
      // Supplier
      supplierName: productData.supplierName || '',
      supplierCode: productData.supplierCode || '',
      
      // Status
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      isFeatured: productData.isFeatured || false,
      
      // Availability
      availableFrom: productData.availableFrom || new Date().toISOString(),
      availableTo: productData.availableTo || '',
      
      // Store
      storeId: new ObjectId(productData.storeId),
      storeName: productData.storeName,
      
      // Timestamps
      createdAt: now,
      updatedAt: now
    };

    const result = await productsCollection.insertOne(productDoc as any);
    
    // Create the complete product object with the generated _id
    const createdProduct: IProduct = {
      // Basic Information
      _id: result.insertedId,
      name: productDoc.name,
      description: productDoc.description,
      brand: productDoc.brand,
      barcode: productDoc.barcode,
      sku: productDoc.sku,
      
      // Pricing
      costPrice: productDoc.costPrice,
      sellingPrice: productDoc.sellingPrice,
      taxRate: productDoc.taxRate,
      isTaxable: productDoc.isTaxable,
      
      // Inventory
      stock: productDoc.stock,
      minStockLevel: productDoc.minStockLevel,
      isTrackInventory: productDoc.isTrackInventory,
      
      // Product Details
      category: productDoc.category,
      subcategory: productDoc.subcategory,
      tags: productDoc.tags,
      
      // Media
      images: productDoc.images,
      
      // Physical Attributes
      weight: productDoc.weight,
      weightUnit: productDoc.weightUnit,
      dimensions: productDoc.dimensions,
      
      // Variants
      hasVariants: productDoc.hasVariants,
      variants: productDoc.variants,
      
      // Shipping
      isShippable: productDoc.isShippable,
      shippingWeight: productDoc.shippingWeight,
      shippingWeightUnit: productDoc.shippingWeightUnit,
      
      // Supplier
      supplierName: productDoc.supplierName,
      supplierCode: productDoc.supplierCode,
      
      // Status
      isActive: productDoc.isActive,
      isFeatured: productDoc.isFeatured,
      
      // Store
      storeId: productDoc.storeId,
      storeName: productDoc.storeName,
      
      // Availability
      availableFrom: productDoc.availableFrom,
      availableTo: productDoc.availableTo,
      
      // Store
      storeId: productDoc.storeId,
      
      // Timestamps
      createdAt: productDoc.createdAt,
      updatedAt: productDoc.updatedAt
    };
    
    return createdProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: string, 
  updateData: UpdateProductDTO
): Promise<{ matchedCount: number; modifiedCount: number }> {
  try {
    const productsCollection = await getProductsCollection();
    
    // Prepare the update document with only the provided fields
    const updateDoc: any = {
      $set: {
        updatedAt: new Date()
      }
    };

    // Add only the fields that are being updated
    const fieldsToUpdate = [
      // Basic Information
      'name', 'description', 'brand', 'barcode', 'sku',
      // Pricing
      'costPrice', 'sellingPrice', 'taxRate', 'isTaxable',
      // Inventory
      'stock', 'minStockLevel', 'isTrackInventory',
      // Product Details
      'category', 'subcategory', 'tags',
      // Media
      'images',
      // Physical Attributes
      'weight', 'weightUnit',
      // Variants
      'hasVariants', 'variants',
      // Shipping
      'isShippable', 'shippingWeight', 'shippingWeightUnit',
      // Supplier
      'supplierName', 'supplierCode',
      // Status
      'isActive', 'isFeatured',
      // Availability
      'availableFrom', 'availableTo'
    ];

    // Add only the fields that exist in updateData
    fieldsToUpdate.forEach(field => {
      if (field in updateData) {
        updateDoc.$set[field] = (updateData as any)[field];
      }
    });

    // Handle dimensions update separately to preserve existing values
    if (updateData.dimensions) {
      updateDoc.$set.dimensions = {
        length: updateData.dimensions.length,
        width: updateData.dimensions.width,
        height: updateData.dimensions.height,
        unit: updateData.dimensions.unit || 'cm'
      };
    }

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      updateDoc
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<{ deletedCount: number }> {
  try {
    const productsCollection = await getProductsCollection();
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    
    if (result.deletedCount === 0) {
      throw new Error('Product not found or already deleted');
    }
    
    return { deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function getStoreProducts(storeId: string): Promise<IProduct[]> {
  try {
    const productsCollection = await getProductsCollection();
    return await productsCollection
      .find({ storeId: new ObjectId(storeId) })
      .sort({ createdAt: -1 })
      .toArray()
      .then(products => 
        products.map(product => ({
          ...product,
          _id: product._id,
          storeId: product.storeId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      );
  } catch (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }
}
