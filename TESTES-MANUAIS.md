# 🧪 TESTES MANUAIS - CHECKLIST RÁPIDO

Execute estes testes para garantir que tudo está funcionando antes de liberar para usuários.

---

## ✅ FLUXO USUÁRIO NORMAL

### 1. Visualizar Eventos (/)
- [ ] Página inicial carrega sem erros
- [ ] Lista de eventos aparece
- [ ] Cards de eventos mostram imagem, nome, local, data
- [ ] Badge "AO VIVO" aparece em eventos que estão acontecendo agora
- [ ] Badge "CUPOM DE BEBIDA" aparece em eventos com Na Mídia presente
- [ ] Scroll funciona suavemente no mobile

### 2. Login/Cadastro
- [ ] Clicar em "Entrar" abre página de login
- [ ] Login com email/senha funciona
- [ ] Login com Google funciona (se configurado)
- [ ] Mensagens de erro aparecem se senha estiver errada
- [ ] Criar nova conta funciona
- [ ] Após login, redireciona de volta à página anterior

### 3. Confirmar Presença
- [ ] Clicar em evento abre página de detalhes
- [ ] Botão "Confirmar Presença" está visível
- [ ] Ao clicar, abre modal de confirmação
- [ ] Modal mostra nome do usuário corretamente
- [ ] Ao confirmar, mostra "Processando..." (não permite clicar de novo)
- [ ] Após confirmação, mostra toast de sucesso com código do cupom
- [ ] Contador de confirmações aumenta em 1
- [ ] **TESTE CRÍTICO:** Tentar clicar múltiplas vezes rapidamente → deve processar apenas 1 vez

### 4. Ver Cupons
- [ ] Acessar /cupons (ou botão no perfil)
- [ ] Lista de cupons aparece
- [ ] QR Code de cada cupom é visível
- [ ] Botão "Mostrar QR Code" funciona
- [ ] Status do cupom (disponível/usado) está correto

### 5. Compartilhar Evento
- [ ] Botão de compartilhar funciona
- [ ] Abre menu de compartilhamento nativo (mobile)
- [ ] Link copiado funciona (desktop)

---

## 🔐 FLUXO ADMIN

### 1. Acesso Admin (/admin)
- [ ] Usuário não-admin NÃO consegue acessar (redireciona para /login)
- [ ] Admin consegue acessar /admin
- [ ] Dashboard mostra estatísticas corretas
- [ ] Lista de eventos aparece

### 2. Criar Evento (/admin/criar)
- [ ] Formulário carrega
- [ ] Upload de imagem funciona
- [ ] **TESTE VALIDAÇÃO:** Tentar enviar formulário vazio → mostra erro
- [ ] **TESTE VALIDAÇÃO:** Data fim ANTES da data início → mostra erro "Data de término deve ser após início"
- [ ] Criar evento com dados válidos funciona
- [ ] Após criar, redireciona para /admin
- [ ] Toast de sucesso aparece
- [ ] Evento criado aparece na lista

### 3. Editar Evento (/admin/editar/[id])
- [ ] Formulário carrega com dados do evento
- [ ] Editar campos funciona
- [ ] Salvar alterações funciona
- [ ] Toast de sucesso aparece

### 4. Validar Cupom (/validar-cupom)
- [ ] Página carrega
- [ ] Scanner de QR Code funciona (mobile)
- [ ] Ou: campo manual para código funciona
- [ ] Cupom válido mostra mensagem verde de sucesso
- [ ] Cupom já usado mostra aviso
- [ ] Cupom inválido mostra erro

### 5. Analytics (/admin/analytics)
- [ ] Gráficos carregam
- [ ] Dados corretos aparecem
- [ ] Filtros funcionam (se houver)

---

## 📱 TESTES MOBILE

### 1. Responsividade
- [ ] Abrir no iPhone/Safari
- [ ] Abrir no Android/Chrome
- [ ] Menu hambúrguer funciona
- [ ] Botões têm tamanho mínimo de 44x44px (touch-friendly)
- [ ] Textos são legíveis sem zoom
- [ ] Imagens não distorcem

