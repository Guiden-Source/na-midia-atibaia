-- ============================================
-- TABELA DE ROLES (caso não exista)
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: usuários podem ver apenas suas próprias roles
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: apenas admins podem inserir/atualizar roles
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
CREATE POLICY "Only admins can manage roles"
  ON user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TABELA DE PROMOÇÕES/CUPONS GERAIS
-- ============================================
-- Promoções não vinculadas a eventos específicos
-- Podem ser ofertas de estabelecimentos, cupons de desconto, etc.

-- Criar tabela de promoções
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Informações básicas
  title TEXT NOT NULL,
  description TEXT,
  
  -- Tipo de desconto
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'freebie', 'special')),
  -- percentage = percentual (ex: 50%)
  -- fixed = valor fixo (ex: R$ 10)
  -- freebie = brinde/cortesia
  -- special = oferta especial (descrito na description)
  
  discount_value NUMERIC, -- Valor do desconto (50 para 50% ou 10.00 para R$ 10)
  
  -- Código do cupom (opcional)
  code TEXT UNIQUE,
  
  -- Validade
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  -- Termos e condições
  terms TEXT,
  
  -- Categoria
  category TEXT, -- 'food', 'drinks', 'events', 'delivery', 'general'
  
  -- Imagem da promoção
  image_url TEXT,
  
  -- Informações do estabelecimento (opcional)
  venue_name TEXT,
  venue_instagram TEXT,
  venue_phone TEXT,
  
  -- Controle
  featured BOOLEAN DEFAULT false, -- Aparecer em destaque na home
  active BOOLEAN DEFAULT true,
  max_uses INTEGER, -- Limite de usos (null = ilimitado)
  current_uses INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_promotions_featured ON promotions(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_promotions_valid_until ON promotions(valid_until); -- Removido NOW() do predicado
CREATE INDEX IF NOT EXISTS idx_promotions_category ON promotions(category);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code) WHERE code IS NOT NULL;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();

-- ============================================
-- TABELA DE RESGATES DE PROMOÇÕES
-- ============================================
-- Rastreia quando usuários resgatam promoções

