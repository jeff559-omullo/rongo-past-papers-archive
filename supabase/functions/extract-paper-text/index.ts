import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      throw new Error("fileUrl is required");
    }

    console.log("Fetching PDF from:", fileUrl);

    // Fetch the PDF file
    const pdfResponse = await fetch(fileUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBytes = new Uint8Array(pdfArrayBuffer);

    // Use pdf-parse library to extract text
    // For now, we'll use a simple approach with PDF.js-like extraction
    // In production, you might want to use a more robust library
    
    // Simple text extraction - look for text objects in PDF
    const textDecoder = new TextDecoder();
    const pdfText = textDecoder.decode(pdfBytes);
    
    // Basic extraction of readable text from PDF structure
    // This is a simplified approach - in production use proper PDF parsing
    const textMatches = pdfText.match(/\(([^)]+)\)/g) || [];
    const extractedText = textMatches
      .map(match => match.slice(1, -1))
      .filter(text => text.length > 2)
      .join(' ')
      .slice(0, 50000); // Limit to 50k chars

    console.log("Extracted text length:", extractedText.length);

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in extract-paper-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        text: ""
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
