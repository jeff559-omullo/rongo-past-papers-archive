
-- Create a table to track user payments and access
CREATE TABLE public.user_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'KES',
  payment_method VARCHAR(20) NOT NULL DEFAULT 'mpesa',
  transaction_id VARCHAR(100),
  phone_number VARCHAR(15),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 year')
);

-- Create a table to store M-Pesa transaction details
CREATE TABLE public.mpesa_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.user_payments(id) NOT NULL,
  merchant_request_id VARCHAR(100),
  checkout_request_id VARCHAR(100),
  result_code INTEGER,
  result_desc TEXT,
  amount DECIMAL(10,2),
  mpesa_receipt_number VARCHAR(100),
  phone_number VARCHAR(15),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_payments
CREATE POLICY "Users can view their own payments" 
  ON public.user_payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
  ON public.user_payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" 
  ON public.user_payments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for mpesa_transactions (read-only for users)
CREATE POLICY "Users can view their own mpesa transactions" 
  ON public.mpesa_transactions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_payments 
    WHERE public.user_payments.id = public.mpesa_transactions.payment_id 
    AND public.user_payments.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_user_payments_user_id ON public.user_payments(user_id);
CREATE INDEX idx_user_payments_status ON public.user_payments(status);
CREATE INDEX idx_mpesa_transactions_payment_id ON public.mpesa_transactions(payment_id);

-- Create a function to check if user has active access
CREATE OR REPLACE FUNCTION public.user_has_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_payments 
    WHERE user_id = user_uuid 
    AND status = 'completed' 
    AND expires_at > now()
  );
END;
$$;
