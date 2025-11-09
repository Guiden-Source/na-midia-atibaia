'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchEventById, confirmPresenceAction } from '@/app/actions';
import type { Event } from '@/lib/types';
import { isLive } from '@/lib/utils';
import toast from 'react-hot-toast';
import ConfirmPresenceModal from '@/components/ConfirmPresenceModal';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, MapPin, Users, Clock, Sparkles, ArrowLeft, Heart, Navigation } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

type Props = { params: { id: string } };

// Skeleton Loader melhorado
function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] w-full animate-pulse bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto max-w-6xl px-4 -mt-32 relative z-10">
        <div className="bg-card/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-border/50 p-8">
          <div className="space-y-6">
            <div className="h-12 w-3/4 animate-pulse rounded-xl bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-muted" />
            <div className="grid gap-6 md:grid-cols-3 mt-8">
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="h-40 animate-pulse rounded-xl bg-muted mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventPage({ params }: Props) {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      const result = await fetchEventById(id);
      if (result.success && result.data) {
        setEvent(result.data);
      } else {
        toast.error('Evento não encontrado.');
      }
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  const handleConfirmPresence = async (): Promise<{ success: boolean; error?: string | null }> => {
    if (!event) return { success: false, error: 'Evento não carregado.' };
    if (isConfirming) return { success: false, error: 'Aguarde...' };

    // Buscar dados do usuário logado
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Você precisa estar logado para confirmar presença.' };
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
    
    console.log('🎫 EventPage - Confirming presence:', {
      name: userName,
      email: user.email,
      eventId: event.id
    });

    setIsConfirming(true);
    
    try {
      const result = await confirmPresenceAction(event.id, { 
        name: userName,
        email: user.email || ''
      });

      if (result.success) {
        toast.success(`🎉 Presença confirmada! Cupom: ${result.data.code}`, {
          duration: 4000,
          icon: '🎫',
        });
        setEvent(prev => prev ? { ...prev, confirmations_count: (prev.confirmations_count || 0) + 1 } : null);
        return { success: true };
      } else {
        const errorMessage = result.error || 'Não foi possível confirmar a presença.';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) return <EventDetailSkeleton />;
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="font-righteous text-3xl text-foreground mb-2">Evento não encontrado</h2>
          <p className="text-muted-foreground mb-8">O link que você seguiu pode estar quebrado ou o evento foi removido.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para eventos
          </Link>
        </motion.div>
      </div>
    );
  }

  const live = isLive(event.start_time, event.end_time);
  const imageUrl = event.image_url || '/placeholder-event.jpg';
  const eventDate = new Date(event.start_time);
  const isPast = eventDate < new Date();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section com Imagem */}
        <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Imagem do evento ${event.name}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            onError={(e) => { e.currentTarget.src = '/placeholder-event.jpg'; }}
          />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          
          {/* Badges superiores */}
          <div className="absolute top-0 right-0 p-4 md:p-6 flex gap-2 z-10">
            {live && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                AO VIVO
              </motion.span>
            )}
          </div>

          {/* Informações sobre a imagem (底部) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-block mb-3">
                  <span className="rounded-full bg-primary/90 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-primary-foreground">
                    {event.event_type}
                  </span>
                </div>
                <h1 className="font-righteous text-4xl md:text-6xl text-white drop-shadow-2xl mb-2">
                  {event.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">
                      {new Date(event.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg">
                      {(() => {
                        const date = new Date(event.start_time);
                        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{event.location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

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
              <ShareButton
                title={event.name}
                text={`Vem comigo nesse evento! ${event.event_type} em ${event.location} 🎉`}
                url={typeof window !== 'undefined' ? window.location.href : `https://namidia.com.br/evento/${event.id}`}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {isModalOpen && (
        <ConfirmPresenceModal
          eventName={event.name}
          onConfirm={handleConfirmPresence}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
