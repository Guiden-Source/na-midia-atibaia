-- ================================================
-- LIMPAR POLICIES DUPLICADAS E RECRIAR
-- ================================================
-- Execute TODO este SQL de uma vez

-- 1. DELETAR TODAS AS POLICIES ANTIGAS
DROP POLICY IF EXISTS "Admin can delete products" ON delivery_products;
DROP POLICY IF EXISTS "Admin can insert products" ON delivery_products;
DROP POLICY IF EXISTS "Admin can update products" ON delivery_products;
DROP POLICY IF EXISTS "Admin can view all products" ON delivery_products;
DROP POLICY IF EXISTS "Admin pode atualizar produtos" ON delivery_products;
DROP POLICY IF EXISTS "Admin pode criar produtos" ON delivery_products;
DROP POLICY IF EXISTS "Admin pode deletar produtos" ON delivery_products;
DROP POLICY IF EXISTS "Admin pode ver todos produtos" ON delivery_products;
DROP POLICY IF EXISTS "Todos podem ver produtos ativos" ON delivery_products;
DROP POLICY IF EXISTS "Users can view active products only" ON delivery_products;

-- 2. RECRIAR POLICIES CORRETAS (APENAS 2 SELECT)

-- SELECT: Admin OU produto ativo
CREATE POLICY "delivery_products_select_policy"
ON delivery_products FOR SELECT
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
  OR is_active = true
);

-- INSERT: Apenas admin
CREATE POLICY "delivery_products_insert_policy"
ON delivery_products FOR INSERT
TO public
WITH CHECK (
  auth.email() = 'guidjvb@gmail.com'
);

-- UPDATE: Apenas admin
CREATE POLICY "delivery_products_update_policy"
ON delivery_products FOR UPDATE
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
);

-- DELETE: Apenas admin
CREATE POLICY "delivery_products_delete_policy"
ON delivery_products FOR DELETE
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
);

-- ================================================
-- PRONTO! Agora terá apenas 4 policies simples
-- ================================================
