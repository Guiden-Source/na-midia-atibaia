-- =================================================================
-- FIX: BACKFILL MISSING PROFILES
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Criar linhas na tabela 'profiles' para usuários que já existem
--           no 'auth.users' mas não têm perfil público (o que causa erros ou updates vazios).
-- =================================================================

INSERT INTO public.profiles (id, full_name, whatsapp)
SELECT 
    id, 
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'whatsapp' -- Tenta pegar dos metadados se existir
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Garantir que todos tenham pelo menos nome 'Usuario' se estiver null
UPDATE public.profiles
SET full_name = 'Cliente'
WHERE full_name IS NULL OR full_name = '';
