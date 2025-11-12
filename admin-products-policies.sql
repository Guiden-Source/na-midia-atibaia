-- =====================================================
-- POLICIES PARA ADMIN GERENCIAR PRODUTOS
-- =====================================================
-- Execute este SQL no Supabase SQL Editor

-- Lista de emails admin autorizados
-- Ajuste conforme necessário

-- Policy para ADMIN criar produtos (verificação por email)
CREATE POLICY "Admin pode criar produtos"
ON delivery_products
FOR INSERT
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    'guidjvb@gmail.com',
    'admin@namidia.com.br'
  )
);

-- Policy para ADMIN atualizar produtos
CREATE POLICY "Admin pode atualizar produtos"
ON delivery_products
FOR UPDATE
USING (
  auth.jwt() ->> 'email' IN (
    'guidjvb@gmail.com',
    'admin@namidia.com.br'
  )
);

-- Policy para ADMIN deletar produtos
CREATE POLICY "Admin pode deletar produtos"
ON delivery_products
FOR DELETE
USING (
  auth.jwt() ->> 'email' IN (
    'guidjvb@gmail.com',
    'admin@namidia.com.br'
  )
);

-- Policy para ADMIN ver todos os produtos (mesmo inativos)
CREATE POLICY "Admin pode ver todos produtos"
ON delivery_products
FOR SELECT
USING (
  auth.jwt() ->> 'email' IN (
    'guidjvb@gmail.com',
    'admin@namidia.com.br'
  )
);

-- Verificar policies criadas
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'delivery_products'
ORDER BY cmd;
