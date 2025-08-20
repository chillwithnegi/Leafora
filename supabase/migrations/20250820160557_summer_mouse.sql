/*
  # Insert Admin User

  1. Create admin user in auth.users (this needs to be done via Supabase Dashboard)
  2. Update the profile to admin role
  
  Admin Credentials:
  Email: admin@leafora.com
  Password: admin123
  
  Note: The actual user creation must be done through Supabase Dashboard or Auth API
  This migration will update the profile once the user is created
*/

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ language 'plpgsql' security definer;

-- This will be executed after creating the admin user manually
-- SELECT promote_to_admin('admin@leafora.com');