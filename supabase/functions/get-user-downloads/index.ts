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
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'User ID is required' 
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

    // Mock downloads data - replace with actual database queries
    const mockDownloads = [
      {
        id: 'download1',
        userId,
        assetId: 'asset1',
        subscriptionId: null,
        category: 'STANDARD',
        isFree: true,
        downloadedAt: new Date().toISOString(),
        asset: {
          title: 'Sample Asset 1',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          category: 'Business'
        }
      },
      {
        id: 'download2',
        userId,
        assetId: 'asset2',
        subscriptionId: null,
        category: 'PREMIUM',
        isFree: false,
        downloadedAt: new Date(Date.now() - 86400000).toISOString(),
        asset: {
          title: 'Sample Asset 2',
          thumbnailUrl: 'https://example.com/thumb2.jpg',
          category: 'Technology'
        }
      }
    ];

    // Filter by category if provided
    const filteredDownloads = category 
      ? mockDownloads.filter(d => d.asset.category.toLowerCase() === category.toLowerCase())
      : mockDownloads;

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDownloads = filteredDownloads.slice(startIndex, endIndex);

    const total = filteredDownloads.length;
    const totalPages = Math.ceil(total / limit);

    const response = {
      downloads: paginatedDownloads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };

    console.log(`Fetched ${paginatedDownloads.length} downloads for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: response
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-user-downloads:', error);
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