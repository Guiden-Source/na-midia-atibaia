"use client";
import type { Event } from '@/lib/types';
import { formatTimeRange, isLive } from '@/lib/utils';

export function EventDetail({ event }: { event: Event }) {
  const live = isLive(event.start_time, event.end_time);
  return (
    <div className="rounded-2xl border-4 border-white shadow-retro bg-secondary text-white p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-righteous text-4xl leading-tight drop-shadow-[0_4px_0_#FFFFFF]">{event.name}</h1>
        {live && <span className="live-badge">AO VIVO 🔴</span>}
      </div>
      <p className="opacity-90 text-sm whitespace-pre-line">{event.description}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1 bg-primary rounded-full border-2 border-white font-semibold">{event.location}</span>
        <span className="px-3 py-1 bg-accent text-ink rounded-full border-2 border-white font-bold">{event.event_type}</span>
        <span className="px-3 py-1 bg-primary rounded-full border-2 border-white">{formatTimeRange(event.start_time, event.end_time)}</span>
        <span className="px-3 py-1 bg-white text-ink rounded-full border-2 border-white font-bold">{event.confirmations_count || 0} confirmados</span>
      </div>
    </div>
  );
}
