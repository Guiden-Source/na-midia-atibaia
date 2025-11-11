-- Criar tabela de categorias do marketplace
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10, 2),
  category_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  gallery_urls TEXT[], -- Array de URLs de imagens
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- Vincular a evento específico (opcional)
  metadata JSONB DEFAULT '{}', -- Dados extras: tamanho, cor, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de carrinho
CREATE TABLE IF NOT EXISTS marketplace_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Pode ser temporário para usuários não logados
  user_email TEXT,
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_at_addition DECIMAL(10, 2) NOT NULL, -- Preço no momento da adição
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- Um produto por usuário no carrinho
);

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE, -- Número do pedido (ex: ORD-2024-0001)
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  
  -- Totais
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, completed, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method TEXT, -- pix, card, money
  
  -- Dados de entrega/retirada
  delivery_method TEXT NOT NULL DEFAULT 'pickup', -- pickup, delivery
  delivery_address TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Criar tabela de itens do pedido
CREATE TABLE IF NOT EXISTS marketplace_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL, -- Nome do produto no momento da compra
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL, -- Preço unitário no momento da compra
  subtotal DECIMAL(10, 2) NOT NULL, -- quantity * price
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON marketplace_products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_event ON marketplace_products(event_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON marketplace_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_email ON marketplace_cart(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON marketplace_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON marketplace_order_items(order_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_marketplace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_marketplace_categories_updated_at
  BEFORE UPDATE ON marketplace_categories
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_products_updated_at
  BEFORE UPDATE ON marketplace_products
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_cart_updated_at
  BEFORE UPDATE ON marketplace_cart
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_orders_updated_at
  BEFORE UPDATE ON marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_order_items ENABLE ROW LEVEL SECURITY;

-- Policies para categorias (público pode ler, apenas admin pode modificar)
CREATE POLICY "Categorias são públicas"
  ON marketplace_categories FOR SELECT
  USING (true);

CREATE POLICY "Apenas admin pode modificar categorias"
  ON marketplace_categories FOR ALL
  USING (auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br'));

-- Policies para produtos (público pode ler ativos, apenas admin pode modificar)
CREATE POLICY "Produtos ativos são públicos"
  ON marketplace_products FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br'));

CREATE POLICY "Apenas admin pode modificar produtos"
  ON marketplace_products FOR ALL
  USING (auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br'));

-- Policies para carrinho (usuário pode ver e modificar apenas seu próprio carrinho)
CREATE POLICY "Usuários podem ver seu próprio carrinho"
  ON marketplace_cart FOR SELECT
  USING (
    user_email = auth.jwt() ->> 'email' 
    OR auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br')
  );

CREATE POLICY "Usuários podem adicionar ao seu carrinho"
  ON marketplace_cart FOR INSERT
  WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Usuários podem modificar seu carrinho"
  ON marketplace_cart FOR UPDATE
  USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Usuários podem deletar do seu carrinho"
  ON marketplace_cart FOR DELETE
  USING (user_email = auth.jwt() ->> 'email');

-- Policies para pedidos (usuário pode ver seus pedidos, admin pode ver todos)
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON marketplace_orders FOR SELECT
  USING (
    user_email = auth.jwt() ->> 'email' 
    OR auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br')
  );

CREATE POLICY "Usuários podem criar pedidos"
  ON marketplace_orders FOR INSERT
  WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Apenas admin pode modificar pedidos"
  ON marketplace_orders FOR UPDATE
  USING (auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br'));

-- Policies para itens do pedido
CREATE POLICY "Usuários podem ver itens de seus pedidos"
  ON marketplace_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE marketplace_orders.id = marketplace_order_items.order_id
      AND (
        marketplace_orders.user_email = auth.jwt() ->> 'email'
        OR auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com.br')
      )
    )
  );

CREATE POLICY "Sistema pode criar itens do pedido"
  ON marketplace_order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE marketplace_orders.id = marketplace_order_items.order_id
      AND marketplace_orders.user_email = auth.jwt() ->> 'email'
    )
  );

-- Inserir categorias padrão
INSERT INTO marketplace_categories (name, slug, description, display_order) VALUES
  ('Ingressos', 'ingressos', 'Ingressos para eventos e shows', 1),
  ('Bebidas', 'bebidas', 'Bebidas e drinks', 2),
  ('VIP', 'vip', 'Experiências VIP e pacotes exclusivos', 3),
  ('Merchandising', 'merchandising', 'Produtos oficiais e souvenirs', 4)
ON CONFLICT (slug) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE marketplace_products IS 'Produtos disponíveis no marketplace';
COMMENT ON TABLE marketplace_cart IS 'Carrinho de compras dos usuários';
COMMENT ON TABLE marketplace_orders IS 'Pedidos realizados';
COMMENT ON TABLE marketplace_order_items IS 'Itens de cada pedido';
