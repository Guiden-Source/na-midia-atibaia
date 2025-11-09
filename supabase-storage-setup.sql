-- Script SQL para criar o bucket de armazenamento de mídia de eventos no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar o bucket público para event-media
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-media', 'event-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurar políticas de acesso (RLS)

-- Permitir SELECT público (qualquer um pode visualizar)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-media' );

-- Permitir INSERT apenas para usuários autenticados (admins)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-media' 
  AND auth.role() = 'authenticated'
);

-- Permitir UPDATE apenas para usuários autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'event-media' 
  AND auth.role() = 'authenticated'
);

-- Permitir DELETE apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'event-media' 
  AND auth.role() = 'authenticated'
);

-- 3. Configurar CORS (se necessário)
-- Você pode precisar configurar isso manualmente no painel do Supabase
-- Vá em: Storage > Configuration > CORS
-- Adicione: http://localhost:3000 e seu domínio de produção

-- 4. Verificar se o bucket foi criado corretamente
SELECT * FROM storage.buckets WHERE id = 'event-media';
