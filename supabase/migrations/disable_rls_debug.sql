-- =================================================================
-- DEBUG NUCLEAR: DISABLE RLS (PROFILES)
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Identificar se o erro é realmente RLS ou outra coisa.
--           ATENÇÃO: ISSO DEIXA A TABELA PÚBLICA TEMPORARIAMENTE.
-- =================================================================

-- 1. Desabilitar RLS completamente na tabela profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Garantir permissões de escrita para roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

-- 3. Remover Trigger de verificação se existir (opcional, só se tiver constraints via trigger)
-- DROP TRIGGER IF EXISTS check_profile_owner ON public.profiles;

-- SE APÓS RODAR ISSO O ERRO CONTINUAR, O PROBLEMA NÃO É RLS!
-- Pode ser:
-- a) O Supabase Client no frontend não está mandando o token (Role = none?)
-- b) Trigger na tabela 'auth.users' interferindo (improvável no update de profile)
-- c) Constraint Check (ex: char_length)
