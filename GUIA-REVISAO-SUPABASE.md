# 🔍 Guia de Revisão e Correção do Supabase

Este guia ajuda a revisar e corrigir a estrutura do banco de dados Supabase para garantir que tudo está configurado corretamente.

## 📋 Scripts Disponíveis

### 1. `revisar-estrutura-supabase.sql` - DIAGNÓSTICO COMPLETO
**Execute PRIMEIRO para identificar problemas**

Este script faz uma análise completa do banco:
- ✅ Lista todas as colunas de cada tabela
- ✅ Conta registros em cada tabela
- ✅ Verifica confirmações com/sem email
- ✅ Verifica cupons com/sem user_email
- ✅ Valida relacionamentos entre tabelas
- ✅ Verifica políticas RLS (Row Level Security)
- ✅ Lista índices existentes
- ✅ Gera relatório de saúde do banco

**Como executar:**
1. Acesse Supabase Dashboard
2. Vá em `SQL Editor`
3. Clique em `New Query`
4. Cole todo o conteúdo de `revisar-estrutura-supabase.sql`
5. Clique em `Run` ou `Ctrl/Cmd + Enter`

**O que observar:**
- ❌ Problemas serão destacados com "PROBLEMA:"
- ✅ Items OK aparecerão com "OK:"
- 📊 Veja o "RESUMO DE SAÚDE DO BANCO" no final

---

### 2. `corrigir-supabase.sql` - CORREÇÃO AUTOMÁTICA
**Execute DEPOIS de revisar os problemas**

Este script corrige automaticamente:
- ✅ Adiciona coluna `user_email` em `coupons` (se não existir)
- ✅ Atualiza cupons existentes com email das confirmações
- ✅ Cria índices para melhorar performance
- ✅ Habilita Row Level Security (RLS)
- ✅ Cria policies de acesso seguro
- ✅ Valida estrutura das tabelas

**Como executar:**
1. Acesse Supabase Dashboard
2. Vá em `SQL Editor`
3. Clique em `New Query`
4. Cole todo o conteúdo de `corrigir-supabase.sql`
5. Clique em `Run` ou `Ctrl/Cmd + Enter`

**Resultado esperado:**
```
✅ Coluna user_email adicionada à tabela coupons
✅ Cupons atualizados com email
✅ Índices criados para performance
✅ RLS habilitado
✅ Policies criadas
✅ CORREÇÃO CONCLUÍDA
```

---

### 3. `adicionar-user-email-cupons.sql` - CORREÇÃO ESPECÍFICA
**Alternativa mais simples ao script completo**

Script menor focado apenas em:
- Adicionar coluna `user_email` em `coupons`
- Migrar emails das confirmações para cupons
- Verificar resultado

---

## 🎯 Passo a Passo Recomendado

### Passo 1: Diagnóstico
```bash
# Execute revisar-estrutura-supabase.sql
```

Analise o output e procure por:
- ⚠️ **Confirmações sem email** - Normal se tiver eventos antigos
- ⚠️ **Cupons sem user_email** - PRECISA corrigir!
- ❌ **Cupons órfãos** - Cupons sem confirmation válida

### Passo 2: Correção
```bash
# Execute corrigir-supabase.sql
```

Aguarde as mensagens de confirmação:
- Cada ✅ indica uma correção bem sucedida
- Se aparecer ❌, leia a mensagem de erro

### Passo 3: Validação
Execute novamente o `revisar-estrutura-supabase.sql` e verifique se:
- ✅ Coluna `user_email` existe em `coupons`
- ✅ Número de cupons sem email deve ser 0 (ou muito baixo)
- ✅ RLS está habilitado
- ✅ Policies estão criadas

---

## 🔧 Problemas Comuns e Soluções

### ❌ Problema: "Coluna user_email não existe em coupons"
**Solução:** Execute `corrigir-supabase.sql` ou `adicionar-user-email-cupons.sql`

### ❌ Problema: "Cupons com user_email = 0"
**Causa:** Cupons foram criados antes da correção
**Solução:** Execute a query de UPDATE do script de correção:
```sql
UPDATE coupons c
SET user_email = conf.user_email
FROM confirmations conf
WHERE c.confirmation_id = conf.id
  AND (c.user_email IS NULL OR c.user_email = '')
  AND conf.user_email IS NOT NULL;
```

### ❌ Problema: "Confirmações sem email"
**Causa:** Usuários confirmaram presença sem estar logados (comportamento antigo)
**Solução:** Isso é normal para eventos antigos. Novos eventos agora exigem login ou email.

