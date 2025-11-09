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
    redirect('/signup?error=' + encodeURIComponent(error.message));
  }

  // Signup bem-sucedido - redireciona para página de confirmação
  redirect('/signup/confirm');
}
