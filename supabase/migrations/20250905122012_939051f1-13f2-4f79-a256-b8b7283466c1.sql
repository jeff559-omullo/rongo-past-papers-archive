-- Allow admins to delete papers
CREATE POLICY "Admins can delete papers" 
ON public.papers 
FOR DELETE 
USING (is_admin(auth.uid()));