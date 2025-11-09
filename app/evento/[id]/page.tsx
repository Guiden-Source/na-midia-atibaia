'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchEventById, confirmPresenceAction } from '@/app/actions';
import type { Event } from '@/lib/types';
import { formatTimeRange, isLive } from '@/lib/utils';
import toast from 'react-hot-toast';
import ConfirmPresenceModal from '@/components/ConfirmPresenceModal';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, MapPin, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Props = { params: { id: string } };

// Skeleton Loader para a página de detalhes
function EventDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="relative h-80 w-full animate-pulse rounded-lg bg-muted" />
      <div className="mt-6">
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function EventPage({ params }: Props) {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  if (loading) return <EventDetailSkeleton />;
  if (!event) {
    return (
      <div className="container py-12 text-center">
        <h2 className="font-righteous text-3xl text-destructive">Evento não encontrado</h2>
        <p className="mt-2 text-muted-foreground">O link que você seguiu pode estar quebrado ou o evento foi removido.</p>
      </div>
    );
  }

  const live = isLive(event.start_time, event.end_time);
  const imageUrl = event.image_url || '/placeholder-event.jpg';

  return (
    <>
      <main className="container mx-auto max-w-4xl py-8 px-4">
        {/* Imagem de Destaque */}
        <div className="relative mb-6 h-80 w-full overflow-hidden rounded-lg shadow-2xl">
          <Image
            src={imageUrl}
            alt={`Imagem do evento ${event.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            onError={(e) => { e.currentTarget.src = '/placeholder-event.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {live && (
            <span className="absolute top-4 right-4 rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white animate-pulse">
              AO VIVO
            </span>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="font-righteous text-4xl text-primary md:text-5xl">{event.name}</h1>
            <p className="mt-4 whitespace-pre-line text-lg text-muted-foreground">{event.description}</p>
          </div>
          
          <div className="space-y-6 rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="font-righteous text-2xl text-foreground">Detalhes</h2>
            
            <div className="flex items-start gap-4">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Data e Hora</h3>
                <p className="text-muted-foreground">{formatTimeRange(event.start_time, event.end_time)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Localização</h3>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Users className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Confirmados</h3>
                <p className="text-muted-foreground">{event.confirmations_count || 0} pessoas</p>
              </div>
            </div>

            {event.na_midia_present && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                <p className="text-sm font-medium text-foreground">
                  🎁 <strong className="text-primary">Cupom de Bebida Incluso!</strong>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ao confirmar presença, você garante um cupom exclusivo para bebidas após o evento.
                </p>
              </div>
            )}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full bg-primary py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              Confirmar Presença
            </button>

            <div className="flex justify-center">
              <ShareButton
                title={event.name}
                text={`Vem comigo nesse evento! ${event.event_type} em ${event.location} 🎉`}
                url={typeof window !== 'undefined' ? window.location.href : `https://namidia.com.br/evento/${event.id}`}
              />
            </div>
          </div>
        </div>
      </main>

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
