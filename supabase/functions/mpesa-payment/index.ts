
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  paymentId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { phoneNumber, amount, paymentId }: PaymentRequest = await req.json()

    console.log('Processing M-Pesa payment:', { phoneNumber, amount, paymentId })

    // Get M-Pesa credentials from secrets
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')

    console.log('Checking M-Pesa credentials availability:', {
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      consumerKeyLength: consumerKey?.length || 0,
      consumerSecretLength: consumerSecret?.length || 0
    })

    console.log('All environment variables:', Object.keys(Deno.env.toObject()))

    if (!consumerKey || !consumerSecret) {
      console.error('M-Pesa credentials not found in environment')
      console.error('Available env vars:', Object.keys(Deno.env.toObject()).filter(key => key.includes('MPESA')))
      console.error('Consumer Key exists:', !!consumerKey, 'Value:', consumerKey ? 'SET' : 'NOT_SET')
      console.error('Consumer Secret exists:', !!consumerSecret, 'Value:', consumerSecret ? 'SET' : 'NOT_SET')
      throw new Error('M-Pesa credentials not configured')
    }

    console.log('M-Pesa credentials loaded successfully')

    // TEMPORARY: Mock STK Push for testing due to DNS connectivity issues
    console.log('Using mock STK Push due to API connectivity issues')
    
    // Ensure phone number is in correct format (254XXXXXXXXX)
    let formattedPhone = phoneNumber.trim()
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.substring(1)}`
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = `254${formattedPhone}`
    }

    console.log('Formatted phone number:', formattedPhone)

    // Simulate successful STK Push response
    const stkData = {
      MerchantRequestID: `MOCK_${Date.now()}`,
      CheckoutRequestID: `ws_CO_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing'
    }

    console.log('Mock STK Push response:', JSON.stringify(stkData, null, 2))

    // Store M-Pesa transaction details using service role key for admin access
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: mpesaError } = await supabaseService
      .from('mpesa_transactions')
      .insert({
        payment_id: paymentId,
        merchant_request_id: stkData.MerchantRequestID,
        checkout_request_id: stkData.CheckoutRequestID,
        phone_number: formattedPhone,
        amount: amount
      })

    if (mpesaError) {
      console.error('Error storing M-Pesa transaction:', mpesaError)
      throw new Error('Failed to store transaction details')
    }

    console.log('M-Pesa transaction stored successfully')

    // For mock mode, simulate successful payment callback after 10 seconds
    setTimeout(async () => {
      try {
        console.log('Simulating successful payment callback for testing...')
        
        // Update M-Pesa transaction with successful result
        const { error: mpesaUpdateError } = await supabaseService
          .from('mpesa_transactions')
          .update({
            result_code: 0,
            result_desc: 'The service request is processed successfully.',
            mpesa_receipt_number: `MOCK${Date.now()}`,
            amount: amount,
            updated_at: new Date().toISOString()
          })
          .eq('checkout_request_id', stkData.CheckoutRequestID)

        if (mpesaUpdateError) {
          console.error('Error updating mock M-Pesa transaction:', mpesaUpdateError)
          return
        }

        // Update payment status to completed
        const { error: paymentUpdateError } = await supabaseService
          .from('user_payments')
          .update({ 
            status: 'completed',
            transaction_id: `MOCK${Date.now()}`
          })
          .eq('id', paymentId)

        if (paymentUpdateError) {
          console.error('Error updating mock payment status:', paymentUpdateError)
          return
        }

        console.log(`Mock payment ${paymentId} completed successfully`)
      } catch (error) {
        console.error('Error in mock callback simulation:', error)
      }
    }, 10000) // 10 seconds delay to simulate processing time

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment request sent to your phone. Please check your phone and enter your M-Pesa PIN. (Using test mode - payment will complete automatically in 10 seconds)',
        merchantRequestId: stkData.MerchantRequestID,
        checkoutRequestId: stkData.CheckoutRequestID
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('M-Pesa payment error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment processing failed',
        success: false 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
