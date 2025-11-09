# 📸 Sistema de Upload de Mídia para Eventos

## ✨ O que foi implementado

Sistema completo de upload de imagens e vídeos para eventos usando Supabase Storage.

### 🎯 Funcionalidades

- ✅ Upload de imagens (WebP, JPG, PNG - máx 5MB)
- ✅ Upload de vídeos (MP4, WebM - máx 50MB)
- ✅ Preview em tempo real
- ✅ Progresso de upload visual
- ✅ Remoção de mídia
- ✅ Suporte a vídeo de fundo nos cards de eventos
- ✅ Fallback para gradiente caso não haja mídia
- ✅ Validação de tamanho e tipo de arquivo

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
1. **`components/admin/MediaUpload.tsx`** - Componente de upload
2. **`supabase-storage-setup.sql`** - Script de configuração do Supabase

### Arquivos Modificados
1. **`app/admin/criar/page.tsx`** - Refatorado para usar upload
2. **`components/EventBentoGrid.tsx`** - Suporte a vídeos de fundo
3. **`next.config.mjs`** - Configuração de domínios de imagem

## 🚀 Como Usar

### 1. Configurar Supabase Storage

Acesse o SQL Editor do seu projeto Supabase e execute:

```bash
# Copie o conteúdo de supabase-storage-setup.sql e execute no SQL Editor
```

Ou manualmente:

1. Vá em **Storage** no painel do Supabase
2. Clique em **Create bucket**
3. Nome: `event-media`
4. **Public bucket**: ✅ Sim
5. **File size limit**: 52428800 (50MB)
6. Clique em **Save**

### 2. Configurar Políticas (RLS)

No painel Storage > Policies, adicione:

**SELECT (visualização pública):**
```sql
bucket_id = 'event-media'
```

**INSERT/UPDATE/DELETE (apenas autenticados):**
```sql
bucket_id = 'event-media' AND auth.role() = 'authenticated'
```

### 3. Usar no Admin

1. Acesse `/admin/criar` ou `/admin/editar/[id]`
2. Verá o componente de upload de mídia
3. Clique ou arraste arquivos para fazer upload
4. Aguarde o progresso (0-100%)
5. Preview aparece automaticamente
6. Botão X para remover

## 🎨 Como Funciona

### Upload Flow

```
1. Usuário seleciona arquivo
2. Validação (tamanho + tipo)
3. Upload para Supabase Storage
4. URL pública gerada
5. URL salva no banco de dados (events.image_url)
6. Preview/Vídeo aparece no card do evento
```

### Estrutura de Pastas no Storage

```
event-media/
  └── events/
      ├── abc123-1699876543210.webp
      ├── def456-1699876543211.mp4
      └── ghi789-1699876543212.jpg
```

### Tipos de Mídia Suportados

**Imagens:**
- WebP (recomendado - melhor compressão)
- JPG/JPEG
- PNG
- Tamanho máximo: 5MB

**Vídeos:**
- MP4 (recomendado)
- WebM
- Tamanho máximo: 50MB

## 🎥 Vídeo de Fundo

Os vídeos tocam automaticamente nos cards de eventos:
- `autoPlay`: ✅
- `loop`: ✅
- `muted`: ✅
- `playsInline`: ✅

## 🔧 Componente MediaUpload

### Props

```typescript
interface MediaUploadProps {
  value?: string | null;        // URL atual da mídia
  onChange: (url: string) => void; // Callback quando nova mídia é carregada
  onRemove: () => void;          // Callback quando mídia é removida
  accept?: 'image' | 'video' | 'both'; // Tipos aceitos
  label?: string;                // Label personalizado
}
```

### Exemplo de Uso

```tsx
import { MediaUpload } from '@/components/admin/MediaUpload';

const [mediaUrl, setMediaUrl] = useState('');

<MediaUpload
  value={mediaUrl}
  onChange={setMediaUrl}
  onRemove={() => setMediaUrl('')}
  accept="both"
  label="Imagem ou Vídeo do Evento"
/>
```

## 🌐 URLs Públicas

URLs geradas seguem o padrão:
```
https://[seu-projeto].supabase.co/storage/v1/object/public/event-media/events/[arquivo]
```

## ⚡ Performance

### Otimizações Implementadas

1. **Lazy Loading**: Imagens carregam sob demanda
2. **Video Autoplay**: Vídeos começam mutados
3. **Fallback Gradient**: Mostrado enquanto carrega
4. **Error Handling**: Gradiente se mídia falhar

### Recomendações

- Use WebP para imagens (melhor compressão)
- Comprima vídeos antes do upload
- Mantenha vídeos abaixo de 20MB para melhor performance
- Use ferramentas como:
  - **Imagens**: TinyPNG, Squoosh
  - **Vídeos**: Handbrake, FFmpeg

## 🐛 Solução de Problemas

### Erro: "Failed to upload"

**Causa**: Bucket não existe ou políticas RLS incorretas

**Solução**:
1. Verifique se o bucket `event-media` existe
2. Confirme que é público
3. Revise as políticas RLS

### Erro: "File too large"

**Causa**: Arquivo excede limite

**Solução**:
- Imagens: Comprima para < 5MB
- Vídeos: Comprima para < 50MB

### Erro: "Invalid file type"

**Causa**: Tipo de arquivo não suportado

**Solução**:
- Use apenas: WebP, JPG, PNG, MP4, WebM

### Vídeo não toca

**Causa**: Formato incompatível ou muito pesado

**Solução**:
- Converta para MP4 H.264
- Reduza resolução para 1080p
- Comprima para < 20MB

## 📊 Limites

| Recurso | Limite |
|---------|--------|
| Tamanho imagem | 5 MB |
| Tamanho vídeo | 50 MB |
| Supabase Free Tier | 1 GB storage total |
| Uploads simultâneos | 1 por vez |

## 🔐 Segurança

- ✅ Upload apenas por usuários autenticados
- ✅ Validação de tipo de arquivo no cliente
- ✅ Validação de tamanho no cliente
- ✅ Nomes únicos gerados automaticamente
- ✅ Políticas RLS no servidor

## 📱 Responsividade

O componente é totalmente responsivo:
- Mobile: Preview em tela cheia
- Tablet: Preview médio
- Desktop: Preview grande

## 🎯 Próximos Passos

### Para adicionar na página de Editar

1. Importe o componente:
```tsx
import { MediaUpload } from '@/components/admin/MediaUpload';
```

2. Adicione ao formulário (antes dos campos):
```tsx
<div className="md:col-span-2">
  <MediaUpload
    value={formData.image_url}
    onChange={(url) => setFormData({ ...formData, image_url: url })}
    onRemove={() => setFormData({ ...formData, image_url: '' })}
    accept="both"
  />
</div>
```

### Melhorias Futuras

- [ ] Múltiplas imagens por evento
- [ ] Crop de imagem antes do upload
- [ ] Thumbnail automático para vídeos
- [ ] CDN para melhor performance
- [ ] Compression no servidor
- [ ] Galeria de imagens reutilizáveis

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador
2. Verifique o console do Supabase
3. Teste manualmente no Storage do Supabase
4. Revise as políticas RLS

---

**Desenvolvido para Na Mídia - Plataforma de Eventos Atibaia** 🎉
