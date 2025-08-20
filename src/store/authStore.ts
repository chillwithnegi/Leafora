import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { mockUsers, mockAdminSettings } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentMode: 'buyer' | 'seller';
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  becomeSeller: (sellerData: any) => Promise<{ success: boolean; message: string }>;
  switchMode: (mode: 'buyer' | 'seller') => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      currentMode: 'buyer',

      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          set({ 
            user, 
            isAuthenticated: true,
            currentMode: user.role === 'seller' ? 'seller' : 'buyer'
          });
          return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid credentials' };
      },

      signup: async (name: string, email: string, password: string) => {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          return { success: false, message: 'User already exists' };
        }

        // Create new user (default role: buyer)
        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          name,
          email,
          role: 'buyer',
          rating: 0,
          totalReviews: 0,
          createdAt: new Date(),
          isVerified: false,
        };

        mockUsers.push(newUser);
        set({ user: newUser, isAuthenticated: true, currentMode: 'buyer' });
        return { success: true, message: 'Account created successfully' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, currentMode: 'buyer' });
      },

      becomeSeller: async (sellerData: any) => {
        const { user } = get();
        if (!user) return { success: false, message: 'Not authenticated' };

        const updatedUser = {
          ...user,
          role: 'seller' as const,
          bio: sellerData.bio,
          skills: sellerData.skills,
          languages: sellerData.languages,
          profilePic: sellerData.profilePic,
        };

        // Update in mockUsers array
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex] = updatedUser;
        }

        set({ user: updatedUser, currentMode: 'seller' });
        return { success: true, message: 'Seller account activated successfully' };
      },

      switchMode: (mode: 'buyer' | 'seller') => {
        const { user } = get();
        if (user && (user.role === 'seller' || user.role === 'admin')) {
          set({ currentMode: mode });
        }
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          
          // Update in mockUsers array
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
        }
      },
    }),
    {
      name: 'leafora-auth-storage',
    }
  )
);