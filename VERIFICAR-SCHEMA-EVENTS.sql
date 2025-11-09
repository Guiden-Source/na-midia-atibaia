-- 🔍 VERIFICAR SCHEMA REAL DA TABELA EVENTS
-- Execute este script no Supabase SQL Editor para ver quais colunas realmente existem

-- Ver todas as colunas da tabela events
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'events'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver dados de exemplo de um evento
SELECT * FROM events LIMIT 1;

-- Ver se image_url existe e tem dados
SELECT 
  id,
  name,
  CASE 
    WHEN image_url IS NOT NULL THEN '✅ Tem image_url'
    ELSE '❌ image_url NULL'
  END as image_status
FROM events;
