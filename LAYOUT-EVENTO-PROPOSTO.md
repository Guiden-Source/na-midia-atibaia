# 🎨 Layout Recomendado - Página de Evento

## Estrutura Proposta

```
┌─────────────────────────────────────┐
│         IMAGEM HERO (60vh)          │
│    (com badge AO VIVO se ativo)     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Badge tipo evento]                │
│  TÍTULO DO EVENTO                   │
│  📅 09 de novembro de 2025          │
│  🕐 23:00                            │
└─────────────────────────────────────┘

─────────────────────────────────────

┌─────────────────────────────────────┐
│  ✨ Sobre o Evento                  │
│                                     │
│  Descrição completa do evento...    │
│  texto em múltiplas linhas...       │
└─────────────────────────────────────┘

┌──────────┬──────────┬──────────────┐
│ 📅 Data  │ 🕐 Hora  │ 👥 Confirmados│
│ 09/nov   │ 23:00    │ 42 pessoas   │
└──────────┴──────────┴──────────────┘

┌─────────────────────────────────────┐
│  📍 Local                            │
│  Av. Industrial Walter Kloth, 915   │
│  [Ver no Mapa]                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🎁 Cupom Incluso!                  │
│  Na Mídia Presente                  │
│  Confirme sua presença e garanta... │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    [Confirmar Presença] (grande)    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    [Compartilhar]  (bonito)         │
└─────────────────────────────────────┘
```

## Código Sugerido

Substitua o conteúdo após o Hero por:

```tsx
{/* Conteúdo Principal */}
<div className="container mx-auto max-w-4xl px-4 py-12">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {/* Header: Badge + Título + Data/Hora */}
    <div className="space-y-4">
      <div>
        <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">
          {event.event_type}
        </span>
      </div>
      
      <h1 className="font-righteous text-4xl md:text-5xl text-foreground leading-tight">
        {event.name}
      </h1>
      
      <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">
            {new Date(event.start_time).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">
            {(() => {
              const date = new Date(event.start_time);
              return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            })()}
          </span>
        </div>
      </div>
    </div>

    {/* Divisor */}
    <div className="border-t border-border" />

    {/* Sobre o Evento */}
    <div>
      <h2 className="font-righteous text-2xl text-foreground mb-4">
        ✨ Sobre o Evento
      </h2>
      <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
        {event.description || 'Detalhes do evento em breve...'}
      </p>
    </div>

    {/* Cards de Informação Rápida */}
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl bg-card border border-border p-4 text-center">
        <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Data</p>
        <p className="font-bold text-foreground">
          {new Date(event.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </p>
      </div>
      
      <div className="rounded-xl bg-card border border-border p-4 text-center">
        <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Horário</p>
        <p className="font-bold text-foreground">
          {(() => {
            const date = new Date(event.start_time);
            return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          })()}
        </p>
      </div>
      
      <div className="rounded-xl bg-card border border-border p-4 text-center">
        <Users className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-xs text-muted-foreground mb-1">Confirmados</p>
        <p className="font-bold text-foreground">{event.confirmations_count || 0}</p>
      </div>
    </div>

    {/* Local */}
    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
      <h3 className="font-righteous text-xl text-foreground flex items-center gap-2">
        <MapPin className="w-6 h-6 text-primary" />
        Local
      </h3>
      <p className="text-lg text-muted-foreground">{event.location}</p>
      
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 hover:bg-primary/20 px-4 py-3 font-bold text-primary transition-all"
      >
        <Navigation className="w-5 h-5" />
        Ver no Mapa
      </a>
    </div>

    {/* Cupom Se Na Mídia Presente */}
    {event.na_midia_present && (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 border-2 border-primary p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1">🎁 Cupom Incluso!</h3>
            <p className="text-sm text-muted-foreground font-medium mb-2">Na Mídia Presente</p>
            <p className="text-muted-foreground">
              Confirme sua presença e garanta um cupom exclusivo de bebida para usar após o evento! 🍹
            </p>
          </div>
        </div>
      </motion.div>
    )}

    {/* Botão CTA Grande */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsModalOpen(true)}
      disabled={isConfirming || isPast}
      className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-8 py-5 font-baloo2 text-xl font-bold text-white shadow-2xl transition-all hover:shadow-3xl disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isConfirming ? (
        <span className="flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 animate-spin" />
          Processando...
        </span>
      ) : isPast ? (
        'Evento Encerrado'
      ) : (
        <span className="flex items-center justify-center gap-3">
          <Heart className="w-6 h-6" />
          Confirmar Presença
        </span>
      )}
    </motion.button>

    {/* Compartilhar Melhorado */}
    <div className="flex flex-col items-center justify-center gap-4 pt-4">
      <p className="text-sm text-muted-foreground font-medium">Compartilhe com seus amigos</p>
      <div className="flex items-center gap-3">
        <ShareButton
          title={event.name}
          text={`Vem comigo nesse evento! ${event.event_type} em ${event.location} 🎉`}
          url={typeof window !== 'undefined' ? window.location.href : `https://namidia.com.br/evento/${event.id}`}
        />
      </div>
    </div>
  </motion.div>
</div>
```

## Melhorias no ShareButton

Arquivo: `components/ShareButton.tsx`

Adicione estilos melhores:

```tsx
export function ShareButton({ title, text, url }: Props) {
  // ... código atual ...
  
  return (
    <button
      onClick={handleShare}
      className="group flex items-center gap-3 px-6 py-3 rounded-full border-2 border-primary/30 bg-primary/5 hover:bg-primary hover:border-primary text-primary hover:text-white font-bold transition-all hover:scale-105 active:scale-95"
    >
      <Share2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
      <span>Compartilhar Evento</span>
    </button>
  );
}
```

## Resultado Visual

**Antes (hero + card):**
- Hero grande com info sobreposta
- Card flutuante com grid 2+1

**Depois (clean vertical):**
- Hero apenas imagem
- Badge > Título > Data/Hora (sequencial)
- Divisor
- Sobre > Cards > Local > Cupom > CTA > Share
- Layout vertical simples e direto
- Mais espaço para respirar
- Leitura linear (scroll natural)

## Vantagens

1. **Mais limpo**: Informação não compete visualmente
2. **Mais claro**: Hierarquia óbvia (título → detalhes → ação)
3. **Mais mobile-friendly**: Stack vertical funciona melhor em telas pequenas
4. **Menos cognitivo**: Usuário não precisa escanear grid
5. **CTA destacado**: Botão grande sem distrações ao redor

---

**Nota:** Por conta da complexidade do arquivo atual e duplicações, recomendo aplicar essas alterações manualmente ou me avisar para criar um novo arquivo limpo do zero.
