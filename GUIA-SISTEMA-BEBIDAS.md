# 🍺 GUIA DE IMPLEMENTAÇÃO DO SISTEMA DE BEBIDAS

## ✅ O QUE JÁ FOI FEITO

### 1. Tipos e Estrutura
- ✅ `types/supabase.ts` - Tipos atualizados com tabelas `drinks` e `event_drinks`
- ✅ `lib/drinks/types.ts` - Tipos TypeScript para bebidas (DRINK_TYPES, Drink, EventDrink)
- ✅ `lib/types.ts` - Tipo Event atualizado para incluir `event_drinks`

### 2. Componentes UI
- ✅ `components/events/DrinkPreview.tsx` - Preview compacto de bebidas nos cards
- ✅ `components/events/DrinkList.tsx` - Lista completa de bebidas com preços
- ✅ `components/EventBentoGrid.tsx` - Integrado com DrinkPreview

### 3. Scripts SQL
- ✅ `supabase-drinks-setup.sql` - Script completo para criar tabelas e popular com 30+ bebidas

### 4. Correções
- ✅ Página de login corrigida (tipo supabase.ts estava faltando tipos de drinks)

---

## 🚀 PRÓXIMOS PASSOS - EXECUTE NESTA ORDEM

### PASSO 1: Executar SQL no Supabase (5 min)

1. **Abra o Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecione seu projeto**: "Na Mídia"
3. **Vá em SQL Editor** (menu lateral esquerdo)
4. **Clique em "New Query"**
5. **Abra o arquivo** `supabase-drinks-setup.sql` (na raiz do projeto)
6. **Copie TODO o conteúdo** e cole no SQL Editor
7. **Clique em RUN** (ou Ctrl+Enter)

✅ **Verificação**: Você deve ver uma mensagem de sucesso e uma tabela mostrando:
```
tipo           | quantidade
---------------|----------
cerveja        | 7
destilado      | 6
drink          | 8
nao_alcoolico  | 6
vinho          | 5
```

Se aparecer erro, leia a mensagem e me avise!

---

### PASSO 2: Vincular Bebidas a um Evento de Teste (3 min)

Depois de executar o PASSO 1, você precisa vincular bebidas a um evento existente.

1. **Ainda no SQL Editor, execute esta query para pegar o ID de um evento:**
```sql
SELECT id, name FROM events WHERE is_active = true LIMIT 1;
```

2. **Copie o ID do evento** (será algo como: `a1b2c3d4-e5f6-...`)

3. **Execute este script** (substitua `SEU_EVENT_ID` pelo ID que você copiou):
```sql
INSERT INTO event_drinks (event_id, drink_id, preco_evento, destaque)
SELECT 
  'SEU_EVENT_ID',  -- ← COLE O ID DO EVENTO AQUI
  id,
  CASE 
    WHEN tipo = 'cerveja' THEN 8.00
    WHEN tipo = 'vinho' THEN 15.00
    WHEN tipo = 'drink' THEN 18.00
    WHEN tipo = 'destilado' THEN 12.00
    WHEN tipo = 'nao_alcoolico' THEN 5.00
  END as preco_evento,
  nome IN ('Heineken', 'Caipirinha', 'Gin Tônica') as destaque
FROM drinks
WHERE nome IN (
  'Heineken', 'Skol', 'Corona',
  'Caipirinha', 'Mojito', 'Gin Tônica',
  'Whisky', 'Vodka',
  'Refrigerante', 'Água Mineral'
)
AND ativo = true;
```

✅ **Verificação**: Você deve ver "10 rows inserted" (10 bebidas vinculadas ao evento)

---

### PASSO 3: Atualizar Queries para Incluir Bebidas (10 min)

Agora vamos modificar as queries para buscar eventos COM as bebidas.

**Abra o arquivo**: `app/actions.ts`

Você precisa atualizar a query `fetchEventsAction`. Procure por esta linha:

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
```

E substitua por:

```typescript
const { data, error } = await supabase
  .from('events')
  .select(`
    *,
    event_drinks (
      id,
      disponivel,
      preco_evento,
      destaque,
      drink:drinks (
        id,
        nome,
        tipo,
        descricao,
        icone
      )
    )
  `)
```

**Mesma coisa para queries que buscam evento por ID!**

---

### PASSO 4: Testar no Navegador (5 min)

1. **Inicie o servidor de desenvolvimento**:
```bash
cd "Na Midia - Plataforma de Atibaia/na-midia"
npm run dev
```

2. **Abra o navegador**: http://localhost:3000

3. **Verifique**:
   - ✅ Página carrega sem erros
   - ✅ Cards de eventos mostram ícones de bebidas (🍺, 🍹, etc)
   - ✅ Quantidade de bebidas aparece ao lado dos ícones

---

## 🐛 TROUBLESHOOTING

### Erro: "relation 'drinks' does not exist"
**Solução**: Você não executou o script SQL do PASSO 1. Execute-o agora.

### Erro: "column 'event_drinks' does not exist"
**Solução**: Você não atualizou a query do PASSO 3. Adicione o `select` com join.

### Bebidas não aparecem nos cards
**Soluções possíveis**:
1. Você não vinculou bebidas ao evento (PASSO 2)
2. A query não está buscando as bebidas (PASSO 3)
3. Limpe o cache: Ctrl+Shift+R no navegador

### Erro de TypeScript sobre 'event_drinks'
**Solução**: Já foi corrigido! Tipo Event foi atualizado em `lib/types.ts`

---

## 📊 RESULTADO ESPERADO

### Antes (sem bebidas):
```
┌────────────────────┐
│ Baile no Don Pietro│
│ 📅 Hoje, 14:37     │
│ 📍 Caetetuba       │
│ 👥 12 confirmados  │
│                    │
│ [Confirmar]        │
└────────────────────┘
```

### Depois (com bebidas):
```
┌────────────────────┐
│ Baile no Don Pietro│
│ 📅 Hoje, 14:37     │
│ 📍 Caetetuba       │
│ 👥 12 confirmados  │
│                    │
│ 🍺 Bebidas:        │
│ [🍺 3] [🍹 2] +5   │
│                    │
│ [Confirmar]        │
└────────────────────┘
```

---

## 🔄 PRÓXIMAS FUNCIONALIDADES (Opcional)

Depois dos passos acima funcionarem, podemos adicionar:

1. **Modal de Bebidas**: Botão "Ver todas as bebidas" que abre um modal com lista completa
2. **Filtro por Bebida**: Filtrar eventos por tipo de bebida disponível
3. **Página Admin**: Gerenciar bebidas de cada evento visualmente
4. **Busca de Bebidas**: Buscar eventos que tenham uma bebida específica

---

## 📞 PRECISA DE AJUDA?

Me avise em qual passo você está travado e qual erro apareceu. Posso te ajudar a resolver!

**Logs úteis para debug**:
- Erros do SQL: Aparece no SQL Editor do Supabase
- Erros do Next.js: Aparece no terminal onde rodou `npm run dev`
- Erros do navegador: Abra DevTools (F12) > Console

---

## ✨ APÓS TUDO FUNCIONAR

Você terá:
- ✅ 30+ bebidas cadastradas no banco
- ✅ Sistema de vinculação evento-bebidas
- ✅ Preview visual de bebidas nos cards
- ✅ Estrutura pronta para adicionar mais funcionalidades

**Parabéns! 🎉** O sistema de bebidas estará 100% funcional!