### 2. PWA (App-like)
- [ ] Banner "Adicionar à tela inicial" aparece (se PWA configurado)
- [ ] Ícone do app aparece na home screen
- [ ] App abre sem barra de navegação (fullscreen)
- [ ] Service worker funciona offline (básico)

---

## 🐛 TESTES DE EDGE CASES

### 1. Eventos sem Imagem
- [ ] Evento sem image_url mostra placeholder correto
- [ ] Não aparece imagem quebrada

### 2. Conexão Lenta/Offline
- [ ] Skeletons aparecem enquanto carrega
- [ ] Mensagem clara se falhar ao carregar
- [ ] Retry funciona

### 3. Sessão Expirada
- [ ] Tentar confirmar presença com sessão expirada → redireciona para login
- [ ] Após login, volta à página correta

### 4. Duplicação de Cupom
- [ ] Tentar confirmar presença 2x no mesmo evento → mostra erro "Você já confirmou presença"

### 5. URL Inválida
- [ ] Acessar /evento/999999 (ID inexistente) → mostra "Evento não encontrado"
- [ ] Não quebra a aplicação

---

## ⚡ TESTES DE PERFORMANCE

### 1. Lighthouse (Chrome DevTools)
```bash
# Rodar no terminal:
npx lighthouse https://na-midia-atibaia.vercel.app/ --view
```

**Metas:**
- [ ] Performance: ≥ 90
- [ ] Accessibility: ≥ 90
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 90

### 2. Core Web Vitals
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

### 3. Bundle Size
```bash
npm run build
```
- [ ] Verificar warnings sobre bundle size
- [ ] First Load JS: idealmente < 200KB

---

## 🔒 TESTES DE SEGURANÇA BÁSICOS

### 1. Auth
- [ ] Usuário não-logado NÃO vê botões de admin
- [ ] Acessar /admin sem estar logado → redireciona
- [ ] Token expira após tempo esperado

### 2. SQL Injection (básico)
- [ ] Tentar buscar evento com ID: `1' OR '1'='1` → retorna erro ou nada, não quebra

### 3. XSS (básico)
- [ ] Criar evento com nome: `<script>alert('xss')</script>` → mostra como texto, não executa

### 4. CORS
- [ ] API Supabase só aceita requests do domínio configurado
- [ ] Testar em https://reqbin.com/

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### 1. Vercel Analytics
- [ ] Acessar https://vercel.com/guiden-sources-projects/na-midia/analytics
- [ ] Verificar tráfego
- [ ] Ver páginas mais acessadas
- [ ] Ver erros 4xx/5xx

### 2. Supabase Logs
- [ ] Acessar Supabase Dashboard → Logs
- [ ] Verificar queries lentas
- [ ] Ver erros de autenticação
- [ ] Monitorar uso de API

### 3. Erros em Produção
**Se houver Sentry configurado:**
- [ ] Ver erros JavaScript
- [ ] Ver stack traces
- [ ] Filtrar por severidade

**Se não houver:**
- [ ] Configurar Sentry (recomendado!)

---

## 🚀 CHECKLIST FINAL ANTES DE ANUNCIAR

- [ ] Todos os testes acima passaram
- [ ] .env.local tem TODAS as variáveis necessárias
- [ ] Vercel tem TODAS as variáveis de ambiente configuradas
- [ ] Build passa sem erros/warnings críticos
- [ ] Site carrega em < 3s (teste com Network Throttling)
- [ ] Não há console.errors visíveis para usuários
- [ ] Documentação AUDITORIA-USABILIDADE.md está atualizada
- [ ] README tem instruções claras
- [ ] Há pelo menos 1 evento de teste criado
- [ ] Admin testou validar cupom funcionando

---

## 📞 CONTATO EM CASO DE PROBLEMAS

**Se algo der errado em produção:**

1. **Checar Vercel Logs:**
   ```
   https://vercel.com/guiden-sources-projects/na-midia/deployments
   ```

2. **Checar Supabase Logs:**
   ```
   https://supabase.com/dashboard → Seu Projeto → Logs
   ```

3. **Rollback se necessário:**
   ```bash
   vercel rollback
   ```

4. **Avisar usuários:**
   - Colocar banner de manutenção
   - Postar em redes sociais

---

**Última atualização:** 09/11/2025  
**Próxima revisão:** Após cada deploy importante
