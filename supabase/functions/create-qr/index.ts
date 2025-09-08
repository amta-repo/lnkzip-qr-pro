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

    const { 
      title, 
      qrType, 
      content, 
      qrColor, 
      bgColor, 
      size, 
      frameStyle,
      createShortUrl 
    } = await req.json();
    
    // Get user if authenticated
    let user = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    let shortUrl = null;
    
    // Create short URL if requested and content is a URL
    if (createShortUrl && qrType === 'url') {
      const shortCode = Math.random().toString(36).substring(2, 8);
      
      const { data: urlData, error: urlError } = await supabaseClient
        .from('urls')
        .insert({
          original_url: content,
          short_code: shortCode,
          title: title,
          user_id: user?.id || null,
          is_active: true
        })
        .select()
        .single();

      if (!urlError) {
        shortUrl = `https://www.lnkzip.com/${shortCode}`;
      }
    }

    // Insert QR code
    const { data, error } = await supabaseClient
      .from('qr_codes')
      .insert({
        title,
        qr_type: qrType,
        content: shortUrl || content,
        short_url: shortUrl,
        qr_color: qrColor || '#3B82F6',
        bg_color: bgColor || '#FFFFFF',
        size: size || 256,
        frame_style: frameStyle || 'none',
        user_id: user?.id || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create QR code' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        qrCode: data,
        shortUrl
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