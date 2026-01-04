-- Migration: Reestruturar categorias e adicionar tags para produtos
-- Data: 2026-01-04
-- Objetivo: Renomear categorias e preparar sistema de tags

-- 1. Adicionar coluna tags aos produtos (se não existir)
ALTER TABLE delivery_products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Renomear categorias existentes
UPDATE delivery_categories 
SET 
  name = 'Mercado Rápido', 
  slug = 'mercado-rapido'
WHERE slug = 'alimentos';

UPDATE delivery_categories 
SET 
  name = 'Bebidas & Álcool', 
  slug = 'bebidas-alcool'
WHERE slug = 'bebidas';

UPDATE delivery_categories 
SET 
  name = 'Doces & Snacks', 
  slug = 'doces-snacks'
WHERE slug = 'doces';

-- 3. Inserir categoria "Copão & Drinks" (se não existir)
INSERT INTO delivery_categories (name, slug, order_index)
VALUES ('Copão & Drinks', 'copao-drinks', 0)
ON CONFLICT (slug) DO NOTHING;

-- 4. Marcar produtos como "copão" baseado no nome
-- Produtos que contenham "copão", "copao", "drink", "gin", "whisky"
UPDATE delivery_products 
SET tags = array_append(tags, 'copao')
WHERE 
  (name ILIKE '%copão%' OR 
   name ILIKE '%copao%' OR 
   name ILIKE '%cop%o%' OR
   name ILIKE '%drink%' OR
   name ILIKE '%gin%' OR
   name ILIKE '%whisky%' OR
   name ILIKE '%whiskey%')
  AND NOT ('copao' = ANY(tags)); -- Evitar duplicatas

-- 5. Marcar produtos alcoólicos
UPDATE delivery_products 
SET tags = array_append(tags, 'alcoolico')
WHERE 
  category_id IN (SELECT id FROM delivery_categories WHERE slug = 'bebidas-alcool')
  AND NOT ('alcoolico' = ANY(tags));

-- 6. Criar índice para busca por tags (performance)
CREATE INDEX IF NOT EXISTS idx_delivery_products_tags 
ON delivery_products USING GIN (tags);

-- 7. Comentários para documentação
COMMENT ON COLUMN delivery_products.tags IS 'Tags para filtros e vitrines especiais (copao, alcoolico, destaque, etc)';
