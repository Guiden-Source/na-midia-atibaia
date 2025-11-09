-- 🖼️ ADICIONAR COLUNA IMAGE_URL NA TABELA EVENTS
-- Execute este script AGORA no Supabase SQL Editor

-- Adicionar coluna image_url
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verificar se foi adicionada
SELECT 
  '✅ Coluna image_url adicionada!' as status,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'events' 
  AND column_name = 'image_url';

-- Ver estrutura completa da tabela events
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;
