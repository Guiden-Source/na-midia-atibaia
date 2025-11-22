-- Fix RLS Policies for Admin Order Management
-- Run this in Supabase SQL Editor

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Admins podem atualizar status dos pedidos" ON delivery_orders;
DROP POLICY IF EXISTS "Service role can update orders" ON delivery_orders;

-- Create comprehensive UPDATE policy for delivery_orders
-- Allow service_role (backend) and authenticated users to update
CREATE POLICY "Allow authenticated updates on delivery_orders"
ON delivery_orders FOR UPDATE
TO authenticated, service_role
USING (true)
WITH CHECK (true);

-- Ensure anon can't update (security)
-- (This is implicit but being explicit for clarity)

-- Grant necessary permissions
GRANT UPDATE ON delivery_orders TO authenticated, service_role;

-- Verify policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'delivery_orders' AND cmd = 'UPDATE';
