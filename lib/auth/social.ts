"use client";

import { createClient } from "@/lib/supabase/client";
import type { Provider } from "@supabase/supabase-js";

export async function signInWithSocial(provider: Provider) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }

  return data;
}

export async function signInWithGoogle() {
  return signInWithSocial('google');
}

// Adicione outros providers conforme necessário
export async function signInWithFacebook() {
  return signInWithSocial('facebook');
}

export async function signInWithApple() {
  return signInWithSocial('apple');
}
