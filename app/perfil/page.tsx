"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Ticket, Calendar, Users, Settings, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cupons: 0,
    eventos: 0,
  });

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      console.log('👤 Perfil - Loading stats for user:', user.email);
      console.log('👤 Perfil - User ID:', user.id);

      // Buscar estatísticas de cupons DISPONÍVEIS (apenas os não usados)
      const { data: cuponsData, error: cuponsError } = await supabase
        .from("coupons")
        .select("*")
        .eq("user_email", user.email || "")
        .is("used_at", null); // ← Filtra apenas cupons não usados

      console.log('👤 Perfil - Cupons disponíveis:', {
        data: cuponsData,
        error: cuponsError,
        count: cuponsData?.length || 0
      });

      if (cuponsError) {
        console.error('👤 Perfil - Error loading cupons:', cuponsError);
      }

      // Buscar estatísticas de eventos - tentar com user_email E user_id
      const { data: eventosData, error: eventosError } = await supabase
        .from("confirmations")
        .select("*, event:events(name, start_time)")
        .eq("user_email", user.email || "");

      console.log('👤 Perfil - Eventos query result:', {
        data: eventosData,
        error: eventosError,
        count: eventosData?.length || 0
      });

      if (eventosError) {
        console.error('👤 Perfil - Error loading eventos:', eventosError);
      }

      // Tentar também buscar todas as confirmações sem filtro (para debug)
      const { data: allConfirmations, count: totalConfirmations } = await supabase
        .from("confirmations")
        .select("*", { count: "exact" });

      console.log('👤 Perfil - Total confirmations in DB:', totalConfirmations);
      console.log('👤 Perfil - All confirmations sample:', allConfirmations?.slice(0, 3));

      setStats({
        cupons: cuponsData?.length || 0,
        eventos: eventosData?.length || 0,
      });

      console.log('👤 Perfil - Final stats:', { 
        cupons: cuponsData?.length || 0, 
        eventos: eventosData?.length || 0 
      });

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

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
              <Image
                src="/logotiponamidiavetorizado.svg"
                alt="Na Mídia"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="mb-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Meu Perfil
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 border border-orange-200 dark:border-orange-700/50">
              <Ticket className="h-8 w-8 text-primary mb-3" />
              <p className="font-baloo2 text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.cupons}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cupons disponíveis
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 border border-purple-200 dark:border-purple-700/50">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" />
              <p className="font-baloo2 text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.eventos}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Eventos confirmados
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/perfil/cupons"
            className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-primary/50"
          >
            <Ticket className="h-10 w-10 text-primary mb-4 transition-transform group-hover:scale-110" />
            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
              Meus Cupons
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Veja e use seus cupons
            </p>
          </Link>

          <Link
            href="/perfil/eventos"
            className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-primary/50"
          >
            <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
              Meus Eventos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Eventos que você participou
            </p>
          </Link>

          <Link
            href="/perfil/amigos"
            className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-primary/50"
          >
            <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
              Amigos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Em breve: convide amigos!
            </p>
          </Link>

          <button
            onClick={handleLogout}
            className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-red-500/50 text-left"
          >
            <LogOut className="h-10 w-10 text-red-600 dark:text-red-400 mb-4 transition-transform group-hover:scale-110" />
            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
              Sair
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fazer logout da conta
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
