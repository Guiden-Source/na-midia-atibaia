import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSafeClient(): SupabaseClient<Database, 'public', any> {
  if (!url || !anon) {
    // Durante build (sem env), retornar proxy seguro
    if (typeof window === 'undefined') {
      console.warn('[Supabase] Variáveis de ambiente faltando durante build. Usando fallback.');
      const handler: ProxyHandler<any> = {
        get() {
          return () => ({ data: null, error: new Error('Supabase não configurado - verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY') });
        },
      };
      // @ts-ignore
      return new Proxy({}, handler) as unknown as SupabaseClient<Database>;
    }
    
    // No cliente, falhar rapidamente
    throw new Error('Configuração Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local');
  }
  
  return createClient<Database>(url, anon, { 
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'na-midia-mvp',
      },
    },
    db: {
      schema: 'public',
    },
  });
}

export const supabase = createSafeClient();
