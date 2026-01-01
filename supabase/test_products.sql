-- ================================================
-- TESTE 1: VERIFICAR SE EXISTEM PRODUTOS
-- ================================================
SELECT COUNT(*) as total_produtos FROM delivery_products;

-- Ver alguns produtos
SELECT id, name, is_active, created_at 
FROM delivery_products 
LIMIT 5;

-- ================================================
-- TESTE 2: TESTAR POLICY COMO ADMIN
-- ================================================
-- Simular query que admin faz
SELECT * FROM delivery_products
WHERE auth.email() = 'guidjvb@gmail.com' OR is_active = true;

-- ================================================  
-- TESTE 3: VERIFICAR AUTENTICAÇÃO
-- ================================================
SELECT auth.email() as current_user_email;

-- ================================================
-- TESTE 4: DESABILITAR RLS TEMPORARIAMENTE
-- ================================================
-- ATENÇÃO: Isso remove segurança!
-- Execute APENAS para teste, depois reative
ALTER TABLE delivery_products DISABLE ROW LEVEL SECURITY;

-- Depois de testar se funciona, REATIVE:
-- ALTER TABLE delivery_products ENABLE ROW LEVEL SECURITY;
