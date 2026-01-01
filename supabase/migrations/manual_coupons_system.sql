-- ================================================
-- MANUAL COUPON SYSTEM - DATABASE MIGRATION
-- ================================================
-- Data: 31/12/2024
-- Objetivo: Adicionar colunas para sistema manual de cupons

-- Adicionar colunas à tabela delivery_coupons_progressive
ALTER TABLE delivery_coupons_progressive
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS manual_created BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by_admin_email TEXT,
ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_uses INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS times_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT false;

-- Comentários nas colunas
COMMENT ON COLUMN delivery_coupons_progressive.is_active IS 'Cupom ativo (true) ou desativado pelo admin (false)';
COMMENT ON COLUMN delivery_coupons_progressive.manual_created IS 'True se criado manualmente pelo admin, false se gerado automaticamente';
COMMENT ON COLUMN delivery_coupons_progressive.created_by_admin_email IS 'Email do admin que criou o cupom (apenas para manuais)';
COMMENT ON COLUMN delivery_coupons_progressive.min_order_value IS 'Valor mínimo do pedido para usar o cupom';
COMMENT ON COLUMN delivery_coupons_progressive.max_uses IS 'Número máximo de vezes que o cupom pode ser usado';
COMMENT ON COLUMN delivery_coupons_progressive.times_used IS 'Contador de quantas vezes o cupom foi usado';
COMMENT ON COLUMN delivery_coupons_progressive.is_global IS 'True se o cupom vale para todos, false se apenas para user_email específico';

-- Atualizar cupons existentes (automáticos)
UPDATE delivery_coupons_progressive
SET 
  is_active = true,
  manual_created = false,
  is_global = false,
  max_uses = 1,
  times_used = 0
WHERE manual_created IS NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON delivery_coupons_progressive(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_manual_created ON delivery_coupons_progressive(manual_created);
CREATE INDEX IF NOT EXISTS idx_coupons_is_global ON delivery_coupons_progressive(is_global);
CREATE INDEX IF NOT EXISTS idx_coupons_created_by_admin ON delivery_coupons_progressive(created_by_admin_email);

-- ================================================
-- FIM DA MIGRATION
-- ================================================
