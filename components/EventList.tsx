"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Event } from '@/lib/types';
import { EventCard } from './EventCard';

export function EventList({ initial }: { initial: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initial);

  useEffect(() => {
    const channel = supabase.channel('events-feed').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'events' },
      async () => {
        // Refetch minimal list
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('start_time', { ascending: true });
        if (!data) return;
        // Attach counts
        const withCounts: Event[] = [];
        for (const e of data) {
          const { count } = await supabase
            .from('confirmations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', e.id);
          withCounts.push({ ...(e as any), confirmations_count: count || 0 });
        }
        setEvents(withCounts);
      }
    );
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!events.length) {
    return <p className="text-center opacity-80">Nenhum evento ativo agora.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} />
      ))}
    </div>
  );
}
