import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  storeId: string;
  storeName: string;
}

interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  storeIds: string[]; // For easy querying by store
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  storeId: { type: String, required: true },
  storeName: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    storeIds: [{ type: String, index: true }],
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `ORD-${year}${month}${random}`;
    
    // Extract unique store IDs from items
    this.storeIds = [...new Set(this.items.map(item => item.storeId))];
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
