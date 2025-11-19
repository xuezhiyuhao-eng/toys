import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Minimalist Leather Sofa',
    price: 1299,
    category: Category.FURNITURE,
    description: 'A sleek, 3-seater leather sofa ideal for modern living rooms.',
    image: 'https://picsum.photos/400/300?random=1',
    tags: ['modern', 'leather', 'living room', 'comfortable']
  },
  {
    id: 'p2',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299,
    category: Category.ELECTRONICS,
    description: 'High-fidelity audio with 30-hour battery life.',
    image: 'https://picsum.photos/400/300?random=2',
    tags: ['audio', 'wireless', 'travel', 'tech']
  },
  {
    id: 'p3',
    name: 'Vintage Denim Jacket',
    price: 89,
    category: Category.CLOTHING,
    description: 'Classic cut denim jacket with a vintage wash.',
    image: 'https://picsum.photos/400/300?random=3',
    tags: ['fashion', 'outerwear', 'casual', 'vintage']
  },
  {
    id: 'p4',
    name: 'Smart Watch Series 5',
    price: 399,
    category: Category.ELECTRONICS,
    description: 'Track fitness, heart rate, and messages on the go.',
    image: 'https://picsum.photos/400/300?random=4',
    tags: ['tech', 'fitness', 'wearable', 'smart']
  },
  {
    id: 'p5',
    name: 'Oak Coffee Table',
    price: 150,
    category: Category.FURNITURE,
    description: 'Solid oak wood coffee table with industrial metal legs.',
    image: 'https://picsum.photos/400/300?random=5',
    tags: ['wood', 'industrial', 'living room', 'sturdy']
  },
  {
    id: 'p6',
    name: 'Cotton Linen Shirt',
    price: 45,
    category: Category.CLOTHING,
    description: 'Breathable fabric perfect for summer days.',
    image: 'https://picsum.photos/400/300?random=6',
    tags: ['summer', 'casual', 'lightweight', 'natural']
  },
  {
    id: 'p7',
    name: 'Designer Sunglasses',
    price: 120,
    category: Category.ACCESSORIES,
    description: 'UV400 protection with a classic aviator frame.',
    image: 'https://picsum.photos/400/300?random=7',
    tags: ['summer', 'fashion', 'protection', 'travel']
  },
  {
    id: 'p8',
    name: 'Ceramic Vase Set',
    price: 65,
    category: Category.FURNITURE,
    description: 'Set of 3 handcrafted ceramic vases.',
    image: 'https://picsum.photos/400/300?random=8',
    tags: ['decor', 'home', 'artisan', 'gift']
  },
  {
    id: 'p9',
    name: 'Bluetooth Speaker',
    price: 75,
    category: Category.ELECTRONICS,
    description: 'Portable speaker with waterproof design.',
    image: 'https://picsum.photos/400/300?random=9',
    tags: ['audio', 'party', 'waterproof', 'portable']
  },
  {
    id: 'p10',
    name: 'Leather Wallet',
    price: 55,
    category: Category.ACCESSORIES,
    description: 'Genuine leather bi-fold wallet with RFID protection.',
    image: 'https://picsum.photos/400/300?random=10',
    tags: ['gift', 'daily', 'leather', 'premium']
  }
];