### ❌ Problema: "RLS não está habilitado"
**Solução:** Execute o script `corrigir-supabase.sql` que habilita RLS automaticamente

### ❌ Problema: "Permission denied" ao executar scripts
**Solução:** 
1. Verifique se você está usando a Service Role Key (não a anon key)
2. Ou execute via Dashboard do Supabase (SQL Editor) que tem permissões corretas

---

## 📊 Estrutura Esperada das Tabelas

### Tabela: `confirmations`
```sql
- id (uuid, PRIMARY KEY)
- event_id (uuid, FOREIGN KEY -> events.id)
- user_name (text, NOT NULL)
- user_email (text) -- ✅ DEVE EXISTIR
- user_phone (text)
- created_at (timestamp)
```

### Tabela: `coupons`
```sql
- id (uuid, PRIMARY KEY)
- code (text, UNIQUE, NOT NULL)
- event_id (uuid, FOREIGN KEY -> events.id)
- confirmation_id (uuid, FOREIGN KEY -> confirmations.id)
- user_email (text) -- ✅ DEVE EXISTIR (NOVO!)
- discount_percentage (integer)
- is_used (boolean, DEFAULT false)
- used_at (timestamp)
- created_at (timestamp)
```

### Tabela: `events`
```sql
- id (uuid, PRIMARY KEY)
- title (text, NOT NULL)
- description (text)
- start_time (timestamp, NOT NULL)
- end_time (timestamp)
- location (text)
- image_url (text)
- drinks_included (boolean)
- max_capacity (integer)
- created_at (timestamp)
```

---

## 🎯 Queries Úteis para Debug

### Ver últimos 10 cupons criados
```sql
SELECT 
    c.code,
    c.user_email,
    c.is_used,
    c.created_at,
    conf.user_name,
    e.title as event_title
FROM coupons c
LEFT JOIN confirmations conf ON c.confirmation_id = conf.id
LEFT JOIN events e ON c.event_id = e.id
ORDER BY c.created_at DESC
LIMIT 10;
```

### Ver usuários que mais confirmaram presença
```sql
SELECT 
    user_email,
    COUNT(*) as total_confirmacoes
FROM confirmations
WHERE user_email IS NOT NULL AND user_email != ''
GROUP BY user_email
ORDER BY total_confirmacoes DESC
LIMIT 10;
```

### Ver cupons não utilizados por usuário
```sql
SELECT 
    user_email,
    COUNT(*) as cupons_disponiveis
FROM coupons
WHERE is_used = false
  AND user_email IS NOT NULL
GROUP BY user_email
ORDER BY cupons_disponiveis DESC;
```

---

## ✅ Checklist Final

Depois de executar os scripts, confirme:

- [ ] ✅ Coluna `user_email` existe na tabela `coupons`
- [ ] ✅ Cupons existentes foram atualizados com email
- [ ] ✅ Índices criados para performance (user_email, is_used)
- [ ] ✅ RLS habilitado em `confirmations` e `coupons`
- [ ] ✅ Policies de acesso criadas e funcionando
- [ ] ✅ Novos cupons estão sendo criados com `user_email`
- [ ] ✅ Dashboard `/perfil` mostra contadores corretos
- [ ] ✅ Página `/perfil/cupons` lista cupons do usuário
- [ ] ✅ Página `/perfil/eventos` lista eventos confirmados

---

## 🚀 Testando na Prática

1. **Faça login** na plataforma
2. **Confirme presença** em um evento
3. **Abra o console** do navegador (F12)
4. **Procure pelos logs**:
   - `✅ confirmPresenceAction - Coupon created: [CODE] for user: [EMAIL]`
   - `👤 Perfil - Final stats: { cupons: X, eventos: Y }`
5. **Acesse `/perfil`** e verifique se os números aparecem
6. **Acesse `/perfil/cupons`** e veja seu cupom listado
7. **Acesse `/perfil/eventos`** e veja o evento confirmado

Se tudo funcionar, está tudo certo! 🎉

---

## 📞 Suporte

Se encontrar problemas:
1. Execute `revisar-estrutura-supabase.sql` e copie o output
2. Verifique os logs do console do navegador (F12)
3. Compartilhe as mensagens de erro

**Logs importantes:**
- 🔐 Header authentication
- ✅ confirmPresenceAction
- 👤 Perfil dashboard
- 🎫 Cupons page
- 📅 Eventos page
