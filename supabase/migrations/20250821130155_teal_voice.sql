/*
  # Create Admin User

  This migration creates the admin user account for Leafora.
  
  Admin Credentials:
  - Email: admin@leafora.com  
  - Password: leafora123
  
  Note: You need to create this user manually in Supabase Auth first,
  then run this function to promote them to admin.
*/

-- Function to promote user to admin (already exists from main schema)
-- This is just a reminder of the admin credentials

-- To create the admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Email: admin@leafora.com
-- 4. Password: leafora123
-- 5. Run: SELECT promote_to_admin('admin@leafora.com');

-- Demo seller account will be created automatically from the main schema migration