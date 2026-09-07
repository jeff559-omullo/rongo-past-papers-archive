import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Parse the callback body no matter how the gateway sends it:
// JSON, text/plain containing JSON, form-encoded, or query params (GET).
async function parsePayload(req: Request): Promise<any> {
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const obj: Record<string, string> = {}
    url.searchParams.forEach((v, k) => { obj[k] = v })
    return obj
  }

  const raw = await req.text()
  if (!raw) {
    const obj: Record<string, string> = {}
    url.searchParams.forEach((v, k) => { obj[k] = v })
    return obj
  }

  try {
    return JSON.parse(raw)
  } catch (_) {
    // form-encoded fallback
    const obj: Record<string, string> = {}
    new URLSearchParams(raw).forEach((v, k) => { obj[k] = v })
    return obj
  }
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

    const payload = await parsePayload(req)
    console.log('Payment callback received:', req.method, JSON.stringify(payload))

    // MegaPay posts a flat body; legacy Daraja posts Body.stkCallback
    const body = payload?.Body?.stkCallback ?? payload

    const resultCode = Number(
      body.ResponseCode ?? body.ResultCode ?? body.resultCode ?? 1
    )
    const resultDesc = body.ResponseDescription ?? body.ResultDesc ?? body.massage ?? body.message ?? ''
    const reference = String(body.TransactionReference ?? body.reference ?? '')
    const checkoutRequestId = String(body.CheckoutRequestID ?? '')
    const transactionRequestId = String(body.TransactionID ?? body.transaction_request_id ?? '')
    const receipt = body.TransactionReceipt ?? body.MpesaReceiptNumber ?? null
    const amount = body.TransactionAmount ?? null
    const msisdn = body.Msisdn ?? body.PhoneNumber ?? null

    // Find the transaction, trying every identifier we might have stored
    let tx: any = null

    const tryFind = async (column: string, value: string) => {
      if (!value) return null
      const { data, error } = await supabaseClient
        .from('mpesa_transactions')
        .select('*')
        .eq(column, value)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) console.error(`Lookup by ${column} failed:`, error)
      return data
    }

    tx = await tryFind('checkout_request_id', reference)      // we store our reference here
      ?? await tryFind('merchant_request_id', transactionRequestId)
      ?? await tryFind('checkout_request_id', checkoutRequestId)
      ?? await tryFind('merchant_request_id', reference)

    // Last resort: match the most recent pending transaction for this phone
    if (!tx && msisdn) {
      const { data } = await supabaseClient
        .from('mpesa_transactions')
        .select('*')
        .eq('phone_number', String(msisdn))
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data) {
        console.log('Matched transaction by phone fallback:', data.id)
        tx = data
      }
    }

    if (!tx) {
      console.error('Transaction not found', { reference, transactionRequestId, checkoutRequestId, msisdn })
      // Return 200 so the gateway stops retrying; we log for manual reconciliation
      return new Response(JSON.stringify({ success: false, reason: 'transaction_not_found' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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

    // Idempotent payment update: don't downgrade an already-completed payment
    const { data: payment } = await supabaseClient
      .from('user_payments')
      .select('status')
      .eq('id', tx.payment_id)
      .maybeSingle()

    if (payment?.status === 'completed') {
      console.log(`Payment ${tx.payment_id} already completed; skipping update`)
      return new Response(JSON.stringify({ success: true, alreadyCompleted: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
