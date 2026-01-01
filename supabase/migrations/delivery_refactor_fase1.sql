-- ================================================
-- DELIVERY REFACTOR FASE 1 - DATABASE MIGRATIONS
-- ================================================
-- Data: 31/12/2024
-- Objetivo: Adicionar colunas para features de destaque, estoque e ordenação

-- 1. Adicionar colunas à tabela delivery_products
ALTER TABLE delivery_products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS order_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- 2. Popular dados de teste (produtos existentes)
-- Marcar alguns produtos como "novos"
UPDATE delivery_products 
SET is_new = true 
WHERE id IN (
  SELECT id FROM delivery_products 
  WHERE created_at > NOW() - INTERVAL '7 days'
  LIMIT 3
);

-- Simular produtos mais pedidos (order_count)
UPDATE delivery_products 
SET order_count = 25 
WHERE name ILIKE '%cerveja%' OR name ILIKE '%combo%';

UPDATE delivery_products 
SET order_count = 15 
WHERE name ILIKE '%suco%' OR name ILIKE '%refrigerante%';

UPDATE delivery_products 
SET order_count = 8 
WHERE name ILIKE '%água%';

-- Adicionar descontos promocionais
UPDATE delivery_products 
SET discount_percentage = 20 
WHERE id IN (
  SELECT id FROM delivery_products 
  WHERE name ILIKE '%combo%'
  LIMIT 2
);

UPDATE delivery_products 
SET discount_percentage = 10 
WHERE id IN (
  SELECT id FROM delivery_products 
  WHERE name ILIKE '%cerveja lata%'
  LIMIT 1
);

-- 3. Ajustar estoque de alguns produtos
UPDATE delivery_products 
SET stock = 3 
WHERE name ILIKE '%whisky%' OR name ILIKE '%vinho%';

UPDATE delivery_products 
SET stock = 0 
WHERE name ILIKE '%esgotado%';

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_delivery_products_order_count 
ON delivery_products(order_count DESC);

CREATE INDEX IF NOT EXISTS idx_delivery_products_is_new 
ON delivery_products(is_new) 
WHERE is_new = true;

CREATE INDEX IF NOT EXISTS idx_delivery_products_discount 
ON delivery_products(discount_percentage) 
WHERE discount_percentage > 0;

-- 5. Criar view para produtos em destaque
CREATE OR REPLACE VIEW featured_products AS
SELECT 
  id,
  name,
  description,
  price,
  image,
  emoji,
  category_id,
  active,
  stock,
  order_count,
  is_new,
  discount_percentage,
  CASE 
    WHEN order_count >= 20 THEN 'bestseller'
    WHEN is_new = true THEN 'new'
    WHEN discount_percentage > 0 THEN 'discount'
    ELSE NULL
  END as badge_type
FROM delivery_products
WHERE active = true
  AND (order_count >= 10 OR is_new = true OR discount_percentage > 0)
ORDER BY order_count DESC, is_new DESC, discount_percentage DESC
LIMIT 10;

-- 6. Comentários nas colunas
COMMENT ON COLUMN delivery_products.stock IS 'Quantidade em estoque do produto';
COMMENT ON COLUMN delivery_products.order_count IS 'Número de vezes que o produto foi pedido (para ranking)';
COMMENT ON COLUMN delivery_products.is_new IS 'Marca produto como novidade (últimos 7-14 dias)';
COMMENT ON COLUMN delivery_products.discount_percentage IS 'Percentual de desconto aplicado (0-100)';

-- ================================================
-- FIM DAS MIGRATIONS
-- ================================================
