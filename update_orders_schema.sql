-- SQL Migration: Update Orders table for Shipping & Location
-- Run this in your Supabase SQL Editor

-- 1. Add basic shipping address field
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- 2. Add coordinates for map pinpointing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- 3. Add granular address fields for professional shipping
ALTER TABLE orders ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Nagaland';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS town TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark TEXT;
