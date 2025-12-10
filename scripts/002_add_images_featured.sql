-- Add images column to annonces table (if not exists)
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add featured column to annonces table for homepage highlight
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add featured column to profiles for prestataires
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create admin user (update with correct user ID after signup)
-- This will be done via the app after creating the admin account
