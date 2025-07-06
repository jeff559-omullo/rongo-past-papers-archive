
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Phone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { user, checkAccess } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);

    try {
      // Create payment record in database
      const { data: payment, error: paymentError } = await supabase
        .from('user_payments')
        .insert({
          user_id: user.id,
          phone_number: phoneNumber,
          amount: 10.00,
          currency: 'KES',
          payment_method: 'mpesa',
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // For demo purposes, we'll simulate successful payment
      // In a real implementation, you would integrate with M-Pesa API here
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update payment status to completed
      const { error: updateError } = await supabase
        .from('user_payments')
        .update({ 
          status: 'completed',
          transaction_id: `MPESA${Date.now()}`
        })
        .eq('id', payment.id);

      if (updateError) {
        throw updateError;
      }

      // Check access status
      await checkAccess();

      toast({
        title: "Payment Successful!",
        description: "You now have full access to all past papers. Enjoy studying!",
      });

      onPaymentSuccess();
      onClose();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as Kenyan phone number
    if (numbers.startsWith('254')) {
      return numbers;
    } else if (numbers.startsWith('0')) {
      return '254' + numbers.slice(1);
    } else if (numbers.startsWith('7') || numbers.startsWith('1')) {
      return '254' + numbers;
    }
    return numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment - KSH 10
          </DialogTitle>
          <DialogDescription>
            Pay KSH 10 to get unlimited access to all past papers for one year.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="space-y-2 text-center">
              <h4 className="font-semibold text-green-800">What you get:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Access to all past papers</li>
                <li>✓ All schools and departments</li>
                <li>✓ Download and view papers</li>
                <li>✓ One year unlimited access</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="pl-10"
                required
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Enter your M-Pesa number (e.g., 0712345678 or 254712345678)
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration. Your payment will be automatically processed for testing purposes.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isProcessing || !phoneNumber}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay KSH 10
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
