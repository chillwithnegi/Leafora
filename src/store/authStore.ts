import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  profile_pic: string | null;
  bio: string | null;
  skills: string[] | null;
  languages: string[] | null;
  rating: number;
  total_reviews: number;
  seller_level: 'new_seller' | 'level_one' | 'level_two' | 'top_rated';
  is_verified: boolean;
  is_active: boolean;
  last_active: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  currentMode: 'buyer' | 'seller';
  loading: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  becomeSeller: (sellerData: {
    bio: string;
    skills: string[];
    languages: string[];
    profilePic?: string;
  }) => Promise<{ success: boolean; message: string }>;
  switchMode: (mode: 'buyer' | 'seller') => void;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      currentMode: 'buyer',
      loading: true,

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            set({
              user: session.user,
              profile,
              isAuthenticated: true,
              currentMode: profile?.role === 'seller' ? 'seller' : 'buyer',
              loading: false
            });
          } else {
            set({ loading: false });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              set({
                user: session.user,
                profile,
                isAuthenticated: true,
                currentMode: profile?.role === 'seller' ? 'seller' : 'buyer'
              });
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                profile: null,
                isAuthenticated: false,
                currentMode: 'buyer'
              });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ loading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            return { success: false, message: error.message };
          }

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            set({
              user: data.user,
              profile,
              isAuthenticated: true,
              currentMode: profile?.role === 'seller' ? 'seller' : 'buyer'
            });

            return { success: true, message: 'Login successful' };
          }

          return { success: false, message: 'Login failed' };
        } catch (error) {
          return { success: false, message: 'An unexpected error occurred' };
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role: 'buyer'
              }
            }
          });

          if (error) {
            return { success: false, message: error.message };
          }

          if (data.user) {
            // Profile will be created automatically via trigger
            return { success: true, message: 'Account created successfully' };
          }

          return { success: false, message: 'Signup failed' };
        } catch (error) {
          return { success: false, message: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          currentMode: 'buyer'
        });
      },

      becomeSeller: async (sellerData) => {
        const { user, profile } = get();
        if (!user || !profile) {
          return { success: false, message: 'Not authenticated' };
        }

        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              role: 'seller',
              bio: sellerData.bio,
              skills: sellerData.skills,
              languages: sellerData.languages,
              profile_pic: sellerData.profilePic || profile.profile_pic
            })
            .eq('id', user.id);

          if (error) {
            return { success: false, message: error.message };
          }

          // Refresh profile
          await get().refreshProfile();
          set({ currentMode: 'seller' });

          return { success: true, message: 'Seller account activated successfully' };
        } catch (error) {
          return { success: false, message: 'Failed to become seller' };
        }
      },

      switchMode: (mode: 'buyer' | 'seller') => {
        const { profile } = get();
        if (profile && (profile.role === 'seller' || profile.role === 'admin')) {
          set({ currentMode: mode });
        }
      },

      updateProfile: async (data: Partial<Profile>) => {
        const { user } = get();
        if (!user) {
          return { success: false, message: 'Not authenticated' };
        }

        try {
          const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id);

          if (error) {
            return { success: false, message: error.message };
          }

          await get().refreshProfile();
          return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
          return { success: false, message: 'Failed to update profile' };
        }
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          set({ profile });
        } catch (error) {
          console.error('Failed to refresh profile:', error);
        }
      }
    }),
    {
      name: 'leafora-auth-storage',
      partialize: (state) => ({
        currentMode: state.currentMode
      })
    }
  )
);