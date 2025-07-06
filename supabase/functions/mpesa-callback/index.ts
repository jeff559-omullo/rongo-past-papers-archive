
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const callbackData = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2))

    const { Body } = callbackData
    if (!Body?.stkCallback) {
      console.log('Invalid callback format')
      return new Response('Invalid callback format', { status: 400, headers: corsHeaders })
    }

    const { stkCallback } = Body
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback

    console.log('Processing STK callback:', {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    })

    // Find the M-Pesa transaction
    const { data: mpesaTransaction, error: findError } = await supabaseClient
      .from('mpesa_transactions')
      .select('*, user_payments(*)')
      .eq('checkout_request_id', CheckoutRequestID)
      .single()

    if (findError || !mpesaTransaction) {
      console.error('Transaction not found:', findError)
      return new Response('Transaction not found', { status: 404, headers: corsHeaders })
    }

    // Update M-Pesa transaction with callback data
    const updateData: any = {
      result_code: ResultCode,
      result_desc: ResultDesc,
      updated_at: new Date().toISOString()
    }

    // If payment was successful, extract additional data
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      const items = CallbackMetadata.Item
      const receiptNumber = items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value
      const amount = items.find((item: any) => item.Name === 'Amount')?.Value
      const phoneNumber = items.find((item: any) => item.Name === 'PhoneNumber')?.Value

      updateData.mpesa_receipt_number = receiptNumber
      updateData.amount = amount
      updateData.phone_number = phoneNumber

      console.log('Payment successful:', {
        receiptNumber,
        amount,
        phoneNumber
      })
    }

    // Update M-Pesa transaction
    const { error: updateError } = await supabaseClient
      .from('mpesa_transactions')
      .update(updateData)
      .eq('id', mpesaTransaction.id)

    if (updateError) {
      console.error('Error updating M-Pesa transaction:', updateError)
      return new Response('Error updating transaction', { status: 500, headers: corsHeaders })
    }

    // Update payment status based on M-Pesa result
    const paymentStatus = ResultCode === 0 ? 'completed' : 'failed'
    const transactionId = ResultCode === 0 ? updateData.mpesa_receipt_number : null

    const { error: paymentUpdateError } = await supabaseClient
      .from('user_payments')
      .update({ 
        status: paymentStatus,
        transaction_id: transactionId
      })
      .eq('id', mpesaTransaction.payment_id)

    if (paymentUpdateError) {
      console.error('Error updating payment status:', paymentUpdateError)
      return new Response('Error updating payment', { status: 500, headers: corsHeaders })
    }

    console.log(`Payment ${mpesaTransaction.payment_id} updated to ${paymentStatus}`)

    return new Response('OK', { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
