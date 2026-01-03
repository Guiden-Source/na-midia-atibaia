-- Enable Realtime for delivery_orders table
-- This allows clients to receive live updates when order status changes

-- 1. Enable REPLICA IDENTITY (required for Realtime to work)
ALTER TABLE delivery_orders REPLICA IDENTITY FULL;

-- 2. Ensure RLS allows realtime subscriptions
-- Users should be able to SELECT their own orders (already in place)
-- But let's verify the policy exists

-- Check if realtime publication includes delivery_orders
-- Run this in SQL Editor to verify:
-- SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- If delivery_orders is NOT in the publication, add it:
-- (This is usually automatic, but let's be explicit)
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_orders;
