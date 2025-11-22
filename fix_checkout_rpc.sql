-- DEFINITIVE CHECKOUT FIX
-- Run this in Supabase SQL Editor

-- 1. Create a sequence for order numbers (safest way to ensure uniqueness)
CREATE SEQUENCE IF NOT EXISTS delivery_order_seq;

-- 2. Sync sequence with current max order number
DO $$
DECLARE
  max_val INTEGER;
BEGIN
  SELECT COALESCE(
    MAX(
      CAST(
        NULLIF(regexp_replace(order_number, '\D', '', 'g'), '') 
        AS INTEGER
      )
    ), 
    0
  ) INTO max_val
  FROM delivery_orders;
  
  PERFORM setval('delivery_order_seq', max_val);
END $$;

-- 3. Create a comprehensive RPC to handle the entire order creation atomically
CREATE OR REPLACE FUNCTION create_delivery_order_complete(
  p_user_id UUID,
  p_user_name TEXT,
  p_user_phone TEXT,
  p_user_email TEXT,
  p_address_street TEXT,
  p_address_number TEXT,
  p_address_complement TEXT,
  p_address_condominium TEXT,
  p_address_block TEXT,
  p_address_apartment TEXT,
  p_address_reference TEXT,
  p_payment_method TEXT,
  p_change_for DECIMAL,
  p_subtotal DECIMAL,
  p_delivery_fee DECIMAL,
  p_total DECIMAL,
  p_notes TEXT,
  p_items JSONB
)
RETURNS JSON AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_item JSONB;
BEGIN
  -- Generate new ID
  v_order_id := gen_random_uuid();
  
  -- Generate next order number from sequence
  v_order_number := '#' || LPAD(nextval('delivery_order_seq')::TEXT, 4, '0');
  
  -- Insert Order
  INSERT INTO delivery_orders (
    id,
    order_number,
    user_id,
    user_name,
    user_phone,
    user_email,
    address_street,
    address_number,
    address_complement,
    address_condominium,
    address_block,
    address_apartment,
    address_reference,
    payment_method,
    change_for,
    subtotal,
    delivery_fee,
    total,
    notes,
    status
  ) VALUES (
    v_order_id,
    v_order_number,
    p_user_id,
    p_user_name,
    p_user_phone,
    p_user_email,
    p_address_street,
    p_address_number,
    p_address_complement,
    p_address_condominium,
    p_address_block,
    p_address_apartment,
    p_address_reference,
    p_payment_method,
    p_change_for,
    p_subtotal,
    p_delivery_fee,
    p_total,
    p_notes,
    'pending'
  );
  
  -- Insert Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO delivery_order_items (
      order_id,
      product_id,
      product_name,
      product_image,
      price,
      quantity,
      subtotal
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      v_item->>'product_image',
      (v_item->>'price')::DECIMAL,
      (v_item->>'quantity')::INTEGER,
      (v_item->>'subtotal')::DECIMAL
    );
  END LOOP;
  
  -- Return the created order details
  RETURN json_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'status', 'pending',
    'total', p_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION create_delivery_order_complete TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE delivery_order_seq TO anon, authenticated, service_role;
