
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

    if (!consumerKey || !consumerSecret) {
      throw new Error('M-Pesa credentials not configured')
    }

    // Step 1: Get access token
    const authString = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenResponse = await fetch('https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
      },
    })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    console.log('Got M-Pesa access token')

    // Step 2: Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const businessShortCode = '174379' // Sandbox business short code
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' // Sandbox passkey
    
    const password = btoa(`${businessShortCode}${passkey}${timestamp}`)

    const stkPushPayload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: businessShortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: `https://zjecjayanqsjomtnsxmh.supabase.co/functions/v1/mpesa-callback`,
      AccountReference: `PAPER${paymentId.slice(-8)}`,
      TransactionDesc: 'Rongo University Past Papers Access'
    }

    console.log('Initiating STK Push:', stkPushPayload)

    const stkResponse = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    })

    if (!stkResponse.ok) {
      throw new Error(`STK Push failed: ${stkResponse.statusText}`)
    }

    const stkData = await stkResponse.json()
    console.log('STK Push response:', stkData)

    if (stkData.ResponseCode !== '0') {
      throw new Error(`STK Push error: ${stkData.ResponseDescription}`)
    }

    // Store M-Pesa transaction details
    const { error: mpesaError } = await supabaseClient
      .from('mpesa_transactions')
      .insert({
        payment_id: paymentId,
        merchant_request_id: stkData.MerchantRequestID,
        checkout_request_id: stkData.CheckoutRequestID,
        phone_number: phoneNumber,
        amount: amount
      })

    if (mpesaError) {
      console.error('Error storing M-Pesa transaction:', mpesaError)
      throw new Error('Failed to store transaction details')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment request sent to your phone',
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
