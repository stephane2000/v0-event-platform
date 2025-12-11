-- Fix RLS policies for featured column on profiles table
-- This allows admins to update the featured status of prestataires

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create policy to allow admins to update any profile
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.is_admin = true
  )
);

-- Ensure the featured column has proper default value
ALTER TABLE profiles
ALTER COLUMN featured SET DEFAULT FALSE;

-- Ensure the is_admin column has proper default value
ALTER TABLE profiles
ALTER COLUMN is_admin SET DEFAULT FALSE;
