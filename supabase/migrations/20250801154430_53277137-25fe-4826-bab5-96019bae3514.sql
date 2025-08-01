-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create papers table for storing uploaded papers with approval status
CREATE TABLE public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
    exam_type TEXT NOT NULL CHECK (exam_type IN ('mid-semester', 'end-semester', 'cat', 'assignment')),
    academic_year TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    download_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Enable RLS on papers
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- RLS policies for papers
CREATE POLICY "Users can view approved papers"
ON public.papers
FOR SELECT
TO authenticated
USING (status = 'approved' OR uploaded_by = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can upload their own papers"
ON public.papers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own pending papers"
ON public.papers
FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any paper"
ON public.papers
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Function to create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

-- Trigger to automatically create user role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();