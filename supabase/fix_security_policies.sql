-- ================================================
-- SECURITY AUDIT FIXED (PART 1)
-- ================================================

-- 1. DELIVERY CATEGORIES (Missing Admin Access)
DROP POLICY IF EXISTS "Todos podem ver categorias ativas" ON delivery_categories;
-- Admin Access
CREATE POLICY "admin_all_categories" ON delivery_categories
  FOR ALL TO public
  USING (auth.email() = 'guidjvb@gmail.com');
-- Public Access allow select all (active or not? letting admin decide active)
CREATE POLICY "public_view_active_categories" ON delivery_categories
  FOR SELECT TO public
  USING (is_active = true OR auth.email() = 'guidjvb@gmail.com');


-- 2. DELIVERY ORDERS (Critical Security Flaw Fix)
-- Remove dangerous policy that allowed any auth user to update any order
DROP POLICY IF EXISTS "Allow authenticated updates on delivery_orders" ON delivery_orders;
DROP POLICY IF EXISTS "Admin pode atualizar pedidos" ON delivery_orders;
DROP POLICY IF EXISTS "Admin pode ver todos pedidos" ON delivery_orders;
DROP POLICY IF EXISTS "Usuários podem criar pedidos" ON delivery_orders;
DROP POLICY IF EXISTS "Usuários podem ver próprios pedidos por telefone" ON delivery_orders;
DROP POLICY IF EXISTS "Users can view their own orders by ID" ON delivery_orders;

-- Admin: Full Access
CREATE POLICY "admin_all_orders" ON delivery_orders
  FOR ALL TO public
  USING (auth.email() = 'guidjvb@gmail.com');

-- Public: Insert (Checkout)
CREATE POLICY "public_insert_orders" ON delivery_orders
  FOR INSERT TO public
  WITH CHECK (true); -- Guests can order

-- Public: Select Own Orders (By ID or Phone logic needs application support, sticking to Auth ID for verified users)
CREATE POLICY "users_select_own_orders" ON delivery_orders
  FOR SELECT TO public
  USING (auth.uid() = user_id OR user_phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Public: Update (Only verify status updates if needed, currently disabling user updates except maybe cancelling?)
-- For now, letting users ONLY insert and select. Order updates (status) are Admin only. If user needs to cancel, implement RPC or specific status update policy later.


-- 3. DELIVERY ORDER ITEMS (Cleanup)
DROP POLICY IF EXISTS "Usuários podem criar itens de pedido" ON delivery_order_items;
DROP POLICY IF EXISTS "Users can view their own order items by ID" ON delivery_order_items;
DROP POLICY IF EXISTS "Usuários podem ver itens dos próprios pedidos" ON delivery_order_items;
DROP POLICY IF EXISTS "Admin pode ver todos itens de pedido" ON delivery_order_items;

-- Admin: Full Access
CREATE POLICY "admin_all_order_items" ON delivery_order_items
  FOR ALL TO public
  USING (auth.email() = 'guidjvb@gmail.com');

-- Public: Insert (Checkout items)
CREATE POLICY "public_insert_order_items" ON delivery_order_items
  FOR INSERT TO public
  WITH CHECK (true); 

-- Public: Select Own Order Items (Linked to Orders)
CREATE POLICY "users_select_own_order_items" ON delivery_order_items
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM delivery_orders
      WHERE delivery_orders.id = delivery_order_items.order_id
      AND (delivery_orders.user_id = auth.uid() OR delivery_orders.user_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR auth.email() = 'guidjvb@gmail.com')
    )
  );
