import type { Event } from '@/lib/types';

interface EventSchemaProps {
  event: Event;
}

export function EventSchema({ event }: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description || `${event.event_type} em ${event.location}`,
    startDate: event.start_time,
    endDate: event.end_time || event.start_time,
    eventStatus: event.is_active ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventCancelled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Atibaia',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
    image: event.image_url || 'https://namidia.com.br/og-image.png',
    organizer: {
      '@type': 'Organization',
      name: 'Na Mídia',
      url: 'https://namidia.com.br',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'BRL',
      url: 'https://namidia.com.br/#eventos',
      validFrom: new Date().toISOString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface EventListSchemaProps {
  events: Event[];
}

export function EventListSchema({ events }: EventListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Event',
        name: event.name,
        description: event.description || `${event.event_type} em ${event.location}`,
        startDate: event.start_time,
        endDate: event.end_time || event.start_time,
        location: {
          '@type': 'Place',
          name: event.location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Atibaia',
            addressRegion: 'SP',
            addressCountry: 'BR',
          },
        },
        image: event.image_url || 'https://namidia.com.br/og-image.png',
        url: 'https://namidia.com.br/#eventos',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Na Mídia',
    url: 'https://namidia.com.br',
    logo: 'https://namidia.com.br/logotiponamidiavetorizado.svg',
    description: 'Plataforma de eventos em Atibaia com cupons exclusivos para bebidas grátis',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atibaia',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: [
      // Adicionar redes sociais quando disponíveis
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Na Mídia',
    url: 'https://namidia.com.br',
    description: 'Descubra eventos incríveis em Atibaia e ganhe cupons para bebidas grátis',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://namidia.com.br/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
