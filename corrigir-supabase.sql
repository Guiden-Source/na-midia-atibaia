-- ============================================
-- SCRIPT DE CORREÇÃO AUTOMÁTICA DO SUPABASE
-- Execute DEPOIS de revisar-estrutura-supabase.sql
-- ============================================

-- ============================================
-- 1. ADICIONAR COLUNA user_email em COUPONS
-- ============================================

DO $$ 
BEGIN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'coupons' 
        AND column_name = 'user_email'
    ) THEN
        ALTER TABLE coupons ADD COLUMN user_email TEXT;
        RAISE NOTICE '✅ Coluna user_email adicionada à tabela coupons';
    ELSE
        RAISE NOTICE '✅ Coluna user_email já existe na tabela coupons';
    END IF;
END $$;

-- ============================================
-- 2. ATUALIZAR CUPONS EXISTENTES
-- ============================================

-- Atualizar cupons com email da confirmação
UPDATE coupons c
SET user_email = conf.user_email
FROM confirmations conf
WHERE c.confirmation_id = conf.id
  AND (c.user_email IS NULL OR c.user_email = '')
  AND conf.user_email IS NOT NULL
  AND conf.user_email != '';

-- Verificar resultado
SELECT 
    '✅ Cupons atualizados com email' as resultado,
    COUNT(*) as total
FROM coupons
WHERE user_email IS NOT NULL AND user_email != '';

-- ============================================
-- 3. GARANTIR ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índice em confirmations.user_email
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'confirmations' 
        AND indexname = 'idx_confirmations_user_email'
    ) THEN
        CREATE INDEX idx_confirmations_user_email ON confirmations(user_email);
        RAISE NOTICE '✅ Índice idx_confirmations_user_email criado';
    ELSE
        RAISE NOTICE '✅ Índice idx_confirmations_user_email já existe';
    END IF;
END $$;

-- Índice em coupons.user_email
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'coupons' 
        AND indexname = 'idx_coupons_user_email'
    ) THEN
        CREATE INDEX idx_coupons_user_email ON coupons(user_email);
        RAISE NOTICE '✅ Índice idx_coupons_user_email criado';
    ELSE
        RAISE NOTICE '✅ Índice idx_coupons_user_email já existe';
    END IF;
END $$;

-- Índice em coupons.is_used
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'coupons' 
        AND indexname = 'idx_coupons_is_used'
    ) THEN
        CREATE INDEX idx_coupons_is_used ON coupons(is_used);
        RAISE NOTICE '✅ Índice idx_coupons_is_used criado';
    ELSE
        RAISE NOTICE '✅ Índice idx_coupons_is_used já existe';
    END IF;
END $$;

-- ============================================
-- 4. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

RAISE NOTICE '✅ RLS habilitado em confirmations e coupons';

-- ============================================
-- 5. CRIAR POLICIES DE ACESSO
-- ============================================

-- Policy para confirmations - usuários podem ver suas próprias confirmações
DROP POLICY IF EXISTS "Users can view own confirmations" ON confirmations;
CREATE POLICY "Users can view own confirmations"
ON confirmations FOR SELECT
USING (
    user_email = (SELECT auth.jwt() ->> 'email')
);

-- Policy para confirmations - todos podem inserir (confirmação anônima)
DROP POLICY IF EXISTS "Anyone can insert confirmations" ON confirmations;
CREATE POLICY "Anyone can insert confirmations"
ON confirmations FOR INSERT
WITH CHECK (true);

-- Policy para coupons - usuários podem ver seus próprios cupons
DROP POLICY IF EXISTS "Users can view own coupons" ON coupons;
CREATE POLICY "Users can view own coupons"
ON coupons FOR SELECT
USING (
    user_email = (SELECT auth.jwt() ->> 'email')
);

-- Policy para coupons - system pode inserir cupons
DROP POLICY IF EXISTS "Service role can insert coupons" ON coupons;
CREATE POLICY "Service role can insert coupons"
ON coupons FOR INSERT
WITH CHECK (true);

-- Policy para coupons - usuários podem atualizar seus próprios cupons (marcar como usado)
DROP POLICY IF EXISTS "Users can update own coupons" ON coupons;
CREATE POLICY "Users can update own coupons"
ON coupons FOR UPDATE
USING (user_email = (SELECT auth.jwt() ->> 'email'))
WITH CHECK (user_email = (SELECT auth.jwt() ->> 'email'));

RAISE NOTICE '✅ Policies de RLS criadas para confirmations e coupons';

-- ============================================
-- 6. VERIFICAR ESTRUTURA DAS COLUNAS NECESSÁRIAS
-- ============================================

-- Verificar se todas as colunas existem em CONFIRMATIONS
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'confirmations' AND column_name = 'id') THEN
        missing_columns := missing_columns || 'id, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'confirmations' AND column_name = 'event_id') THEN
        missing_columns := missing_columns || 'event_id, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'confirmations' AND column_name = 'user_name') THEN
        missing_columns := missing_columns || 'user_name, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'confirmations' AND column_name = 'user_email') THEN
        missing_columns := missing_columns || 'user_email, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'confirmations' AND column_name = 'user_phone') THEN
        missing_columns := missing_columns || 'user_phone, ';
    END IF;
    
    IF missing_columns != '' THEN
        RAISE NOTICE '❌ Colunas faltando em CONFIRMATIONS: %', missing_columns;
    ELSE
        RAISE NOTICE '✅ Todas as colunas necessárias existem em CONFIRMATIONS';
    END IF;
END $$;

-- Verificar se todas as colunas existem em COUPONS
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'id') THEN
        missing_columns := missing_columns || 'id, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'code') THEN
        missing_columns := missing_columns || 'code, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'event_id') THEN
        missing_columns := missing_columns || 'event_id, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'confirmation_id') THEN
        missing_columns := missing_columns || 'confirmation_id, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'user_email') THEN
        missing_columns := missing_columns || 'user_email, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'discount_percentage') THEN
        missing_columns := missing_columns || 'discount_percentage, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'is_used') THEN
        missing_columns := missing_columns || 'is_used, ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'used_at') THEN
        missing_columns := missing_columns || 'used_at, ';
    END IF;
    
    IF missing_columns != '' THEN
        RAISE NOTICE '❌ Colunas faltando em COUPONS: %', missing_columns;
    ELSE
        RAISE NOTICE '✅ Todas as colunas necessárias existem em COUPONS';
    END IF;
END $$;

-- ============================================
-- 7. RELATÓRIO FINAL
-- ============================================

SELECT 
    '✅ CORREÇÃO CONCLUÍDA' as status,
    '' as detalhes
UNION ALL
SELECT 
    'Total de cupons',
    COUNT(*)::TEXT
FROM coupons
UNION ALL
SELECT 
    'Cupons com email',
    COUNT(*)::TEXT
FROM coupons
WHERE user_email IS NOT NULL AND user_email != ''
UNION ALL
SELECT 
    'Total de confirmações',
    COUNT(*)::TEXT
FROM confirmations
UNION ALL
SELECT 
    'Confirmações com email',
    COUNT(*)::TEXT
FROM confirmations
WHERE user_email IS NOT NULL AND user_email != '';
