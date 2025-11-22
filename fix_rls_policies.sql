-- Fix RLS Policies for Delivery System
-- Run this in the Supabase SQL Editor

-- 1. Allow users to see their own orders based on user_id (standard Auth)
CREATE POLICY "Users can view their own orders by ID"
ON delivery_orders FOR SELECT
USING (auth.uid() = user_id);

-- 2. Allow users to see items of their own orders
CREATE POLICY "Users can view their own order items by ID"
ON delivery_order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM delivery_orders
    WHERE delivery_orders.id = delivery_order_items.order_id
    AND delivery_orders.user_id = auth.uid()
  )
);

-- 3. Ensure INSERT is definitely allowed (re-applying just in case)
DROP POLICY IF EXISTS "Usuários podem criar pedidos" ON delivery_orders;
CREATE POLICY "Usuários podem criar pedidos"
  ON delivery_orders FOR INSERT
  WITH CHECK (true);

-- 4. Ensure INSERT for items is allowed
DROP POLICY IF EXISTS "Usuários podem criar itens de pedido" ON delivery_order_items;
CREATE POLICY "Usuários podem criar itens de pedido"
  ON delivery_order_items FOR INSERT
  WITH CHECK (true);
