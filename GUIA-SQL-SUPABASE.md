# 🗄️ Guia de Execução dos Scripts SQL no Supabase

## ⚠️ IMPORTANTE: Como Executar Corretamente

### Passo 1: Acesse o Supabase Dashboard
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto **na-midia-atibaia**
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Execute o Script Principal
1. Clique em **"+ New Query"** (botão verde)
2. **COPIE TODO O CONTEÚDO** do arquivo `supabase-delivery-setup.sql`
   - **NÃO copie do editor VS Code** (pode ter problemas de formatação)
   - Abra o arquivo no Finder/Explorer e copie o conteúdo raw
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (ou Ctrl/Cmd + Enter)

**✅ Resultado Esperado:**
```
Success. No rows returned
```

Isso vai criar:
- ✅ 4 tabelas: `delivery_categories`, `delivery_products`, `delivery_orders`, `delivery_order_items`
- ✅ Índices para performance
- ✅ Triggers e funções
- ✅ RLS Policies
- ✅ Seed data (categorias e produtos de exemplo)

### Passo 3: Execute o Script de Endereços
1. Clique em **"+ New Query"** novamente
2. **COPIE TODO O CONTEÚDO** do arquivo `supabase-delivery-addresses.sql`
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**

**✅ Resultado Esperado:**
```
Success. No rows returned
```

Isso vai criar:
- ✅ Tabela `delivery_addresses`
- ✅ RLS policies para endereços
- ✅ Triggers automáticos

### Passo 4: Verificar se Tudo Foi Criado
Execute esta query para confirmar:

\`\`\`sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'delivery_%'
ORDER BY table_name;
\`\`\`

**✅ Resultado Esperado:**
```
delivery_addresses
delivery_categories
delivery_order_items
delivery_orders
delivery_products
```

### Passo 5: Verificar Seed Data
Execute para ver os produtos criados:

\`\`\`sql
-- Ver categorias
SELECT name, slug, icon FROM delivery_categories ORDER BY display_order;

-- Ver produtos
SELECT name, price, category_id FROM delivery_products LIMIT 10;
\`\`\`

## 🚨 Erros Comuns

### Erro: "syntax error at or near 'use client'"
**Causa:** Você copiou conteúdo de um arquivo TypeScript/React (`.tsx`) ao invés do SQL  
**Solução:** Certifique-se de copiar do arquivo `.sql` correto

### Erro: "relation already exists"
**Causa:** As tabelas já foram criadas antes  
**Solução:** Pode ignorar, ou dropar e recriar:
\`\`\`sql
DROP TABLE IF EXISTS delivery_order_items CASCADE;
DROP TABLE IF EXISTS delivery_orders CASCADE;
DROP TABLE IF EXISTS delivery_products CASCADE;
DROP TABLE IF EXISTS delivery_categories CASCADE;
DROP TABLE IF EXISTS delivery_addresses CASCADE;
\`\`\`
Depois execute os scripts novamente.

### Erro: "uuid_generate_v4() does not exist"
**Causa:** Extensão UUID não está habilitada  
**Solução:** Execute antes dos scripts:
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\`\`\`

## 📋 Checklist Final

Após executar os scripts:

- [ ] Tabelas criadas (5 tabelas)
- [ ] Seed data inserido (6 categorias + produtos)
- [ ] RLS policies ativas
- [ ] Triggers configurados
- [ ] Verificou no Table Editor do Supabase

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard
- **SQL Editor:** https://supabase.com/dashboard/project/YOUR_PROJECT/sql
- **Table Editor:** https://supabase.com/dashboard/project/YOUR_PROJECT/editor

## 📝 Próximos Passos

Depois de executar os scripts:

1. ✅ Teste a aplicação em: https://sua-url.vercel.app/delivery
2. ✅ Faça login para testar o fluxo completo
3. ✅ Adicione produtos ao carrinho
4. ✅ Teste o checkout e WhatsApp
5. ✅ Acesse `/admin/produtos` para gerenciar

---

**Dica:** Se tiver dúvidas, compartilhe o erro completo que aparece no Supabase!
