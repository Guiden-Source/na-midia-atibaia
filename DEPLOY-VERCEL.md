# 🚀 Guia de Deploy na Vercel - Na Mídia

## ✅ Checklist Pré-Deploy

Antes de fazer o deploy, certifique-se de que:

- [x] Todos os arquivos estão salvos
- [x] `.gitignore` criado
- [x] Variáveis de ambiente preparadas
- [x] Build local funciona (`npm run build`)
- [ ] Git inicializado
- [ ] Repositório no GitHub
- [ ] Conta Vercel criada

---

## 📋 Passo a Passo Completo

### **Etapa 1: Preparar Variáveis de Ambiente**

Você vai precisar dessas variáveis na Vercel:

#### **Supabase** (obrigatório):
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...sua-service-role-key
```

#### **OneSignal** (para notificações push):
```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=seu-app-id-onesignal
ONESIGNAL_REST_API_KEY=sua-rest-api-key
```

#### **Site URL** (após deploy):
```env
NEXT_PUBLIC_SITE_URL=https://namidia.vercel.app
```

**📝 Copie suas chaves agora e tenha em mãos!**

---

### **Etapa 2: Inicializar Git e GitHub**

```bash
# 1. Inicializar Git
cd "/Users/guilhermebrandao/Desktop/Na Midia - Plataforma de Atibaia/na-midia"
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Primeiro commit
git commit -m "🚀 Initial commit - Na Mídia Platform

- Sistema de eventos
- Analytics dashboard
- Push notifications (OneSignal)
- Sistema de cupons com QR Code
- PWA completo com ícones
- Service Worker configurado"

# 4. Criar repositório no GitHub
# Vá para: https://github.com/new
# Nome: na-midia-atibaia
# Descrição: Plataforma de eventos e cupons em Atibaia
# Privado ou Público: Escolha
# NÃO adicione README, .gitignore ou licença (já temos)

# 5. Conectar ao GitHub (substitua SEU-USUARIO)
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/na-midia-atibaia.git
git push -u origin main
```

---

### **Etapa 3: Deploy na Vercel**

#### **Opção A: Via Site (Recomendado para primeira vez)**

1. **Acesse:** https://vercel.com
2. **Login:** Use GitHub (mais fácil)
3. **New Project:** Clique em "Add New..." → "Project"
4. **Import Repository:**
   - Selecione "na-midia-atibaia"
   - Clique "Import"
5. **Configure Project:**
   ```
   Framework Preset: Next.js (detectado automaticamente)
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
6. **Environment Variables:** Clique em "Add" e adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
   SUPABASE_SERVICE_ROLE_KEY = eyJ...
   NEXT_PUBLIC_ONESIGNAL_APP_ID = xxx (opcional agora)
   ONESIGNAL_REST_API_KEY = xxx (opcional agora)
   NEXT_PUBLIC_SITE_URL = https://seu-projeto.vercel.app
   ```
7. **Deploy:** Clique "Deploy"
8. **Aguarde:** 2-5 minutos ⏳

#### **Opção B: Via CLI (Alternativa)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Responda:
# ? Set up and deploy? [Y/n] y
# ? Which scope? [Seu usuário]
# ? Link to existing project? [N/y] n
# ? What's your project's name? na-midia-atibaia
# ? In which directory is your code located? ./

# 4. Adicionar env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 5. Deploy em produção
vercel --prod
```

---

### **Etapa 4: Configurar Domínio (Opcional)**

#### **Se você tem um domínio:**

1. **Vercel Dashboard** → Seu projeto → Settings → Domains
2. **Add Domain:** `namidia.com.br`
3. **Configurar DNS:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. **Aguardar propagação:** 15 minutos - 48 horas

#### **Se não tem domínio:**

Use o domínio Vercel gratuito:
```
https://na-midia-atibaia.vercel.app
```

Você pode customizar depois em Settings → Domains.

---

### **Etapa 5: Configurar OneSignal (HTTPS obrigatório)**

Após o deploy, configure OneSignal:

1. **Acesse:** https://onesignal.com
2. **Seu App** → Settings → Keys & IDs
3. **Copie:**
   - App ID
   - REST API Key
4. **Volte para Vercel:**
   - Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_ONESIGNAL_APP_ID = xxx
     ONESIGNAL_REST_API_KEY = xxx
     ```
5. **Redeploy:**
   - Deployments → Latest → "Redeploy"

6. **OneSignal → Configuration:**
   - Site URL: `https://seu-projeto.vercel.app`
   - Default Notification Icon: `https://seu-projeto.vercel.app/icon-192.png`
   - Save

---

### **Etapa 6: Atualizar NEXT_PUBLIC_SITE_URL**

Depois que souber a URL final:

1. **Vercel** → Settings → Environment Variables
2. **Editar** `NEXT_PUBLIC_SITE_URL`
3. **Valor:** `https://sua-url-final.vercel.app` (ou domínio customizado)
4. **Redeploy** para aplicar

---

## 🧪 Testes Após Deploy

