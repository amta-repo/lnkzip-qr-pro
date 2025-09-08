-- Fix RLS on clicks table
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert clicks" 
ON public.clicks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public to select clicks" 
ON public.clicks 
FOR SELECT 
USING (true);

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.increment_click(url_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.urls
  SET click_count = click_count + 1
  WHERE id = url_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_qr_scan(qr_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.qr_codes
  SET scan_count = scan_count + 1
  WHERE id = qr_id;
END;
$$;