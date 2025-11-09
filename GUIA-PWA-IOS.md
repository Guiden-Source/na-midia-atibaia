# 📱 Guia de Instalação PWA - iPhone/iOS

## ✅ Melhorias Implementadas

### 1. **Meta Tags iOS Adicionadas**
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Na Mídia" />
<meta name="mobile-web-app-capable" content="yes" />
```

### 2. **PWA Installer Inteligente**
- Detecta iOS automaticamente
- Mostra instruções específicas para Safari
- Banner animado com gradiente
- Não aparece se já foi instalado
- Lembra que usuário já viu (localStorage)

### 3. **Vercel Analytics Instalado**
- Pacote `@vercel/analytics` adicionado
- Componente `<Analytics />` no layout
- Dados de visitantes começarão a aparecer após deploy

---

## 📲 Como Instalar no iPhone (Safari)

### Passo 1: Acessar pelo Safari
1. Abra o Safari (não Chrome/Firefox)
2. Acesse: `https://na-midia-atibaia.vercel.app/`
3. Aguarde 3 segundos

### Passo 2: Banner de Instalação
Um banner laranja/rosa/roxo aparecerá na parte inferior com instruções:

**"Instalar Na Mídia"**
- "Adicione o app à tela inicial para acesso rápido e notificações de eventos!"

### Passo 3: Seguir Instruções
1. Toque no botão **Compartilhar** (ícone de quadrado com seta) no Safari
2. Role para baixo até encontrar **"Adicionar à Tela Inicial"**
3. Toque nessa opção
4. Confirme o nome "Na Mídia"
5. Toque em **"Adicionar"**

### Passo 4: Abrir o App
- O ícone "Na Mídia" aparecerá na tela inicial
- Toque nele para abrir o app em modo standalone
- Funciona como um app nativo!

---

## 🔍 Por Que Não Aparecia Antes?

### Problemas Identificados:
1. **Faltavam meta tags iOS específicas** → ✅ Corrigido
2. **Sem prompt visual** → ✅ Banner adicionado
3. **iOS não suporta `beforeinstallprompt`** → ✅ Detectamos iOS manualmente

### Requisitos do Safari (iOS):
- ✅ Manifest.json válido
- ✅ Service Worker registrado
- ✅ HTTPS (Vercel já fornece)
- ✅ apple-touch-icon.png (180x180)
- ✅ Meta tags apple-mobile-web-app

---

## 🧪 Testando PWA no iPhone

### Checklist Completo:
- [ ] Abrir site no Safari (não outros navegadores)
- [ ] Aguardar 3 segundos
- [ ] Ver banner de instalação aparecer
- [ ] Seguir instruções do banner
- [ ] Toque em Compartilhar → Adicionar à Tela Inicial
- [ ] Verificar ícone na tela inicial
- [ ] Abrir app instalado
- [ ] Verificar se abre em fullscreen (sem barra do Safari)
- [ ] Testar navegação entre páginas
- [ ] Verificar se funciona offline (básico)

### Se Banner Não Aparecer:
1. **Limpar cache do Safari:**
   - Ajustes → Safari → Limpar Histórico e Dados
   
2. **Limpar localStorage:**
   - Abra console no Safari (precisa habilitar nas configurações)
   - Digite: `localStorage.clear()`
   
3. **Verificar se já está instalado:**
   - Veja se ícone "Na Mídia" já está na tela inicial
   - Se sim, o banner não aparece novamente

4. **Forçar refresh:**
   - Puxe a página para baixo (pull to refresh)
   - Ou: Segure botão refresh por 2s → "Recarregar sem Cache"

---

## 📊 Verificando Analytics (Vercel)

### Onde Ver os Dados:
1. Acesse: https://vercel.com/guiden-sources-projects/na-midia/analytics
2. Dashboard mostrará:
   - **Visitantes únicos** (por hora/dia/mês)
   - **Page Views** (páginas mais visitadas)
   - **Dispositivos** (mobile vs desktop)
   - **Países/Regiões**
   - **Navegadores**

### Tempo para Aparecer:
- **Primeiros dados:** ~30 segundos após visita
- **Atualização:** Em tempo real
- **Histórico:** Mantido por 30 dias (plano gratuito)

### Se Não Aparecer:
1. **Verificar se está em produção:**
   - Analytics só funciona em deploy (não em localhost)
   
2. **Checar bloqueadores:**
   - Desabilitar AdBlock/uBlock temporariamente
   - Alguns bloqueadores impedem analytics

3. **Aguardar um pouco:**
   - Primeiro deploy pode demorar ~5 minutos

---

## 🚀 Features do PWA Instalado

### Funcionalidades Ativas:
- ✅ **Ícone na tela inicial** (acesso rápido)
- ✅ **Fullscreen** (sem barra do navegador)
- ✅ **Splash screen** (ao abrir)
- ✅ **Cache offline** (páginas básicas)
- ✅ **Service Worker** (sincronização)
- ✅ **Notificações push** (se OneSignal configurado)

### Limitações iOS (Safari):
- ⚠️ Push notifications requerem iOS 16.4+
- ⚠️ Cache limitado (50MB)
- ⚠️ Service Worker pode ser limpo após 7 dias sem uso
- ⚠️ Não há atualização automática (usuário precisa reabrir site)

---

## 🔧 Troubleshooting Avançado

### Console do Safari (Desktop):
1. Conectar iPhone no Mac via cabo
2. Abrir Safari no Mac → Preferências → Avançado → Mostrar menu Desenvolver
3. Menu Desenvolver → [Seu iPhone] → [Na Mídia]
4. Ver console e verificar erros

### Verificar Service Worker:
No console do Safari (mobile ou desktop):
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### Verificar Manifest:
```javascript
fetch('/manifest.json').then(r => r.json()).then(console.log);
```

### Verificar Meta Tags:
```javascript
document.querySelector('meta[name="apple-mobile-web-app-capable"]');
```

---

## 📝 Próximos Passos (Opcional)

### Melhorias Futuras:
1. **Splash Screens Customizados:**
   - Criar imagens para cada tamanho de iPhone
   - Adicionar `apple-touch-startup-image`

2. **Atalhos do App:**
   - Já temos shortcuts no manifest.json
   - Testar se funcionam no iOS 16+

3. **Badging API:**
   - Mostrar número de notificações não lidas
   - Requer iOS 16.4+

4. **Melhor Offline:**
   - Cache mais páginas
   - Sincronização de dados (background sync)

---

## 📞 Suporte

### Se Continuar Não Funcionando:
1. **Versão do iOS:**
   - Verificar se está no iOS 13+ (mínimo)
   - Ideal: iOS 16.4+ (para todos recursos)

2. **Restrições:**
   - Modo Privado do Safari NÃO permite PWA
   - Restrições de tela (Screen Time) podem bloquear

3. **Logs:**
   - Checar console no Safari Web Inspector
   - Verificar erros 404 em arquivos (manifest, icons, sw.js)

---

**Última atualização:** 09/11/2025  
**Versão do PWA:** v1  
**Compatibilidade:** iOS 13+, Safari 13+
