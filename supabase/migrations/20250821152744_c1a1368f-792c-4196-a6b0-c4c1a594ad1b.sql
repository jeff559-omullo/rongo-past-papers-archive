-- Create the make_admin function
CREATE OR REPLACE FUNCTION public.make_admin(_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Find the user by email
  SELECT id INTO _user_id 
  FROM auth.users 
  WHERE email = _email;
  
  -- Check if user exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _email;
  END IF;
  
  -- Insert admin role if it doesn't exist
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;