-- Add explicit DELETE policy for user_payments table
-- Only admins can delete payment records for compliance/data management
CREATE POLICY "Only admins can delete payment records"
ON public.user_payments
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));