-- Fix for Guest Checkout (RLS blocking read after insert)
-- Run this in the Supabase SQL Editor

-- 1. Create a secure function to fetch order details by ID (bypassing RLS)
-- This allows the "Order Success" page to load even for guest users
CREATE OR REPLACE FUNCTION get_order_details_by_id(p_order_id UUID)
RETURNS JSON AS $$
DECLARE
  v_order JSON;
BEGIN
  SELECT row_to_json(t) INTO v_order
  FROM (
    SELECT 
      o.*,
      (
        SELECT json_agg(i.*)
        FROM delivery_order_items i
        WHERE i.order_id = o.id
      ) as items
    FROM delivery_orders o
    WHERE o.id = p_order_id
  ) t;
  
  RETURN v_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Grant execute permission to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION get_order_details_by_id(UUID) TO anon, authenticated, service_role;
