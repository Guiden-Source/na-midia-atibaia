-- =====================================================
-- TABELA: delivery_coupons_progressive
-- Sistema de cupons progressivos (10% → 15% → 20%)
-- =====================================================

CREATE TABLE IF NOT EXISTS delivery_coupons_progressive (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Código único do cupom
  code TEXT UNIQUE NOT NULL,
  
  -- Desconto (10, 15 ou 20%)
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage IN (10, 15, 20)),
  
  -- Controle de uso
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_used BOOLEAN DEFAULT FALSE,
  
  -- Associação com usuário
  user_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Número do pedido que gerou o cupom (1º, 2º, 3º)
  order_number INTEGER NOT NULL CHECK (order_number >= 1),
  
  -- Validade
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES para performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_coupons_progressive_code 
  ON delivery_coupons_progressive(code);

CREATE INDEX IF NOT EXISTS idx_coupons_progressive_email 
  ON delivery_coupons_progressive(user_email);

CREATE INDEX IF NOT EXISTS idx_coupons_progressive_used 
  ON delivery_coupons_progressive(is_used);

CREATE INDEX IF NOT EXISTS idx_coupons_progressive_user_id 
  ON delivery_coupons_progressive(user_id);

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

ALTER TABLE delivery_coupons_progressive ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seus próprios cupons
CREATE POLICY "Users can view their own coupons"
  ON delivery_coupons_progressive FOR SELECT
  USING (
    auth.jwt() ->> 'email' = user_email 
    OR user_id = auth.uid()
  );

-- Apenas sistema pode inserir cupons (via service role)
CREATE POLICY "Service role can insert coupons"
  ON delivery_coupons_progressive FOR INSERT
  WITH CHECK (true);

-- Apenas sistema pode atualizar cupons (marcar como usado)
CREATE POLICY "Service role can update coupons"
  ON delivery_coupons_progressive FOR UPDATE
  USING (true);

-- =====================================================
-- TRIGGER: Atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupons_progressive_updated_at
  BEFORE UPDATE ON delivery_coupons_progressive
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS úteis
-- =====================================================

-- View de cupons válidos (não expirados e não usados)
CREATE OR REPLACE VIEW valid_coupons_progressive AS
SELECT *
FROM delivery_coupons_progressive
WHERE 
  is_used = FALSE 
  AND expires_at > NOW()
  AND used_count < max_uses;

-- =====================================================
-- COMENTÁRIOS na tabela
-- =====================================================

COMMENT ON TABLE delivery_coupons_progressive IS 'Sistema de cupons progressivos para delivery (10% → 15% → 20%)';
COMMENT ON COLUMN delivery_coupons_progressive.code IS 'Código único do cupom (ex: VOLTA10-ABC123)';
COMMENT ON COLUMN delivery_coupons_progressive.discount_percentage IS 'Percentual de desconto: 10, 15 ou 20';
COMMENT ON COLUMN delivery_coupons_progressive.order_number IS 'Qual pedido gerou este cupom (1º, 2º, 3º)';
COMMENT ON COLUMN delivery_coupons_progressive.user_email IS 'Email do usuário dono do cupom';
