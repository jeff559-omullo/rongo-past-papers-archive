-- Drop the existing policy that allows any user to upload papers
DROP POLICY IF EXISTS "Users can upload their own papers" ON public.papers;

-- Create new policy that only allows admins to upload papers
CREATE POLICY "Only admins can upload papers" 
ON public.papers 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Also update the update policy to allow admins to update any paper
DROP POLICY IF EXISTS "Users can update their own pending papers" ON public.papers;

CREATE POLICY "Admins can update any paper and users can update their pending papers" 
ON public.papers 
FOR UPDATE 
USING (is_admin(auth.uid()) OR (uploaded_by = auth.uid() AND status = 'pending'));