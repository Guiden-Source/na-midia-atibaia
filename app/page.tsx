"use client";
import { confirmPresenceAction, fetchEventsAction, fetchFeaturedPromotionsAction } from './actions';
import type { Event, Promotion } from '@/lib/types';
import { EventCard } from '@/components/EventCard';
import ConfirmPresenceModal from '@/components/ConfirmPresenceModal';
import { isLive } from '@/lib/utils';
import { useEffect, useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Sparkles, Gift, PartyPopper, Calendar, Zap, TrendingUp, ShoppingBag } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { EventBentoGrid } from '@/components/EventBentoGrid';
import { ModernHowItWorksSection } from '@/components/ModernHowItWorksSection';
import { EventListSchema, OrganizationSchema, WebSiteSchema } from '@/components/StructuredData';
import { EventSuggestions } from '@/components/search/EventSuggestions';
import { createClient } from '@/lib/supabase/client';
import { QuickCategories } from '@/components/QuickCategories';
import { PromotionsGrid } from '@/components/PromotionsGrid';
import Link from 'next/link';

// Skeleton Loader
function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-lg animate-pulse">
      <div className="relative h-60 w-full bg-muted" />
      <div className="flex-1 p-5">
        <div className="h-7 w-3/4 rounded-lg bg-muted" />
        <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-24 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="mt-6 h-12 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

