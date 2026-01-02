-- =================================================================
-- FIX: TABLE PERMISSIONS (GRANTS)
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Garantir que o role 'authenticated' tenha permissão de escrita/leitura
--           tabelas criadas via SQL às vezes perdem os GRANTS padrões.
-- =================================================================

-- 1. Grant permissions on PROFILES
GRANT ALL ON TABLE public.profiles TO postgres;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO anon; -- (Opcional, mas útil para leitura pública se precisar)

-- 2. Grant permissions on DELIVERY_ORDERS
GRANT ALL ON TABLE public.delivery_orders TO postgres;
GRANT ALL ON TABLE public.delivery_orders TO service_role;
GRANT ALL ON TABLE public.delivery_orders TO authenticated;
GRANT ALL ON TABLE public.delivery_orders TO anon; -- Necessário para criar pedidos sem login

-- 3. Grant permissions on DELIVERY_ORDER_ITEMS
GRANT ALL ON TABLE public.delivery_order_items TO postgres;
GRANT ALL ON TABLE public.delivery_order_items TO service_role;
GRANT ALL ON TABLE public.delivery_order_items TO authenticated;
GRANT ALL ON TABLE public.delivery_order_items TO anon;

-- 4. EMERGENCY POLICY (Se o RLS estrito estiver bloqueando creation)
-- Se a policy anterior "Users can insert own profile" estiver falhando, esta é mais permissiva
-- Apenas para confirmar se o problema é a checagem de ID

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = id );

-- Permitir UPDATE também
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id );
