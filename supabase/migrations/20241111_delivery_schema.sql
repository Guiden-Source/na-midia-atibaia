-- =====================================================
-- DELIVERY SYSTEM - SCHEMA MIGRATION
-- =====================================================
-- Criado em: 11/11/2024
-- Sistema de delivery com pedidos via WhatsApp

-- =====================================================
-- 1. TABELA: delivery_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji ou nome do ícone
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA: delivery_products
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES delivery_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- preço original (para ofertas)
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  unit TEXT DEFAULT 'un', -- unidade (un, kg, L, etc)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA: delivery_orders
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- número do pedido (ex: #001)
  user_id UUID, -- opcional, pode ser guest
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  
  -- Endereço
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_condominium TEXT NOT NULL, -- Jeronimo de Camargo 1 ou 2
  address_block TEXT,
  address_apartment TEXT,
  address_reference TEXT,
  
  -- Pagamento
  payment_method TEXT NOT NULL, -- pix, dinheiro, cartao
  payment_status TEXT DEFAULT 'pending', -- pending, paid
  change_for DECIMAL(10, 2), -- troco para quanto?
  
  -- Pedido
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT, -- observações do cliente
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, confirmed, preparing, delivering, completed, cancelled
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- WhatsApp
  whatsapp_sent BOOLEAN DEFAULT false,
  whatsapp_sent_at TIMESTAMPTZ
);

-- =====================================================
-- 4. TABELA: delivery_order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES delivery_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, -- snapshot do nome
  product_image TEXT, -- snapshot da imagem
  price DECIMAL(10, 2) NOT NULL, -- preço no momento da compra
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL, -- price * quantity
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_delivery_products_category ON delivery_products(category_id);
CREATE INDEX IF NOT EXISTS idx_delivery_products_active ON delivery_products(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_products_featured ON delivery_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_user_phone ON delivery_orders(user_phone);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_created ON delivery_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_order_items_order ON delivery_order_items(order_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE delivery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura
CREATE POLICY "Categorias são públicas"
  ON delivery_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Produtos são públicos"
  ON delivery_products FOR SELECT
  USING (is_active = true);

-- Políticas de pedidos (usuário vê seus próprios pedidos)
CREATE POLICY "Usuários veem seus próprios pedidos"
  ON delivery_orders FOR SELECT
  USING (
    user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
    OR user_email = current_setting('request.jwt.claims', true)::json->>'email'
  );

CREATE POLICY "Qualquer um pode criar pedido"
  ON delivery_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários veem itens de seus pedidos"
  ON delivery_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM delivery_orders
      WHERE delivery_orders.id = delivery_order_items.order_id
      AND (
        delivery_orders.user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
        OR delivery_orders.user_email = current_setting('request.jwt.claims', true)::json->>'email'
      )
    )
  );

CREATE POLICY "Qualquer um pode criar itens de pedido"
  ON delivery_order_items FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 7. FUNÇÃO: Gerar número de pedido sequencial
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  order_number TEXT;
BEGIN
  -- Buscar o maior número de pedido atual
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 2) AS INTEGER)), 0) + 1
  INTO next_number
  FROM delivery_orders;
  
  -- Formatar como #001, #002, etc
  order_number := '#' || LPAD(next_number::TEXT, 3, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. TRIGGER: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_delivery_categories_updated_at
  BEFORE UPDATE ON delivery_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_products_updated_at
  BEFORE UPDATE ON delivery_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. SEED DATA: Categorias iniciais
-- =====================================================
INSERT INTO delivery_categories (name, slug, icon, display_order) VALUES
  ('🔥 Ofertas', 'ofertas', '🔥', 1),
  ('🏠 Básicos da Casa', 'basicos', '🏠', 2),
  ('🍺 Bebidas', 'bebidas', '🍺', 3),
  ('🧹 Limpeza', 'limpeza', '🧹', 4),
  ('🍰 Doces e Sobremesas', 'doces', '🍰', 5),
  ('⭐ Favoritos', 'favoritos', '⭐', 6)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 10. COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE delivery_categories IS 'Categorias de produtos do delivery';
COMMENT ON TABLE delivery_products IS 'Produtos disponíveis para delivery';
COMMENT ON TABLE delivery_orders IS 'Pedidos realizados pelos clientes';
COMMENT ON TABLE delivery_order_items IS 'Itens de cada pedido';

COMMENT ON COLUMN delivery_orders.status IS 'Status: pending, confirmed, preparing, delivering, completed, cancelled';
COMMENT ON COLUMN delivery_orders.payment_method IS 'Método: pix, dinheiro, cartao';
COMMENT ON COLUMN delivery_orders.address_condominium IS 'Apenas: Jeronimo de Camargo 1 ou 2';
