-- CONSOLIDATED SQL MIGRATION
-- Run this in your Supabase SQL Editor

-- 1. ADD COLUMNS FOR SHIPPING & LOCATION
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Nagaland';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS town TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark TEXT;

-- 2. FIX VENDOR VISIBILITY (RLS POLICIES)

-- Allow vendors to see order items for THEIR products
DROP POLICY IF EXISTS "Vendors can view order items for their products" ON order_items;
CREATE POLICY "Vendors can view order items for their products" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = order_items.product_id 
    AND products.vendor_id = auth.uid()
  )
);

-- Allow vendors to see order details (like shipping address) for orders containing their products
DROP POLICY IF EXISTS "Vendors can view orders containing their products" ON orders;
CREATE POLICY "Vendors can view orders containing their products" 
ON orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM order_items 
    JOIN products ON products.id = order_items.product_id
    WHERE order_items.order_id = orders.id 
    AND products.vendor_id = auth.uid()
  )
);
-- 3. PRODUCT ENHANCEMENTS (OFFERS & SOFT DELETE)
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
