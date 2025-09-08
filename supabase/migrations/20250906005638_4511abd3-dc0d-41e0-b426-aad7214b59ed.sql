-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'standard', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by users themselves" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add user_id to urls table for user ownership
ALTER TABLE public.urls 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN expires_at TIMESTAMPTZ,
ADD COLUMN title TEXT,
ADD COLUMN description TEXT;

-- Update urls table policies
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own URLs" 
ON public.urls 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own URLs" 
ON public.urls 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own URLs" 
ON public.urls 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own URLs" 
ON public.urls 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create QR codes table
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  qr_type TEXT NOT NULL DEFAULT 'url',
  content TEXT NOT NULL,
  short_url TEXT,
  qr_color TEXT DEFAULT '#3B82F6',
  bg_color TEXT DEFAULT '#FFFFFF',
  size INTEGER DEFAULT 256,
  frame_style TEXT DEFAULT 'none',
  scan_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for QR codes
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own QR codes" 
ON public.qr_codes 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own QR codes" 
ON public.qr_codes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own QR codes" 
ON public.qr_codes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes" 
ON public.qr_codes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment QR scan count
CREATE OR REPLACE FUNCTION public.increment_qr_scan(qr_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.qr_codes
  SET scan_count = scan_count + 1
  WHERE id = qr_id;
END;
$$;

-- Update clicks table to include QR code tracking
ALTER TABLE public.clicks 
ADD COLUMN qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE SET NULL;