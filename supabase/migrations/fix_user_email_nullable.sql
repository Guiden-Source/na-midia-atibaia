-- ================================================
-- FIX: Allow NULL in multiple columns for manual coupons
-- ================================================
-- Cupons manuais não têm: order_number, user_id

-- Remover NOT NULL constraints
ALTER TABLE delivery_coupons_progressive
ALTER COLUMN user_email DROP NOT NULL,
ALTER COLUMN user_id DROP NOT NULL,
ALTER COLUMN order_number DROP NOT NULL;

-- Comentários
COMMENT ON COLUMN delivery_coupons_progressive.user_email IS 'Email do usuário (NULL para cupons globais)';
COMMENT ON COLUMN delivery_coupons_progressive.user_id IS 'ID do usuário (NULL para cupons manuais)';
COMMENT ON COLUMN delivery_coupons_progressive.order_number IS 'Número do pedido que gerou o cupom (NULL para manuais)';
