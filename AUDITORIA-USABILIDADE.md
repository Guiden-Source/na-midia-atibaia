# 🛡️ CHECKLIST DE USABILIDADE E SEGURANÇA - NA MÍDIA
**Data:** 09/11/2025  
**Status do Deploy:** ✅ Produção ativa em https://na-midia-atibaia.vercel.app/

---

## ✅ JÁ IMPLEMENTADO (PONTOS FORTES)

### Segurança
- ✅ Middleware protegendo rotas `/admin`
- ✅ Rate limiting em actions críticas
- ✅ Validação de dados em server actions
- ✅ Cookies seguros (httpOnly, secure em prod)
- ✅ Variáveis de ambiente protegidas

### Performance
- ✅ PWA com service worker
- ✅ Manifest.json configurado
- ✅ Ícones gerados (16x16 até 512x512)
- ✅ Suspense boundaries para async components
- ✅ Image optimization do Next.js

### UX
- ✅ Loading states em operações assíncronas
- ✅ Toasts para feedback ao usuário
- ✅ Mensagens de erro traduzidas
- ✅ Responsividade mobile
- ✅ Animações com framer-motion

---

## ⚠️ MELHORIAS CRÍTICAS RECOMENDADAS

### 1. 🚨 **PRIORIDADE MÁXIMA**

#### 1.1 Adicionar variáveis de ambiente faltantes no Vercel
**Problema:** `SUPABASE_SERVICE_ROLE_KEY` pode estar faltando  
**Impacto:** Operações server-side podem falhar silenciosamente

**Como verificar:**
```bash
# No Vercel Dashboard:
https://vercel.com/guiden-sources-projects/na-midia/settings/environment-variables

# Deve ter TODAS estas variáveis:
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✗ SUPABASE_SERVICE_ROLE_KEY (VERIFICAR!)
✓ NEXT_PUBLIC_SITE_URL
□ NEXT_PUBLIC_ONESIGNAL_APP_ID (opcional)
□ ONESIGNAL_REST_API_KEY (opcional)
```

#### 1.2 Validar lista de admins
**Arquivo:** `app/admin/page.tsx`
```typescript
const ADMIN_EMAILS = [
  'guidjvb@gmail.com',
  'admin@namidia.com.br',
  // ⚠️ ADICIONAR MAIS EMAILS CONFORME NECESSÁRIO
];
```

**Ação:** Confirmar se estes são os únicos admins ou adicionar mais.

---

### 2. 🔧 **ALTA PRIORIDADE**

#### 2.1 Melhorar tratamento de imagens quebradas
**Problema atual:** Se evento não tem imagem, mostra placeholder genérico

**Solução recomendada:**
```typescript
// components/EventCard.tsx e app/evento/[id]/page.tsx
// Adicionar onError fallback mais robusto:

<Image
  src={imageUrl}
  alt={`Imagem do evento ${event.name}`}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 800px"
  priority
  onError={(e) => {
    e.currentTarget.src = '/placeholder-event.jpg';
    e.currentTarget.onerror = null; // Evitar loop infinito
  }}
/>
```

#### 2.2 Adicionar limites de tentativas para confirmação de presença
**Problema:** Usuário pode clicar múltiplas vezes rapidamente

**Arquivo:** `app/evento/[id]/page.tsx`
```typescript
// Adicionar debounce ou disabled state durante o processamento
const [isConfirming, setIsConfirming] = useState(false);

const handleConfirmPresence = async () => {
  if (isConfirming) return; // Prevenir cliques múltiplos
  setIsConfirming(true);
  try {
    // ... lógica atual
  } finally {
    setIsConfirming(false);
  }
};
```

#### 2.3 Validar cupons expirados
**Problema:** Não há lógica para expirar cupons automaticamente

**Recomendação:**
```sql
-- Adicionar coluna expires_at na tabela coupons
ALTER TABLE coupons ADD COLUMN expires_at TIMESTAMP;

-- Criar função para expirar cupons automaticamente
CREATE OR REPLACE FUNCTION expire_old_coupons()
RETURNS void AS $$
BEGIN
  UPDATE coupons
  SET is_used = true
  WHERE expires_at < NOW() AND is_used = false;
END;
$$ LANGUAGE plpgsql;

-- Agendar execução diária no Supabase (Database > Functions > Cron Jobs)
```

#### 2.4 Adicionar página de erro 500 customizada
**Arquivo a criar:** `app/error.tsx` (já existe, mas verificar se está completo)

---

### 3. 📊 **MÉDIA PRIORIDADE**

