-- =====================================================
-- DELIVERY SYSTEM - SUPABASE SCHEMA
-- =====================================================
-- Criar tabelas para o sistema de delivery
-- Executar no SQL Editor do Supabase

-- =====================================================
-- 1. CATEGORIAS DE PRODUTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PRODUTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES delivery_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10, 2) CHECK (original_price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  unit TEXT DEFAULT 'un', -- un, kg, L, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PEDIDOS
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  
  -- Endereço
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_condominium TEXT NOT NULL,
  address_block TEXT,
  address_apartment TEXT,
  address_reference TEXT,
  
  -- Pagamento
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'dinheiro', 'cartao')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  change_for DECIMAL(10, 2),
  
  -- Valores
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- WhatsApp
  whatsapp_sent BOOLEAN DEFAULT false,
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4. ITENS DO PEDIDO
-- =====================================================
CREATE TABLE IF NOT EXISTS delivery_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES delivery_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON delivery_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON delivery_products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON delivery_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON delivery_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_phone ON delivery_orders(user_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON delivery_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON delivery_order_items(order_id);

-- =====================================================
-- 6. FUNÇÃO PARA GERAR NÚMERO DO PEDIDO
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  order_number TEXT;
BEGIN
  -- Busca o último número de pedido
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 2) AS INTEGER)), 0) + 1
  INTO next_number
  FROM delivery_orders
  WHERE order_number ~ '^#[0-9]+$';
  
  -- Formata o número com zeros à esquerda
  order_number := '#' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. TRIGGER PARA ATUALIZAR updated_at
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
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_products_updated_at
  BEFORE UPDATE ON delivery_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE delivery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_order_items ENABLE ROW LEVEL SECURITY;

-- Policies para categorias (todos podem ver)
CREATE POLICY "Todos podem ver categorias ativas"
  ON delivery_categories FOR SELECT
  USING (is_active = true);

-- Policies para produtos (todos podem ver ativos)
CREATE POLICY "Todos podem ver produtos ativos"
  ON delivery_products FOR SELECT
  USING (is_active = true);

-- Policies para pedidos
CREATE POLICY "Usuários podem criar pedidos"
  ON delivery_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver próprios pedidos por telefone"
  ON delivery_orders FOR SELECT
  USING (user_phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Admin pode ver todos pedidos"
  ON delivery_orders FOR SELECT
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

CREATE POLICY "Admin pode atualizar pedidos"
  ON delivery_orders FOR UPDATE
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
  );

-- Policies para itens do pedido
CREATE POLICY "Usuários podem criar itens de pedido"
  ON delivery_order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver itens dos próprios pedidos"
  ON delivery_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM delivery_orders
      WHERE delivery_orders.id = delivery_order_items.order_id
      AND (
        delivery_orders.user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
        OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
      )
    )
  );

-- =====================================================
-- 9. SEED DATA - CATEGORIAS
-- =====================================================
INSERT INTO delivery_categories (name, slug, icon, display_order) VALUES
  ('Ofertas', 'ofertas', '🔥', 1),
  ('Básicos da Casa', 'basicos', '🏠', 2),
  ('Bebidas', 'bebidas', '🍺', 3),
  ('Limpeza', 'limpeza', '🧹', 4),
  ('Doces e Sobremesas', 'doces', '🍰', 5),
  ('Seus Favoritos', 'favoritos', '⭐', 6)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 10. SEED DATA - PRODUTOS DE EXEMPLO
-- =====================================================
-- Ofertas
INSERT INTO delivery_products (category_id, name, description, price, original_price, stock, is_active, is_featured) VALUES
  ((SELECT id FROM delivery_categories WHERE slug = 'ofertas'), 'Kit Churrasco Completo', 'Carvão + Sal Grosso + Guardanapos', 29.90, 39.90, 50, true, true),
  ((SELECT id FROM delivery_categories WHERE slug = 'ofertas'), 'Combo Festa (6 Cervejas + 2 Refrigerantes)', 'Economize comprando junto!', 39.90, 49.90, 30, true, true);

-- Básicos da Casa
INSERT INTO delivery_products (category_id, name, description, price, stock, is_active, unit) VALUES
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Arroz Tipo 1 - 5kg', 'Arroz branco de qualidade', 24.90, 100, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Feijão Preto - 1kg', 'Feijão preto selecionado', 8.90, 80, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Óleo de Soja - 900ml', 'Óleo de soja puro', 6.90, 120, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Macarrão Espaguete - 500g', 'Massa de sêmola', 4.90, 150, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Açúcar Cristal - 1kg', 'Açúcar cristal refinado', 4.50, 90, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'basicos'), 'Sal Refinado - 1kg', 'Sal refinado iodado', 2.90, 100, true, 'un');

-- Bebidas
INSERT INTO delivery_products (category_id, name, description, price, stock, is_active, unit) VALUES
  ((SELECT id FROM delivery_categories WHERE slug = 'bebidas'), 'Cerveja Lata 350ml', 'Cerveja pilsen gelada', 3.50, 200, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'bebidas'), 'Refrigerante 2L', 'Diversos sabores', 7.90, 80, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'bebidas'), 'Água Mineral 1.5L', 'Água mineral sem gás', 3.00, 150, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'bebidas'), 'Suco de Laranja 1L', 'Suco natural', 8.50, 40, true, 'un');

-- Limpeza
INSERT INTO delivery_products (category_id, name, description, price, stock, is_active, unit) VALUES
  ((SELECT id FROM delivery_categories WHERE slug = 'limpeza'), 'Detergente Líquido 500ml', 'Diversos aromas', 2.90, 100, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'limpeza'), 'Sabão em Pó 1kg', 'Limpeza profunda', 12.90, 60, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'limpeza'), 'Papel Higiênico 12 rolos', 'Folha dupla', 18.90, 50, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'limpeza'), 'Desinfetante 2L', 'Diversos aromas', 9.90, 70, true, 'un');

-- Doces e Sobremesas
INSERT INTO delivery_products (category_id, name, description, price, stock, is_active, unit) VALUES
  ((SELECT id FROM delivery_categories WHERE slug = 'doces'), 'Chocolate ao Leite 170g', 'Chocolate cremoso', 8.90, 80, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'doces'), 'Sorvete 2L', 'Diversos sabores', 24.90, 30, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'doces'), 'Biscoito Recheado 140g', 'Diversos sabores', 3.90, 120, true, 'un'),
  ((SELECT id FROM delivery_categories WHERE slug = 'doces'), 'Bolo Caseiro', 'Feito no dia', 19.90, 10, true, 'un');

-- =====================================================
-- 11. VIEWS ÚTEIS
-- =====================================================

-- View de produtos com desconto
CREATE OR REPLACE VIEW delivery_products_with_discount AS
SELECT 
  *,
  CASE 
    WHEN original_price IS NOT NULL AND original_price > price 
    THEN ROUND(((original_price - price) / original_price * 100)::NUMERIC, 0)
    ELSE 0 
  END AS discount_percentage
FROM delivery_products
WHERE is_active = true;

-- View de estatísticas de pedidos
CREATE OR REPLACE VIEW delivery_order_stats AS
SELECT 
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_orders,
  COUNT(*) FILTER (WHERE status = 'preparing') AS preparing_orders,
  COUNT(*) FILTER (WHERE status = 'delivering') AS delivering_orders,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_orders,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders,
  SUM(total) FILTER (WHERE status = 'completed') AS total_revenue,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today_orders
FROM delivery_orders;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para verificar se tudo foi criado corretamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'delivery_%';
