"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Email ou senha incorretos" };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signUp(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: "Erro ao criar conta. Email pode já estar em uso." };
  }

  return { success: true };
}
