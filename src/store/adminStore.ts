import { create } from 'zustand';
import { AdminSettings } from '../types';
import { mockAdminSettings } from '../data/mockData';

interface AdminState {
  settings: AdminSettings;
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  updateSettings: (settings: Partial<AdminSettings>) => Promise<{ success: boolean; message: string }>;
  getAnalytics: () => any;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  settings: mockAdminSettings,
  isAdminAuthenticated: false,

  adminLogin: (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      set({ isAdminAuthenticated: true });
      return true;
    }
    return false;
  },

  adminLogout: () => {
    set({ isAdminAuthenticated: false });
  },

  updateSettings: async (newSettings: Partial<AdminSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
    
    return { success: true, message: 'Settings updated successfully' };
  },

  getAnalytics: () => {
    // Mock analytics data
    return {
      totalUsers: 1250,
      totalOrders: 890,
      totalRevenue: 45780,
      activeServices: 324,
      monthlyGrowth: 12.5,
    };
  },
}));