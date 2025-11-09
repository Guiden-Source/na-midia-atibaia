# ✅ Checklist de Testes Mobile - Na Mídia

## 🎯 CRÍTICO (Pré-Lançamento Obrigatório)

### Viewport & Zoom
- [x] Viewport meta configurado: `width=device-width, initial-scale=1, maximum-scale=5`
- [x] Zoom permitido até 500% (WCAG 1.4.4)
- [x] user-scalable=true configurado
- [ ] Testado zoom em iOS Safari
- [ ] Testado zoom em Chrome Android

### Touch Targets (44x44px mínimo)
- [x] Botões principais ≥48px altura
- [x] Links de navegação ≥44px
- [x] Ícones do bottom nav ≥48px
- [x] Inputs de formulário ≥48px
- [x] Espaçamento entre touch targets ≥8px
- [ ] Testado em iPhone SE (tela menor)
- [ ] Testado em Galaxy S23

### Formulários
- [x] Font-size inputs ≥16px (evita auto-zoom iOS)
- [x] Altura mínima inputs: 48px
- [x] Labels visíveis em TODOS campos
- [x] type="text" para nome (com autocomplete="name")
- [x] Placeholders apenas como exemplo
- [x] Validação inline implementada
- [ ] Testado teclado mobile correto

### Contraste (WCAG AA: 4.5:1 normal, 3:1 large)
- [x] Badge laranja: text-orange-800 sobre bg-orange-100 ✅
- [x] Texto sobre fundos: gray-700+ sobre white
- [x] Botões CTAs: cores sólidas com bom contraste
- [ ] Testado em luz solar direta
- [ ] Validado com ferramenta de contraste (WebAIM)

### Layout Mobile
- [x] Cards de evento: grid-cols-1 em mobile
- [x] Como Funciona: stack vertical (<640px)
- [x] Padding horizontal: 20px (px-5)
- [x] Heading reduzido: 32px (text-3xl) em mobile
- [ ] Scroll horizontal prevenido (overflow-x: hidden)
- [ ] Testado em 320px width (iPhone SE)

### Acessibilidade
- [x] Focus states visíveis (3px outline laranja)
- [x] aria-label em botões importantes
- [x] Contraste 3:1 em focus indicators
- [x] Orientação livre (portrait/landscape)
- [ ] Testado com iOS VoiceOver
- [ ] Testado com Android TalkBack
- [ ] Tab order lógico em formulários

## 🔶 ALTO (Importante para UX)

### Performance
- [x] Lazy loading em imagens não críticas
- [x] Next.js Image com sizes corretos
- [ ] Core Web Vitals mobile (PageSpeed Insights)
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1
  - [ ] INP < 200ms
- [ ] Testado em 3G throttling
- [ ] Fontes otimizadas (font-display: swap)

### Feedback Visual
- [x] Loading states em botões
- [x] Toast notifications implementadas
- [x] Spinners durante ações
- [x] CTAs na zona do polegar (bottom)
- [ ] Animations respeitam prefers-reduced-motion

### Navegação
- [x] Bottom nav mobile implementado
- [x] Touch targets bem espaçados
- [x] Feedback visual em taps
- [ ] Botão "X" em modais: 44x44px
- [ ] Sticky header não ocupa muito espaço

## 📋 MÉDIO (Melhorias Graduais)

### Conteúdo
- [x] Line-height: 1.6 em textos
- [x] Heading line-height: 1.2
- [x] Depoimentos únicos (máx 4)
- [ ] Textos reduzidos para mobile (2-3 linhas max)
- [ ] Hierarquia h1→h2→h3 validada

### Imagens
- [x] loading="lazy" em imagens secundárias
- [x] priority nas imagens hero
- [ ] WebP/AVIF via srcset
- [ ] Alt text descritivo

### UX
- [ ] Safe area para iPhone notch
- [ ] Gestos simples (sem pinch/swipe complexos)
- [ ] Animações suaves (não agressivas)

## 💡 BAIXO (Polimento)

### Otimizações
- [ ] Prefetch de páginas principais
- [ ] Code splitting por rota
- [ ] Bundle JS analisado
- [ ] Console.logs removidos
- [ ] Service worker/PWA considerado

### Analytics
- [ ] Hotjar/Clarity instalado
- [ ] Métricas mobile segmentadas
- [ ] Heatmaps de mobile analisados
- [ ] A/B testing de CTAs

## 🧪 TESTES EM DISPOSITIVOS REAIS

### iOS
- [ ] iPhone SE (2020) - 375x667px
- [ ] iPhone 15 Pro - 393x852px
- [ ] Safari iOS testado
- [ ] VoiceOver testado
- [ ] Zoom até 200% testado

### Android
- [ ] Galaxy S23 - 360x780px
- [ ] Pixel 7 - 412x915px
- [ ] Chrome Android testado
- [ ] TalkBack testado
- [ ] Zoom até 200% testado

### Condições de Rede
- [ ] 3G (750kbps) - <3s load time
- [ ] 4G (4Mbps)
- [ ] Wi-Fi
- [ ] Offline (se aplicável)

## 🔍 FERRAMENTAS DE TESTE

### Contraste
- [ ] WebAIM Contrast Checker
- [ ] Stark plugin
- [ ] Chrome DevTools (Lighthouse)

### Performance
- [ ] PageSpeed Insights Mobile
- [ ] Lighthouse CI
- [ ] WebPageTest (3G)

### Acessibilidade
- [ ] axe DevTools
- [ ] WAVE
- [ ] iOS VoiceOver
- [ ] Android TalkBack

## 📊 MÉTRICAS DE SUCESSO

- **Touch Target Success Rate**: >95% alvos ≥44px
- **Contrast Pass Rate**: 100% WCAG AA
- **Mobile Load Time**: <3s em 3G
- **Core Web Vitals**: LCP<2.5s, CLS<0.1, INP<200ms
- **Accessibility Score**: Lighthouse ≥95

---

## ✅ STATUS ATUAL

**Completo (70%):**
- ✅ Touch targets 44x44px
- ✅ Inputs otimizados (16px+, 48px height)
- ✅ Viewport zoom configurado
- ✅ Grid mobile (grid-cols-1)
- ✅ Contraste melhorado
- ✅ Focus states visíveis
- ✅ Lazy loading implementado
- ✅ Line-height otimizado

**Pendente (30%):**
- ⏳ Testes em dispositivos reais
- ⏳ Core Web Vitals mobile
- ⏳ VoiceOver/TalkBack
- ⏳ Validação de contraste em luz solar

---

**Última atualização:** 8 de novembro de 2025
**Próxima revisão:** Após testes em dispositivos reais
