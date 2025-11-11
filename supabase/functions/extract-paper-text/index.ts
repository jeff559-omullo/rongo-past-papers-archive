import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="npm:@types/pdf-parse@1.1.4"
import pdfParse from "npm:pdf-parse@1.1.1";
import { Buffer } from "node:buffer";
// Provide Buffer global for libraries expecting Node.js
// deno-lint-ignore no-explicit-any
// @ts-ignore
(globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;

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

    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    console.log("Parsing PDF with pdf-parse...");
    
    // Use pdf-parse to properly extract text
    // Pass a Uint8Array - compatible with pdf-parse in Deno Node-compat
    const data = await pdfParse(new Uint8Array(pdfBuffer));
    
    // Limit to 50k characters for API context limits
    const extractedText = data.text.slice(0, 50000);

    console.log("Successfully extracted text length:", extractedText.length);
    console.log("First 200 chars:", extractedText.slice(0, 200));

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
