-- ================================================
-- RLS POLICIES FOR ADMIN STATISTICS & PRODUCTS
-- ================================================
-- Execute este SQL no Supabase SQL Editor
-- ANTES: Substitua 'seu-email-admin@gmail.com' pelo seu email real!

-- Nota: Se policies já existirem, você verá erro "already exists" - pode ignorar

-- ================================================
-- DELIVERY_PRODUCTS POLICIES
-- ================================================

-- Admin pode ver todos os produtos (para estatísticas e gerenciamento)
CREATE POLICY "Admin can view all products"
ON delivery_products FOR SELECT
TO public
USING (
  auth.email() IN ('seu-email-admin@gmail.com')
);

-- Users podem ver apenas produtos ativos
CREATE POLICY "Users can view active products only"
ON delivery_products FOR SELECT
TO public
USING (
  is_active = true
);

-- Admin pode criar produtos
CREATE POLICY "Admin can insert products"
ON delivery_products FOR INSERT
TO public
WITH CHECK (
  auth.email() IN ('seu-email-admin@gmail.com')
);

-- Admin pode atualizar produtos
CREATE POLICY "Admin can update products"
ON delivery_products FOR UPDATE
TO public
USING (
  auth.email() IN ('seu-email-admin@gmail.com')
);

-- Admin pode deletar produtos
CREATE POLICY "Admin can delete products"
ON delivery_products FOR DELETE
TO public
USING (
  auth.email() IN ('seu-email-admin@gmail.com')
);

-- ================================================
-- FIM
-- ================================================
-- Policies para delivery_orders e delivery_order_items já foram criadas anteriormente
-- Estatísticas devem funcionar após executar este SQL
