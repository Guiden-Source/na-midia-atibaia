-- ==============================================================================
-- FIX: PERMISSÕES DE PERFIL (RLS) - Versão Corrigida
-- Descrição: Libera UPDATE e INSERT na tabela 'profiles' para o próprio usuário.
-- ==============================================================================

-- 1. Habilita RLS (garantia)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Remove políticas antigas que possam estar bloqueando ou duplicadas
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Individuals can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Individuals can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles; -- Remove a regra quebrada

-- 3. Cria política para ATUALIZAR (UPDATE)
-- Permite que o usuário altere linhas onde o ID dele bate com o auth.uid()
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Cria política para INSERIR (INSERT)
-- Permite que o usuário crie seu perfil se não existir
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. Garante Leitura (SELECT)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
