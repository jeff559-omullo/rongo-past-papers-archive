
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

    // Step 1: Get access token
    const authString = btoa(`${consumerKey}:${consumerSecret}`)
    
    console.log('Attempting to get M-Pesa access token...')
    
    const tokenResponse = await fetch('https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token request failed:', errorText)
      throw new Error(`Failed to get access token: ${tokenResponse.status} ${tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error('No access token in response:', tokenData)
      throw new Error('No access token received from Safaricom')
    }

    console.log('M-Pesa access token obtained successfully')

    // Step 2: Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const businessShortCode = '174379' // Test business short code
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' // Test passkey
    
    const password = btoa(`${businessShortCode}${passkey}${timestamp}`)

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

    const stkPushPayload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.floor(amount), // Ensure amount is integer
      PartyA: formattedPhone,
      PartyB: businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `https://zjecjayanqsjomtnsxmh.supabase.co/functions/v1/mpesa-callback`,
      AccountReference: `PAPER${paymentId.slice(-8).toUpperCase()}`,
      TransactionDesc: 'Rongo University Past Papers Access'
    }

    console.log('Initiating STK Push with payload:', JSON.stringify(stkPushPayload, null, 2))

    const stkResponse = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    })

    if (!stkResponse.ok) {
      const errorText = await stkResponse.text()
      console.error('STK Push request failed:', errorText)
      throw new Error(`STK Push failed: ${stkResponse.status} ${stkResponse.statusText}`)
    }

    const stkData = await stkResponse.json()
    console.log('STK Push response received:', JSON.stringify(stkData, null, 2))

    if (stkData.ResponseCode !== '0') {
      console.error('STK Push error response:', stkData)
      throw new Error(`STK Push error: ${stkData.ResponseDescription || 'Unknown error'}`)
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment request sent to your phone. Please check your phone and enter your M-Pesa PIN.',
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