### **1. Verificar Deploy**
```bash
# Abra a URL
https://seu-projeto.vercel.app

# Ou
vercel --prod
```

### **2. Teste de Funcionalidades**

- [ ] **Homepage carrega**
- [ ] **Login funciona** (Supabase Auth)
- [ ] **Eventos aparecem**
- [ ] **Confirmar presença funciona**
- [ ] **Cupons são gerados**
- [ ] **QR Code é exibido**
- [ ] **Validação de cupom funciona** (`/validar-cupom`)
- [ ] **Analytics dashboard** (`/admin/analytics`)
- [ ] **PWA instalável** (ícone aparece)
- [ ] **Service Worker registrado** (DevTools → Application)
- [ ] **Notificações push** (após configurar OneSignal)

### **3. Lighthouse Audit**

```
1. Abra DevTools (F12)
2. Lighthouse tab
3. Run audit (Mobile + Desktop)
4. Verificar scores:
   - Performance: 80+ ✅
   - SEO: 90+ ✅
   - Best Practices: 90+ ✅
   - PWA: 90+ ✅
```

### **4. Teste PWA Mobile**

**iOS (Safari):**
```
1. Abra: https://seu-projeto.vercel.app
2. Compartilhar → Adicionar à Tela Inicial
3. Abra o app instalado
4. Verifique ícone gradiente
```

**Android (Chrome):**
```
1. Abra: https://seu-projeto.vercel.app
2. Banner "Instalar app" ou Menu → Instalar
3. Confirme instalação
4. Abra o app
```

---

## 🔧 Comandos Úteis Pós-Deploy

### **Ver logs em tempo real:**
```bash
vercel logs seu-projeto.vercel.app --follow
```

### **Redeploy (após mudanças):**
```bash
git add .
git commit -m "feat: descrição da mudança"
git push

# Deploy automático! ✨
# Ou manualmente:
vercel --prod
```

### **Ver todas as deployments:**
```bash
vercel ls
```

### **Rollback (voltar para versão anterior):**
```bash
# Vercel Dashboard → Deployments → Escolha versão → Promote to Production
```

---

## 🐛 Troubleshooting

### **Build falha na Vercel?**

**Erro comum:** TypeScript errors

**Solução:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true, // Adicione isso
    // ... resto
  }
}
```

**Ou temporariamente:**
```json
// next.config.js
module.exports = {
  typescript: {
    ignoreBuildErrors: true // Use com cuidado!
  }
}
```

### **Variáveis de ambiente não funcionam?**

1. Verifique se começam com `NEXT_PUBLIC_` (para client-side)
2. Redeploy após adicionar novas vars
3. Verifique em Settings → Environment Variables
4. Teste localmente com `.env.local` primeiro

### **Imagens não carregam?**

Verifique `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['seu-projeto.supabase.co'],
  },
}
```

### **OneSignal não funciona?**

- [ ] Site em HTTPS ✅ (Vercel sempre usa)
- [ ] App ID correto nas env vars
- [ ] Site URL configurado no OneSignal
- [ ] Service Worker registrado (`/sw.js` acessível)
- [ ] Notificações permitidas no navegador

---

## 📊 Monitoramento

### **Vercel Analytics (Grátis):**
```
Vercel Dashboard → Analytics
- Page views
- Unique visitors
- Top pages
- Performance metrics
```

### **Supabase Logs:**
```
Supabase Dashboard → Database → Logs
- SQL queries
- Auth events
- API calls
```

### **OneSignal Dashboard:**
```
OneSignal → Messages → Delivery
- Notifications sent
- Click-through rate
- Subscription growth
```

---

## 🎯 Checklist Final

### Antes do Deploy:
- [x] Git inicializado
- [x] GitHub repository criado
- [x] Env vars prontas
- [x] Build local funciona

### Durante o Deploy:
- [ ] Vercel project criado
- [ ] GitHub conectado
- [ ] Env vars configuradas
- [ ] Deploy executado (sucesso)

### Depois do Deploy:
- [ ] Site acessível (HTTPS)
- [ ] Login funciona
- [ ] Eventos carregam
- [ ] Cupons funcionam
- [ ] PWA instalável
- [ ] OneSignal configurado
- [ ] Domínio customizado (opcional)

---

## 🚀 Comandos Rápidos

```bash
# Setup completo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/na-midia.git
git push -u origin main

# Deploy (se CLI instalada)
vercel --prod

# Redeploy após mudanças
git add .
git commit -m "Descrição"
git push
```

---

## 📞 Suporte

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Next.js:**
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

**Ajuda adicional:**
- Verifique logs na Vercel Dashboard
- Console do navegador (F12)
- Network tab para erros de API

---

## ✅ Próximos Passos Após Deploy

1. **Testar tudo** ✅
2. **Configurar OneSignal** para notificações
3. **Adicionar domínio customizado** (opcional)
4. **Monitorar analytics**
5. **Coletar feedback** dos usuários
6. **Iterar e melhorar** 🚀

---

**Sucesso no deploy! 🎉**

Seu app está pronto para receber usuários, eventos, cupons e notificações!