// Hero Section Otimizado
function HeroSection({ events }: { events: Event[] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-5xl">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              width={208}
              height={104}
              className="h-auto w-28 sm:w-40 lg:w-52 drop-shadow-2xl"
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-center font-baloo2 text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-7xl">
            Seu Guia Completo de <br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">Atibaia</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-center text-base sm:text-lg text-gray-700 dark:text-gray-200 lg:text-xl">
            Eventos • Promoções • Cupons • Delivery — Tudo em um só lugar 🎉
          </p>

          {/* Event Suggestions */}
          <div className="mb-10 sm:mb-12">
            <EventSuggestions events={events} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#eventos"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 min-h-[52px] font-baloo2 text-base sm:text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-orange-600 active:scale-95"
              aria-label="Ver todos os eventos disponíveis"
            >
              Explorar Eventos
              <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" fill="currentColor" />
            </a>

            <Link
              href="/delivery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white/80 backdrop-blur-sm px-8 py-4 min-h-[52px] font-baloo2 text-base sm:text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
              aria-label="Acessar delivery"
            >
              <ShoppingBag className="h-5 w-5" />
              Delivery
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-primary">100+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Eventos</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-primary">50+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Promoções</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-primary">1000+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Usuários</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-primary">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [, startTransition] = useTransition();

  const loadEvents = async () => {
    try {
      const result = await fetchEventsAction();

      if (!result) {
        console.error('fetchEventsAction returned undefined');
        toast.error('Erro ao carregar eventos. Tente recarregar a página.');
        setLoading(false);
        return;
      }

      if (result.success) {
        setEvents(result.data);
      } else {
        toast.error(result.error || 'Não foi possível carregar os eventos.');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Erro ao carregar eventos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadPromotions = async () => {
    try {
      const result = await fetchFeaturedPromotionsAction();
      if (result.success) {
        setPromotions(result.data);
      } else {
        console.error('Error loading promotions:', result.error);
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoadingPromotions(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadPromotions();
    const id = setInterval(() => startTransition(loadEvents), 60000);
    return () => clearInterval(id);
  }, []);

  const handleOpenConfirmModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleConfirmPresence = async (): Promise<{ success: boolean; error?: string | null }> => {
    if (!selectedEvent) return { success: false, error: 'Nenhum evento selecionado.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Você precisa estar logado para confirmar presença.' };
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';

    const result = await confirmPresenceAction(selectedEvent.id, {
      name: userName,
      email: user.email || ''
    });

    if (result.success) {
      toast.success(`🎉 Presença confirmada! Cupom: ${result.data.code}`, {
        duration: 4000,
        icon: '🎫',
      });
      setEvents(prev =>
        prev.map(e =>
          e.id === selectedEvent.id ? { ...e, confirmations_count: (e.confirmations_count || 0) + 1 } : e
        )
      );
      return { success: true };
    } else {
      const errorMessage = result.error || 'Não foi possível confirmar a presença.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sections = useMemo(() => {
    const now = new Date();
    const live: Event[] = [];
    const today: Event[] = [];
    const upcoming: Event[] = [];

    events.forEach(ev => {
      const start = new Date(ev.start_time);
      if (isLive(ev.start_time, ev.end_time)) live.push(ev);
      else if (start.toDateString() === now.toDateString()) today.push(ev);
      else if (start > now) upcoming.push(ev);
    });

    return { live, today, upcoming };
  }, [events]);

  const hasAnyEvents = events.length > 0;

  return (
    <>
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebSiteSchema />
      {hasAnyEvents && <EventListSchema events={events} />}

      {/* Hero Section */}
      <BlurFade delay={0} inView>
        <HeroSection events={events} />
      </BlurFade>

      {/* Como Funciona */}
      <BlurFade delay={0.2} inView>
        <ModernHowItWorksSection />
      </BlurFade>

      {/* Categorias Rápidas */}
      <BlurFade delay={0.25} inView>
        <QuickCategories />
      </BlurFade>

      {/* Promoções em Destaque */}
      {!loadingPromotions && promotions.length > 0 && (
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />

          <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
            <BlurFade delay={0.3} inView>
              <div className="mb-10 sm:mb-12 text-center">
                <h2 className="mb-3 font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
                  Promoções & Cupons
                </h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
                  Aproveite as melhores ofertas e descontos de Atibaia 🎁
                </p>
              </div>

              <PromotionsGrid
                promotions={promotions}
                onPromotionClaim={loadPromotions}
              />

              {/* Ver Todas as Promoções */}
              <div className="mt-10 flex justify-center">
                <Link
                  href="/promocoes"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-baloo2 text-base sm:text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  Ver Todas as Promoções
                  <Gift className="h-5 w-5" />
                </Link>
              </div>
            </BlurFade>
          </div>
        </section>
      )}

      {/* Eventos */}
      <div id="eventos" className="container px-5 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="mb-3 font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Eventos Disponíveis
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
            Confirme presença e ganhe cupons de desconto em bebidas 🍺
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && !hasAnyEvents && (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 sm:py-28 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <Calendar className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Nenhum evento por aqui... ainda!
            </h3>
            <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Fique de olho, sempre tem novidade aparecendo 👀
            </p>
          </div>
        )}

        {!loading && hasAnyEvents && (
          <div className="flex flex-col gap-12">
            {sections.live.length > 0 && <Section title="AO VIVO AGORA" events={sections.live} onConfirm={handleOpenConfirmModal} />}
            {sections.today.length > 0 && <Section title="HOJE" events={sections.today} onConfirm={handleOpenConfirmModal} />}
            {sections.upcoming.length > 0 && <Section title="PRÓXIMOS" events={sections.upcoming} onConfirm={handleOpenConfirmModal} />}
          </div>
        )}

        {isModalOpen && selectedEvent && (
          <ConfirmPresenceModal
            eventName={selectedEvent.name}
            onConfirm={handleConfirmPresence}
            onClose={handleCloseModal}
          />
        )}
      </div>

      {/* Testimonials Section */}
      <BlurFade delay={0.3} inView>
        <TestimonialsSection />
      </BlurFade>

      {/* CTA Final */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <BlurFade delay={0.4} inView>
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
                Pronto para descobrir os melhores eventos de
                <span className="bg-gradient-to-r from-primary via-orange-500 to-pink-600 bg-clip-text text-transparent"> Atibaia</span>?
              </h2>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
                Junte-se a centenas de pessoas que já estão aproveitando eventos incríveis e economizando com cupons de desconto
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="/#eventos"
                  aria-label="Ver todos os eventos"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-10 py-5 min-h-[56px] font-baloo2 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-3xl active:scale-95"
                >
                  Ver Todos os Eventos
                  <PartyPopper className="h-6 w-6 transition-transform group-hover:rotate-12" />
                </a>

                <a
                  href="/login"
                  aria-label="Criar conta gratuita"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-white/80 backdrop-blur-sm px-10 py-5 min-h-[56px] font-baloo2 text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
                >
                  Criar Conta Grátis
                  <Sparkles className="h-6 w-6" />
                </a>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </>
  );
}

function Section({ title, events, onConfirm }: { title: string; events: Event[]; onConfirm: (e: Event) => void }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h3 className="font-baloo2 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {title === "AO VIVO AGORA" && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white animate-pulse shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white" />
            LIVE
          </span>
        )}
      </div>
      <EventBentoGrid events={events} onConfirm={onConfirm} />
    </div>
  );
}
