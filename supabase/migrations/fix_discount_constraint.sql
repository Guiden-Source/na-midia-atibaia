-- ================================================
-- FIX: Remove restrictive discount_percentage constraint
-- ================================================
-- Constraint antigo permitia apenas [10, 15, 20]
-- Cupons manuais precisam de 1-100%

-- Dropar constraint antigo
ALTER TABLE delivery_coupons_progressive
DROP CONSTRAINT IF EXISTS delivery_coupons_progressive_discount_percentage_check;

-- Criar novo constraint permitindo 1-100%
ALTER TABLE delivery_coupons_progressive
ADD CONSTRAINT delivery_coupons_progressive_discount_percentage_check 
CHECK (discount_percentage >= 1 AND discount_percentage <= 100);

-- Também corrigir order_number (pode ser NULL para cupons manuais)
ALTER TABLE delivery_coupons_progressive
DROP CONSTRAINT IF EXISTS delivery_coupons_progressive_order_number_check;

-- Novo constraint: se não for NULL, deve ser >= 1
ALTER TABLE delivery_coupons_progressive
ADD CONSTRAINT delivery_coupons_progressive_order_number_check 
CHECK (order_number IS NULL OR order_number >= 1);

-- ================================================
-- Agora permite descontos de 1% até 100%
-- ================================================
