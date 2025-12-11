-- Create RPC functions to update featured status
-- These functions run with elevated privileges to bypass RLS

-- Function to toggle featured status for profiles (prestataires)
CREATE OR REPLACE FUNCTION toggle_profile_featured(
  profile_id UUID,
  new_featured_status BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the function owner
SET search_path = public
AS $$
DECLARE
  is_user_admin BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  SELECT is_admin INTO is_user_admin
  FROM profiles
  WHERE id = auth.uid();

  -- If not admin, raise an exception
  IF NOT COALESCE(is_user_admin, FALSE) THEN
    RAISE EXCEPTION 'Only administrators can update featured status';
  END IF;

  -- Update the featured status
  UPDATE profiles
  SET featured = new_featured_status,
      updated_at = NOW()
  WHERE id = profile_id;

  -- Return success
  RETURN TRUE;
END;
$$;

-- Function to toggle featured status for annonces
CREATE OR REPLACE FUNCTION toggle_annonce_featured(
  annonce_id UUID,
  new_featured_status BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_user_admin BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  SELECT is_admin INTO is_user_admin
  FROM profiles
  WHERE id = auth.uid();

  -- If not admin, raise an exception
  IF NOT COALESCE(is_user_admin, FALSE) THEN
    RAISE EXCEPTION 'Only administrators can update featured status';
  END IF;

  -- Update the featured status
  UPDATE annonces
  SET featured = new_featured_status,
      updated_at = NOW()
  WHERE id = annonce_id;

  -- Return success
  RETURN TRUE;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION toggle_profile_featured TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_annonce_featured TO authenticated;
