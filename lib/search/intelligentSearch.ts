// Sistema de busca inteligente com keywords
export type SearchIntent = {
  query: string;
  eventType?: string[];
  date?: 'today' | 'tomorrow' | 'weekend' | 'week' | 'month';
  drinks?: string[];
  priceRange?: 'free' | 'cheap' | 'any';
  location?: string;
};

// Sinônimos e variações para tipos de evento
const EVENT_TYPES_MAP: Record<string, string[]> = {
  sertanejo: ['sertanejo', 'sertaneja', 'modão', 'universitário', 'raiz', 'show sertanejo'],
  pagode: ['pagode', 'samba', 'sambinha', 'roda de samba'],
  baile: ['baile', 'bailão', 'bailinho', 'baile funk', 'baile black'],
  festa: ['festa', 'festinha', 'festão', 'balada', 'night', 'club'],
  show: ['show', 'apresentação', 'live', 'ao vivo', 'performance'],
  afterparty: ['after', 'afterparty', 'after party', 'pós festa'],
};

// Palavras-chave para datas
const DATE_KEYWORDS: Record<string, string[]> = {
  today: ['hoje', 'hj', 'agora', 'neste momento'],
  tomorrow: ['amanhã', 'amanha', 'tomorrow'],
  weekend: ['fim de semana', 'final de semana', 'fds', 'sábado', 'sabado', 'domingo'],
  week: ['essa semana', 'esta semana', 'próximos dias', 'proximos dias'],
  month: ['esse mês', 'este mês', 'este mes', 'próximo mês', 'proximo mes'],
};

// Palavras-chave para bebidas
const DRINK_KEYWORDS: Record<string, string[]> = {
  cerveja: ['cerveja', 'beer', 'chopp', 'chope', 'breja', 'gelada'],
  vodka: ['vodka', 'vodca'],
  whisky: ['whisky', 'whiskey', 'uísque', 'uisque'],
  vinho: ['vinho', 'wine', 'tinto', 'branco', 'rosé', 'rose'],
  drink: ['drink', 'coquetel', 'cocktail', 'caipirinha', 'mojito'],
  refrigerante: ['refri', 'refrigerante', 'coca', 'guaraná', 'guarana', 'soda'],
};

// Palavras-chave para preço
const PRICE_KEYWORDS: Record<string, string[]> = {
  free: ['grátis', 'gratis', 'gratuito', 'free', 'de graça', 'sem pagar'],
  cheap: ['barato', 'em conta', 'promoção', 'promocao', 'desconto'],
};

// Locais em Atibaia
const LOCATION_KEYWORDS = [
  'centro', 'downtown', 'cerejeiras', 'alvinópolis', 'alvinopolis',
  'portão', 'portao', 'imperial', 'tanque', 'ponte grande'
];

/**
 * Analisa a query do usuário e extrai intenções de busca
 */
export function parseSearchQuery(query: string): SearchIntent {
  const normalizedQuery = query.toLowerCase().trim();
  const intent: SearchIntent = { query };

  // Detectar tipo de evento
  const eventTypes: string[] = [];
  Object.entries(EVENT_TYPES_MAP).forEach(([type, keywords]) => {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      eventTypes.push(type);
    }
  });
  if (eventTypes.length > 0) intent.eventType = eventTypes;

  // Detectar data
  Object.entries(DATE_KEYWORDS).forEach(([dateType, keywords]) => {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      intent.date = dateType as SearchIntent['date'];
    }
  });

  // Detectar bebidas
  const drinks: string[] = [];
  Object.entries(DRINK_KEYWORDS).forEach(([drink, keywords]) => {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      drinks.push(drink);
    }
  });
  if (drinks.length > 0) intent.drinks = drinks;

  // Detectar preço
  Object.entries(PRICE_KEYWORDS).forEach(([priceType, keywords]) => {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      intent.priceRange = priceType as SearchIntent['priceRange'];
    }
  });

  // Detectar local
  const location = LOCATION_KEYWORDS.find(loc => normalizedQuery.includes(loc));
  if (location) intent.location = location;

  return intent;
}

/**
 * Gera sugestões de busca baseadas no input parcial
 */
