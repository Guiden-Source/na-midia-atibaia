-- =================================================================
-- FIX: SECURITY & RLS POLICIES (EMERGENCY)
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Corrigir erro de permissão (42501) e vazamento de dados
-- =================================================================

-- 1. PROFILES: Corrigir erro de inserção/atualização
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Limpar policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Criar policies corretas
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Permitir que Admins (ou Service Role) gerenciem tudo (opcional, mas útil)
-- Ajuste para seu email de admin se necessário
-- CREATE POLICY "Admins can manage profiles"
--   ON public.profiles FOR ALL
--   USING ( auth.jwt() ->> 'email' = 'guidjvb@gmail.com' );


-- 2. DELIVERY_ORDERS: Corrigir vazamento de dados (Users vendo tudo)
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;

-- Limpar policies antigas (que estavam permissivas demais ou quebradas)
DROP POLICY IF EXISTS "Usuários veem seus próprios pedidos" ON public.delivery_orders;
DROP POLICY IF EXISTS "Qualquer um pode criar pedido" ON public.delivery_orders;
DROP POLICY IF EXISTS "Public view" ON public.delivery_orders;
DROP POLICY IF EXISTS "Authenticated users can see all" ON public.delivery_orders;

-- Policy de Leitura: Usuário vê SOMENTE seus pedidos (pelo ID de autenticação)
CREATE POLICY "Users view own orders"
  ON public.delivery_orders FOR SELECT
  USING (
    auth.uid() = user_id
    -- Opcional: manter compatibilidade com email/phone se não tiver user_id vinculado na criação
    -- OR user_email = auth.jwt() ->> 'email'
  );

-- Policy de Criação: Qualquer um (mesmo anonimo) pode criar pedidos
CREATE POLICY "Anyone can create orders"
  ON public.delivery_orders FOR INSERT
  WITH CHECK (true);

-- Policy de Admin: Visualizar TUDO (Dashboard)
-- Substitua pelo seu e-mail de admin real
CREATE POLICY "Admin full access"
  ON public.delivery_orders FOR ALL
  USING (
    auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com')
  );


-- 3. DELIVERY_ORDER_ITEMS: Acesso em cascata
ALTER TABLE public.delivery_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem itens de seus pedidos" ON public.delivery_order_items;
DROP POLICY IF EXISTS "Qualquer um pode criar itens" ON public.delivery_order_items;

CREATE POLICY "Users view own order items"
  ON public.delivery_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.delivery_orders
      WHERE delivery_orders.id = delivery_order_items.order_id
      AND delivery_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create order items"
  ON public.delivery_order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin full access items"
  ON public.delivery_order_items FOR ALL
  USING (
    auth.jwt() ->> 'email' IN ('guidjvb@gmail.com', 'admin@namidia.com')
  );

-- =================================================================
-- FIM DA CORREÇÃO
-- =================================================================
