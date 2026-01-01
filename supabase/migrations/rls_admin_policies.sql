-- ================================================
-- RLS POLICIES FOR ADMIN STATISTICS
-- ================================================
-- Permitir admin fazer COUNT queries para estatísticas

-- 1. delivery_orders - Admin pode contar todos os pedidos
CREATE POLICY IF NOT EXISTS "Admin can count all orders"
ON delivery_orders FOR SELECT
TO public
USING (
  auth.email() IN (
    'guidjvb@gmail.com'
  )
);

-- 2. delivery_products - Admin pode contar produtos
CREATE POLICY IF NOT EXISTS "Admin can count all products"  
ON delivery_products FOR SELECT
TO public
USING (
  auth.email() IN (
    'guidjvb@gmail.com'
  )
);

-- 3. delivery_products - Users podem ver apenas ativos
CREATE POLICY IF NOT EXISTS "Users can view active products"
ON delivery_products FOR SELECT
TO public
USING (
  is_active = true
  OR auth.email() IN ('guidjvb@gmail.com')
);

-- 4. delivery_order_items - Já tem policy (fixada antes)
-- Verificar se existe, senão criar

-- ================================================
-- POLICIES PARA ADMIN GERENCIAR PRODUTOS
-- ================================================

-- INSERT
CREATE POLICY IF NOT EXISTS "Admin can insert products"
ON delivery_products FOR INSERT
TO public
WITH CHECK (
  auth.email() IN (
    'guidjvb@gmail.com'
  )
);

-- UPDATE  
CREATE POLICY IF NOT EXISTS "Admin can update products"
ON delivery_products FOR UPDATE
TO public
USING (
  auth.email() IN (
    'guidjvb@gmail.com'
  )
);

-- DELETE
CREATE POLICY IF NOT EXISTS "Admin can delete products"
ON delivery_products FOR DELETE
TO public
USING (
  auth.email() IN (
    'guidjvb@gmail.com'
  )
);

-- ================================================
-- RESUMO DAS POLICIES
-- ================================================
-- delivery_orders:
--   ✅ Admin vê todos (SELECT)
--   ✅ Admin atualiza todos (UPDATE - já existe)
--   ✅ Users criam (INSERT - já existe)
--   ✅ Users veem próprios (SELECT - já existe)

-- delivery_order_items:
--   ✅ Admin vê todos (SELECT - criada antes)
--   ✅ Users criam (INSERT - já existe)
--   ✅ Users veem itens próprios (SELECT - já existe)

-- delivery_products:
--   ✅ Admin full access (SELECT, INSERT, UPDATE, DELETE)
--   ✅ Users veem apenas is_active=true
