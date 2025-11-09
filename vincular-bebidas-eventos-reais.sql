-- ====================================
-- VINCULAR BEBIDAS AOS EVENTOS REAIS
-- ====================================

-- PASSO 1: Verificar eventos ativos
SELECT id, nome, start_time 
FROM events 
WHERE is_active = true 
ORDER BY start_time;

-- ====================================
-- PASSO 2: Remover evento de teste (se desejar)
-- ====================================
-- DELETE FROM events WHERE id = '44a1d2dc-6970-42dc-a13a-d71bb46de3a8';


-- ====================================
-- PASSO 3: Vincular bebidas aos eventos reais
-- ====================================

-- Exemplo: Substitua 'SEU_EVENT_ID_AQUI' pelos IDs reais dos seus eventos
-- Você pode adicionar diferentes seleções de bebidas para cada tipo de evento

-- EVENTO SERTANEJO - Mix de cervejas, drinks e destilados
-- Substitua 'SEU_EVENT_ID_SERTANEJO' pelo ID real
/*
INSERT INTO event_drinks (event_id, drink_id, disponivel, preco_evento, destaque)
VALUES
  -- Cervejas populares
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Heineken'), true, 15.00, true),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Stella Artois'), true, 16.00, false),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Corona Extra'), true, 16.00, false),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Budweiser'), true, 12.00, false),
  
  -- Drinks e coquetéis
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Caipirinha'), true, 18.00, true),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Mojito'), true, 20.00, false),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Gin Tônica'), true, 22.00, false),
  
  -- Destilados
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Whisky Jack Daniels'), true, 35.00, false),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Vodka Absolut'), true, 28.00, false),
  
  -- Não alcoólicos
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Coca-Cola'), true, 8.00, false),
  ('SEU_EVENT_ID_SERTANEJO', (SELECT id FROM drinks WHERE nome = 'Red Bull'), true, 15.00, false);
*/

-- EVENTO PAGODE - Foco em cervejas e caipirinhas
/*
INSERT INTO event_drinks (event_id, drink_id, disponivel, preco_evento, destaque)
VALUES
  -- Cervejas
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Heineken'), true, 15.00, true),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Brahma'), true, 10.00, false),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Skol'), true, 10.00, false),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Corona Extra'), true, 16.00, false),
  
  -- Drinks típicos
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Caipirinha'), true, 18.00, true),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Caipiroska'), true, 18.00, false),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Batida de Limão'), true, 16.00, false),
  
  -- Destilados
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Cachaça Artesanal'), true, 12.00, false),
  
  -- Não alcoólicos
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Coca-Cola'), true, 8.00, false),
  ('SEU_EVENT_ID_PAGODE', (SELECT id FROM drinks WHERE nome = 'Água de Coco'), true, 10.00, false);
*/

-- EVENTO SOFISTICADO (Ex: Fine Dining, Jazz) - Vinhos e drinks premium
/*
INSERT INTO event_drinks (event_id, drink_id, disponivel, preco_evento, destaque)
VALUES
  -- Vinhos
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Vinho Tinto Malbec'), true, 45.00, true),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Vinho Branco Chardonnay'), true, 42.00, false),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Espumante Chandon'), true, 50.00, true),
  
  -- Drinks premium
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Negroni'), true, 28.00, false),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Old Fashioned'), true, 32.00, false),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Gin Tônica'), true, 25.00, false),
  
  -- Destilados premium
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Whisky Jack Daniels'), true, 40.00, false),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Gin Tanqueray'), true, 35.00, false),
  
  -- Não alcoólicos sofisticados
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Suco Natural Detox'), true, 15.00, false),
  ('SEU_EVENT_ID_SOFISTICADO', (SELECT id FROM drinks WHERE nome = 'Limonada Suíça'), true, 12.00, false);
*/

-- ====================================
-- PASSO 4: Verificar bebidas vinculadas
-- ====================================
SELECT 
  e.nome AS evento,
  d.nome AS bebida,
  d.tipo,
  ed.preco_evento,
  ed.destaque,
  ed.disponivel
FROM event_drinks ed
JOIN events e ON ed.event_id = e.id
JOIN drinks d ON ed.drink_id = d.id
WHERE e.is_active = true
ORDER BY e.nome, d.tipo, d.nome;

-- ====================================
-- DICAS:
-- ====================================
-- 1. Execute o PASSO 1 para ver os IDs dos eventos
-- 2. Copie os IDs reais e substitua 'SEU_EVENT_ID_AQUI' nos exemplos acima
-- 3. Descomente (remova /*  */) o bloco do evento que deseja vincular
-- 4. Ajuste os preços conforme necessário
-- 5. Execute o script modificado
-- 6. Use o PASSO 4 para verificar as vinculações
