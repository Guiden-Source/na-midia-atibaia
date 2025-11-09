-- 🔧 SCRIPT DE MIGRAÇÃO URGENTE
-- Execute este script NO SUPABASE SQL EDITOR para corrigir dados existentes

-- ============================================
-- PASSO 1: Adicionar user_email às confirmações existentes
-- ============================================
-- IMPORTANTE: Substitua 'guidjvb@gmail.com' pelo email correto do usuário

UPDATE confirmations 
SET user_email = 'guidjvb@gmail.com'
WHERE user_email IS NULL OR user_email = '';

-- Verificar resultado
SELECT 
  '✅ Confirmações atualizadas' as status,
  COUNT(*) as total_confirmacoes,
  COUNT(CASE WHEN user_email IS NOT NULL AND user_email != '' THEN 1 END) as com_email,
  COUNT(CASE WHEN user_email IS NULL OR user_email = '' THEN 1 END) as sem_email
FROM confirmations;

-- ============================================
-- PASSO 2: Adicionar coluna user_email à tabela coupons (se não existir)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE coupons ADD COLUMN user_email TEXT;
    RAISE NOTICE '✅ Coluna user_email adicionada à tabela coupons';
  ELSE
    RAISE NOTICE '✅ Coluna user_email já existe na tabela coupons';
  END IF;
END $$;

-- ============================================
-- PASSO 3: Atualizar cupons existentes com email das confirmações
-- ============================================
UPDATE coupons 
SET user_email = confirmations.user_email
FROM confirmations
WHERE coupons.confirmation_id = confirmations.id
  AND (coupons.user_email IS NULL OR coupons.user_email = '');

-- Verificar resultado
SELECT 
  '✅ Cupons atualizados' as status,
  COUNT(*) as total_cupons,
  COUNT(CASE WHEN user_email IS NOT NULL AND user_email != '' THEN 1 END) as com_email,
  COUNT(CASE WHEN user_email IS NULL OR user_email = '' THEN 1 END) as sem_email
FROM coupons;

-- ============================================
-- PASSO 4: Criar índices para performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_confirmations_user_email ON confirmations(user_email);
CREATE INDEX IF NOT EXISTS idx_coupons_user_email ON coupons(user_email);
CREATE INDEX IF NOT EXISTS idx_coupons_is_used ON coupons(is_used);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 
  '🎯 RESULTADO FINAL' as titulo,
  '' as valor
UNION ALL
SELECT '📊 Eventos', COUNT(*)::text FROM events
UNION ALL
SELECT '✅ Confirmações', COUNT(*)::text FROM confirmations
UNION ALL
SELECT '🎫 Cupons', COUNT(*)::text FROM coupons
UNION ALL
SELECT '⚠️ Confirmações sem email', COUNT(*)::text 
  FROM confirmations WHERE user_email IS NULL OR user_email = ''
UNION ALL
SELECT '⚠️ Cupons sem user_email', COUNT(*)::text 
  FROM coupons WHERE user_email IS NULL OR user_email = ''
UNION ALL
SELECT '✅ Tudo pronto!', 
  CASE 
    WHEN (SELECT COUNT(*) FROM confirmations WHERE user_email IS NULL OR user_email = '') = 0
     AND (SELECT COUNT(*) FROM coupons WHERE user_email IS NULL OR user_email = '') = 0
    THEN '✅ Todos os registros têm email!'
    ELSE '❌ Ainda existem registros sem email'
  END;
