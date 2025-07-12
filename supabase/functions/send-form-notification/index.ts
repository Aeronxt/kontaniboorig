import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request payload
    const payload = await req.json()
    const record = payload.record
    const oldRecord = payload.old_record

    // Only proceed if this is a new record (insert)
    if (oldRecord) {
      return new Response(
        JSON.stringify({ message: 'Not a new record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare email content
    const emailContent = `
      <h2>New Form Submission</h2>
      <p><strong>Form Type:</strong> ${record.form_type}</p>
      <p><strong>Status:</strong> ${record.status}</p>
      <p><strong>Submitted At:</strong> ${record.created_at}</p>
      <h3>Form Data:</h3>
      <pre>${JSON.stringify(record.data, null, 2)}</pre>
    `

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kontanibo <notifications@kontanibo.com>',
        to: 'kontanibo@outlook.com',
        subject: `New ${record.form_type} Submission`,
        html: emailContent,
      }),
    })

    const result = await response.json()

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
}) 