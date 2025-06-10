import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getStoreProducts 
} from '@/lib/db-operations';

// GET /api/products - Get all products for the store
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    
    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const products = await getStoreProducts(storeId);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    console.log('Received request to create product');
    
    // Parse request body
    let productData;
    try {
      productData = await request.json();
      console.log('Parsed request body:', JSON.stringify(productData, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields with more detailed error messages
    const requiredFields = [
      { field: 'name', type: 'string' },
      { field: 'sku', type: 'string' },
      { field: 'category', type: 'string' },
      { field: 'storeId', type: 'string' },
      { field: 'sellingPrice', type: 'number' }
    ];
    
    const validationErrors: string[] = [];
    
    requiredFields.forEach(({ field, type }) => {
      if (!(field in productData)) {
        validationErrors.push(`Missing required field: ${field}`);
      } else if (type === 'number' && isNaN(Number(productData[field]))) {
        validationErrors.push(`Invalid ${field}: must be a valid number`);
      } else if (type === 'string' && typeof productData[field] !== 'string') {
        validationErrors.push(`Invalid ${field}: must be a string`);
      } else if (type === 'string' && !productData[field].trim()) {
        validationErrors.push(`Invalid ${field}: cannot be empty`);
      }
    });
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Prepare product data with proper types and validation
    const productToCreate = {
      // Basic Information
      name: String(productData.name || '').trim(),
      description: String(productData.description || '').trim(),
      brand: String(productData.brand || '').trim(),
      barcode: String(productData.barcode || '').trim(),
      sku: String(productData.sku || `SKU-${Date.now()}`).trim(),
      
      // Pricing
      costPrice: Math.max(0, Number(productData.costPrice) || 0),
      sellingPrice: Math.max(0, Number(productData.sellingPrice) || 0),
      taxRate: Math.min(100, Math.max(0, Number(productData.taxRate) || 0)), // Cap at 100%
      isTaxable: productData.isTaxable !== false, // default to true
      
      // Inventory
      stock: Math.max(0, Math.floor(Number(productData.stock) || 0)),
      minStockLevel: Math.max(0, Math.floor(Number(productData.minStockLevel) || 0)),
      isTrackInventory: productData.isTrackInventory !== false, // default to true
      
      // Product Details
      category: String(productData.category || '').trim(),
      subcategory: String(productData.subcategory || '').trim(),
      tags: Array.isArray(productData.tags) 
        ? productData.tags.map((tag: any) => String(tag).trim()).filter(Boolean) 
        : [],
      
      // Media
      images: Array.isArray(productData.images) 
        ? productData.images.map((img: any) => String(img).trim()).filter(Boolean) 
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
      supplierName: String(productData.supplierName || '').trim(),
      supplierCode: String(productData.supplierCode || '').trim(),
      
      // Status
      isActive: productData.isActive !== false, // default to true
      isFeatured: Boolean(productData.isFeatured),
      isTaxable: productData.isTaxable !== false, // default to true
      
      // Availability
      availableFrom: productData.availableFrom || new Date().toISOString(),
      availableTo: productData.availableTo || '',
      
      // Store
      storeId: String(productData.storeId || '').trim(),
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Prepared product data for creation:', JSON.stringify(productToCreate, null, 2));
    
    try {
      // Create the product in the database
      console.log('Attempting to create product...');
      const createdProduct = await createProduct(productToCreate);
      console.log('Product created successfully:', createdProduct._id);
      
      return NextResponse.json(createdProduct, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating product:', dbError);
      
      // Check for duplicate key error (MongoDB error code 11000)
      if ((dbError as any).code === 11000) {
        return NextResponse.json(
          { 
            error: 'Duplicate product',
            details: 'A product with the same SKU or barcode already exists',
            code: 'DUPLICATE_PRODUCT'
          },
          { status: 409 } // Conflict
        );
      }
      
      // Handle validation errors
      if ((dbError as any).name === 'ValidationError') {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: (dbError as any).message,
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
      
      // Handle other database errors
      return NextResponse.json(
        { 
          error: 'Database error',
          details: (dbError as Error).message,
          code: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/products:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/products - Update a product
export async function PATCH(request: Request) {
  try {
    const { _id, ...updates } = await request.json();
    
    if (!_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are being updated
    // Basic Information
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.brand !== undefined) updateData.brand = updates.brand;
    if (updates.barcode !== undefined) updateData.barcode = updates.barcode;
    if (updates.sku !== undefined) updateData.sku = updates.sku;
    
    // Pricing
    if (updates.costPrice !== undefined) updateData.costPrice = parseFloat(updates.costPrice) || 0;
    if (updates.sellingPrice !== undefined) updateData.sellingPrice = parseFloat(updates.sellingPrice);
    if (updates.taxRate !== undefined) updateData.taxRate = parseFloat(updates.taxRate) || 0;
    if (updates.isTaxable !== undefined) updateData.isTaxable = updates.isTaxable;
    
    // Inventory
    if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock, 10) || 0;
    if (updates.minStockLevel !== undefined) updateData.minStockLevel = parseInt(updates.minStockLevel, 10) || 0;
    if (updates.isTrackInventory !== undefined) updateData.isTrackInventory = updates.isTrackInventory;
    
    // Product Details
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory;
    if (updates.tags !== undefined) updateData.tags = Array.isArray(updates.tags) ? updates.tags : [];
    
    // Media
    if (updates.images !== undefined) updateData.images = Array.isArray(updates.images) ? updates.images : [];
    
    // Physical Attributes
    if (updates.weight !== undefined) updateData.weight = parseFloat(updates.weight) || 0;
    if (updates.weightUnit !== undefined) updateData.weightUnit = updates.weightUnit;
    
    // Handle dimensions updates
    if (updates.dimensions) {
      updateData.dimensions = {
        ...(updateData.dimensions || {}),
        length: parseFloat(updates.dimensions.length) || 0,
        width: parseFloat(updates.dimensions.width) || 0,
        height: parseFloat(updates.dimensions.height) || 0,
        unit: updates.dimensions.unit || 'cm'
      };
    }
    
    // Variants
    if (updates.hasVariants !== undefined) updateData.hasVariants = updates.hasVariants;
    if (updates.variants !== undefined) {
      updateData.variants = Array.isArray(updates.variants) ? updates.variants : [];
    }
    
    // Shipping
    if (updates.isShippable !== undefined) updateData.isShippable = updates.isShippable;
    if (updates.shippingWeight !== undefined) {
      updateData.shippingWeight = parseFloat(updates.shippingWeight) || 0;
    }
    if (updates.shippingWeightUnit !== undefined) {
      updateData.shippingWeightUnit = updates.shippingWeightUnit;
    }
    
    // Supplier
    if (updates.supplierName !== undefined) updateData.supplierName = updates.supplierName;
    if (updates.supplierCode !== undefined) updateData.supplierCode = updates.supplierCode;
    
    // Status
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.isFeatured !== undefined) updateData.isFeatured = updates.isFeatured;
    
    // Availability
    if (updates.availableFrom !== undefined) updateData.availableFrom = updates.availableFrom;
    if (updates.availableTo !== undefined) updateData.availableTo = updates.availableTo;

    const result = await updateProduct(_id, updateData);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products - Delete a product
export async function DELETE(request: Request) {
  try {
    const { _id } = await request.json();
    
    if (!_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(_id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
