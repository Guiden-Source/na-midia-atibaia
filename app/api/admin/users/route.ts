export const runtime = 'nodejs';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lista de emails autorizados como admin
const ADMIN_EMAILS = [
  'guidjvb@gmail.com',
  'admin@namidia.com.br',
];

export async function GET(request: Request) {
  try {
    // Verificar se o usuário atual é admin
    const supabase = createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    
    // Criar cliente admin com service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Buscar usuários usando admin API
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Retornar apenas dados necessários
    const usersData = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      full_name: u.user_metadata?.full_name || u.user_metadata?.name || '',
      avatar_url: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
      provider: u.app_metadata?.provider || 'email',
    }));
    
    console.log('✅ Usuários buscados:', usersData.length);
    
    return NextResponse.json({ users: usersData });
  } catch (e: any) {
    console.error('❌ Erro na API de usuários:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
