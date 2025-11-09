# Cross-Browser Testing Guide

## 🌐 Browsers Alvo

### Desktop (macOS)
- ✅ **Chrome** (primary) - v120+
- ✅ **Safari** - v17+
- ✅ **Firefox** - v121+
- ⚠️ Edge - v120+ (opcional, baseado em Chromium)

### Mobile (iOS)
- ✅ **Safari iOS** - v17+
- ⚠️ Chrome iOS (usa Safari engine)

## 📋 Checklist de Teste

### 1. Renderização de Cores (HSL)

**O que testar:**
- [ ] `orange-500` (#ea580c) renderiza consistente
- [ ] Gradients (`from-orange-500 to-orange-600`) sem banding
- [ ] `text-transparent` com `bg-clip-text` funciona
- [ ] Opacity (`bg-white/80`) renderiza corretamente

**Comandos de Teste:**

```javascript
// No Console de cada browser
const testColors = () => {
  const elements = [
    { selector: '.bg-primary', expected: 'rgb(234, 88, 12)' },
    { selector: '.text-gray-900', expected: 'rgb(17, 24, 39)' },
    { selector: '.text-gray-700', expected: 'rgb(55, 65, 81)' },
  ];
  
  elements.forEach(({ selector, expected }) => {
    const el = document.querySelector(selector);
    if (el) {
      const computed = getComputedStyle(el);
      const actual = computed.backgroundColor || computed.color;
      console.log(`${selector}: ${actual} ${actual === expected ? '✅' : '❌'}`);
    }
  });
};

testColors();
```

### 2. Dark Mode Integration

**Chrome:**
```
DevTools → Rendering → Emulate CSS media feature prefers-color-scheme: dark
```

**Safari:**
```
Develop → Experimental Features → Dark Mode CSS Override
```

**Firefox:**
```
about:config → ui.systemUsesDarkTheme → 1 (dark) / 0 (light)
```

**System-wide (macOS):**
```
System Settings → Appearance → Dark
```

**Verificar:**
- [ ] Cores mudam automaticamente (gray-900 → white)
- [ ] Gradients ajustam (orange-600 → orange-400)
- [ ] Backgrounds escurecem (white → gray-900)
- [ ] Sem "flash" de tema incorreto no load

### 3. Tailwind CSS Classes

**Testar classes críticas:**

```javascript
// No Console
const testTailwind = () => {
  const tests = [
    'text-gray-900 dark:text-white',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'hover:scale-105 transition-all',
    'backdrop-blur-md',
  ];
  
  tests.forEach(className => {
    const el = document.querySelector(`.${className.split(' ')[0]}`);
    if (el) {
      console.log(`${className}: ${el.className.includes(className) ? '✅' : '❌'}`);
    }
  });
};

testTailwind();
```

### 4. Animações e Transições

**Elementos a testar:**

| Elemento | Animação | Chrome | Safari | Firefox |
|----------|----------|--------|--------|---------|
| Hero CTAs | `hover:scale-105` | | | |
| Stats Cards | `hover:shadow-lg` | | | |
| Event Cards | `hover:-translate-y-2` | | | |
| Como Funciona | `group-hover:rotate-6` | | | |
| Testimonials | Marquee scroll | | | |

**Verificar:**
- [ ] Smooth transitions (não "jumpy")
- [ ] Performance 60fps (sem lag)
- [ ] Backdrop-blur funciona
- [ ] Framer Motion animations suaves

### 5. Font Rendering

**Chrome:**
```css
/* Anti-aliasing padrão */
-webkit-font-smoothing: antialiased;
```

**Safari:**
```css
/* Rendering mais fino */
-webkit-font-smoothing: subpixel-antialiased;
```

**Firefox:**
```css
/* Próprio sistema */
-moz-osx-font-smoothing: grayscale;
```

**Verificar:**
- [ ] Baloo 2 (títulos) renderiza bold adequadamente
- [ ] Inter (corpo) legível em todos os tamanhos
- [ ] Text-shadows visíveis (evento cards)
- [ ] Font weights consistentes (extrabold = 800)

### 6. Responsividade

**Breakpoints Tailwind:**
```
sm: 640px   → Tablet
md: 768px   → Tablet Landscape
lg: 1024px  → Desktop
xl: 1280px  → Large Desktop
```

**Teste em cada browser:**

```javascript
// Resize window e verificar
const testBreakpoints = () => {
  const breakpoints = [375, 640, 768, 1024, 1280, 1920];
  
  breakpoints.forEach(width => {
    window.resizeTo(width, 900);
    console.log(`${width}px: ${document.body.clientWidth}px`);
  });
};

// Ou usar DevTools Device Toolbar
```

**Verificar:**
- [ ] Layout não quebra em nenhum breakpoint
- [ ] Touch targets >44px em mobile
- [ ] Text wrapping adequado
- [ ] Images mantêm aspect ratio

### 7. Flexbox & Grid

**Chrome/Firefox/Safari diferenças:**

```css
/* Potencial issue: Safari com gap em flexbox */
.flex { gap: 1rem; } /* Verificar espaçamento */

/* Grid auto-fill */
.grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
```

**Verificar:**
- [ ] Bento Grid alinha corretamente
- [ ] Event cards grid responsivo
- [ ] Stats cards distribuem uniformemente
- [ ] Gaps consistentes (gap-4, gap-6)

### 8. Blur Effects

**Safari tem limitações com backdrop-blur:**

```tsx
// Testar esses elementos
<div className="backdrop-blur-md" />
<div className="blur-3xl" />
```

**Fallback se não funcionar:**

```tsx
// Adicionar background sólido como fallback
className="backdrop-blur-md bg-white/80"
// Safari ignora blur mas usa bg-white/80
```

**Verificar:**
- [ ] Hero background blur visível
- [ ] Stats cards backdrop-blur funciona
- [ ] Decorative blur circles (orange/400/10)

### 9. Performance (Chrome DevTools)

**Lighthouse em cada browser:**

1. **Chrome:**
   ```
   DevTools → Lighthouse → Generate Report
   ```

2. **Safari:**
   ```
   Develop → Show Web Inspector → Timelines
   ```

3. **Firefox:**
   ```
   DevTools → Performance → Record
   ```

**Métricas Alvo:**

| Métrica | Target | Chrome | Safari | Firefox |
|---------|--------|--------|--------|---------|
| FCP (First Contentful Paint) | <1.8s | | | |
| LCP (Largest Contentful Paint) | <2.5s | | | |
| CLS (Cumulative Layout Shift) | <0.1 | | | |
| TBT (Total Blocking Time) | <300ms | | | |

### 10. Known Browser Issues

#### Safari Specific

**Issue 1: Position Sticky com Overflow**
```css
/* Safari pode ignorar sticky em flex containers */
.flex .sticky { position: -webkit-sticky; }
```

**Issue 2: Date Input Formatting**
```tsx
// Safari formata datas diferente
<input type="datetime-local" />
// Validar formato ISO 8601
```

**Issue 3: Gradient Text**
```css
/* Safari precisa -webkit- prefix */
.gradient-text {
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### Firefox Specific

**Issue 1: Scrollbar Customization**
```css
/* Firefox ignora ::-webkit-scrollbar */
/* Usar scrollbar-width e scrollbar-color */
html {
  scrollbar-width: thin;
  scrollbar-color: #ea580c transparent;
}
```

**Issue 2: Backdrop Filter**
```css
/* Firefox requer flag habilitada */
/* about:config → layout.css.backdrop-filter.enabled → true */
```

## 🧪 Automated Testing Script

Salvar como `cross-browser-test.js`:

```javascript
// Executar no Console de cada browser

const runTests = () => {
  const results = {
    browser: navigator.userAgent,
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Color Rendering
  const primaryBtn = document.querySelector('.bg-primary');
  results.tests.primaryColor = getComputedStyle(primaryBtn)?.backgroundColor;

  // Test 2: Dark Mode
  const isDark = document.documentElement.classList.contains('dark');
  results.tests.darkMode = isDark;

  // Test 3: Font Loading
  const title = document.querySelector('h1');
  results.tests.fontFamily = getComputedStyle(title)?.fontFamily;

  // Test 4: Animations
  const hasTransitions = getComputedStyle(primaryBtn)?.transition !== 'none';
  results.tests.transitions = hasTransitions;

  // Test 5: Backdrop Blur
  const blurred = document.querySelector('.backdrop-blur-md');
  results.tests.backdropFilter = getComputedStyle(blurred)?.backdropFilter !== 'none';

  console.table(results.tests);
  return results;
};

runTests();
```

## 📊 Relatório Template

```markdown
# Cross-Browser Test Report - [Data]

## Browsers Testados
- ✅ Chrome 120.x (macOS 14.x)
- ✅ Safari 17.x (macOS 14.x)
- ✅ Firefox 121.x (macOS 14.x)

## Resultados

### Cores e Gradients
| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| HSL Colors | ✅ | ✅ | ✅ |
| Gradients | ✅ | ✅ | ✅ |
| Text Gradient | ✅ | ⚠️ Lighter | ✅ |
| Opacity | ✅ | ✅ | ✅ |

### Dark Mode
| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| Auto-switch | ✅ | ✅ | ✅ |
| Colors | ✅ | ✅ | ✅ |
| Transitions | ✅ | ⚠️ Slow | ✅ |

### Animações
| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| Hover Effects | ✅ | ✅ | ✅ |
| Transitions | ✅ | ✅ | ✅ |
| Backdrop Blur | ✅ | ⚠️ Requires enable | ⚠️ Flag |
| Marquee | ✅ | ✅ | ✅ |

### Performance
| Métrica | Chrome | Safari | Firefox | Target |
|---------|--------|--------|---------|--------|
| FCP | 1.2s | 1.5s | 1.3s | <1.8s ✅ |
| LCP | 2.1s | 2.4s | 2.2s | <2.5s ✅ |
| CLS | 0.05 | 0.08 | 0.06 | <0.1 ✅ |

## Issues Encontrados
- ⚠️ Safari: Gradient text ligeiramente mais claro (aceitável)
- ⚠️ Firefox: Backdrop-blur requer flag habilitada
- ✅ Todos os browsers passaram contraste WCAG AA

## Recomendações
- ✅ Nenhuma alteração crítica necessária
- 📝 Documentar flag Firefox para desenvolvedores
- 📝 Adicionar fallback para backdrop-blur (bg-white/80)
```

## 🔧 Ferramentas Úteis

### BrowserStack (Cloud Testing)
```
https://www.browserstack.com/
```
Teste em múltiplos browsers/dispositivos reais

### Can I Use (Compatibility)
```
https://caniuse.com/
```
Verificar suporte de features CSS/JS

### Autoprefixer (VS Code)
```bash
# Adicionar prefixes automaticamente
npm install -D autoprefixer
```

### Polyfills (se necessário)
```tsx
// Se backdrop-blur não funcionar
import 'backdrop-filter-polyfill';
```

---

**Frequência:** Semanal durante desenvolvimento, antes de cada release
**Responsável:** QA Team / Frontend Dev
**Duração Estimada:** 30-45 minutos por ciclo completo
