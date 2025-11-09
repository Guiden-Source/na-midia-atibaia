# Na Mídia (MVP)

Plataforma de eventos em tempo real para Atibaia. Usuários confirmam presença e recebem cupom de desconto.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Realtime)
- OneSignal (push web)

## Funcionalidades
1. Feed de eventos em tempo real
2. Confirmação de presença + geração de cupom
3. Notificações push de novos eventos

## Scripts
Dev: `npm run dev`
Build: `npm run build`

## Variáveis de Ambiente (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ONESIGNAL_APP_ID=...
ONESIGNAL_REST_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Estrutura principal
Ver diretórios `app/`, `components/` e `lib/`.

## OneSignal (Push Web)
1) Crie um app no painel da OneSignal e copie o App ID e a REST API Key.
2) Configure em `.env.local`:
	- `NEXT_PUBLIC_ONESIGNAL_APP_ID` = App ID
	- `ONESIGNAL_REST_API_KEY` = REST API Key (não usar prefixo NEXT_PUBLIC)
	- `NEXT_PUBLIC_SITE_URL` = URL pública do site (ex.: https://seusite.com)
3) No painel da OneSignal, em Web Push, configure o Site URL exatamente igual ao domínio que você usa em produção/dev. Em dev, usamos `allowLocalhostAsSecureOrigin` para funcionar em `localhost`.
4) O botão “Receber avisos de eventos” aparece no topo (Header). Ao clicar, o navegador pedirá permissão. Em Safari (macOS), é necessário estar no HTTPS ou usar a configuração específica de Safari no painel da OneSignal.
5) Ao criar um novo evento pelo Admin, o backend tenta enviar uma notificação para o segmento "All". Caso as variáveis não estejam definidas, essa etapa é ignorada.

## TODO Futuro
- Autenticação de usuários
- Painel analytics de confirmações
- Marcar uso de cupom (is_used)
- Filtro de eventos por tipo
