-- ============================================
-- Fix: Supabase Storage Policies for Image Upload
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read images
-- This allows anyone (even logged out users) to see product images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 3. Allow authenticated vendors to upload images to their own folder
-- This policy checks:
--   a) The bucket is 'product-images'
--   b) The user is authenticated (auth.uid() is not null)
--   c) The folder name matches the user's ID
CREATE POLICY "Vendors can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow vendors to delete their own images
CREATE POLICY "Vendors can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Allow vendors to update their own images
CREATE POLICY "Vendors can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
