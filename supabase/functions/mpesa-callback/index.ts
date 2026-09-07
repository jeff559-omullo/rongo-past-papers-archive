import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const payload = await req.json()
    console.log('Payment callback received:', JSON.stringify(payload))

    // MegaPay posts a flat body; legacy Daraja posts Body.stkCallback
    const body = payload?.Body?.stkCallback ?? payload

    const resultCode = Number(
      body.ResponseCode ?? body.ResultCode ?? body.resultCode ?? 1
    )
    const resultDesc = body.ResponseDescription ?? body.ResultDesc ?? body.massage ?? ''
    const reference = String(body.TransactionReference ?? body.reference ?? '')
    const checkoutRequestId = String(body.CheckoutRequestID ?? '')
    const transactionRequestId = String(body.TransactionID ?? body.transaction_request_id ?? '')
    const receipt = body.TransactionReceipt ?? body.MpesaReceiptNumber ?? null
    const amount = body.TransactionAmount ?? null
    const msisdn = body.Msisdn ?? body.PhoneNumber ?? null

    // Find the transaction: reference is what we stored in checkout_request_id
    let query = supabaseClient.from('mpesa_transactions').select('*')
    if (reference) {
      query = query.eq('checkout_request_id', reference)
    } else if (transactionRequestId) {
      query = query.eq('merchant_request_id', transactionRequestId)
    } else if (checkoutRequestId) {
      query = query.eq('checkout_request_id', checkoutRequestId)
    } else {
      return new Response('Missing transaction identifier', { status: 400, headers: corsHeaders })
    }

    const { data: tx, error: findError } = await query.maybeSingle()

    if (findError || !tx) {
      console.error('Transaction not found', { reference, transactionRequestId, findError })
      return new Response('Transaction not found', { status: 404, headers: corsHeaders })
    }

    const success = resultCode === 0

    const { error: updateError } = await supabaseClient
      .from('mpesa_transactions')
      .update({
        result_code: resultCode,
        result_desc: resultDesc,
        mpesa_receipt_number: success ? receipt : null,
        amount: amount ?? tx.amount,
        phone_number: msisdn ?? tx.phone_number,
        merchant_request_id: transactionRequestId || tx.merchant_request_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tx.id)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return new Response('Error updating transaction', { status: 500, headers: corsHeaders })
    }

    const { error: paymentUpdateError } = await supabaseClient
      .from('user_payments')
      .update({
        status: success ? 'completed' : 'failed',
        transaction_id: success ? receipt : null,
      })
      .eq('id', tx.payment_id)

    if (paymentUpdateError) {
      console.error('Error updating payment status:', paymentUpdateError)
      return new Response('Error updating payment', { status: 500, headers: corsHeaders })
    }

    console.log(`Payment ${tx.payment_id} -> ${success ? 'completed' : 'failed'}`)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
