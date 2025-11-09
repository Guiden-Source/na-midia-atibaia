-- ==========================================
-- SCRIPT COMPLETO: SISTEMA DE BEBIDAS
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Criar tabela de bebidas
CREATE TABLE IF NOT EXISTS drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('cerveja', 'vinho', 'drink', 'destilado', 'nao_alcoolico')),
  descricao TEXT,
  preco DECIMAL(10, 2),
  imagem_url TEXT,
  icone VARCHAR(10),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de relação evento-bebidas
CREATE TABLE IF NOT EXISTS event_drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  drink_id UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  disponivel BOOLEAN DEFAULT true,
  preco_evento DECIMAL(10, 2),
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(event_id, drink_id)
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_drinks_tipo ON drinks(tipo);
CREATE INDEX IF NOT EXISTS idx_drinks_ativo ON drinks(ativo);
CREATE INDEX IF NOT EXISTS idx_event_drinks_event ON event_drinks(event_id);
CREATE INDEX IF NOT EXISTS idx_event_drinks_drink ON event_drinks(drink_id);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_drinks ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança - Leitura pública
DROP POLICY IF EXISTS "Drinks são visíveis para todos" ON drinks;
CREATE POLICY "Drinks são visíveis para todos" ON drinks
  FOR SELECT
  USING (ativo = true);

DROP POLICY IF EXISTS "Event drinks são visíveis para todos" ON event_drinks;
CREATE POLICY "Event drinks são visíveis para todos" ON event_drinks
  FOR SELECT
  USING (true);

-- 6. Políticas de segurança - Escrita apenas autenticados (temporariamente permissivo)
DROP POLICY IF EXISTS "Usuários autenticados podem inserir drinks" ON drinks;
CREATE POLICY "Usuários autenticados podem inserir drinks" ON drinks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar drinks" ON drinks;
CREATE POLICY "Usuários autenticados podem atualizar drinks" ON drinks
  FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários autenticados podem deletar drinks" ON drinks;
CREATE POLICY "Usuários autenticados podem deletar drinks" ON drinks
  FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar event_drinks" ON event_drinks;
CREATE POLICY "Usuários autenticados podem gerenciar event_drinks" ON event_drinks
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 7. Popular com bebidas iniciais
INSERT INTO drinks (nome, tipo, descricao, icone, ativo) VALUES
  -- Cervejas
  ('Heineken', 'cerveja', 'Cerveja Premium Holandesa', '🍺', true),
  ('Skol', 'cerveja', 'Cerveja Pilsen Brasileira', '🍺', true),
  ('Brahma', 'cerveja', 'Cerveja Pilsen', '🍺', true),
  ('Budweiser', 'cerveja', 'Cerveja Americana', '🍺', true),
  ('Corona', 'cerveja', 'Cerveja Mexicana', '🍺', true),
  ('Stella Artois', 'cerveja', 'Cerveja Premium Belga', '🍺', true),
  ('Amstel', 'cerveja', 'Cerveja Holandesa', '🍺', true),
  
  -- Vinhos
  ('Vinho Tinto', 'vinho', 'Vinho Tinto Seco', '🍷', true),
  ('Vinho Branco', 'vinho', 'Vinho Branco Seco', '🍾', true),
  ('Espumante', 'vinho', 'Espumante Brut', '🍾', true),
  ('Rosé', 'vinho', 'Vinho Rosé', '🍷', true),
  ('Prosecco', 'vinho', 'Espumante Italiano', '🍾', true),
  
  -- Drinks/Coquetéis
  ('Caipirinha', 'drink', 'Clássico brasileiro com cachaça', '🍹', true),
  ('Mojito', 'drink', 'Rum, hortelã, limão e soda', '🍹', true),
  ('Gin Tônica', 'drink', 'Gin com água tônica', '🍸', true),
  ('Margarita', 'drink', 'Tequila com limão', '🍹', true),
  ('Aperol Spritz', 'drink', 'Aperol, prosecco e soda', '🍹', true),
  ('Cosmopolitan', 'drink', 'Vodka com cranberry', '🍸', true),
  ('Caipiroska', 'drink', 'Caipirinha com vodka', '🍹', true),
  ('Negroni', 'drink', 'Gin, vermute e Campari', '🍸', true),
  
  -- Destilados
  ('Whisky', 'destilado', 'Whisky escocês', '🥃', true),
  ('Vodka', 'destilado', 'Vodka pura', '🥃', true),
  ('Cachaça', 'destilado', 'Cachaça artesanal', '🥃', true),
  ('Tequila', 'destilado', 'Tequila mexicana', '🥃', true),
  ('Rum', 'destilado', 'Rum caribenho', '🥃', true),
  ('Gin', 'destilado', 'Gin London Dry', '🥃', true),
  
  -- Não Alcoólicos
  ('Refrigerante', 'nao_alcoolico', 'Coca-Cola, Guaraná, etc', '🥤', true),
  ('Suco Natural', 'nao_alcoolico', 'Sucos de frutas frescas', '🧃', true),
  ('Água Mineral', 'nao_alcoolico', 'Água mineral natural', '💧', true),
  ('Energético', 'nao_alcoolico', 'Red Bull, Monster, etc', '⚡', true),
  ('Água de Coco', 'nao_alcoolico', 'Água de coco natural', '🥥', true),
  ('Chá Gelado', 'nao_alcoolico', 'Chá gelado natural', '🍵', true)
ON CONFLICT DO NOTHING;

-- 8. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger para atualizar updated_at em drinks
DROP TRIGGER IF EXISTS update_drinks_updated_at ON drinks;
CREATE TRIGGER update_drinks_updated_at
  BEFORE UPDATE ON drinks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Verificar quantas bebidas foram criadas
SELECT tipo, COUNT(*) as quantidade
FROM drinks
WHERE ativo = true
GROUP BY tipo
ORDER BY tipo;

-- ==========================================
-- PARA VINCULAR BEBIDAS A UM EVENTO:
-- 
-- 1. Primeiro, pegue o ID de um evento:
--    SELECT id, name FROM events LIMIT 1;
--
-- 2. Depois execute (substitua 'SEU_EVENT_ID'):
--    INSERT INTO event_drinks (event_id, drink_id, preco_evento, destaque)
--    SELECT 
--      'SEU_EVENT_ID',
--      id,
--      CASE 
--        WHEN tipo = 'cerveja' THEN 8.00
--        WHEN tipo = 'vinho' THEN 15.00
--        WHEN tipo = 'drink' THEN 18.00
--        WHEN tipo = 'destilado' THEN 12.00
--        WHEN tipo = 'nao_alcoolico' THEN 5.00
--      END as preco_evento,
--      nome IN ('Heineken', 'Caipirinha', 'Gin Tônica') as destaque
--    FROM drinks
--    WHERE nome IN (
--      'Heineken', 'Skol', 'Corona',
--      'Caipirinha', 'Mojito', 'Gin Tônica',
--      'Whisky', 'Vodka',
--      'Refrigerante', 'Água Mineral'
--    )
--    AND ativo = true;
-- ==========================================
