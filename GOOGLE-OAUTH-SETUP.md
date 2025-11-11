# 🔐 Configuração do Login Social (Google OAuth)

## ✅ O que foi implementado

1. **Componente SocialButton** reutilizável
2. **Integração com Supabase Auth**
3. **Botão "Entrar com Google"** em Login e Signup
4. **Callback handler** para OAuth
5. **UI moderna** com divisores e ícones

---

## 📋 PASSOS OBRIGATÓRIOS - Configuração no Google Cloud

### 1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Anote o **Project ID**

### 2. Configurar OAuth Consent Screen

1. No menu lateral: **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para permitir qualquer usuário do Google)
3. Preencha:
   - **App name:** Na Mídia
   - **User support email:** seu-email@gmail.com
   - **Developer contact:** seu-email@gmail.com
4. Clique **Save and Continue**
5. Em **Scopes**, adicione:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. Clique **Save and Continue**
7. Em **Test users** (se estiver em modo testing), adicione seus emails de teste
8. Clique **Save and Continue**

### 3. Criar Credenciais OAuth

1. No menu lateral: **APIs & Services** → **Credentials**
2. Clique **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Escolha **Application type:** Web application
4. Preencha:
   - **Name:** Na Mídia Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://seu-dominio-vercel.vercel.app
     https://namidia.com.br
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/callback
     https://seu-dominio-vercel.vercel.app/auth/callback
     https://namidia.com.br/auth/callback
     ```
5. Clique **CREATE**
6. **IMPORTANTE:** Copie o **Client ID** e **Client Secret** que aparecerem

---

## 🔧 Configuração no Supabase Dashboard

### 1. Habilitar Google Provider

1. Acesse: https://supabase.com/dashboard/project/SEU_PROJECT_ID
2. Vá em **Authentication** → **Providers**
3. Procure por **Google** e clique para expandir
4. **Enable** o toggle
5. Cole:
   - **Client ID:** (do passo anterior)
   - **Client Secret:** (do passo anterior)
6. Em **Redirect URL**, copie a URL gerada (algo como):
   ```
   https://seu-project.supabase.co/auth/v1/callback
   ```
7. Clique **Save**

### 2. Voltar ao Google Cloud e Adicionar Redirect da Supabase

1. Volte no Google Cloud Console → **Credentials**
2. Clique no OAuth client que criou
3. Em **Authorized redirect URIs**, adicione a URL copiada do Supabase:
   ```
   https://seu-project.supabase.co/auth/v1/callback
   ```
4. Clique **Save**

---

## 🌐 Variáveis de Ambiente (Já configuradas)

Certifique-se de ter no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## ✅ Testando

### 1. Desenvolvimento Local

```bash
npm run dev
```

1. Acesse http://localhost:3000/signup
2. Clique em "Criar conta com Google"
3. Faça login com sua conta Google
4. Deve redirecionar para a home (`/`) logado

### 2. Produção (Vercel)

Após deploy:
1. Acesse sua URL do Vercel
2. Teste o mesmo fluxo
3. Verifique os logs no Vercel se houver erro

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"
- **Causa:** URL de redirect não está autorizada no Google Cloud
- **Solução:** Adicione EXATAMENTE a URL que aparece no erro nas **Authorized redirect URIs**

### Erro: "invalid_client"
- **Causa:** Client ID ou Secret incorretos
- **Solução:** Verifique se copiou corretamente para o Supabase

### Erro: "Access blocked: This app's request is invalid"
- **Causa:** OAuth Consent Screen não configurado
- **Solução:** Complete o passo 2 (OAuth Consent Screen)

### Usuário não consegue logar (conta não existe)
- **Causa:** Email não está na lista de test users
- **Solução:** Publique o app (mude de Testing para Production no OAuth Consent Screen) OU adicione o email nos test users

---

## 📱 Para adicionar outros providers no futuro

### Facebook
1. Crie app em https://developers.facebook.com/
2. Habilite Facebook Login
3. Adicione as URLs de redirect
4. Copie App ID e App Secret para o Supabase

### Apple
1. Configure Sign in with Apple em https://developer.apple.com/
2. Crie Service ID e Key
3. Configure no Supabase

**Para habilitar:**
Descomente as linhas em `components/auth/SocialButton.tsx`:
```tsx
// <SocialButton provider="facebook" mode={mode} />
// <SocialButton provider="apple" mode={mode} />
```

---

## 🎯 Benefícios

✅ **Sem problemas de email:** Usuários não dependem de receber email de confirmação  
✅ **Login rápido:** 1 clique para criar conta/entrar  
✅ **Seguro:** OAuth é mais seguro que senhas  
✅ **Menos fricção:** Menos campos para preencher  
✅ **Dados confiáveis:** Email já verificado pelo Google  

---

## 📊 Dados salvos pelo Google OAuth

Quando um usuário faz login com Google, salvamos:
- **Email** (verificado)
- **Nome completo**
- **Avatar URL** (foto do perfil)
- **Provider:** 'google'

Acesse no Supabase:
```sql
SELECT * FROM auth.users WHERE provider = 'google';
```

---

## 🔒 Segurança

- ✅ OAuth 2.0 com PKCE
- ✅ State parameter para prevenir CSRF
- ✅ Tokens armazenados de forma segura (httpOnly cookies via Supabase)
- ✅ Refresh tokens para sessões longas

---

## 📝 Próximos Passos

1. **Configurar Google Cloud** (seguir passos acima)
2. **Configurar Supabase** (seguir passos acima)
3. **Testar localmente**
4. **Deploy e testar em produção**
5. **(Opcional)** Adicionar Facebook/Apple

---

**Desenvolvido para:** Na Mídia - Plataforma de Atibaia  
**Data:** 9 de novembro de 2025  
**Status:** ✅ Código implementado, aguardando configuração