CREATE TABLE IF NOT EXISTS promotion_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Código gerado para o usuário (se aplicável)
  claim_code TEXT,
  
  -- Status do resgate
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  
  -- Quando foi usado (se aplicável)
  used_at TIMESTAMPTZ,
  
  -- Timestamps
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: um usuário só pode resgatar uma promoção uma vez
  UNIQUE(promotion_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_promotion_claims_user ON promotion_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_promotion_claims_promotion ON promotion_claims(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_claims_status ON promotion_claims(status);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Habilitar RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_claims ENABLE ROW LEVEL SECURITY;

-- Policies para PROMOTIONS
-- Qualquer um pode ver promoções ativas
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  USING (active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- Apenas admins podem inserir/atualizar/deletar promoções
CREATE POLICY "Only admins can insert promotions"
  ON promotions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update promotions"
  ON promotions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete promotions"
  ON promotions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies para PROMOTION_CLAIMS
-- Usuários podem ver apenas seus próprios resgates
CREATE POLICY "Users can view own claims"
  ON promotion_claims FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários autenticados podem resgatar promoções
CREATE POLICY "Authenticated users can claim promotions"
  ON promotion_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar status de seus próprios resgates
CREATE POLICY "Users can update own claims"
  ON promotion_claims FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins podem ver todos os resgates
CREATE POLICY "Admins can view all claims"
  ON promotion_claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNÇÃO PARA RESGATAR PROMOÇÃO
-- ============================================

CREATE OR REPLACE FUNCTION claim_promotion(p_promotion_id UUID)
RETURNS JSON AS $$
DECLARE
  v_promotion promotions;
  v_claim_code TEXT;
  v_claim_id UUID;
BEGIN
  -- Verificar se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuário não autenticado');
  END IF;

  -- Buscar promoção
  SELECT * INTO v_promotion
  FROM promotions
  WHERE id = p_promotion_id AND active = true;

  -- Verificar se promoção existe e está ativa
  IF v_promotion IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Promoção não encontrada ou inativa');
  END IF;

  -- Verificar validade
  IF v_promotion.valid_until IS NOT NULL AND v_promotion.valid_until < NOW() THEN
    RETURN json_build_object('success', false, 'error', 'Promoção expirada');
  END IF;

  -- Verificar limite de usos
  IF v_promotion.max_uses IS NOT NULL AND v_promotion.current_uses >= v_promotion.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'Promoção esgotada');
  END IF;

  -- Verificar se usuário já resgatou
  IF EXISTS (
    SELECT 1 FROM promotion_claims
    WHERE promotion_id = p_promotion_id AND user_id = auth.uid()
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Você já resgatou esta promoção');
  END IF;

  -- Gerar código único (se a promoção tiver código)
  IF v_promotion.code IS NOT NULL THEN
    v_claim_code := v_promotion.code;
  ELSE
    v_claim_code := 'PROMO-' || upper(substring(gen_random_uuid()::text from 1 for 8));
  END IF;

  -- Criar resgate
  INSERT INTO promotion_claims (promotion_id, user_id, claim_code)
  VALUES (p_promotion_id, auth.uid(), v_claim_code)
  RETURNING id INTO v_claim_id;

  -- Incrementar contador de usos
  UPDATE promotions
  SET current_uses = current_uses + 1
  WHERE id = p_promotion_id;

  -- Retornar sucesso
  RETURN json_build_object(
    'success', true,
    'claim_id', v_claim_id,
    'code', v_claim_code,
    'promotion', json_build_object(
      'title', v_promotion.title,
      'description', v_promotion.description,
      'terms', v_promotion.terms
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DADOS DE EXEMPLO
-- ============================================

INSERT INTO promotions (title, description, discount_type, discount_value, code, category, featured, valid_until, terms, venue_name, venue_instagram, image_url) VALUES
  (
    '50% OFF na Happy Hour',
    'Aproveite 50% de desconto em todas as bebidas de segunda a sexta, das 17h às 19h',
    'percentage',
    50,
    'HAPPYHOUR50',
    'drinks',
    true,
    NOW() + INTERVAL '30 days',
    'Válido apenas de segunda a sexta-feira, das 17h às 19h. Não cumulativo com outras promoções.',
    'Bar do Centro',
    '@bardocentro',
    NULL
  ),
  (
    '2x1 em Pizzas',
    'Na compra de uma pizza grande, leve outra do mesmo tamanho grátis',
    'special',
    NULL,
    'PIZZA2X1',
    'food',
    true,
    NOW() + INTERVAL '15 days',
    'Válido apenas para pizzas grandes. Não válido aos sábados e véspera de feriados.',
    'Pizzaria Bella',
    '@pizzariabella',
    NULL
  ),
  (
    'Frete Grátis no Delivery',
    'Peça pelo app e ganhe frete grátis em pedidos acima de R$ 40',
    'freebie',
    NULL,
    'FRETEGRATIS',
    'delivery',
    true,
    NOW() + INTERVAL '7 days',
    'Válido apenas para pedidos acima de R$ 40. Raio de entrega limitado.',
    'Na Mídia Delivery',
    '@namidiadelivery',
    NULL
  ),
  (
    'R$ 10 OFF na primeira compra',
    'Ganhe R$ 10 de desconto na sua primeira compra acima de R$ 50',
    'fixed',
    10,
    'PRIMEIRA10',
    'general',
    false,
    NOW() + INTERVAL '60 days',
    'Válido apenas para novos usuários. Compra mínima de R$ 50.',
    NULL,
    NULL,
    NULL
  ),
  (
    'Chopp em Dobro',
    'A cada chopp comprado, ganhe outro da mesma marca',
    'special',
    NULL,
    'CHOPX2',
    'drinks',
    false,
    NOW() + INTERVAL '10 days',
    'Válido apenas às quartas-feiras. Limite de 2 chopps por pessoa.',
    'Cervejaria Artesanal',
    '@cervejariaatibaia',
    NULL
  );

-- Commit
COMMIT;
