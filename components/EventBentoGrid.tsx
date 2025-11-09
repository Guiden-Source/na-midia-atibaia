"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { DrinkPreview } from "@/components/events/DrinkPreview";

interface EventBentoGridProps {
  events: Event[];
  onConfirm: (event: Event) => void;
}

export function EventBentoGrid({ events, onConfirm }: EventBentoGridProps) {
  if (events.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
      {events.map((event, index) => (
        <EventBentoCard
          key={event.id}
          event={event}
          index={index}
          onConfirm={onConfirm}
        />
      ))}
    </div>
  );
}

interface EventBentoCardProps {
  event: Event;
  index: number;
  onConfirm: (event: Event) => void;
}

function EventBentoCard({ event, index, onConfirm }: EventBentoCardProps) {
  const isLarge = index % 5 === 0; // Every 5th card is large
  const isMedium = index % 3 === 0 && !isLarge; // Every 3rd (but not 5th) is medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        "backdrop-blur-md bg-white/60 dark:bg-gray-800/60",
        "border border-white/20 shadow-xl",
        "hover:shadow-2xl hover:scale-[1.02] transition-all duration-300",
        isLarge && "md:col-span-2 md:row-span-2",
        isMedium && "md:row-span-2"
      )}
    >
      {/* Background Media with Overlay */}
      <div className="absolute inset-0">
        {event.image_url && isValidImageUrl(event.image_url) ? (
          isVideoUrl(event.image_url) ? (
            <video
              src={event.image_url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Se a imagem falhar ao carregar, substitui por um gradiente
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400" />
        )}
        
        {/* Fallback gradient (visível se a imagem não carregar) */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 -z-10" />
        
        {/* Gradient overlay - AUMENTADO para melhor contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top badges */}
        <div className="flex items-start justify-between gap-2">
          {/* Live badge */}
          {isLiveEvent(event) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-white"
              />
              LIVE
            </motion.div>
          )}

          {/* Drink badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
            🍺 CUPOM
          </div>
        </div>

        {/* Bottom content */}
        <div className="space-y-4">
          {/* Event details */}
          <div className="space-y-2">
            <h3 className="font-baloo2 text-2xl font-bold text-white drop-shadow-lg line-clamp-2">
              {event.name}
            </h3>

            <div className="flex flex-col gap-1 text-sm text-gray-200 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  {new Date(event.start_time).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              {(event.confirmations_count ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{event.confirmations_count} confirmados</span>
                </div>
              )}
            </div>

            {/* Drinks Preview */}
            {event.event_drinks && event.event_drinks.length > 0 && (
              <div className="pt-2 border-t border-white/20">
                <DrinkPreview drinks={event.event_drinks} maxDisplay={4} showLabel={false} />
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onConfirm(event)}
            aria-label={`Confirmar presença em ${event.name}`}
            className={cn(
              "w-full px-6 py-4 min-h-[52px] rounded-full",
              "bg-gradient-to-r from-orange-500 to-pink-500",
              "text-white font-baloo2 font-bold text-base",
              "hover:from-orange-600 hover:to-pink-600",
              "transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "shadow-lg hover:shadow-xl",
              "flex items-center justify-center gap-2"
            )}
          >
            <Sparkles className="w-5 h-5" />
            Confirmar Presença
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to check if event is live
function isLiveEvent(event: Event): boolean {
  if (!event.end_time) return false;
  const now = new Date();
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  return now >= start && now <= end;
}

// Helper function to validate image URL
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    // Verifica se é uma URL válida e se começa com http/https
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper function to check if URL is a video
function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}
