# 🚀 Setup Rápido - Sistema Delivery

## 📋 Passos para Ativação

### 1️⃣ Configurar Banco de Dados

```bash
# 1. Acesse: https://supabase.com/dashboard
# 2. Abra seu projeto Na Mídia
# 3. Vá em "SQL Editor"
# 4. Clique em "New Query"
# 5. Cole o conteúdo do arquivo: supabase-delivery-setup.sql
# 6. Clique em "Run"
# 7. Aguarde confirmação de sucesso ✅
```

### 2️⃣ Configurar WhatsApp

Edite o arquivo: `lib/delivery/whatsapp.ts`

```typescript
// LINHA 9 - Substitua pelo seu número
const WHATSAPP_NUMBER = '5511999999999'; // ← Seu número aqui

// Formato correto:
// 55 + DDD + Número (sem espaços ou caracteres especiais)
// Exemplo: 5512997654321
```

### 3️⃣ Adicionar Produtos

Opção 1 - Manualmente via Supabase:
```bash
# 1. Acesse Supabase Dashboard
# 2. Vá em "Table Editor"
# 3. Selecione "delivery_products"
# 4. Clique em "Insert" → "Insert row"
# 5. Preencha: name, price, category_id, stock
```

Opção 2 - Usar produtos de exemplo (já incluídos no SQL):
```bash
# Os produtos de exemplo já foram inseridos pelo script SQL!
# Arroz, Feijão, Cerveja, etc.
```

### 4️⃣ Testar Sistema

```bash
# 1. Acesse: http://localhost:3000/delivery
# 2. Adicione produtos ao carrinho
# 3. Vá para checkout
# 4. Preencha formulário
# 5. Clique em "Finalizar Pedido"
# 6. Clique no botão verde "Enviar via WhatsApp"
# 7. Verifique se WhatsApp abre corretamente
```

### 5️⃣ Acessar Admin

```bash
# Acesse: http://localhost:3000/admin/pedidos
# Veja estatísticas e gerencie pedidos
```

---

## ✅ Checklist de Ativação

- [ ] SQL executado no Supabase
- [ ] Número do WhatsApp configurado
- [ ] Produtos adicionados/verificados
- [ ] Teste de compra completo realizado
- [ ] WhatsApp abrindo corretamente
- [ ] Admin dashboard acessível

---

## 🎯 URLs Importantes

- **Loja:** `/delivery`
- **Carrinho:** `/delivery/cart`
- **Admin:** `/admin/pedidos`
- **Rastrear Pedido:** `/delivery/pedidos/[orderId]`

---

## 🐛 Problemas Comuns

### WhatsApp não abre?
- Verifique o número em `lib/delivery/whatsapp.ts`
- Formato: 55 + DDD + número (sem espaços)

### Sem produtos na loja?
- Execute o SQL novamente (produtos de exemplo incluídos)
- Ou adicione manualmente via Supabase

### Erro ao criar pedido?
- Verifique se as tabelas foram criadas
- Cheque o console do navegador
- Verifique RLS policies no Supabase

---

## 📚 Documentação Completa

Veja: `DELIVERY-SYSTEM.md`

---

## 🎉 Pronto para Usar!

Sistema totalmente funcional. Qualquer dúvida, consulte a documentação completa.
