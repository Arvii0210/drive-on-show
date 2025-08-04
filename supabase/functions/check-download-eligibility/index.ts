import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const assetId = url.searchParams.get('assetId');
    const subscriptionId = url.searchParams.get('subscriptionId');

    if (!userId || !assetId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'User ID and Asset ID are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // For now, we'll simulate the eligibility check
    // In a real implementation, you'd check user subscription, quotas, etc.
    
    // Mock response - you can replace this with actual business logic
    const eligibilityResponse = {
      canDownload: true,
      reason: null,
      isFree: true, // Assume free for now
      subscriptionId: subscriptionId || null,
      remainingCredits: {
        standard: 10,
        premium: 5
      }
    };

    console.log(`Eligibility check for user ${userId}, asset ${assetId}:`, eligibilityResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: eligibilityResponse
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in check-download-eligibility:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});