"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { isLive, formatTimeRange } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onConfirm?: (event: Event) => void;
}

// Inspirado na Ref 1 (Party Planner) e Ref 3 (Event List)
export function EventCard({ event, onConfirm }: EventCardProps) {
  const live = isLive(event.start_time, event.end_time);
  const imageUrl = event.image_url || '/placeholder-event.jpg';

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg transition-transform duration-300 hover:scale-105">
      <Link href={`/evento/${event.id}`} className="absolute inset-0 z-10" aria-label={`Ver detalhes do evento ${event.name}`} />
      
      {/* Imagem de Destaque */}
      <div className="relative h-60 w-full">
        <Image
          src={imageUrl}
          alt={`Imagem do evento ${event.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/placeholder-event.jpg'; }}
        />
        {/* Overlay para melhor legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Badges de Status (AO VIVO, CUPOM DE BEBIDA) */}
        <div className="absolute top-3 right-3 flex gap-2">
          {live && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white animate-pulse">
              AO VIVO
            </span>
          )}
          {event.na_midia_present && !live && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              🍺 CUPOM DE BEBIDA
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5 bg-white dark:bg-gray-800">
        <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{event.name}</h3>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 line-clamp-1">{event.location}</p>
        
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1.5 font-medium text-gray-800 dark:text-gray-100">
            {formatTimeRange(event.start_time, event.end_time)}
          </span>
          <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 font-baloo2 font-bold text-orange-700 dark:text-orange-200">
            {event.event_type}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              <div className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-orange-600 dark:border-gray-800" />
              <div className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-orange-500 to-orange-700 dark:border-gray-800" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {event.confirmations_count || 0}+
            </span>
          </div>
          
          {onConfirm && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onConfirm(event);
              }}
              className="z-20 relative rounded-xl bg-primary px-6 py-3 min-h-[48px] min-w-[80px] font-baloo2 text-base font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-orange-600 active:scale-95"
              aria-label={`Confirmar presença em ${event.name}`}
            >
              Vou!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

