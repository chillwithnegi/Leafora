export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  profilePic?: string;
  bio?: string;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  isVerified?: boolean;
  skills?: string[];
  languages?: string[];
  lastActive?: Date;
}

export interface Service {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  tags: string[];
  images: string[];
  video?: string;
  pricing: {
    basic: {
      price: number;
      delivery: number; // days
      revisions: number;
      features: string[];
    };
    standard: {
      price: number;
      delivery: number;
      revisions: number;
      features: string[];
    };
    premium: {
      price: number;
      delivery: number;
      revisions: number;
      features: string[];
    };
  };
  status: 'active' | 'draft' | 'paused' | 'rejected';
  rating: number;
  totalOrders: number;
  createdAt: Date;
  featured?: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  serviceId: string;
  buyer: User;
  seller: User;
  service: Service;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  package: 'basic' | 'standard' | 'premium';
  amount: number;
  deliveryDate: Date;
  requirements?: string;
  deliverables?: string[];
  revisionCount: number;
  maxRevisions: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  orderId?: string;
  content: string;
  attachments?: string[];
  timestamp: Date;
  read: boolean;
}

export interface Review {
  id: string;
  buyerId: string;
  sellerId: string;
  serviceId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface AdminSettings {
  siteTitle: string;
  siteDescription: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  commissionRate: number;
  tosContent: string;
  privacyPolicyContent: string;
  refundPolicyContent: string;
  contactEmail: string;
  featuredCategories: string[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  orderId?: string;
  unreadCount: number;
}

export const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Logo Design',
  'Content Writing',
  'Digital Marketing',
  'Video Editing',
  'Animation',
  'Data Analysis',
  'Translation',
  'Voice Over',
] as const;

export const SELLER_LEVELS = {
  NEW_SELLER: { name: 'New Seller', minOrders: 0, color: '#6B7280' },
  LEVEL_ONE: { name: 'Level 1 Seller', minOrders: 10, color: '#3B82F6' },
  LEVEL_TWO: { name: 'Level 2 Seller', minOrders: 50, color: '#8B5CF6' },
  TOP_RATED: { name: 'Top Rated Seller', minOrders: 100, color: '#F59E0B' },
} as const;