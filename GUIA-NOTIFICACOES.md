# 🔔 Guia de Notificações Push - OneSignal

## Visão Geral

Sistema completo de notificações push implementado com OneSignal para avisar usuários sobre novos eventos em tempo real.

## ✨ Funcionalidades

- ✅ Botão de ativar/desativar notificações no header
- ✅ Página de gerenciamento de notificações
- ✅ Envio automático ao criar novo evento
- ✅ Suporte a todos navegadores modernos (Chrome, Firefox, Edge, Safari)
- ✅ Funciona em desktop e mobile
- ✅ Graceful degradation se não configurado

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
1. **`lib/onesignal.ts`** - Helpers para inicialização e gerenciamento
2. **`components/NotificationButton.tsx`** - Botão toggle para header
3. **`app/notificacoes/page.tsx`** - Página de gerenciamento completa
4. **`.env.example`** - Template com instruções de setup

### Arquivos Modificados:
1. **`components/FloatingHeader.tsx`** - Adicionado NotificationButton
2. **`app/actions.ts`** - Adicionado sendEventNotification nas funções de criar evento

## 🚀 Setup do OneSignal

### 1. Criar Conta e App

1. Acesse: https://onesignal.com/
2. Crie uma conta gratuita
3. Click em "New App/Website"
4. Dê um nome (ex: "Na Mídia")
5. Selecione "Web Push" como plataforma

### 2. Configurar Web Push

No painel do OneSignal, configure:

```
Platform: Web Push
Site Name: Na Mídia
Site URL: https://seudominio.com.br (ou http://localhost:3000 para dev)

Settings:
✓ Auto Resubscribe
✓ Default Notification Icon: (URL da sua logo)
✓ Typical Site URL: ativado
```

### 3. Copiar Credenciais

Vá em **Settings → Keys & IDs**:

1. **App ID** - Use em `NEXT_PUBLIC_ONESIGNAL_APP_ID`
2. **REST API Key** - Use em `ONESIGNAL_REST_API_KEY`

### 4. Configurar .env.local

```bash
# Copie para .env.local
NEXT_PUBLIC_ONESIGNAL_APP_ID=seu_app_id_aqui
ONESIGNAL_REST_API_KEY=sua_rest_api_key_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Reiniciar Servidor

```bash
npm run dev
```

## 📱 Como Usar

### Para Usuários:

1. **Ativar Notificações:**
   - Clique no botão no header (sino com "Ativar Notificações")
   - Aceite a permissão do navegador
   - Botão ficará verde com "Notificações Ativas"

2. **Gerenciar:**
   - Acesse `/notificacoes` ou clique no perfil
   - Veja status completo
   - Ative/desative quando quiser

3. **Receber Avisos:**
   - Quando novo evento for criado, todos inscritos recebem notificação
   - Notificação aparece mesmo com site fechado
   - Clique na notificação para ir direto ao evento

### Para Admins:

1. **Criar Evento:**
   - Vá em `/admin/criar`
   - Preencha dados do evento
   - Ao salvar, notificação é enviada automaticamente
   - Todos usuários inscritos recebem

2. **Verificar Envio:**
   - Check no console do servidor: `✅ [OneSignal] Notificação enviada`
   - Vá no painel OneSignal → Delivery para ver estatísticas

## 🔧 Funções Disponíveis

### Client-Side (`lib/onesignal.ts`):

```typescript
// Verificar se está configurado
isOneSignalEnabled(): boolean

// Inicializar
initOneSignal(): Promise<boolean>

// Verificar se usuário está inscrito
isUserSubscribed(): Promise<boolean>

// Solicitar permissão
requestNotificationPermission(): Promise<boolean>

// Cancelar inscrição
unsubscribeFromNotifications(): Promise<boolean>

// Obter ID do dispositivo
getPlayerId(): Promise<string | null>

// Adicionar tags (segmentação)
setUserTags(tags: Record<string, any>): Promise<boolean>
```

### Server-Side (`lib/onesignal.ts`):

```typescript
// Enviar notificação
sendNotification(data: {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
  segment?: string[];
}): Promise<boolean>
```

## 📊 Segmentação (Avançado)

Você pode segmentar notificações por tipos de usuários:

```typescript
// Marcar usuário com tags
await setUserTags({
  user_type: 'premium',
  city: 'Atibaia',
  interests: ['shows', 'festivais']
});

// Enviar apenas para segmento específico
await sendNotification({
  title: 'Show Especial!',
  message: 'Evento Premium hoje à noite',
  segment: ['Premium Users'] // Configure no painel OneSignal
});
```

## 🐛 Troubleshooting

### Notificações não aparecem?

**1. Verifique permissões do navegador:**
- Chrome: chrome://settings/content/notifications
- Firefox: about:preferences#privacy → Notificações
- Safari: Safari → Preferências → Sites → Notificações

**2. Verifique console:**
```bash
# Deve aparecer:
✅ OneSignal inicializado
✅ [OneSignal] Notificação enviada
```

**3. Verifique .env.local:**
```bash
# Ambas devem estar preenchidas:
NEXT_PUBLIC_ONESIGNAL_APP_ID=...
ONESIGNAL_REST_API_KEY=...
```

### Permissão negada?

Se usuário negou:
1. Vá em configurações do navegador
2. Encontre o site
3. Altere permissão de notificações para "Permitir"
4. Recarregue a página

### Localhost não funciona?

Em desenvolvimento, o OneSignal precisa de `allowLocalhostAsSecureOrigin: true` (já configurado no código).

Para Safari, configure no painel OneSignal:
- Settings → Safari Web Push
- Add localhost como Allowed Origin

## 📈 Estatísticas

Acesse o painel OneSignal para ver:

- **Delivery:** Quantas notificações foram entregues
- **CTR:** Taxa de cliques
- **Subscribers:** Total de inscritos
- **Devices:** Tipos de dispositivos

## 🔐 Segurança

- ✅ REST API Key nunca exposta no client
- ✅ App ID é público (seguro)
- ✅ Usuários podem cancelar inscrição a qualquer momento
- ✅ Permissões do navegador respeitadas

## 🚦 Status do Sistema

```
✅ OneSignal SDK: Instalado (react-onesignal)
✅ Helpers: lib/onesignal.ts
✅ Botão Header: components/NotificationButton.tsx
✅ Página Gerenciamento: app/notificacoes/page.tsx
✅ Integração Admin: app/actions.ts
✅ Documentação: GUIA-NOTIFICACOES.md
```

## 📝 TODO Futuro

- [ ] Notificações agendadas (lembrete antes do evento)
- [ ] Segmentação por tipo de evento favorito
- [ ] Teste A/B de mensagens
- [ ] Notificações rich (com imagem grande)
- [ ] Deep linking para app mobile
- [ ] Histórico de notificações recebidas

## 🎯 Métricas de Sucesso

Objetivos:
- **30%** dos visitantes ativam notificações
- **40%** clicam nos links enviados
- **<1** notificação por dia por usuário

## 📞 Suporte

Problemas com OneSignal?
- Docs: https://documentation.onesignal.com/docs
- Suporte: support@onesignal.com
- Status: https://status.onesignal.com/

---

**Sistema de Notificações implementado com sucesso! 🎉**

Agora os usuários receberão avisos automáticos de novos eventos, aumentando o engajamento e retenção na plataforma.
