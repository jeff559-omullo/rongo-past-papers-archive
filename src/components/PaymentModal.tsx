
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'waiting' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

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

      console.log('Payment record created:', payment.id);

      // Call M-Pesa payment function
      const { data: mpesaResponse, error: mpesaError } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phoneNumber: phoneNumber,
          amount: 10,
          paymentId: payment.id
        }
      });

      if (mpesaError) {
        throw mpesaError;
      }

      if (!mpesaResponse.success) {
        throw new Error(mpesaResponse.error || 'Payment failed');
      }

      console.log('M-Pesa STK Push sent:', mpesaResponse);

      setCheckoutRequestId(mpesaResponse.checkoutRequestId);
      setPaymentStatus('waiting');

      toast({
        title: "Payment Request Sent!",
        description: "Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.",
      });

      // Poll for payment status
      let attempts = 0;
      const maxAttempts = 30; // Poll for 2 minutes (30 * 4 seconds)
      
      const pollPaymentStatus = setInterval(async () => {
        attempts++;
        
        try {
          // Check payment status in database
          const { data: updatedPayment, error } = await supabase
            .from('user_payments')
            .select('status')
            .eq('id', payment.id)
            .single();

          if (error) {
            console.error('Error checking payment status:', error);
            return;
          }

          console.log('Payment status check:', updatedPayment.status);

          if (updatedPayment.status === 'completed') {
            clearInterval(pollPaymentStatus);
            setPaymentStatus('success');
            setIsProcessing(false);
            
            // Check access status
            await checkAccess();

            toast({
              title: "Payment Successful!",
              description: "You now have 4 months of access to all past papers. Enjoy studying!",
            });

            setTimeout(() => {
              onPaymentSuccess();
              onClose();
              resetModal();
            }, 2000);
            
          } else if (updatedPayment.status === 'failed') {
            clearInterval(pollPaymentStatus);
            setPaymentStatus('failed');
            setIsProcessing(false);
            
            toast({
              title: "Payment Failed",
              description: "Your M-Pesa payment was not successful. Please try again.",
              variant: "destructive",
            });
          } else if (attempts >= maxAttempts) {
            clearInterval(pollPaymentStatus);
            setPaymentStatus('failed');
            setIsProcessing(false);
            
            toast({
              title: "Payment Timeout",
              description: "Payment verification timed out. If you completed the payment, your access will be activated shortly.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error polling payment status:', error);
        }
      }, 4000); // Check every 4 seconds

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    setPhoneNumber('');
    setCheckoutRequestId('');
    setIsProcessing(false);
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

  const handleClose = () => {
    if (!isProcessing) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment - KSH 10
          </DialogTitle>
          <DialogDescription>
            Pay KSH 10 to get unlimited access to all past papers for 4 months.
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
                <li>✓ 4 months unlimited access</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {paymentStatus === 'idle' && (
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

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
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
                <CreditCard className="mr-2 h-4 w-4" />
                Pay KSH 10
              </Button>
            </div>
          </form>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Setting up your M-Pesa payment request</p>
          </div>
        )}

        {paymentStatus === 'waiting' && (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Check Your Phone</h3>
            <p className="text-gray-600 mb-4">
              We've sent a payment request to your phone. Please check for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for payment confirmation...
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2 text-green-800">Payment Successful!</h3>
            <p className="text-gray-600">
              You now have 4 months of access to all past papers. Redirecting...
            </p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-semibold mb-2 text-red-800">Payment Failed</h3>
            <p className="text-gray-600 mb-4">
              Your payment could not be completed. Please try again.
            </p>
            <Button onClick={() => setPaymentStatus('idle')} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
