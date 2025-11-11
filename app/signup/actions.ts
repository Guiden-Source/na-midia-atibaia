'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function signup(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
      }
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    
    // Traduzir mensagens de erro comuns
    let errorMessage = error.message;
    
    if (error.message.includes('rate limit exceeded')) {
      errorMessage = 'Muitas tentativas de cadastro. Por favor, aguarde alguns minutos ou use o login com Google.';
    } else if (error.message.includes('User already registered')) {
      errorMessage = 'Este email já está cadastrado. Faça login ou recupere sua senha.';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Email inválido. Verifique o endereço digitado.';
    } else if (error.message.includes('Password should be at least')) {
      errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
    }
    
    redirect('/signup?error=' + encodeURIComponent(errorMessage));
  }

  // Signup bem-sucedido - redireciona para página de confirmação
  redirect('/signup/confirm');
}
