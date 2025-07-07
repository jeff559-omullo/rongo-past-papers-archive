
-- First, delete all user payments (this will cascade to mpesa_transactions)
DELETE FROM public.user_payments;

-- Then delete all users from the auth.users table
-- This requires superuser privileges, so we use a function
DELETE FROM auth.users;
