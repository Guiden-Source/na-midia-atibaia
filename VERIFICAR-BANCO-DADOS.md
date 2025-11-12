# ✅ Verificação das Tabelas do Delivery - Supabase

## 🔍 Execute estas queries para verificar se está tudo OK

### 1️⃣ Verificar se todas as tabelas foram criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'delivery_%'
ORDER BY table_name;
```

**✅ Resultado Esperado:**
- delivery_addresses
- delivery_categories
- delivery_order_items
- delivery_orders
- delivery_products

---

### 2️⃣ Verificar categorias criadas
```sql
SELECT id, name, slug, icon, display_order, is_active 
FROM delivery_categories 
ORDER BY display_order;
```

**✅ Deve mostrar 6 categorias:**
- Ofertas (🔥)
- Básicos da Casa (🏠)
- Bebidas (🍺)
- Limpeza (🧹)
- Doces e Sobremesas (🍰)
- Seus Favoritos (⭐)

---

### 3️⃣ Verificar produtos criados
```sql
SELECT 
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as category
FROM delivery_products p
LEFT JOIN delivery_categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 10;
```

**✅ Deve mostrar vários produtos** (arroz, feijão, cerveja, etc.)

---

### 4️⃣ Verificar RLS Policies
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename LIKE 'delivery_%'
ORDER BY tablename, policyname;
```

**✅ Deve mostrar várias policies** para cada tabela

---

### 5️⃣ Testar insert de endereço (opcional)
```sql
-- Isso vai falhar se o RLS estiver funcionando corretamente
-- (porque precisa estar autenticado)
INSERT INTO delivery_addresses (
  user_id,
  label,
  street,
  number,
  condominium
) VALUES (
  auth.uid(),
  'Teste',
  'Rua Teste',
  '123',
  'Jeronimo de Camargo 1'
);
```

**✅ Deve dar erro:** "new row violates row-level security policy"  
Isso é CORRETO! Significa que o RLS está protegendo os dados.

---

### 6️⃣ Verificar estrutura da tabela delivery_products
```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'delivery_products'
ORDER BY ordinal_position;
```

**✅ Verificar se tem o campo `discount_percentage`**

---

## 🎯 Checklist Final

Execute cada query acima e verifique:

- [ ] 5 tabelas delivery_* existem
- [ ] 6 categorias foram criadas
- [ ] Produtos de exemplo foram inseridos
- [ ] RLS policies estão ativas
- [ ] Campo discount_percentage existe em delivery_products
- [ ] Tabela delivery_addresses existe

---

## 🚀 Próximo Passo: Testar a Aplicação

Se tudo estiver OK acima, agora você pode testar a aplicação:

### URLs para testar:

1. **Página de Produtos:**
   ```
   https://sua-url.vercel.app/delivery
   ```
   ✅ Deve mostrar os produtos criados

2. **Admin de Produtos:**
   ```
   https://sua-url.vercel.app/admin/produtos
   ```
   ✅ Requer login como admin
   ✅ Deve mostrar lista de produtos

3. **Perfil do Usuário:**
   ```
   https://sua-url.vercel.app/perfil
   ```
   ✅ Deve mostrar estatísticas (cupons, eventos, pedidos, carrinho, endereços)

4. **Meus Pedidos:**
   ```
   https://sua-url.vercel.app/perfil/pedidos
   ```
   ✅ Deve mostrar histórico vazio (ou pedidos se já tiver)

5. **Endereços:**
   ```
   https://sua-url.vercel.app/perfil/enderecos
   ```
   ✅ Deve permitir adicionar endereços

---

## ⚠️ Se algo não funcionar

### Problema: Campo discount_percentage não existe
**Solução:** Execute:
```sql
ALTER TABLE delivery_products 
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
```

### Problema: Produtos não aparecem
**Solução:** Verifique RLS:
```sql
-- Temporariamente desabilitar RLS para testar
ALTER TABLE delivery_products DISABLE ROW LEVEL SECURITY;
```

### Problema: Não consigo adicionar produtos no admin
**Solução:** Adicione policy para admin:
```sql
CREATE POLICY "Admin pode gerenciar produtos"
ON delivery_products
FOR ALL
USING (
  current_setting('request.jwt.claims', true)::json->>'email' = 'guidjvb@gmail.com'
);
```

---

## 🐛 Debug Console

Se encontrar erros, verifique o console do navegador (F12) e procure por:
- ❌ Erros de Supabase queries
- ❌ Erros de autenticação
- ❌ Erros de RLS policies

Compartilhe os erros para eu ajudar a resolver! 🚀
