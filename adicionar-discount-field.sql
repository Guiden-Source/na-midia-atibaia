-- =====================================================
-- ADICIONAR CAMPO discount_percentage
-- =====================================================
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE delivery_products 
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0 
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Adicionar comentário
COMMENT ON COLUMN delivery_products.discount_percentage IS 'Percentual de desconto (0-100)';

-- Verificar se foi criado
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'delivery_products'
AND column_name = 'discount_percentage';
