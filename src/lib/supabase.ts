import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: 'buyer' | 'seller' | 'admin';
          profile_pic?: string | null;
          bio?: string | null;
          skills?: string[] | null;
          languages?: string[] | null;
          rating?: number;
          total_reviews?: number;
          seller_level?: 'new_seller' | 'level_one' | 'level_two' | 'top_rated';
          is_verified?: boolean;
          is_active?: boolean;
          last_active?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'buyer' | 'seller' | 'admin';
          profile_pic?: string | null;
          bio?: string | null;
          skills?: string[] | null;
          languages?: string[] | null;
          rating?: number;
          total_reviews?: number;
          seller_level?: 'new_seller' | 'level_one' | 'level_two' | 'top_rated';
          is_verified?: boolean;
          is_active?: boolean;
          last_active?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
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
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description: string;
          category: string;
          sub_category?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          video_url?: string | null;
          price_basic: number;
          price_standard?: number | null;
          price_premium?: number | null;
          delivery_basic: number;
          delivery_standard?: number | null;
          delivery_premium?: number | null;
          revisions_basic?: number;
          revisions_standard?: number | null;
          revisions_premium?: number | null;
          features_basic?: string[] | null;
          features_standard?: string[] | null;
          features_premium?: string[] | null;
          status?: 'draft' | 'active' | 'paused' | 'rejected';
          rating?: number;
          total_orders?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          description?: string;
          category?: string;
          sub_category?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          video_url?: string | null;
          price_basic?: number;
          price_standard?: number | null;
          price_premium?: number | null;
          delivery_basic?: number;
          delivery_standard?: number | null;
          delivery_premium?: number | null;
          revisions_basic?: number;
          revisions_standard?: number | null;
          revisions_premium?: number | null;
          features_basic?: string[] | null;
          features_standard?: string[] | null;
          features_premium?: string[] | null;
          status?: 'draft' | 'active' | 'paused' | 'rejected';
          rating?: number;
          total_orders?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          service_id: string;
          package: 'basic' | 'standard' | 'premium';
          amount: number;
          commission_amount: number;
          status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
          requirements: string | null;
          deliverables: string[] | null;
          delivery_date: string;
          revision_count: number;
          max_revisions: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          service_id: string;
          package: 'basic' | 'standard' | 'premium';
          amount: number;
          commission_amount: number;
          status?: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
          requirements?: string | null;
          deliverables?: string[] | null;
          delivery_date: string;
          revision_count?: number;
          max_revisions: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          service_id?: string;
          package?: 'basic' | 'standard' | 'premium';
          amount?: number;
          commission_amount?: number;
          status?: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
          requirements?: string | null;
          deliverables?: string[] | null;
          delivery_date?: string;
          revision_count?: number;
          max_revisions?: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          site_title: string;
          site_description: string;
          tagline: string;
          hero_title: string;
          hero_subtitle: string;
          commission_rate: number;
          tos_content: string | null;
          privacy_policy_content: string | null;
          refund_policy_content: string | null;
          contact_email: string;
          featured_categories: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_title?: string;
          site_description?: string;
          tagline?: string;
          hero_title?: string;
          hero_subtitle?: string;
          commission_rate?: number;
          tos_content?: string | null;
          privacy_policy_content?: string | null;
          refund_policy_content?: string | null;
          contact_email?: string;
          featured_categories?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string;
          site_description?: string;
          tagline?: string;
          hero_title?: string;
          hero_subtitle?: string;
          commission_rate?: number;
          tos_content?: string | null;
          privacy_policy_content?: string | null;
          refund_policy_content?: string | null;
          contact_email?: string;
          featured_categories?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}