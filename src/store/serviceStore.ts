import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string | null;
  tags: string[] | null;
  images: string[] | null;
  video_url: string | null;
  price_basic: number;
  price_standard: number | null;
  price_premium: number | null;
  delivery_basic: number;
  delivery_standard: number | null;
  delivery_premium: number | null;
  revisions_basic: number;
  revisions_standard: number | null;
  revisions_premium: number | null;
  features_basic: string[] | null;
  features_standard: string[] | null;
  features_premium: string[] | null;
  status: 'draft' | 'active' | 'paused' | 'rejected';
  rating: number;
  total_orders: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  seller?: {
    name: string;
    profile_pic: string | null;
    rating: number;
    total_reviews: number;
    seller_level: string;
  };
}

interface ServiceState {
  services: Service[];
  filteredServices: Service[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  loading: boolean;
  
  // Actions
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<Service | null>;
  createService: (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_orders'>) => Promise<{ success: boolean; message: string }>;
  updateService: (id: string, updates: Partial<Service>) => Promise<{ success: boolean; message: string }>;
  deleteService: (id: string) => Promise<{ success: boolean; message: string }>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  filterServices: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  filteredServices: [],
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

  fetchServices: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          seller:profiles!services_seller_id_fkey (
            name,
            profile_pic,
            rating,
            total_reviews,
            seller_level
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ services: data || [], filteredServices: data || [] });
      get().filterServices();
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchServiceById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          seller:profiles!services_seller_id_fkey (
            name,
            profile_pic,
            rating,
            total_reviews,
            seller_level,
            bio,
            skills,
            languages
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  },

  createService: async (serviceData) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([serviceData]);

      if (error) throw error;

      await get().fetchServices();
      return { success: true, message: 'Service created successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create service' };
    }
  },

  updateService: async (id: string, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await get().fetchServices();
      return { success: true, message: 'Service updated successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update service' };
    }
  },

  deleteService: async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchServices();
      return { success: true, message: 'Service deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete service' };
    }
  },

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
                          (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      const minPrice = service.price_basic;
      const matchesPrice = minPrice >= priceRange[0] && minPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_basic - b.price_basic;
        case 'price-high':
          return b.price_basic - a.price_basic;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.total_orders - a.total_orders;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    set({ filteredServices: filtered });
  }
}));