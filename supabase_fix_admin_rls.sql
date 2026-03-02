-- ============================================
-- Fix: Admin RLS Policies for Vendor Approval
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old restrictive update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 3. Create new policies: users can update own profile OR admin can update any
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON profiles 
  FOR UPDATE USING (public.is_admin());

-- 4. Allow admin to delete products (not just the vendor who owns them)
DROP POLICY IF EXISTS "Vendors can delete own products" ON products;

CREATE POLICY "Owners or admins can delete products" ON products 
  FOR DELETE USING (auth.uid() = vendor_id OR public.is_admin());

-- 5. Allow admin to update products too
DROP POLICY IF EXISTS "Vendors can update own products" ON products;

CREATE POLICY "Owners or admins can update products" ON products 
  FOR UPDATE USING (auth.uid() = vendor_id OR public.is_admin());
