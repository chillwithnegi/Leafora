import { create } from 'zustand';
import { Service } from '../types';
import { mockServices } from '../data/mockData';

interface ServiceState {
  services: Service[];
  filteredServices: Service[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  loading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  filterServices: () => void;
  getServiceById: (id: string) => Service | undefined;
  createService: (service: Omit<Service, 'id' | 'createdAt' | 'rating' | 'totalOrders'>) => Promise<{ success: boolean; message: string }>;
  updateService: (id: string, updates: Partial<Service>) => Promise<{ success: boolean; message: string }>;
  deleteService: (id: string) => Promise<{ success: boolean; message: string }>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: mockServices,
  filteredServices: mockServices,
  categories: [
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
    'Voice Over'
  ],
  searchQuery: '',
  selectedCategory: '',
  priceRange: [0, 1000],
  sortBy: 'newest',
  loading: false,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().filterServices();
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    get().filterServices();
  },

  setPriceRange: (range: [number, number]) => {
    set({ priceRange: range });
    get().filterServices();
  },

  setSortBy: (sort: string) => {
    set({ sortBy: sort });
    get().filterServices();
  },

  filterServices: () => {
    const { services, searchQuery, selectedCategory, priceRange, sortBy } = get();
    
    let filtered = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      const minPrice = Math.min(service.pricing.basic.price, service.pricing.standard.price, service.pricing.premium.price);
      const matchesPrice = minPrice >= priceRange[0] && minPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice && service.status === 'active';
    });

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Math.min(a.pricing.basic.price, a.pricing.standard.price, a.pricing.premium.price) -
                 Math.min(b.pricing.basic.price, b.pricing.standard.price, b.pricing.premium.price);
        case 'price-high':
          return Math.min(b.pricing.basic.price, b.pricing.standard.price, b.pricing.premium.price) -
                 Math.min(a.pricing.basic.price, a.pricing.standard.price, a.pricing.premium.price);
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.totalOrders - a.totalOrders;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    set({ filteredServices: filtered });
  },

  getServiceById: (id: string) => {
    return get().services.find(service => service.id === id);
  },

  createService: async (serviceData) => {
    const newService: Service = {
      ...serviceData,
      id: (get().services.length + 1).toString(),
      createdAt: new Date(),
      rating: 0,
      totalOrders: 0,
      status: 'active',
    };

    set(state => ({
      services: [...state.services, newService]
    }));
    
    get().filterServices();
    return { success: true, message: 'Service created successfully' };
  },

  updateService: async (id: string, updates: Partial<Service>) => {
    set(state => ({
      services: state.services.map(service => 
        service.id === id ? { ...service, ...updates } : service
      )
    }));
    
    get().filterServices();
    return { success: true, message: 'Service updated successfully' };
  },

  deleteService: async (id: string) => {
    set(state => ({
      services: state.services.filter(service => service.id !== id)
    }));
    
    get().filterServices();
    return { success: true, message: 'Service deleted successfully' };
  },
}));