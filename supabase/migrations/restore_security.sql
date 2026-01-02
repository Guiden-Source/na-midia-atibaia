-- =================================================================
-- RESTORE SECURITY (PRODUCTION READY)
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Reativar a segurança (RLS) que foi desligada para teste.
--           Agora sabemos que o banco está acessível, vamos aplicar a regra correta.
-- =================================================================

-- 1. Reativar RLS na tabela profiles (Trancar a porta novamente)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Limpar todas as policies antigas/temporárias para começar limpo
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all auth users" ON public.profiles;

-- 3. Criar Policies Seguras (Padrão Ouro)

-- LEITURA: Usuário vê seu próprio perfil (e opcionalmente admin)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- INSERT: Usuário cria seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- UPDATE: Usuário atualiza seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Opcional: Permitir leitura pública APENAS se necessário (ex: avatars publicos)
-- Se não precisar, mantenha comentado.
-- CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
