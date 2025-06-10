import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  userId: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
  };
  socialMedia: {
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
    default: '',
  },
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'Cameroon',
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  socialMedia: {
    website: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
  },
  businessHours: {
    type: Map,
    of: {
      isOpen: Boolean,
      openTime: String,
      closeTime: String,
    },
    default: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
    },
  },
}, {
  timestamps: true,
});

// Create the model if it doesn't exist, or use the existing one
const Store = mongoose.models.Store || mongoose.model<IStore>('Store', storeSchema);

export default Store; 