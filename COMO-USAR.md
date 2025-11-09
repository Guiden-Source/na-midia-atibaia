# 🎯 Como Usar os Novos Componentes

## 🚀 Quick Start

### 1. Navegação Mobile (Expandable Tabs)

Já está integrado no layout automaticamente! Aparece apenas em mobile (< 768px).

```tsx
// Já adicionado em app/layout.tsx
import { ExpandableTabs } from '@/components/ui/expandable-tabs';

// No footer:
<div className="md:hidden">
  <ExpandableTabs />
</div>
```

### 2. Liquid Glass Components

**Para Cards Premium:**
```tsx
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

<LiquidGlassCard 
  intensity={0.6} 
  gradientBorder 
  hover
  className="p-8"
>
  <h3>Título Premium</h3>
  <p>Conteúdo especial</p>
</LiquidGlassCard>
```

**Para Botões Especiais:**
```tsx
import { LiquidGlassButton } from '@/components/ui/liquid-glass';

<LiquidGlassButton 
  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
  onClick={handleClick}
>
  Clique Aqui
</LiquidGlassButton>
```

**Para Containers Customizados:**
```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';

<LiquidGlass 
  intensity={0.3} 
  hover={false}
  rounded="xl"
>
  {/* Seu conteúdo */}
</LiquidGlass>
```

### 3. Hero Section Alternativo (Tailark)

Substitua o Hero atual por este em `app/page.tsx`:

```tsx
import { TailarkHeroSection } from '@/components/ui/tailark-hero';

// Em vez de:
<HeroSection />

// Use:
<TailarkHeroSection />
```

Features:
- Parallax scrolling automático
- Floating cards animados
- Stats integrados (editáveis no arquivo)

### 4. Event Bento Grid

Já está integrado! Substitui os cards antigos.

Para customizar o layout, edite `EventBentoGrid.tsx`:
```tsx
// Linha 30-32
const isLarge = index % 5 === 0; // A cada 5 cards, um grande
const isMedium = index % 3 === 0 && !isLarge; // A cada 3, um médio
```

### 5. Modern How It Works

Já está integrado! Substitui a seção antiga.

Para editar os steps, veja `ModernHowItWorksSection.tsx`:
```tsx
const steps = [
  {
    number: 1,
    icon: PartyPopper,
    title: "Seu Título",
    description: "Sua descrição",
    color: "from-orange-500 to-orange-600", // Gradient
    // ...
  },
  // Mais steps...
];
```

### 6. Login Moderno

Acesse via `/login-modern` ou atualize o link no header:

```tsx
// Em app/layout.tsx, substitua:
<Link href="/login">Login</Link>

// Por:
<Link href="/login-modern">Login</Link>
```

### 7. Página de Cupons

Já criada em `/cupons`. Usuários logados veem seus cupons.

Para adicionar link no menu:
```tsx
<Link href="/cupons">Meus Cupons</Link>
```

## 🎨 Customização

### Cores do Tema

Todas estão em `tailwind.config.ts`:
```ts
colors: {
  primary: {
    DEFAULT: "hsl(20 94% 48%)", // Orange #ea580c
    // ...
  }
}
```

### Fontes

Já configuradas em `app/layout.tsx`:
```tsx
const baloo2 = Baloo_2({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo2',
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});
```

Uso no código:
```tsx
<h1 className="font-baloo2 font-bold">Título</h1>
<p className="font-inter">Texto normal</p>
```

### Animações

BlurFade para qualquer seção:
```tsx
import { BlurFade } from '@/components/ui/blur-fade';

<BlurFade delay={0.2} inView>
  <section>{/* conteúdo */}</section>
</BlurFade>
```

## 📱 Responsividade

### Breakpoints Tailwind
```tsx
// Mobile first por padrão
<div className="
  text-sm              /* mobile */
  sm:text-base         /* 640px+ */
  md:text-lg           /* 768px+ */
  lg:text-xl           /* 1024px+ */
">
```

### Grid Responsivo
```tsx
<div className="
  grid 
  grid-cols-1          /* mobile: 1 coluna */
  md:grid-cols-2       /* tablet: 2 colunas */
  lg:grid-cols-3       /* desktop: 3 colunas */
  gap-6
">
```

### Mobile Navigation
```tsx
// Mostrar apenas em mobile
<div className="md:hidden">
  <MobileComponent />
</div>

// Ocultar em mobile
<div className="hidden md:block">
  <DesktopComponent />
</div>
```

## 🔧 Configuração de Ambiente

### Variáveis Necessárias

Arquivo `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
```

### Dependências

Já instaladas:
```json
{
  "framer-motion": "^11.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "class-variance-authority": "^0.x",
  "lucide-react": "^0.x",
  "react-hot-toast": "^2.x"
}
```

## 🐛 Troubleshooting

### "Cannot find module 'framer-motion'"
```bash
npm install framer-motion clsx tailwind-merge class-variance-authority
```

### Animações não funcionam
Verifique se framer-motion está instalado e se o componente é Client Component:
```tsx
"use client"; // Adicione no topo do arquivo
```

### Dark mode não funciona
Certifique-se de que o Provider está configurado em `layout.tsx`:
```tsx
<html className="dark"> {/* ou sistema de toggle */}
```

### Navegação mobile não aparece
Verifique:
1. Componente está envolvido em `<div className="md:hidden">`
2. Footer tem `mb-20 md:mb-0` para espaçamento

## 📚 Documentação Completa

- **COMPONENTES-UI.md** - Lista completa de componentes
- **RESPONSIVIDADE.md** - Checklist de responsividade
- **PERFORMANCE.md** - Guia de otimização
- **RESUMO-IMPLEMENTACAO.md** - Resumo da implementação

## 💡 Dicas

### Performance
- Use `priority` apenas nas primeiras 3 imagens
- Evite animações complexas em listas longas
- Memoize componentes que re-renderizam muito

### Acessibilidade
- Mantenha touch targets ≥ 44x44px
- Use cores com contrast ratio adequado
- Teste com keyboard navigation

### Manutenção
- Componentes estão isolados e reutilizáveis
- Documentação inline com JSDoc
- TypeScript para type safety

## 🎉 Está Pronto!

Todos os componentes estão integrados e funcionais. Basta rodar:

```bash
npm run dev
```

E acessar http://localhost:3000

Aproveite! 🚀
