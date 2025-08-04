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
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId, assetId, subscriptionId, isFree } = await req.json();

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

    // Get IP address and user agent
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Mock download record - replace with actual database operations
    const downloadRecord = {
      id: crypto.randomUUID(),
      userId,
      assetId,
      subscriptionId: subscriptionId || null,
      category: 'STANDARD', // You'd get this from the asset
      isFree: isFree || true,
      downloadedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
      asset: {
        title: 'Sample Asset', // You'd fetch this from your asset API
        thumbnailUrl: '',
        category: 'STANDARD'
      }
    };

    // Mock file URL - replace with actual file serving logic
    const fileUrl = `https://example.com/download/${assetId}`;
    const fileType = 'image/jpeg';

    console.log('Download recorded:', downloadRecord);

    const response = {
      download: downloadRecord,
      fileUrl,
      fileType
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: response
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in record-download:', error);
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