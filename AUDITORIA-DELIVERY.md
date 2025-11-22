# Auditoria de Delivery & Produtos 🛍️

## 📊 Estado Atual

O sistema de delivery está funcional, com listagem de produtos, carrinho e gestão básica no admin. No entanto, para divulgação em massa, precisamos elevar o nível de UX/UI e adicionar funcionalidades de engajamento.

### ✅ Pontos Fortes
- Estrutura de banco de dados sólida (Supabase)
- Carrinho funcional com persistência local
- Gestão de produtos no admin (CRUD básico)
- Busca e filtros por categoria

### ⚠️ Pontos de Atenção
- **Design Básico:** Muitos componentes ainda usam estilos padrão, sem o "wow factor" do resto do site.
- **Admin Simples:** A gestão de produtos não usa o design system `LiquidGlass` e carece de feedback visual melhor.
- **Checkout:** O fluxo de finalização precisa ser extremamente fluido para evitar abandono.
- **Mobile:** A experiência mobile precisa ser "app-like" (barra de navegação inferior, gestos).

---

## 📝 Todo List Priorizado

### 🚀 Fase 1: Refinamento Visual (Urgente para Divulgação)

- [ ] **Modernizar `ProductCardModern`:**
    - Adicionar animações de hover
    - Melhorar badge de desconto
    - Botão de adicionar com feedback visual (confete/partículas)
    - Skeleton loading state mais bonito
- [ ] **Refinar `DeliveryHeader`:**
    - Garantir consistência com o header principal
    - Melhorar a busca (sugestões em tempo real)
    - Filtros de categoria com ícones visuais (emojis ou SVGs)
- [ ] **Carrinho "Slide-over":**
    - Ao invés de uma página separada, usar um drawer lateral para acesso rápido ao carrinho sem sair da lista.
- [ ] **Página de Detalhes do Produto:**
    - Criar modal ou página dedicada para ver detalhes, adicionais e observações.

### 🛠️ Fase 2: Painel Administrativo

- [ ] **Modernizar `ProductsManager`:**
    - Aplicar `LiquidGlass`
    - Tabela com ações rápidas (toggle ativo/inativo direto na lista)
    - Upload de imagem com preview e drag-and-drop
- [ ] **Gestão de Pedidos (`/admin/pedidos`):**
    - Kanban board para status (Recebido -> Preparo -> Entrega -> Entregue)
    - Notificações sonoras para novos pedidos

### 🎯 Fase 3: Landing Page "Jerônimo"

**Objetivo:** Capturar moradores do Residencial Jerônimo de Camargo com oferta exclusiva.

**Estrutura Sugerida:**
1.  **Hero Section:**
    - Título: "Delivery em 30 min no Jerônimo de Camargo 1 e 2"
    - Subtítulo: "Taxa de entrega GRÁTIS para vizinhos. Peça agora!"
    - CTA: "Ver Cardápio" (leva para `/delivery?bairro=jeronimo`)
2.  **Validador de Endereço:**
    - Input simples: "Digite seu bloco/apartamento" para validar elegibilidade (efeito psicológico de exclusividade).
3.  **Produtos em Destaque:**
    - Carrossel com os "Mais Pedidos no Condomínio".
4.  **Prova Social:**
    - "Mais de 50 vizinhos já pediram hoje!" (contador fake ou real).

### 💡 Sugestões de Funcionalidades

1.  **Rastreamento em Tempo Real (WhatsApp):**
    - Ao mudar status no admin, enviar msg automática no WhatsApp do cliente: "Seu pedido saiu para entrega! 🛵"
2.  **Clube de Assinatura / Fidelidade:**
    - "Peça 5 vezes e ganhe R$ 20" (Gamificação).
3.  **Agendamento:**
    - "Agendar para o jantar" (útil para quem pede do trabalho).

---

## 📂 Arquivos para Modificação

1.  `components/delivery/ProductCardModern.tsx` (UI)
2.  `components/delivery/ProductsManager.tsx` (Admin)
3.  `app/delivery/page.tsx` (Layout)
4.  `components/delivery/Cart.tsx` (UX)
