-- ============================================
-- SCRIPT DE REVISÃO COMPLETA DO SUPABASE
-- Execute no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- ============================================

-- Verificar colunas da tabela EVENTS
SELECT 
    'events' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Verificar colunas da tabela CONFIRMATIONS
SELECT 
    'confirmations' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'confirmations'
ORDER BY ordinal_position;

-- Verificar colunas da tabela COUPONS
SELECT 
    'coupons' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'coupons'
ORDER BY ordinal_position;

-- Verificar colunas da tabela DRINKS
SELECT 
    'drinks' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'drinks'
ORDER BY ordinal_position;

-- Verificar colunas da tabela EVENT_DRINKS
SELECT 
    'event_drinks' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'event_drinks'
ORDER BY ordinal_position;

-- ============================================
-- 2. VERIFICAR DADOS EXISTENTES
-- ============================================

-- Contagem de registros por tabela
SELECT 'events' as tabela, COUNT(*) as total FROM events
UNION ALL
SELECT 'confirmations', COUNT(*) FROM confirmations
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'drinks', COUNT(*) FROM drinks
UNION ALL
SELECT 'event_drinks', COUNT(*) FROM event_drinks;

-- ============================================
-- 3. VERIFICAR CONFIRMATIONS
-- ============================================

-- Ver confirmations com e sem email
SELECT 
    'Confirmations COM email' as tipo,
    COUNT(*) as total
FROM confirmations
WHERE user_email IS NOT NULL AND user_email != ''
UNION ALL
SELECT 
    'Confirmations SEM email',
    COUNT(*)
FROM confirmations
WHERE user_email IS NULL OR user_email = '';

-- Sample de confirmations
SELECT 
    id,
    event_id,
    user_name,
    user_email,
    user_phone,
    created_at
FROM confirmations
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 4. VERIFICAR COUPONS
-- ============================================

-- Ver coupons com e sem email
SELECT 
    'Coupons COM user_email' as tipo,
    COUNT(*) as total
FROM coupons
WHERE user_email IS NOT NULL AND user_email != ''
UNION ALL
SELECT 
    'Coupons SEM user_email',
    COUNT(*)
FROM coupons
WHERE user_email IS NULL OR user_email = '';

-- Sample de coupons
SELECT 
    c.id,
    c.code,
    c.user_email,
    c.event_id,
    c.confirmation_id,
    c.is_used,
    c.created_at,
    conf.user_email as confirmation_email
FROM coupons c
LEFT JOIN confirmations conf ON c.confirmation_id = conf.id
ORDER BY c.created_at DESC
LIMIT 5;

-- ============================================
-- 5. VERIFICAR RELACIONAMENTOS
-- ============================================

-- Coupons sem confirmation válida
SELECT 
    'Coupons sem confirmation válida' as problema,
    COUNT(*) as total
FROM coupons c
LEFT JOIN confirmations conf ON c.confirmation_id = conf.id
WHERE conf.id IS NULL;

-- Coupons sem event válido
SELECT 
    'Coupons sem event válido' as problema,
    COUNT(*) as total
FROM coupons c
LEFT JOIN events e ON c.event_id = e.id
WHERE e.id IS NULL;

-- Confirmations sem event válido
SELECT 
    'Confirmations sem event válido' as problema,
    COUNT(*) as total
FROM confirmations conf
LEFT JOIN events e ON conf.event_id = e.id
WHERE e.id IS NULL;

-- ============================================
-- 6. VERIFICAR POLICIES (RLS)
-- ============================================

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('events', 'confirmations', 'coupons', 'drinks', 'event_drinks');

-- Listar policies existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 7. VERIFICAR ÍNDICES
-- ============================================

SELECT 
    t.relname as tabela,
    i.relname as indice,
    a.attname as coluna
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
WHERE t.relkind = 'r'
    AND t.relname IN ('events', 'confirmations', 'coupons', 'drinks', 'event_drinks')
ORDER BY t.relname, i.relname;

-- ============================================
-- 8. PROBLEMAS ESPECÍFICOS A CORRIGIR
-- ============================================

-- Verificar se coluna user_email existe em coupons
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'coupons' 
        AND column_name = 'user_email'
    ) THEN
        RAISE NOTICE '❌ PROBLEMA: Coluna user_email NÃO existe na tabela coupons!';
        RAISE NOTICE '✅ SOLUÇÃO: Execute o script adicionar-user-email-cupons.sql';
    ELSE
        RAISE NOTICE '✅ OK: Coluna user_email existe na tabela coupons';
    END IF;
END $$;

-- ============================================
-- 9. DIAGNÓSTICO FINAL
-- ============================================

-- Resumo de saúde do banco
SELECT 
    'RESUMO DE SAÚDE DO BANCO' as titulo,
    '' as valor
UNION ALL
SELECT 
    '📊 Total de Eventos',
    COUNT(*)::TEXT
FROM events
UNION ALL
SELECT 
    '✅ Confirmações',
    COUNT(*)::TEXT
FROM confirmations
UNION ALL
SELECT 
    '🎫 Cupons',
    COUNT(*)::TEXT
FROM coupons
UNION ALL
SELECT 
    '🍹 Drinks',
    COUNT(*)::TEXT
FROM drinks
UNION ALL
SELECT 
    '🔗 Event-Drinks Relationships',
    COUNT(*)::TEXT
FROM event_drinks
UNION ALL
SELECT 
    '⚠️ Confirmações sem email',
    COUNT(*)::TEXT
FROM confirmations
WHERE user_email IS NULL OR user_email = ''
UNION ALL
SELECT 
    '⚠️ Cupons sem user_email',
    COUNT(*)::TEXT
FROM coupons
WHERE user_email IS NULL OR user_email = ''
UNION ALL
SELECT 
    '❌ Cupons órfãos (sem confirmation)',
    COUNT(*)::TEXT
FROM coupons c
LEFT JOIN confirmations conf ON c.confirmation_id = conf.id
WHERE conf.id IS NULL;
