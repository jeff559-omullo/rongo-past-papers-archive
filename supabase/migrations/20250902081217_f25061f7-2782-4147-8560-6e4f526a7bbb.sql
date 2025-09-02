-- Create papers storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('papers', 'papers', true);

-- Create RLS policies for papers bucket
CREATE POLICY "Anyone can view papers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'papers');

CREATE POLICY "Authenticated users can upload papers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'papers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own papers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'papers' AND auth.uid()::text = owner);

CREATE POLICY "Users can delete their own papers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'papers' AND auth.uid()::text = owner);