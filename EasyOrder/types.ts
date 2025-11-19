export enum Category {
  ALL = 'All',
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  ACCESSORIES = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderSummaryResponse {
  formattedNote: string;
  suggestedUpsell: string;
}