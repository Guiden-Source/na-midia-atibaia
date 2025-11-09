-- Script para adicionar coluna user_email na tabela coupons
-- Execute no SQL Editor do Supabase

-- 1. Adicionar coluna user_email se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'coupons' 
        AND column_name = 'user_email'
    ) THEN
        ALTER TABLE coupons ADD COLUMN user_email TEXT;
        RAISE NOTICE 'Coluna user_email adicionada à tabela coupons';
    ELSE
        RAISE NOTICE 'Coluna user_email já existe na tabela coupons';
    END IF;
END $$;

-- 2. Atualizar cupons existentes com o email do usuário da confirmação
UPDATE coupons c
SET user_email = conf.user_email
FROM confirmations conf
WHERE c.confirmation_id = conf.id
  AND (c.user_email IS NULL OR c.user_email = '');

-- 3. Verificar resultado
SELECT 
    COUNT(*) as total_cupons,
    COUNT(user_email) as cupons_com_email,
    COUNT(*) - COUNT(user_email) as cupons_sem_email
FROM coupons;

-- 4. Ver sample dos dados atualizados
SELECT 
    c.id,
    c.code,
    c.user_email,
    c.created_at,
    conf.user_name,
    conf.user_email as conf_email
FROM coupons c
LEFT JOIN confirmations conf ON c.confirmation_id = conf.id
ORDER BY c.created_at DESC
LIMIT 10;
