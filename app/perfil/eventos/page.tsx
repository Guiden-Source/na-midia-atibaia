"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, Check, Clock } from "lucide-react";

interface EventConfirmation {
  id: string;
  created_at: string;
  event: {
    id: string;
    name: string;
    location: string;
    start_time: string;
    end_time: string;
    image_url?: string | null;
  };
}

export default function EventosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<EventConfirmation[]>([]);

  useEffect(() => {
    const loadEventos = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('📅 Eventos - User not logged in, redirecting to login');
        router.push("/login");
        return;
      }

      console.log('📅 Eventos - Loading for user:', user.email);

      const { data, error } = await supabase
        .from("confirmations")
        .select(`
          id,
          created_at,
          event:events (
            id,
            name,
            location,
            start_time,
            end_time,
            image_url
          )
        `)
        .eq("user_email", user.email || "")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("📅 Eventos - Error loading events:", error);
      } else {
        console.log('📅 Eventos - Loaded events:', data?.length || 0, 'eventos');
        console.log('📅 Eventos - Data:', data);
        setEventos((data as any) || []);
      }

      setLoading(false);
    };

    loadEventos();
  }, [router]);

  const proximosEventos = eventos.filter(
    e => new Date(e.event.end_time) > new Date()
  );
  
  const passados = eventos.filter(
    e => new Date(e.event.end_time) <= new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/perfil" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                Meus Eventos
              </h1>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Próximos Eventos */}
        {proximosEventos.length > 0 && (
          <div className="mb-8">
            <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Próximos ({proximosEventos.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proximosEventos.map((confirmation) => {
                const { event } = confirmation;
                const startDate = new Date(event.start_time);
                const isToday = startDate.toDateString() === new Date().toDateString();
                const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
                
                return (
                  <Link
                    key={confirmation.id}
                    href={`/evento/${event.id}`}
                    className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-primary/30 dark:border-primary/30 overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:border-primary"
                  >
                    {/* Image */}
                    {event.image_url && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={event.image_url}
                          alt={event.name}
                          fill
                          className="object-cover"
                        />
                        {/* Badge */}
                        {(isToday || isTomorrow) && (
                          <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1">
                            <span className="text-xs font-baloo2 font-bold text-white">
                              {isToday ? "Hoje" : "Amanhã"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {event.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {startDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {startDate.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Eventos Passados */}
        <div>
          <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="h-6 w-6 text-gray-500" />
            Já Participados ({passados.length})
          </h2>

          {passados.length === 0 && proximosEventos.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você ainda não confirmou presença em nenhum evento.
              </p>
              <Link
                href="/"
                className="inline-block rounded-xl bg-primary hover:bg-orange-600 px-6 py-3 font-baloo2 font-semibold text-white transition-colors"
              >
                Explorar Eventos
              </Link>
            </div>
          ) : passados.length === 0 ? (
            <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum evento passado ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passados.map((confirmation) => {
                const { event } = confirmation;
                const startDate = new Date(event.start_time);
                
                return (
                  <Link
                    key={confirmation.id}
                    href={`/evento/${event.id}`}
                    className="group rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 overflow-hidden transition-all hover:scale-105 hover:shadow-xl opacity-75"
                  >
                    {/* Image */}
                    {event.image_url && (
                      <div className="relative h-40 w-full grayscale">
                        <Image
                          src={event.image_url}
                          alt={event.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <div className="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 mb-3">
                        <Check className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          Encerrado
                        </span>
                      </div>

                      <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {event.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {startDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
