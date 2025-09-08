import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { url, customAlias, title, description } = await req.json();
    
    // Get user if authenticated
    let user = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    // Generate short code or use custom alias
    const shortCode = customAlias || Math.random().toString(36).substring(2, 8);
    
    // Check if custom alias already exists
    if (customAlias) {
      const { data: existing } = await supabaseClient
        .from('urls')
        .select('id')
        .eq('short_code', customAlias)
        .single();
      
      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Custom alias already exists' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Insert URL
    const { data, error } = await supabaseClient
      .from('urls')
      .insert({
        original_url: url,
        short_code: shortCode,
        custom_alias: customAlias,
        title: title || '',
        description: description || '',
        user_id: user?.id || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create short URL' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const shortUrl = `https://www.lnkzip.com/${shortCode}`;

    return new Response(
      JSON.stringify({ 
        shortUrl,
        shortCode,
        originalUrl: url,
        id: data.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});