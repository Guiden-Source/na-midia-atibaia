"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ChevronLeft, Sparkles, UserPlus, Calendar } from "lucide-react";

export default function AmigosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/perfil" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                Amigos
              </h1>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Coming Soon Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 sm:p-12 text-center border-2 border-blue-200 dark:border-blue-700/50">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-baloo2 font-bold text-blue-700 dark:text-blue-300">
              Em Breve
            </span>
          </div>

          <h2 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sistema de Amigos
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
            Em breve você poderá convidar amigos, ver quem vai nos mesmos eventos e compartilhar experiências juntos!
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6">
              <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <p className="font-baloo2 font-bold text-gray-900 dark:text-white mb-1">
                Adicionar Amigos
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convide por email ou username
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <p className="font-baloo2 font-bold text-gray-900 dark:text-white mb-1">
                Eventos em Comum
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Veja quem vai nos mesmos eventos
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6">
              <Sparkles className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
              <p className="font-baloo2 font-bold text-gray-900 dark:text-white mb-1">
                Compartilhar Cupons
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Envie cupons para amigos
              </p>
            </div>
          </div>

          {/* Notification Signup */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Quer ser notificado quando essa feature estiver disponível?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Estamos trabalhando nisso! Fique de olho nas atualizações da plataforma.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-orange-600 px-8 py-4 font-baloo2 font-semibold text-white transition-colors"
            >
              Explorar Eventos
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 p-4 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Dica:</strong> Enquanto isso, você pode compartilhar eventos manualmente com seus amigos pelo WhatsApp ou redes sociais!
          </p>
        </div>
      </div>
    </div>
  );
}
