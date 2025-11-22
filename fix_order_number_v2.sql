-- Fix for "duplicate key value" error in order number generation
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  v_order_number TEXT;
  v_exists BOOLEAN;
BEGIN
  -- 1. Find the true maximum number by extracting digits from ALL order numbers
  -- This handles cases where regex might have missed some formats
  SELECT COALESCE(
    MAX(
      CAST(
        NULLIF(regexp_replace(order_number, '\D', '', 'g'), '') 
        AS INTEGER
      )
    ), 
    0
  ) + 1
  INTO next_number
  FROM delivery_orders;
  
  -- 2. Loop to ensure uniqueness (just in case of race conditions)
  LOOP
    v_order_number := '#' || LPAD(next_number::TEXT, 4, '0');
    
    SELECT EXISTS(
      SELECT 1 FROM delivery_orders WHERE order_number = v_order_number
    ) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
    
    next_number := next_number + 1;
  END LOOP;
  
  RETURN v_order_number;
END;
$$ LANGUAGE plpgsql;
