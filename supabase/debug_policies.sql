-- ================================================
-- DEBUG: VERIFICAR POLICIES EXISTENTES
-- ================================================
-- Execute este SQL para ver TODAS as policies de delivery_products

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'delivery_products'
ORDER BY policyname;

-- ================================================
-- Se houver múltiplas policies SELECT, elas podem estar em conflito
-- PostgreSQL usa AND lógico entre policies do mesmo tipo
-- Solução: DELETAR policies antigas e manter apenas as novas
-- ================================================

-- REMOVER TODAS AS POLICIES ANTIGAS (se necessário)
-- Descomente as linhas abaixo SE as policies estiverem em conflito:

-- DROP POLICY IF EXISTS "Admin can view all products" ON delivery_products;
-- DROP POLICY IF EXISTS "Users can view active products only" ON delivery_products;
-- DROP POLICY IF EXISTS "Admin can insert products" ON delivery_products;
-- DROP POLICY IF EXISTS "Admin can update products" ON delivery_products;
-- DROP POLICY IF EXISTS "Admin can delete products" ON delivery_products;

-- Depois de deletar, execute novamente o rls_admin_policies.sql
