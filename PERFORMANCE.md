# 🚀 Guia de Otimização de Performance

## ✅ Otimizações Já Implementadas

### 1. **Next.js 14 App Router**
- ✅ Server Components por padrão
- ✅ Streaming SSR automático
- ✅ Automatic code splitting por rota
- ✅ Built-in Image Optimization (next/image)

### 2. **Font Optimization**
- ✅ next/font/google para Baloo 2 e Inter
- ✅ Automatic subsetting
- ✅ Self-hosted fonts (sem chamadas externas)
- ✅ Font display: swap configurado

### 3. **Images**
- ✅ Next/Image usado em todos lugares
- ✅ Lazy loading automático
- ✅ Responsive images (srcset)
- ✅ WebP/AVIF quando suportado

### 4. **CSS & Styling**
- ✅ Tailwind CSS (JIT compilation)
- ✅ Purge CSS automático
- ✅ CSS-in-JS evitado (melhor performance)
- ✅ Critical CSS inline

### 5. **Animations**
- ✅ GPU-accelerated (transform, opacity)
- ✅ Framer Motion otimizado (layoutId)
- ✅ CSS animations via Tailwind
- ✅ Reduced motion support

### 6. **Data Fetching**
- ✅ Server Components para fetch inicial
- ✅ Supabase client-side cache
- ✅ revalidatePath após mutations
- ✅ Polling intervalo otimizado (30s)

## 🔧 Otimizações Recomendadas

### 1. **Lazy Loading de Componentes**

```tsx
// Em vez de:
import { HeavyComponent } from './HeavyComponent';

// Usar:
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Se não precisa SSR
});
```

**Candidatos:**
- TestimonialsSection (não crítico above-fold)
- FeaturesSection
- Modal components (apenas quando abertos)

### 2. **Image Optimization Avançada**

```tsx
// Adicionar placeholder blur
<Image
  src={evento.image_url}
  alt={evento.name}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Gerar com lib
  priority={index < 3} // Apenas para primeiros 3 eventos
/>
```

### 3. **Bundle Analysis**

```bash
# Instalar
npm install @next/bundle-analyzer

# Adicionar em next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... config existente
})

# Rodar
ANALYZE=true npm run build
```

### 4. **Reduce Client-Side JavaScript**

**Mover para Server Components onde possível:**
- Seções estáticas (Hero, How It Works sem interação)
- Cards de eventos (display only)
- Testimonials (apenas scroll, pode ser CSS)

**Manter Client Components apenas para:**
- Formulários e inputs
- Modal/Dialog
- Animações complexas
- State management

### 5. **Database Optimization**

```sql
-- Criar índices no Supabase
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_is_active ON events(is_active);
CREATE INDEX idx_confirmations_user_event 
  ON event_confirmations(user_id, event_id);

-- Query otimizada
SELECT 
  e.*,
  COUNT(ec.id) as confirmations_count
FROM events e
LEFT JOIN event_confirmations ec ON e.id = ec.event_id
WHERE e.is_active = true 
  AND e.start_time > NOW()
GROUP BY e.id
ORDER BY e.start_time ASC
LIMIT 20;
```

### 6. **Caching Strategy**

```tsx
// app/page.tsx - Cache estático com revalidação
export const revalidate = 60; // Revalidate a cada 60s

// ou fetch específico
const events = await fetch('...', {
  next: { revalidate: 60 }
});
```

### 7. **Preload Critical Resources**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="preload" href="/logotiponamidiavetorizado.svg" as="image" />
        <link rel="preconnect" href="https://supabase.co" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 8. **Framer Motion Optimization**

```tsx
// Usar AnimatePresence apenas quando necessário
// Evitar re-renders desnecessários
const MemoizedCard = memo(({ event }) => (
  <motion.div
    initial={false} // Desabilita animação inicial se já renderizado
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* content */}
  </motion.div>
));

// Usar layoutId apenas quando necessário
// Remover de elementos que não compartilham layout
```

## 📊 Métricas Alvo

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s ✅ (Hero image/logo)
- **FID (First Input Delay)**: < 100ms ✅ (Buttons responsivos)
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅ (Dimensions fixas, sem shifts)

### Lighthouse Scores
- **Performance**: > 90
- **Accessibility**: > 95 ✅
- **Best Practices**: > 95 ✅
- **SEO**: > 95 ✅

## 🧪 Testes de Performance

### 1. **Lighthouse Audit**
```bash
# Chrome DevTools > Lighthouse > Analyze page load
# Ou
npm install -g lighthouse
lighthouse https://localhost:3000 --view
```

### 2. **WebPageTest**
- https://www.webpagetest.org/
- Testar em 3G/4G
- Verificar waterfall

### 3. **React DevTools Profiler**
- Identificar renders desnecessários
- Otimizar com memo/useMemo/useCallback

## 📝 Checklist de Implementação

### Fase 1 - Quick Wins (1-2 horas)
- [ ] Dynamic imports para sections pesadas
- [ ] Memoizar componentes que re-renderizam
- [ ] Adicionar priority nas primeiras imagens
- [ ] Reduzir polling interval (30s → 60s)

### Fase 2 - Medium Effort (2-4 horas)
- [ ] Bundle analysis e tree shaking
- [ ] Converter componentes para Server Components
- [ ] Implementar database indexes
- [ ] Configurar cache headers

### Fase 3 - Advanced (4+ horas)
- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Service Worker para offline
- [ ] CDN para assets estáticos
- [ ] Edge functions para geolocation

## 🎯 Resultado Esperado

**Antes:**
- Performance Score: ~70-80
- LCP: 3-4s
- FID: 200-300ms
- Bundle Size: 500-600KB

**Depois (com otimizações):**
- Performance Score: 90+
- LCP: < 2s
- FID: < 100ms
- Bundle Size: 300-400KB

## 🔍 Monitoramento Contínuo

### Ferramentas Recomendadas:
1. **Vercel Analytics** (se hospedado na Vercel)
2. **Google Analytics 4** + Web Vitals
3. **Sentry** para error tracking
4. **LogRocket** para session replay

### Alertas Configurar:
- LCP > 3s
- FID > 200ms
- Error rate > 1%
- API latency > 1s
