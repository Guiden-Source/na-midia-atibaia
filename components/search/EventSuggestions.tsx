"use client";

import { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronRight, Sparkles, Music, Users, Clock } from 'lucide-react';
import type { Event } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface EventSuggestionsProps {
  events: Event[];
}

export function EventSuggestions({ events }: EventSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Event[]>([]);

  useEffect(() => {
    // Pegar os 4 próximos eventos (ou menos se não houver)
    const upcoming = events
      .filter(event => new Date(event.start_time) > new Date())
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 4);
    
    setSuggestions(upcoming);
  }, [events]);

  if (suggestions.length === 0) return null;

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.includes('.mp4') || url.includes('.webm') || url.includes('video');
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 shadow-lg">
          <Sparkles className="h-5 w-5 text-white animate-pulse" fill="white" />
          <h3 className="font-baloo2 text-lg font-bold text-white">
            Eventos em Destaque
          </h3>
        </div>
      </div>

      {/* Grid de sugestões - Design Premium */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((event, index) => {
          const startDate = new Date(event.start_time);
          const isToday = startDate.toDateString() === new Date().toDateString();
          const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          let dateLabel = startDate.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
          });
          
          if (isToday) dateLabel = "🔥 Hoje";
          else if (isTomorrow) dateLabel = "⭐ Amanhã";

          const hasMedia = event.image_url && event.image_url.trim() !== '';

          return (
            <Link
              key={event.id}
              href={`/evento/${event.id}`}
              className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Imagem/Video de fundo */}
              {hasMedia ? (
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500">
                  {isVideoUrl(event.image_url!) ? (
                    <video
                      src={event.image_url!}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <Image
                      src={event.image_url!}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              ) : (
                <div className="relative h-48 w-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] opacity-50" />
                  <Music className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              )}

              {/* Badge de data - Sobre a imagem */}
              <div className="absolute top-4 left-4 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-lg">
                <span className="text-sm font-baloo2 font-bold text-orange-600">
                  {dateLabel}
                </span>
              </div>

              {/* Badge de tipo */}
              <div className="absolute top-4 right-4 rounded-xl bg-primary/95 backdrop-blur-sm px-3 py-1.5 shadow-lg">
                <span className="text-xs font-bold text-white">
                  {event.event_type}
                </span>
              </div>

              {/* Conteúdo principal */}
              <div className="relative p-5 space-y-3">
                <h4 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                  {event.name}
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">
                      {startDate.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30">
                      <MapPin className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span className="truncate font-medium">{event.location}</span>
                  </div>

                  {(event.confirmations_count || 0) > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">{event.confirmations_count} confirmados</span>
                    </div>
                  )}
                </div>

                {/* CTA - Hover state */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary group-hover:underline">
                    Ver detalhes
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary group-hover:bg-orange-600 transition-colors">
                    <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
