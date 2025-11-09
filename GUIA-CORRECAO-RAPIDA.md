# 🚀 GUIA DE CORREÇÃO RÁPIDA

## 📊 Diagnóstico Atual

**Problemas Identificados:**
- ❌ 6 Confirmações sem user_email
- ❌ 6 Cupons sem user_email  
- ❌ Queries retornando erro de "column does not exist" (pode ser problema de schema)

**Arquivos Corrigidos:**
- ✅ `/app/perfil/page.tsx` - mudou `events(title)` para `events(name)`
- ✅ Outras queries já estavam corretas

## 🎯 PASSO A PASSO (Execute Nesta Ordem)

### PASSO 1: Verificar Schema Real (2 min)
**Execute no Supabase SQL Editor:**
```
VERIFICAR-SCHEMA-EVENTS.sql
```

**O que esperar:**
- Lista de todas as colunas da tabela events
- Se `image_url` aparecer na lista, está tudo OK
- Se NÃO aparecer, precisamos adicionar a coluna

---

### PASSO 2: Migrar Dados Existentes (3 min)
**⚠️ IMPORTANTE ANTES DE EXECUTAR:**
Abra `MIGRAR-DADOS-EXISTENTES.sql` e **substitua** na linha 7:
```sql
UPDATE confirmations 
SET user_email = 'guidjvb@gmail.com'  -- ← COLOQUE SEU EMAIL AQUI
```

**Execute no Supabase SQL Editor:**
```
MIGRAR-DADOS-EXISTENTES.sql
```

**O que vai acontecer:**
1. ✅ Adiciona email a todas as confirmações
2. ✅ Cria coluna `user_email` na tabela `coupons` (se não existir)
3. ✅ Copia email das confirmações para os cupons correspondentes
4. ✅ Cria índices para performance
5. ✅ Mostra relatório final

**Resultado Esperado:**
```
⚠️ Confirmações sem email: 0
⚠️ Cupons sem user_email: 0
✅ Tudo pronto! ✅ Todos os registros têm email!
```

---

### PASSO 3: Testar no Navegador (5 min)

1. **Recarregue a página** (Ctrl+R ou Cmd+R)
2. **Abra o Console** (F12 → Console)
3. **Acesse `/perfil`** e verifique:
   - Console deve mostrar: `👤 Perfil - Final stats: {cupons: 6, eventos: 6}`
   - Contadores devem aparecer na tela

4. **Acesse `/perfil/cupons`** e verifique:
   - Console deve mostrar: `🎫 Cupons - Loaded coupons: 6 cupons`
   - Lista de cupons com QR codes deve aparecer

5. **Acesse `/perfil/eventos`** e verifique:
   - Console deve mostrar: `📅 Eventos - Loaded events: 6 eventos`
   - Lista de eventos deve aparecer

---

## 🐛 Se Der Erro no PASSO 1

**Erro: "column image_url does not exist"**

Execute este script para adicionar a coluna:
```sql
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
```

---

## 🐛 Se Der Erro no PASSO 2

**Erro: "column user_email already exists"**
- Normal! O script detecta e pula para a próxima etapa

**Erro: "update... null value"**
- Substitua o email na linha 7 do script antes de executar

---

## ✅ Checklist Final

Após executar os scripts, você deve ter:

- [ ] ✅ Tabela `events` tem coluna `image_url`
- [ ] ✅ Tabela `coupons` tem coluna `user_email`
- [ ] ✅ 6 confirmações COM email
- [ ] ✅ 6 cupons COM user_email
- [ ] ✅ Dashboard `/perfil` mostra contadores corretos
- [ ] ✅ Página `/perfil/cupons` lista cupons
- [ ] ✅ Página `/perfil/eventos` lista eventos
- [ ] ✅ Console sem erros 400 ou 42703

---

## 📞 Arquivos Criados

1. **MIGRAR-DADOS-EXISTENTES.sql** - Migração de dados
2. **VERIFICAR-SCHEMA-EVENTS.sql** - Diagnóstico de schema
3. **GUIA-CORRECAO-RAPIDA.md** - Este guia

---

## 🔄 Próximos Passos (Após Tudo Funcionar)

1. Testar confirmação de presença em novo evento
2. Verificar se cupom novo é criado corretamente
3. Remover console.logs excessivos (opcional)
