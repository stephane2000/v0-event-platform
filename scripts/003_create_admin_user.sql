-- Create admin user
-- First, sign up with email: admin@prestevent.fr and password: admin123
-- Then run this query with the user ID to make them admin

-- To find the user ID after signup, run:
-- SELECT id, email FROM auth.users WHERE email = 'admin@prestevent.fr';

-- Then update the profile to make them admin:
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@prestevent.fr';

-- Or use this query that will work automatically after signup:
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@prestevent.fr';
