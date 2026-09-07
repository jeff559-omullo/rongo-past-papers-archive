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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed', success: false }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { phoneNumber, amount, paymentId }: PaymentRequest = await req.json()

    if (!phoneNumber || !paymentId) {
      return new Response(
        JSON.stringify({ error: 'phoneNumber and paymentId are required', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('MEGAPAY_API_KEY')
    const email = Deno.env.get('MEGAPAY_EMAIL')
    const baseUrl = (Deno.env.get('MEGAPAY_BASE_URL') ?? 'https://megapay.co.ke/backend/v1').replace(/\/+$/, '')

    if (!apiKey || !email) {
      console.error('MegaPay credentials not configured')
      throw new Error('Payment gateway not configured')
    }

    // Normalise phone to 2547XXXXXXXX / 2541XXXXXXXX
    let msisdn = phoneNumber.trim().replace(/\s+/g, '')
    if (msisdn.startsWith('+')) msisdn = msisdn.substring(1)
    if (msisdn.startsWith('0')) msisdn = `254${msisdn.substring(1)}`
    if (!msisdn.startsWith('254')) msisdn = `254${msisdn}`

    // Unique numeric reference we can match in the callback
    const reference = `${Date.now()}`.slice(-9)
    const payAmount = String(amount ?? 50)

    console.log('Sending MegaPay STK push', { msisdn, payAmount, reference, paymentId })

    const stkResponse = await fetch(`${baseUrl}/stk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        amount: payAmount,
        msisdn,
        reference,
      }),
    })

    const raw = await stkResponse.text()
    console.log('MegaPay raw response:', stkResponse.status, raw)

    let data: any = {}
    try { data = JSON.parse(raw) } catch (_) { /* keep raw */ }

    const ok = stkResponse.ok && (String(data.success) === '200' || data.success === true)
    if (!ok) {
      throw new Error(data.massage || data.message || data.error || `MegaPay request failed (${stkResponse.status})`)
    }

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: mpesaError } = await supabaseService
      .from('mpesa_transactions')
      .insert({
        payment_id: paymentId,
        merchant_request_id: data.transaction_request_id ?? null,
        checkout_request_id: reference,
        phone_number: msisdn,
        amount: Number(payAmount),
      })

    if (mpesaError) {
      console.error('Error storing MegaPay transaction:', mpesaError)
      throw new Error('Failed to store transaction details')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: data.massage || 'Payment request sent to your phone. Enter your M-Pesa PIN to complete.',
        transactionRequestId: data.transaction_request_id ?? null,
        checkoutRequestId: reference,
        reference,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('MegaPay payment error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Payment processing failed', success: false }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
