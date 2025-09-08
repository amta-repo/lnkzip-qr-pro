import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  const url = new URL(req.url);
  const shortCode = url.pathname.split('/').pop();

  if (!shortCode) {
    return new Response('Short code not provided', { status: 400 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the URL
    const { data: urlData, error } = await supabaseClient
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single();

    if (error || !urlData) {
      return new Response('Short URL not found', { status: 404 });
    }

    // Track click
    const userAgent = req.headers.get('user-agent') || '';
    const forwarded = req.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';

    await supabaseClient.from('clicks').insert({
      url_id: urlData.id,
      ip_address: ipAddress,
      user_agent: userAgent
    });

    // Increment click count
    await supabaseClient.rpc('increment_click', { url_id: urlData.id });

    // Redirect to original URL
    return new Response(null, {
      status: 302,
      headers: {
        'Location': urlData.original_url
      }
    });

  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});