# 🔧 URLs para Configurar no Google Cloud Console

## 🌐 Domínio de Produção
**https://na-midia-atibaia.vercel.app**

---

## ✅ COPIE ESTAS URLs EXATAMENTE

### Para **Authorized JavaScript origins**

```
https://na-midia-atibaia.vercel.app
http://localhost:3000
```

### Para **Authorized redirect URIs**

```
https://na-midia-atibaia.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

⚠️ **IMPORTANTE:** NÃO adicione barra (/) no final das URLs

---

## 📝 Passo a Passo Rápido

### 1. Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Clique no seu **OAuth 2.0 Client ID**
3. Em **Authorized JavaScript origins**, adicione:
   - `https://na-midia-atibaia.vercel.app`
   - `http://localhost:3000`
4. Em **Authorized redirect URIs**, adicione:
   - `https://na-midia-atibaia.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
5. Clique **SAVE**

### 2. Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Providers** → **Google**
4. **Enable** o toggle
5. Cole:
   - **Client ID** (do Google Cloud)
   - **Client Secret** (do Google Cloud)
6. Em **Site URL** (na seção URL Configuration):
   - `https://na-midia-atibaia.vercel.app`
7. Clique **Save**

### 3. Copiar Redirect URI do Supabase para o Google

No Supabase, copie a URL que aparece em **Callback URL (for OAuth)**, algo como:
```
https://SEU_PROJECT.supabase.co/auth/v1/callback
```

Volte no Google Cloud e adicione essa URL também em **Authorized redirect URIs**.

---

## ✅ URLs Finais no Google Cloud

Deve ficar assim:

**Authorized JavaScript origins:**
- https://na-midia-atibaia.vercel.app
- http://localhost:3000

**Authorized redirect URIs:**
- https://na-midia-atibaia.vercel.app/auth/callback
- http://localhost:3000/auth/callback
- https://SEU_PROJECT.supabase.co/auth/v1/callback

---

## 🧪 Como Testar

1. Acesse: https://na-midia-atibaia.vercel.app/login
2. Clique em **"Entrar com Google"**
3. Escolha sua conta Google
4. Deve redirecionar para a home logado ✅

---

## 🐛 Se der erro

### redirect_uri_mismatch
❌ Erro: A URL não está autorizada

✅ Solução: 
1. Veja a URL exata no erro
2. Adicione EXATAMENTE essa URL em **Authorized redirect URIs**
3. Aguarde 1-2 minutos para propagar

### Access blocked
❌ Erro: App não verificado

✅ Solução:
1. No Google Cloud → OAuth consent screen
2. Adicione seu email em **Test users**
3. OU publique o app (mude de Testing para Production)

---

**Deploy:** ✅ Código já está no ar em https://na-midia-atibaia.vercel.app  
**Aguardando:** Configuração do Google Cloud Console (você)
