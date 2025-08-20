import { User, Service, Order, AdminSettings } from '../types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@leafora.com',
    role: 'admin',
    rating: 5,
    totalReviews: 0,
    createdAt: new Date('2024-01-01'),
    isVerified: true,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'seller',
    profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
    bio: 'Full-stack developer with 5+ years experience in React, Node.js, and modern web technologies.',
    rating: 4.9,
    totalReviews: 127,
    createdAt: new Date('2024-01-15'),
    isVerified: true,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    languages: ['English', 'Chinese'],
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    role: 'seller',
    profilePic: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150&h=150&fit=crop',
    bio: 'Creative UI/UX designer passionate about creating beautiful and functional user experiences.',
    rating: 4.8,
    totalReviews: 89,
    createdAt: new Date('2024-02-01'),
    isVerified: true,
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    languages: ['English', 'Spanish'],
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma@example.com',
    role: 'buyer',
    profilePic: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=150&h=150&fit=crop',
    rating: 0,
    totalReviews: 0,
    createdAt: new Date('2024-03-01'),
  },
];

// Mock services data
export const mockServices: Service[] = [
  {
    id: '1',
    sellerId: '2',
    seller: mockUsers[1] as User,
    title: 'I will build a modern responsive website with React and TypeScript',
    description: 'Get a professional, modern website built with the latest technologies including React, TypeScript, and Tailwind CSS. Perfect for businesses, portfolios, and startups.',
    category: 'Web Development',
    subCategory: 'Frontend Development',
    tags: ['React', 'TypeScript', 'Responsive', 'Modern', 'Professional'],
    images: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: {
        price: 99,
        delivery: 3,
        revisions: 2,
        features: ['Responsive design', 'Basic SEO', '3 pages', 'Mobile-friendly']
      },
      standard: {
        price: 199,
        delivery: 5,
        revisions: 3,
        features: ['Everything in Basic', '5 pages', 'Contact form', 'Advanced SEO', 'Speed optimization']
      },
      premium: {
        price: 399,
        delivery: 7,
        revisions: 5,
        features: ['Everything in Standard', '10 pages', 'Admin panel', 'Database integration', 'API setup']
      }
    },
    status: 'active',
    rating: 4.9,
    totalOrders: 45,
    createdAt: new Date('2024-01-20'),
    featured: true,
  },
  {
    id: '2',
    sellerId: '3',
    seller: mockUsers[2] as User,
    title: 'I will design a stunning UI/UX for your mobile app or website',
    description: 'Transform your ideas into beautiful, user-friendly designs. I specialize in creating modern, intuitive interfaces that users love.',
    category: 'UI/UX Design',
    subCategory: 'Mobile App Design',
    tags: ['UI Design', 'UX Design', 'Mobile App', 'Figma', 'Prototyping'],
    images: [
      'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: {
        price: 79,
        delivery: 2,
        revisions: 2,
        features: ['3 screens', 'Mobile-first design', 'Basic wireframes', 'High-fidelity mockups']
      },
      standard: {
        price: 149,
        delivery: 4,
        revisions: 3,
        features: ['Everything in Basic', '7 screens', 'Interactive prototype', 'User flow diagram']
      },
      premium: {
        price: 299,
        delivery: 6,
        revisions: 5,
        features: ['Everything in Standard', '15 screens', 'Design system', 'Handoff files', 'Unlimited revisions']
      }
    },
    status: 'active',
    rating: 4.8,
    totalOrders: 32,
    createdAt: new Date('2024-02-05'),
    featured: true,
  },
];

// Mock admin settings
export const mockAdminSettings: AdminSettings = {
  siteTitle: 'Leafora',
  siteDescription: 'Premium freelancing marketplace where talent meets opportunity',
  tagline: 'Grow Your Work, Grow Your Future',
  heroTitle: 'Find the Perfect Freelance Services for Your Business',
  heroSubtitle: 'Discover talented freelancers and get your projects done professionally',
  commissionRate: 15,
  tosContent: 'Terms of Service content goes here...',
  privacyPolicyContent: 'Privacy Policy content goes here...',
  refundPolicyContent: 'Refund Policy content goes here...',
  contactEmail: 'support@leafora.com',
  featuredCategories: ['Web Development', 'UI/UX Design', 'Content Writing', 'Digital Marketing'],
};

// Mock orders
export const mockOrders: Order[] = [
  {
    id: '1',
    buyerId: '4',
    sellerId: '2',
    serviceId: '1',
    buyer: mockUsers[3] as User,
    seller: mockUsers[1] as User,
    service: mockServices[0],
    status: 'in_progress',
    package: 'standard',
    amount: 199,
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    requirements: 'Need a portfolio website for my photography business with gallery and contact form.',
    revisionCount: 0,
    maxRevisions: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];