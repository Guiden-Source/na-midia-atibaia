// Tipos e constantes para o sistema de bebidas

export const DRINK_TYPES = {
  cerveja: {
    label: 'Cerveja',
    icon: '🍺',
    color: '#F59E0B', // amber-500
  },
  vinho: {
    label: 'Vinho',
    icon: '🍷',
    color: '#DC2626', // red-600
  },
  drink: {
    label: 'Drink/Coquetel',
    icon: '🍹',
    color: '#EC4899', // pink-500
  },
  destilado: {
    label: 'Destilado',
    icon: '🥃',
    color: '#B45309', // amber-700
  },
  nao_alcoolico: {
    label: 'Não Alcoólico',
    icon: '🧃',
    color: '#10B981', // emerald-500
  },
} as const;

export type DrinkType = keyof typeof DRINK_TYPES;

export interface Drink {
  id: string;
  nome: string;
  tipo: DrinkType;
  descricao?: string | null;
  preco?: number | null;
  imagem_url?: string | null;
  icone?: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventDrink {
  id: string;
  event_id: string;
  drink_id: string;
  drink?: Drink;
  disponivel: boolean;
  preco_evento?: number | null;
  destaque: boolean;
  created_at: string;
}
