-- Fix privacy violation in clicks table by restricting SELECT access
-- Only allow users to view clicks for their own URLs and QR codes

-- Drop the overly permissive public select policy
DROP POLICY IF EXISTS "Allow public to select clicks" ON public.clicks;

-- Create new policy that only allows users to see clicks for their own URLs
CREATE POLICY "Users can view clicks for their own URLs" ON public.clicks
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.urls 
    WHERE urls.id = clicks.url_id 
    AND urls.user_id = auth.uid()
  )
  OR 
  EXISTS (
    SELECT 1 FROM public.qr_codes 
    WHERE qr_codes.id = clicks.qr_code_id 
    AND qr_codes.user_id = auth.uid()
  )
);

-- Keep the public insert policy for redirect functionality
-- This allows the redirect function to track clicks without authentication
-- but doesn't expose the data to unauthorized users