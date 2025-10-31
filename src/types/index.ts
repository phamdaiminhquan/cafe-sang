export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  isInStore: boolean;
  role: 'customer' | 'staff' | 'admin';
}

// Backend API Types
export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  status: 'active' | 'inactive';
  categoryId: number;
  category: Category;
}

// Legacy MenuItem interface for backward compatibility
// This will be mapped from Product for existing components
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  views: number;
  clicks: number;
  orders: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  tableNumber?: number;
  pointsEarned: number;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  menuItemId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
  available: boolean;
}