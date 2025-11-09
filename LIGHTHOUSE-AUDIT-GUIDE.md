# Guia de Auditoria WCAG AA/AAA - Lighthouse

## 📋 Como Executar Auditoria

### 1. Via Chrome DevTools (Recomendado)

1. **Abrir o site:**
   ```
   http://localhost:3000
   ```

2. **Abrir DevTools:**
   - Mac: `Cmd + Option + I`
   - Windows: `F12`

3. **Executar Lighthouse:**
   - Ir na aba **Lighthouse**
   - Selecionar:
     - ✅ **Performance**
     - ✅ **Accessibility**
     - ✅ **Best Practices**
     - ✅ **SEO**
   - Device: **Desktop** e depois **Mobile**
   - Click **"Generate report"**

4. **Analisar Accessibility Score:**
   - **Meta:** ≥90 pontos (Bom) | **Ideal:** ≥95 (Excelente)
   - Verificar seção "Accessibility" expandida
   - Focar em:
     - ❌ "Contrast" issues (prioridade alta)
     - ⚠️ "Touch targets" warnings
     - ⚠️ "Font sizes" issues

### 2. Via CLI (Opcional - Para Automação)

```bash
# Instalar Lighthouse globalmente
npm install -g lighthouse

# Executar audit completo
lighthouse http://localhost:3000 \
  --view \
  --output html \
  --output-path ./lighthouse-report.html \
  --preset=desktop

# Audit focado em acessibilidade
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --view
```

## 🎯 Checklist de Auditoria

### Seção por Seção

#### ✅ 1. Hero Section

**Elementos a Validar:**
- [ ] Título principal: contrast ratio ≥7:1
- [ ] Subtítulo: contrast ratio ≥4.5:1
- [ ] "cupom exclusivo" highlight: contrast ratio ≥4.5:1
- [ ] CTAs (botões): contrast ratio ≥4.5:1
- [ ] Stats cards labels: font-size ≥14px
- [ ] Touch targets: ≥44×44px

**Comando Específico:**
```javascript
// No DevTools Console
document.querySelectorAll('section')[0].scrollIntoView()
// Rodar Lighthouse na viewport atual
```

#### ✅ 2. Como Funciona Section

**Elementos a Validar:**
- [ ] Gradient title legível em dark mode
- [ ] Card descriptions: contrast ≥4.5:1
- [ ] Step numbers em badges: contrast ≥4.5:1
- [ ] Icons em cards: tamanho adequado

#### ✅ 3. Eventos Section

**Elementos a Validar:**
- [ ] Títulos "HOJE" / "PRÓXIMOS": contrast ≥7:1 (dark mode)
- [ ] Event card titles: contrast ≥7:1
- [ ] Event info (local, data): contrast ≥4.5:1
- [ ] Badge "CUPOM": contrast ≥4.5:1
- [ ] Overlay gradient: texto legível sobre imagens

#### ✅ 4. Testimonials Section

**Elementos a Validar:**
- [ ] Username: contrast ≥4.5:1
- [ ] Body text: contrast ≥7:1 (AAA)
- [ ] Card backgrounds: suficientemente opacos

#### ✅ 5. Features Section (Bento Grid)

**Elementos a Validar:**
- [ ] Item titles: contrast ≥7:1
- [ ] Descriptions: font-size ≥14px, contrast ≥4.5:1
- [ ] Colored cards (Laranja, Roxo, Verde, Azul): contraste validado

#### ✅ 6. Footer (se existir)

**Elementos a Validar:**
- [ ] Links: contrast ≥4.5:1
- [ ] Texto legal: font-size ≥12px (mínimo permitido)
- [ ] Social icons: touch targets ≥44px

## 📊 Interpretação dos Resultados

### Score de Acessibilidade

| Score | Classificação | Ação |
|-------|---------------|------|
| **90-100** | ✅ Excelente | Manter padrões |
| **80-89** | ⚠️ Bom | Corrigir issues críticos |
| **50-79** | ❌ Precisa melhorar | Revisar contraste e semântica |
| **0-49** | 🚨 Crítico | Refatoração necessária |

### Issues Comuns

#### 🔴 High Priority (Corrigir Imediatamente)

**1. Contrast Issues**
```
Background and foreground colors do not have a sufficient contrast ratio
```
**Fix:** Usar cores do DESIGN-SYSTEM.md

**2. Touch Target Too Small**
```
Touch targets are not sized appropriately
```
**Fix:** Adicionar `min-h-11 min-w-11` (44px)

**3. Font Size Too Small**
```
Font sizes are too small to read comfortably
```
**Fix:** Mínimo `text-sm` (14px)

#### 🟡 Medium Priority (Melhorias)

**4. ARIA Labels Missing**
```
Elements with aria-* attributes must have valid values
```
**Fix:** Adicionar `aria-label` em icons sem texto

**5. Semantic HTML**
```
Document should use semantic HTML5 elements
```
**Fix:** Usar `<nav>`, `<main>`, `<article>` adequadamente

