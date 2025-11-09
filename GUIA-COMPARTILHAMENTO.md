# 📱 Sistema de Compartilhamento Social

Sistema completo de compartilhamento de eventos nas redes sociais com Open Graph e Twitter Cards.

## ✨ Funcionalidades

### 1. **Botão de Compartilhamento**
- ✅ Compartilhar via Web Share API (mobile)
- ✅ Menu com opções para desktop
- ✅ WhatsApp (link direto)
- ✅ Instagram (copiar link)
- ✅ Facebook (janela de compartilhamento)
- ✅ Twitter (tweet pré-formatado)
- ✅ Copiar link para área de transferência

### 2. **Open Graph Tags (Facebook, LinkedIn, WhatsApp)**
Quando alguém compartilha um link do evento, aparecem:
- 🖼️ Imagem do evento (ou imagem OG dinâmica)
- 📝 Título com nome e data do evento
- 📄 Descrição do evento
- 🔗 URL do evento
- 🏷️ Metadata (locale, site_name, etc.)

### 3. **Twitter Cards**
Preview especial para Twitter com:
- 🖼️ Card tipo "summary_large_image"
- 📝 Título otimizado
- 📄 Descrição concisa
- 🖼️ Imagem em destaque

### 4. **Imagens OG Dinâmicas**
Se o evento não tiver imagem, gera automaticamente uma arte com:
- 🎨 Gradiente laranja/rosa (cores da marca)
- 🏷️ Badge com tipo do evento
- 📝 Nome do evento em destaque
- 📅 Data formatada
- 📍 Local do evento
- 💎 Design profissional e atrativo

## 🏗️ Arquitetura

### Componentes

**`components/ShareButton.tsx`**
- Botão principal de compartilhamento
- Detecta suporte a Web Share API
- Menu dropdown com todas as opções
- Feedback visual (toast notifications)

**`app/api/og/route.tsx`**
- Endpoint para gerar imagens OG dinâmicas
- Usa Next.js `ImageResponse`
- Runtime: Edge (super rápido)
- Tamanho: 1200x630px (padrão OG)

### Metadata

**`app/evento/[id]/page.tsx`**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Carrega dados do evento
  // Gera metadata dinâmica
  // Retorna Open Graph e Twitter Cards
}
```

## 🎨 Exemplo de Preview

### WhatsApp / Facebook
```
┌─────────────────────────────────────┐
│  [Imagem do Evento - 1200x630]     │
├─────────────────────────────────────┤
│ Show na Praça - 15 de Nov | Na Mídia│
├─────────────────────────────────────┤
│ Show em Praça da Matriz. Confirme   │
│ presença e ganhe cupons de bebida!  │
└─────────────────────────────────────┘
```

### Twitter
```
┌─────────────────────────────────────┐
│  [Imagem Grande - Card]             │
├─────────────────────────────────────┤
│ Show na Praça - 15 de Nov           │
│ Show em Praça da Matriz...          │
│ 🔗 namidia.com.br                   │
└─────────────────────────────────────┘
```

## 🚀 Como Usar

### Para Usuários

1. **Abra um evento** qualquer
2. **Clique em "Compartilhar"**
3. **Escolha a rede social:**
   - Mobile: menu nativo do sistema
   - Desktop: menu com ícones coloridos
4. **Pronto!** O link é compartilhado com preview bonito

### Para Admins

Ao criar/editar eventos:
- ✅ Faça upload de uma **imagem atrativa** (1200x630 recomendado)
- ✅ Escreva uma **descrição envolvente**
- ✅ O sistema cria automaticamente as tags OG

Se não houver imagem:
- 🎨 Sistema gera arte automática com gradiente
- 📝 Usa dados do evento (nome, data, local)
- ✨ Resultado profissional garantido

## 🧪 Testar Previews

### Facebook Debugger
1. Acesse: https://developers.facebook.com/tools/debug/
2. Cole a URL do evento
3. Clique em "Buscar novas informações"
4. Veja o preview

### Twitter Card Validator
1. Acesse: https://cards-dev.twitter.com/validator
2. Cole a URL do evento
3. Veja o preview do card

### LinkedIn Inspector
1. Acesse: https://www.linkedin.com/post-inspector/
2. Cole a URL do evento
3. Veja o preview

## 📊 Metadata Padrão

### Página Principal (`layout.tsx`)
```typescript
{
  title: 'Na Mídia - Eventos em Atibaia | Ganhe Cupons de Bebida',
  description: 'Descubra os melhores eventos...',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://namidia.com.br',
    images: ['/og-image.png']
  }
}
```

### Páginas de Evento (dinâmico)
```typescript
{
  title: '[Nome do Evento] - [Data] | Na Mídia',
  description: '[Descrição do evento]',
  openGraph: {
    type: 'website',
    images: [evento.image_url || '/api/og?...']
  },
  twitter: {
    card: 'summary_large_image',
    images: [...]
  }
}
```

## 🎯 Melhores Práticas

### Imagens
- ✅ Tamanho ideal: **1200x630px**
- ✅ Formato: WebP, JPG ou PNG
- ✅ Tamanho máximo: **5MB**
- ✅ Evite textos pequenos (ficam ilegíveis no preview)
- ✅ Use cores vibrantes

### Títulos
- ✅ Máximo: **60 caracteres** (Twitter)
- ✅ Inclua data e local
- ✅ Seja claro e direto

### Descrições
- ✅ Máximo: **155 caracteres** (preview)
- ✅ Inclua call-to-action
- ✅ Mencione benefícios (cupons)

## 🔧 Troubleshooting

### Preview não aparece no WhatsApp
- Aguarde 5-10 minutos (cache)
- Teste com link diferente
- Verifique se imagem é pública

### Preview não atualiza
- Use Facebook Debugger para limpar cache
- Adicione `?v=2` no final da URL
- Aguarde propagação do CDN

### Imagem OG dinâmica não carrega
- Verifique logs do servidor
- Confirme que `/api/og` está acessível
- Teste diretamente: `http://localhost:3001/api/og?title=Teste`

## 📱 Compatibilidade

### Redes Sociais
- ✅ WhatsApp
- ✅ Facebook
- ✅ Instagram (copiar link)
- ✅ Twitter
- ✅ LinkedIn
- ✅ Telegram
- ✅ Discord

### Navegadores
- ✅ Chrome/Edge (Web Share API)
- ✅ Safari iOS (Web Share API)
- ✅ Firefox (menu manual)
- ✅ Todos os modernos (fallback)

## 🎨 Customização

### Mudar Cores do Gradiente OG
Edite `app/api/og/route.tsx`:
```typescript
background: 'linear-gradient(135deg, #SUA_COR1 0%, #SUA_COR2 100%)'
```

### Adicionar Logo na Imagem OG
Adicione na rota OG:
```typescript
<img src="URL_DO_LOGO" style={{ width: 200 }} />
```

### Mudar Texto do Compartilhamento
Edite em `app/evento/[id]/page.tsx`:
```typescript
<ShareButton
  text="Seu texto customizado aqui!"
/>
```

## 📈 Próximas Melhorias

- [ ] Analytics de compartilhamentos
- [ ] Compartilhamento com imagem personalizada por usuário
- [ ] Deep links para apps móveis
- [ ] Preview ao vivo antes de compartilhar
- [ ] QR Code para compartilhamento offline

---

**Dúvidas?** Consulte a documentação do Next.js sobre [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata).
