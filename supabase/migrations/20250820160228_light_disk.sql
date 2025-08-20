/*
  # Leafora Database Schema

  1. New Tables
    - `profiles` - User profiles with role management
    - `services` - Freelance services/gigs
    - `orders` - Order management with status tracking
    - `messages` - Real-time messaging system
    - `reviews` - Service reviews and ratings
    - `admin_settings` - Site-wide configuration
    - `transactions` - Payment and wallet tracking
    - `disputes` - Dispute resolution system

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure admin access with proper permissions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE service_status AS ENUM ('draft', 'active', 'paused', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed');
CREATE TYPE seller_level AS ENUM ('new_seller', 'level_one', 'level_two', 'top_rated');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'buyer',
  profile_pic text,
  bio text,
  skills text[],
  languages text[],
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  seller_level seller_level DEFAULT 'new_seller',
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  sub_category text,
  tags text[],
  images text[],
  video_url text,
  
  -- Pricing tiers
  price_basic integer NOT NULL,
  price_standard integer,
  price_premium integer,
  
  -- Delivery times (in days)
  delivery_basic integer NOT NULL,
  delivery_standard integer,
  delivery_premium integer,
  
  -- Revisions
  revisions_basic integer DEFAULT 1,
  revisions_standard integer DEFAULT 2,
  revisions_premium integer DEFAULT 3,
  
  -- Features for each tier
  features_basic text[],
  features_standard text[],
  features_premium text[],
  
  status service_status DEFAULT 'draft',
  rating numeric(3,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  
  package text NOT NULL CHECK (package IN ('basic', 'standard', 'premium')),
  amount integer NOT NULL,
  commission_amount integer NOT NULL,
  
  status order_status DEFAULT 'pending',
  requirements text,
  deliverables text[],
  
  delivery_date timestamptz NOT NULL,
  revision_count integer DEFAULT 0,
  max_revisions integer NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  
  content text NOT NULL,
  attachments text[],
  is_read boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  
  created_at timestamptz DEFAULT now()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_title text DEFAULT 'Leafora',
  site_description text DEFAULT 'Premium freelancing marketplace where talent meets opportunity',
  tagline text DEFAULT 'Grow Your Work, Grow Your Future',
  hero_title text DEFAULT 'Find the Perfect Freelance Services for Your Business',
  hero_subtitle text DEFAULT 'Discover talented freelancers and get your projects done professionally',
  commission_rate numeric(5,2) DEFAULT 15.00,
  tos_content text,
  privacy_policy_content text,
  refund_policy_content text,
  contact_email text DEFAULT 'support@leafora.com',
  featured_categories text[],
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  
  type text NOT NULL CHECK (type IN ('payment', 'withdrawal', 'commission', 'refund')),
  amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  
  payment_method text,
  transaction_reference text,
  description text,
  
  created_at timestamptz DEFAULT now()
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  raised_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  reason text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
  
  admin_notes text,
  resolution text,
  
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Services policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own services" ON services FOR ALL USING (seller_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Order participants can update" ON orders FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Admin settings policies
CREATE POLICY "Anyone can view admin settings" ON admin_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify settings" ON admin_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create transactions" ON transactions FOR INSERT WITH CHECK (true);

-- Disputes policies
CREATE POLICY "Order participants can view disputes" ON disputes FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);
CREATE POLICY "Order participants can create disputes" ON disputes FOR INSERT WITH CHECK (raised_by = auth.uid());

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default admin settings
INSERT INTO admin_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- This will be called after the admin user is created via Supabase Auth
  -- The profile will be created via trigger
END;
$$ language 'plpgsql';

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS trigger AS $$
BEGIN
  -- Update seller rating when new review is added
  UPDATE profiles 
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2) 
      FROM reviews 
      WHERE seller_id = NEW.seller_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE seller_id = NEW.seller_id
    )
  WHERE id = NEW.seller_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update ratings
CREATE TRIGGER update_seller_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_user_rating();