**6. Headings Order**
```
Heading elements are not in a sequentially-descending order
```
**Fix:** h1 → h2 → h3 (sem pular níveis)

## 🧪 Testes Manuais Complementares

### 1. Keyboard Navigation

```
Tab      → Navegar entre elementos focáveis
Shift+Tab → Voltar
Enter    → Ativar links/botões
Space    → Ativar botões
Esc      → Fechar modais
```

**Verificar:**
- [ ] Ordem de foco lógica
- [ ] Todos os CTAs acessíveis via teclado
- [ ] Focus visible (outline ou ring)

### 2. Screen Reader (VoiceOver - macOS)

```bash
# Ativar VoiceOver
Cmd + F5

# Navegar
Ctrl + Option + → (próximo)
Ctrl + Option + ← (anterior)
Ctrl + Option + Space (ativar)
```

**Verificar:**
- [ ] Imagens têm `alt` text descritivo
- [ ] Botões anunciam ação corretamente
- [ ] Headings estruturam conteúdo
- [ ] Links descritivos (evitar "clique aqui")

### 3. Zoom Test

```
Chrome: Cmd + "+" até 200%
```

**Verificar:**
- [ ] Layout não quebra em 200% zoom
- [ ] Texto não sobrepõe
- [ ] Botões permanecem clicáveis

### 4. Color Blindness Simulation

**Chrome DevTools:**
1. `Cmd + Shift + P` → "Rendering"
2. "Emulate vision deficiencies"
3. Testar:
   - Protanopia (vermelho-verde)
   - Deuteranopia (vermelho-verde)
   - Tritanopia (azul-amarelo)
   - Achromatopsia (sem cores)

**Verificar:**
- [ ] Informação não depende apenas de cor
- [ ] Badges/status têm ícones + texto
- [ ] Gráficos têm padrões ou labels

## 📈 Métricas Ideais

### Accessibility Score Breakdown

```
✅ [names-and-labels] = 100%
   - Botões/links com aria-label adequado

✅ [contrast] = 100%
   - Todos os elementos >4.5:1 (AA) ou >7:1 (AAA)

✅ [navigation] = 100%
   - Landmarks semânticos
   - Skip links implementados

✅ [aria] = 100%
   - ARIA attributes válidos
   - Roles adequados

✅ [language] = 100%
   - <html lang="pt-BR">
   - Declarações corretas
```

## 🐛 Debugging Common Issues

### Issue: "Low Contrast Text"

**Identificar:**
```javascript
// No Console do DevTools
const checkContrast = (el) => {
  const style = getComputedStyle(el);
  console.log('Color:', style.color);
  console.log('Background:', style.backgroundColor);
};

// Testar elemento específico
checkContrast(document.querySelector('.text-gray-600'));
```

**Fix:**
```tsx
// ANTES (❌ 3.2:1)
<p className="text-gray-400">Texto</p>

// DEPOIS (✅ 7:1+)
<p className="text-gray-700 dark:text-gray-200">Texto</p>
```

### Issue: "Button Too Small"

**Identificar:**
```javascript
// No Console
const button = document.querySelector('button');
const rect = button.getBoundingClientRect();
console.log(`Width: ${rect.width}, Height: ${rect.height}`);
// Target: Width/Height ≥44px
```

**Fix:**
```tsx
// ANTES (❌ 36px height)
<button className="px-4 py-2">CTA</button>

// DEPOIS (✅ 52px height)
<button className="px-6 py-3.5">CTA</button>
```

## 📝 Relatório Template

```markdown
# Lighthouse Accessibility Audit - [Data]

## Resumo Executivo
- **Score:** XX/100
- **Issues Críticos:** X
- **Issues Médios:** X
- **Aprovado WCAG AA:** ✅/❌

## Issues Encontrados

### 🔴 High Priority
1. **[Título do Issue]**
   - Elemento: `.class-name` ou `<button>`
   - Problema: Contraste 3.2:1 (mínimo 4.5:1)
   - Fix: Alterar `text-gray-400` → `text-gray-700`
   - Status: ⏳ Pendente / ✅ Corrigido

### 🟡 Medium Priority
...

## Melhorias Implementadas
- ✅ Contraste aumentado em Testimonials
- ✅ Touch targets hero CTAs aumentados
- ✅ Font sizes labels ajustados (14px mínimo)

## Próximos Passos
- [ ] Re-test após correções
- [ ] Validar em dispositivos reais
- [ ] Cross-browser testing
```

## 🔗 Ferramentas Adicionais

- **[axe DevTools](https://www.deque.com/axe/devtools/)** - Chrome Extension
- **[WAVE](https://wave.webaim.org/extension/)** - Visual accessibility evaluator
- **[Stark](https://www.getstark.co/)** - Color blindness simulator
- **[Accessibility Insights](https://accessibilityinsights.io/)** - Microsoft tool

---

**Boa prática:** Executar auditoria após cada PR/deploy significativo
**Frequência:** Semanal durante desenvolvimento ativo
