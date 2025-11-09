import type { EventDrink } from './drinks/types';

export type EventType = 'Afterparty' | 'Show' | 'Baile' | 'Festival' | 'Outro';

export type Event = {
  id: string;
  name: string;
  location: string;
  description?: string;
  start_time: string; // ISO
  end_time?: string | null; // ISO
  event_type: EventType;
  is_active: boolean;
  na_midia_present: boolean;
  image_url?: string | null;
  created_at: string; // ISO
  updated_at?: string; // ISO
  // Campos derivados para UI
  confirmations_count?: number;
  event_drinks?: EventDrink[]; // Bebidas do evento
};

export type Confirmation = {
  id: string;
  event_id: string;
  user_name: string;
  user_email?: string | null;
  user_phone?: string | null;
  created_at: string; // ISO
};

export type Coupon = {
  id: string;
  code: string;
  event_id: string;
  confirmation_id: string;
  discount_percentage: number;
  is_used: boolean;
  used_at?: string | null;
  created_at: string; // ISO
};

// Opcional: Tipos gerados para o cliente tipado do Supabase (mínimos)
export type Database = {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>> & {
          name: string; location: string; start_time: string; event_type: EventType;
        };
        Update: Partial<Omit<Event, 'id' | 'created_at'>>;
        Relationships: [];
      };
      confirmations: {
        Row: Confirmation;
        Insert: { event_id: string; user_name: string; user_email?: string | null; user_phone?: string | null; };
        Update: Partial<Confirmation>;
        Relationships: [{ foreignKeyName: 'confirmations_event_id_fkey'; columns: ['event_id']; referencedRelation: 'events'; referencedColumns: ['id']; }];
      };
      coupons: {
        Row: Coupon;
        Insert: { code: string; event_id: string; confirmation_id: string; discount_percentage?: number; is_used?: boolean; };
        Update: Partial<Coupon>;
        Relationships: [
          { foreignKeyName: 'coupons_event_id_fkey'; columns: ['event_id']; referencedRelation: 'events'; referencedColumns: ['id']; },
          { foreignKeyName: 'coupons_confirmation_id_fkey'; columns: ['confirmation_id']; referencedRelation: 'confirmations'; referencedColumns: ['id']; }
        ];
      };
    };
    Views: {
      event_confirmations_count: {
        Row: { event_id: string; event_name: string; confirmations_count: number };
      };
      unused_coupons: {
        Row: { code: string; event_name: string; discount_percentage: number; created_at: string };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
