import { Product } from '@/models/product';
import { User } from '@/models/user';

const sampleProducts = [
  {
    name: 'Fresh Apples',
    description: 'Freshly picked apples from local farms. Perfect for snacking or cooking.',
    price: 1.99,
    category: 'Fruits',
    subcategory: 'Apples',
    images: [
      { url: '/images/products/apples.jpg', alt: 'Fresh Apples' },
      { url: '/images/products/apples2.jpg', alt: 'Fresh Apples' },
    ],
    stock: 100,
    store: '1',
    location: { city: 'Douala', region: 'Littoral' },
    tags: ['fresh', 'local', 'healthy'],
    weight: 1, // kg
    weightUnit: 'kg',
    available: true,
    organic: true,
  },
  {
    name: 'Organic Bananas',
    description: 'Organic bananas from Cameroon. Grown without chemicals.',
    price: 0.99,
    category: 'Fruits',
    subcategory: 'Bananas',
    images: [
      { url: '/images/products/bananas.jpg', alt: 'Organic Bananas' },
      { url: '/images/products/bananas2.jpg', alt: 'Organic Bananas' },
    ],
    stock: 150,
    store: '2',
    location: { city: 'Yaoundé', region: 'Centre' },
    tags: ['organic', 'local', 'healthy'],
    weight: 1, // kg
    weightUnit: 'kg',
    available: true,
    organic: true,
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Locally grown tomatoes. Perfect for salads and cooking.',
    price: 2.49,
    category: 'Vegetables',
    subcategory: 'Tomatoes',
    images: [
      { url: '/images/products/tomatoes.jpg', alt: 'Fresh Tomatoes' },
      { url: '/images/products/tomatoes2.jpg', alt: 'Fresh Tomatoes' },
    ],
    stock: 200,
    store: '3',
    location: { city: 'Buea', region: 'South West' },
    tags: ['fresh', 'local', 'healthy'],
    weight: 1, // kg
    weightUnit: 'kg',
    available: true,
    organic: false,
  },
  {
    name: 'Organic Carrots',
    description: 'Organic carrots grown in Cameroon. Rich in vitamins.',
    price: 1.49,
    category: 'Vegetables',
    subcategory: 'Carrots',
    images: [
      { url: '/images/products/carrots.jpg', alt: 'Organic Carrots' },
      { url: '/images/products/carrots2.jpg', alt: 'Organic Carrots' },
    ],
    stock: 180,
    store: '4',
    location: { city: 'Bamenda', region: 'North West' },
    tags: ['organic', 'local', 'healthy'],
    weight: 1, // kg
    weightUnit: 'kg',
    available: true,
    organic: true,
  },
  {
    name: 'Fresh Pineapples',
    description: 'Fresh pineapples from Cameroon. Sweet and juicy.',
    price: 3.99,
    category: 'Fruits',
    subcategory: 'Pineapples',
    images: [
      { url: '/images/products/pineapples.jpg', alt: 'Fresh Pineapples' },
      { url: '/images/products/pineapples2.jpg', alt: 'Fresh Pineapples' },
    ],
    stock: 120,
    store: '5',
    location: { city: 'Garoua', region: 'North' },
    tags: ['fresh', 'local', 'healthy'],
    weight: 1, // kg
    weightUnit: 'kg',
    available: true,
    organic: false,
  },
];

export async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Successfully created ${products.length} products`);

    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
