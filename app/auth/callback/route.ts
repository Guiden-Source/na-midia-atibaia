import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Se a sessão foi criada com sucesso, redireciona para o perfil
    if (data?.session) {
      return NextResponse.redirect(`${origin}/perfil`);
    }
  }

  // Se não houver código ou sessão, vai para home
  return NextResponse.redirect(`${origin}/`);
}
