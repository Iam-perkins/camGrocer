import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Fruits',
      'Vegetables',
      'Grains',
      'Dairy',
      'Meat',
      'Beverages',
      'Snacks',
      'Household',
      'Other',
    ],
  },
  subcategory: {
    type: String,
    required: true,
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  organic: {
    type: Boolean,
    default: false,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  salePrice: {
    type: Number,
    default: null,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'ml', 'l'],
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  approvedAt: {
    type: Date,
    default: null,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Index for text search
ProductSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text',
  tags: 'text',
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Fruits' | 'Vegetables' | 'Grains' | 'Dairy' | 'Meat' | 'Beverages' | 'Snacks' | 'Household' | 'Other';
  subcategory: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  stock: number;
  rating: number;
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  store: string;
  location: {
    city: string;
    region: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  organic: boolean;
  onSale: boolean;
  salePrice: number | null;
  discountPercentage: number;
  weight: number;
  weightUnit: 'g' | 'kg' | 'ml' | 'l';
  available: boolean;
  views: number;
  sold: number;
};
