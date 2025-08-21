/*
  # Complete Leafora Database Schema

  1. New Tables
    - `profiles` - User profiles with buyer/seller/admin roles
    - `services` - Freelance services/gigs
    - `orders` - Order management system
    - `messages` - Real-time messaging
    - `reviews` - Rating and review system
    - `transactions` - Payment and wallet system
    - `disputes` - Dispute resolution
    - `admin_settings` - Site-wide settings

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for each role
    - Secure admin access

  3. Functions
    - Auto profile creation on signup
    - Rating calculation triggers
    - Admin promotion function
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE service_status AS ENUM ('draft', 'active', 'paused', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed');
CREATE TYPE seller_level AS ENUM ('new_seller', 'level_one', 'level_two', 'top_rated');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  sub_category text,
  tags text[],
  images text[],
  video_url text,
  price_basic integer NOT NULL,
  price_standard integer,
  price_premium integer,
  delivery_basic integer NOT NULL,
  delivery_standard integer,
  delivery_premium integer,
  revisions_basic integer DEFAULT 1,
  revisions_standard integer DEFAULT 2,
  revisions_premium integer DEFAULT 3,
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments text[],
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  raised_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
  admin_notes text,
  resolution text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO public USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT TO public USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own services" ON services FOR ALL TO public USING (seller_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO public USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT TO public WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Order participants can update" ON orders FOR UPDATE TO public USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT TO public USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO public WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE TO public USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT TO public USING (true);
CREATE POLICY "Buyers can create reviews" ON reviews FOR INSERT TO public WITH CHECK (buyer_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT TO public USING (user_id = auth.uid());
CREATE POLICY "System can create transactions" ON transactions FOR INSERT TO public WITH CHECK (true);

-- Disputes policies
CREATE POLICY "Order participants can view disputes" ON disputes FOR SELECT TO public USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = disputes.order_id 
    AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
  )
);
CREATE POLICY "Order participants can create disputes" ON disputes FOR INSERT TO public WITH CHECK (raised_by = auth.uid());

-- Admin settings policies
CREATE POLICY "Anyone can view admin settings" ON admin_settings FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can modify settings" ON admin_settings FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET
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

-- Trigger to update seller rating after review
CREATE TRIGGER update_seller_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Insert default admin settings
INSERT INTO admin_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Insert sample data
INSERT INTO profiles (id, email, name, role, profile_pic, bio, skills, languages, rating, total_reviews, is_verified) VALUES
(uuid_generate_v4(), 'sarah@example.com', 'Sarah Chen', 'seller', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop', 'Full-stack developer with 5+ years experience in React, Node.js, and modern web technologies.', ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB'], ARRAY['English', 'Chinese'], 4.9, 127, true),
(uuid_generate_v4(), 'marcus@example.com', 'Marcus Rodriguez', 'seller', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150&h=150&fit=crop', 'Creative UI/UX designer passionate about creating beautiful and functional user experiences.', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Prototyping'], ARRAY['English', 'Spanish'], 4.8, 89, true)
ON CONFLICT (email) DO NOTHING;