#### 3.1 Analytics e Monitoramento
**Ferramentas recomendadas:**
- [ ] Vercel Analytics (já incluído automaticamente)
- [ ] Sentry para error tracking
- [ ] PostHog ou Mixpanel para user analytics

**Instalação Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

#### 3.2 Logs estruturados
**Problema:** Console.log em produção não é ideal

**Solução:**
```typescript
// lib/logger.ts
export const logger = {
  info: (msg: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️', msg, meta);
    }
    // Em produção, enviar para serviço de logging
  },
  error: (msg: string, error?: any) => {
    console.error('❌', msg, error);
    // Enviar para Sentry ou similar
  },
  warn: (msg: string, meta?: any) => {
    console.warn('⚠️', msg, meta);
  }
};
```

#### 3.3 Testes básicos
**Arquivo a criar:** `__tests__/critical-flows.test.ts`
```typescript
// Testar fluxos críticos:
// 1. Confirmação de presença
// 2. Geração de cupom
// 3. Validação de cupom
// 4. Criação de evento (admin)
```

---

### 4. 🎨 **BAIXA PRIORIDADE (UX)**

#### 4.1 Skeleton loaders
Substituir spinners genéricos por skeletons nas listagens

#### 4.2 Modo offline
Melhorar experiência quando não há conexão:
```typescript
// service worker já existe, mas adicionar:
// - Página offline customizada
// - Queue de ações para sincronizar quando voltar online
```

#### 4.3 Push notifications testing
Criar página de debug para testar notificações:
```
/admin/notificacoes-teste
```

#### 4.4 Acessibilidade (ARIA)
- Adicionar `aria-label` em botões sem texto
- Testar navegação por teclado
- Verificar contraste de cores (WCAG AA)

---

## 🧪 TESTES MANUAIS CRÍTICOS

### Checklist para testar agora:

#### Fluxo do usuário normal:
1. [ ] Acessar home sem estar logado
2. [ ] Clicar em um evento
3. [ ] Tentar confirmar presença (deve pedir login)
4. [ ] Criar conta
5. [ ] Confirmar presença
6. [ ] Verificar se cupom foi gerado
7. [ ] Ver cupons em /cupons ou /perfil/cupons
8. [ ] Mostrar QR Code

#### Fluxo admin:
1. [ ] Acessar /admin sem estar logado (deve redirecionar)
2. [ ] Logar com email admin
3. [ ] Criar novo evento
4. [ ] Editar evento existente
5. [ ] Ver analytics
6. [ ] Validar cupom em /validar-cupom

#### Edge cases:
1. [ ] Tentar confirmar presença 2x no mesmo evento
2. [ ] Acessar evento com ID inválido
3. [ ] Carregar página sem conexão
4. [ ] Usar em mobile (iOS e Android)
5. [ ] Testar com Lighthouse (performance)

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

### Para fazer HOJE:
1. ✅ Verificar variáveis de ambiente no Vercel
2. ⚠️ Testar fluxo completo de confirmação de presença
3. ⚠️ Testar criação de evento (verificar se notificação funciona)
4. ⚠️ Verificar se cupons aparecem corretamente

### Para fazer esta SEMANA:
1. Adicionar Sentry para error tracking
2. Criar testes automatizados básicos
3. Implementar expiração de cupons
4. Adicionar mais validações de formulário
5. Melhorar tratamento de imagens quebradas

### Para fazer este MÊS:
1. Analytics completo (PostHog ou similar)
2. Sistema de logs estruturado
3. Página de status/health check
4. Documentação para usuários
5. Tutorial de primeiro uso

---

## 🔗 RECURSOS ÚTEIS

### Monitoramento:
- Vercel Dashboard: https://vercel.com/guiden-sources-projects/na-midia
- Supabase Dashboard: https://supabase.com/dashboard
- OneSignal Dashboard: https://onesignal.com/

### Performance:
- Lighthouse: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/

### Segurança:
- Security Headers: https://securityheaders.com/
- SSL Labs: https://www.ssllabs.com/ssltest/

---

## ⚡ COMANDOS RÁPIDOS

```bash
# Rodar build local para testar
npm run build
npm run start

# Rodar Lighthouse
npx lighthouse https://na-midia-atibaia.vercel.app/ --view

# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar problemas de ESLint
npm run lint

# Testar PWA
# Chrome DevTools > Application > Service Workers
# Application > Manifest
```

---

**Última atualização:** 09/11/2025  
**Próxima revisão:** Após implementar melhorias críticas
