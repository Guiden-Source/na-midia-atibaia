# Na Mídia Atibaia

**Plataforma completa de eventos, cupons e delivery para Atibaia/SP**

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-black)](https://na-midia-atibaia.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)

---

## 🎯 Sobre o Projeto

**Na Mídia** é uma plataforma de engajamento local que conecta moradores de Atibaia com:
- 🎉 **Eventos em tempo real** - Descubra o que está rolando na cidade
- 🎁 **Sistema de cupons** - Descontos em estabelecimentos locais
- 🍕 **Delivery exclusivo** - Entrega expressa para condomínios específicos

### Visão do Produto
Transformar Atibaia em uma comunidade mais conectada, onde moradores descobrem eventos, recebem benefícios e apoiam o comércio local.

---

## 🚀 Status Atual

### ✅ Sprints Completados

#### Sprint 1: Correções Críticas & Fundação (Dez 2024)
- Corrigido erro de fetch em `/delivery`
- Implementado sistema de login para rotas protegidas
- Criada seção "Como Funciona" na homepage
- Guia de copywriting estabelecido

#### Sprint 2: UX/UX & Copywriting (Dez 2024)
- FAQs interativos na homepage
- CTAs otimizados (padrão VERB + NOUN)
- Headlines com social proof ("1000+ usuários")
- Empty states melhorados

#### Sprint 3: Sistema de Cupons Progressivos (Dez 2024) - **ATUAL**
- ✅ Cupons progressivos (10% → 15% → 20%)
- ✅ Validação em tempo real
- ✅ Geração automática após pedido
- ✅ Checkout simplificado (Condomínio/Torre/Apartamento)
- 🚧 Templates de email (preparados, não ativos)

---

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend**:
- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animações

**Backend**:
- **Supabase** - Database (PostgreSQL) + Auth + Realtime
- **Next.js API Routes** - Server functions

**Integrações**:
- **OneSignal** - Push notifications
- **Resend** - Email (preparado, não ativo)

### Estrutura de Pastas

```
na-midia/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── eventos/             # Listagem de eventos
│   ├── cupons/              # Cupons do usuário
│   ├── delivery/            # Sistema de delivery
│   │   ├── checkout/        # Checkout com cupons
│   │   └── jeronimo/        # Delivery exclusivo Jeronimo
│   ├── admin/               # Painel administrativo
│   └── api/                 # API routes
│       └── delivery/        # APIs de delivery
│
├── components/              # Componentes React
│   ├── delivery/            # Componentes de delivery
│   │   ├── CouponInput.tsx          # Input de cupom
│   │   ├── CondominiumSelector.tsx  # Seletor condomínio
│   │   ├── TowerSelector.tsx        # Seletor torre
│   │   └── ApartmentInput.tsx       # Input apartamento
│   ├── ui/                  # Componentes base
│   └── [outros]             # Hero, FAQs, etc
│
├── lib/                     # Utilitários e lógica
│   ├── delivery/            # Sistema de delivery
│   │   ├── coupon-system.ts         # Lógica de cupons
│   │   ├── email-templates.ts       # Templates email
│   │   └── simplified-checkout-types.ts
│   ├── supabase/            # Cliente Supabase
│   └── auth/                # Autenticação
│
└── supabase/
    └── migrations/          # SQL migrations
        └── create_delivery_coupons_progressive.sql
```

---

## 💾 Banco de Dados (Supabase)

### Tabelas Principais

| Tabela | Propósito | Status |
|--------|-----------|--------|
| `events` | Eventos da cidade | ✅ Ativo |
| `confirmations` | Confirmações de presença | ✅ Ativo |
| `coupons` | Cupons de eventos | ✅ Ativo |
| `delivery_orders` | Pedidos de delivery | ✅ Ativo |
| `delivery_products` | Produtos | ✅ Ativo |
| `delivery_coupons_progressive` | Cupons progressivos | ✅ Novo (Sprint 3) |

### Sistema de Cupons Progressivos

**Como funciona**:
1. Cliente faz **1º pedido** → Ganha cupom **10% OFF**
2. Usa cupom no **2º pedido** → Ganha cupom **15% OFF**
3. Usa cupom no **3º pedido** → Ganha cupom **20% OFF**
4. A partir do 3º: sempre **20% OFF**

**Estrutura**:
```sql
delivery_coupons_progressive:
  - code (VOLTA10-ABC123)
  - discount_percentage (10, 15, 20)
  - user_email
  - is_used
  - expires_at (30 dias)
```

---

## 🔧 Configuração Local

### 1. Pré-requisitos
```bash
Node.js >= 18
npm ou pnpm
```

### 2. Instalação
```bash
git clone https://github.com/Guiden-Source/na-midia-atibaia.git
cd na-midia
npm install
```

### 3. Variáveis de Ambiente

Crie `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Opcional

# OneSignal (Push Notifications)
NEXT_PUBLIC_ONESIGNAL_APP_ID=...
ONESIGNAL_REST_API_KEY=...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend (Email - Opcional)
RESEND_API_KEY=re_... # Não ativo ainda
```

### 4. Rodar Localmente
```bash
npm run dev
# Acesse: http://localhost:3000
```

### 5. Build de Produção
```bash
npm run build
npm start
```

---

## 📨 Sistema de Notificações

### OneSignal (Push Web)

**Setup**:
1. Crie conta em [OneSignal](https://onesignal.com)
2. Crie um app Web Push
3. Configure variáveis `.env.local`
4. No painel OneSignal, configure Site URL

**Uso**:
- Botão "Receber avisos" no header
- Admin envia notificação ao criar evento
- Segmento "All" = todos os inscritos

---

## 🎨 Design System

### Copywriting
Seguimos um **guia de copywriting** rigoroso:
- Tom: Conversacional e amigável
- Padrão CTA: **VERB + NOUN** (ex: "Descobrir Eventos 🎉")
- Emojis estratégicos para clareza
- Benefícios > Features

Ver: [`/brain/.../copywriting_guide.md`]

### Cores & Branding
- **Primária**: Orange-500 → Pink-500 (gradiente)
- **Secundária**: Green (sucesso), Red (erro)
- **Neutros**: Gray-50 → Gray-900 (dark mode)

---

## 🚀 Deploy

### Vercel (Automático)

**Produção**:
- Push para `main` → Deploy automático
- URL: https://na-midia-atibaia.vercel.app

**Preview**:
- Pull Requests → Preview deploy automático

### Checklist Deploy
- [ ] Migrations SQL rodadas no Supabase Production
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local passa (`npm run build`)
- [ ] Testes manuais em preview

---

## 📊 Roadmap

### ✅ Completado
- [x] Sistema de eventos em tempo real
- [x] Confirmação de presença + cupons
- [x] Push notifications
- [x] Sistema de delivery
- [x] Cupons progressivos
- [x] Checkout simplificado (Jeronimo 1 & 2)

### 🚧 Em Desenvolvimento
- [ ] Emails automatizados (Resend)
- [ ] Analytics de cupons

### 📋 Backlog
- [ ] Painel admin de cupons
- [ ] Expansão para mais condomínios
- [ ] App mobile (React Native)
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Marketplace de produtos locais

---

## 📖 Documentação Adicional

### Artifacts (Brain)
Documentação técnica detalhada em `/Users/guilhermebrandao/.gemini/antigravity/brain/[id]/`:

- **`task.md`** - Checklist de tarefas por sprint
- **`implementation_plan.md`** - Planos técnicos detalhados
- **`walkthrough.md`** - Documentação de implementação
- **`copywriting_guide.md`** - Guia de linguagem
- **`sprint3_deploy_status.md`** - Status de deploys

### APIs Internas

#### Delivery
- `POST /api/delivery/create-order` - Cria pedido
- `POST /api/delivery/send-order-email` - Envia email (preparado)

#### Eventos
- `POST /api/events/notify` - Envia push notification

---

## 🤝 Contribuindo

### Fluxo de Trabalho
1. Crie branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -m "feat: descrição"`
3. Push: `git push origin feature/minha-feature`
4. Abra Pull Request

### Convenções de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes

---

## 📞 Suporte

### Contato
- **Instagram**: [@namidia.atibaia](https://instagram.com/namidia.atibaia)
- **Email**: contato@namidia.com.br

### Issues
Abra uma issue no GitHub para:
- 🐛 Reportar bugs
- 💡 Sugerir features
- 📖 Melhorias de documentação

---

## 📄 Licença

Este projeto é proprietário e confidencial.  
© 2024 Na Mídia Atibaia - Todos os direitos reservados.

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para a comunidade de Atibaia.

**Stack & Tools**:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [OneSignal](https://onesignal.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Última atualização**: 31 de Dezembro de 2024  
**Versão**: Sprint 3 - Sistema de Cupons Progressivos  
**Status**: ✅ Em Produção