export function generateSearchSuggestions(input: string): string[] {
  const normalized = input.toLowerCase().trim();
  
  if (normalized.length < 2) return [];

  const suggestions: string[] = [];

  // Sugestões populares
  const popularSearches = [
    'pagode hoje',
    'sertanejo fim de semana',
    'festa com cerveja barata',
    'baile este mês',
    'show ao vivo',
    'after com drinks',
    'evento grátis',
    'festa no centro',
    'samba amanhã',
    'balada hoje à noite',
  ];

  // Filtrar sugestões que fazem match
  popularSearches.forEach(search => {
    if (search.includes(normalized) || normalized.includes(search.split(' ')[0])) {
      suggestions.push(search);
    }
  });

  // Adicionar sugestões baseadas em tipos de evento
  Object.entries(EVENT_TYPES_MAP).forEach(([type, keywords]) => {
    keywords.forEach(keyword => {
      if (keyword.includes(normalized) || normalized.includes(keyword)) {
        suggestions.push(`${keyword} hoje`);
        suggestions.push(`${keyword} fim de semana`);
      }
    });
  });

  // Remover duplicatas e limitar a 5 sugestões
  return [...new Set(suggestions)].slice(0, 5);
}

/**
 * Filtra eventos baseado na intenção de busca
 */
export function filterEventsByIntent(events: any[], intent: SearchIntent): any[] {
  let filtered = [...events];

  // Filtrar por tipo de evento
  if (intent.eventType && intent.eventType.length > 0) {
    filtered = filtered.filter(event => 
      intent.eventType!.some(type => 
        event.event_type?.toLowerCase().includes(type) ||
        event.name?.toLowerCase().includes(type) ||
        event.description?.toLowerCase().includes(type)
      )
    );
  }

  // Filtrar por data
  if (intent.date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.start_time);
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      switch (intent.date) {
        case 'today':
          return eventDay.getTime() === today.getTime();
        
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return eventDay.getTime() === tomorrow.getTime();
        
        case 'weekend':
          const dayOfWeek = eventDay.getDay();
          const daysUntilEvent = Math.floor((eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return (dayOfWeek === 0 || dayOfWeek === 6) && daysUntilEvent <= 7;
        
        case 'week':
          const weekLater = new Date(today);
          weekLater.setDate(weekLater.getDate() + 7);
          return eventDay >= today && eventDay <= weekLater;
        
        case 'month':
          const monthLater = new Date(today);
          monthLater.setMonth(monthLater.getMonth() + 1);
          return eventDay >= today && eventDay <= monthLater;
        
        default:
          return true;
      }
    });
  }

  // Filtrar por bebidas
  if (intent.drinks && intent.drinks.length > 0 && filtered.length > 0) {
    filtered = filtered.filter(event => {
      if (!event.event_drinks || event.event_drinks.length === 0) return false;
      
      return intent.drinks!.some(drinkType => 
        event.event_drinks.some((ed: any) => 
          ed.drink?.tipo?.toLowerCase().includes(drinkType) ||
          ed.drink?.nome?.toLowerCase().includes(drinkType)
        )
      );
    });
  }

  // Filtrar por preço (bebidas)
  if (intent.priceRange && filtered.length > 0) {
    filtered = filtered.filter(event => {
      if (!event.event_drinks || event.event_drinks.length === 0) return intent.priceRange === 'any';
      
      const prices = event.event_drinks
        .map((ed: any) => ed.preco_evento || ed.drink?.preco || 0)
        .filter((p: number) => p > 0);
      
      if (prices.length === 0) return intent.priceRange === 'free';
      
      const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
      
      switch (intent.priceRange) {
        case 'free':
          return avgPrice === 0;
        case 'cheap':
          return avgPrice < 15;
        default:
          return true;
      }
    });
  }

  // Filtrar por local
  if (intent.location) {
    filtered = filtered.filter(event =>
      event.location?.toLowerCase().includes(intent.location!)
    );
  }

  // Se ainda tiver a query original, fazer busca fuzzy no nome/descrição
  if (intent.query && filtered.length > 0) {
    const queryWords = intent.query.toLowerCase().split(' ');
    filtered = filtered.filter(event => {
      const searchText = `${event.name} ${event.description} ${event.location}`.toLowerCase();
      return queryWords.some(word => searchText.includes(word));
    });
  }

  return filtered;
}
