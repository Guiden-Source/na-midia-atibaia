-- Fix for "column reference order_number is ambiguous" error
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  v_order_number TEXT; -- Renamed variable to avoid conflict with column name
BEGIN
  -- Busca o último número de pedido
  -- Explicitly using table name to be safe, though renaming variable is enough
  SELECT COALESCE(MAX(CAST(SUBSTRING(delivery_orders.order_number FROM 2) AS INTEGER)), 0) + 1
  INTO next_number
  FROM delivery_orders
  WHERE delivery_orders.order_number ~ '^#[0-9]+$';
  
  -- Formata o número com zeros à esquerda
  v_order_number := '#' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN v_order_number;
END;
$$ LANGUAGE plpgsql;
