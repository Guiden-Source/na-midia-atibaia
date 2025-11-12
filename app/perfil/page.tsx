"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Ticket, Calendar, Users, Settings, LogOut, ShoppingBag, Package, MapPin, ShoppingCart } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getCart } from "@/lib/delivery/cart";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    cupons: 0,
    eventos: 0,
    pedidos: 0,
    carrinho: 0,
    enderecos: 0,
  });

  // Lista de emails autorizados como admin
  const ADMIN_EMAILS = [
    'guidjvb@gmail.com',
    'admin@namidia.com.br',
  ];

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Verificar se é admin
      const userIsAdmin = ADMIN_EMAILS.includes(user.email || '');
      setIsAdmin(userIsAdmin);

      console.log('👤 Perfil - Loading stats for user:', user.email);
      console.log('👤 Perfil - User ID:', user.id);
      console.log('👤 Perfil - Is Admin:', userIsAdmin);

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

      // Buscar estatísticas de delivery
      const { data: pedidosData } = await supabase
        .from("delivery_orders")
        .select("id")
        .eq("user_email", user.email || "");

      const { data: enderecosData } = await supabase
        .from("delivery_addresses")
        .select("id")
        .eq("user_id", user.id);

      // Obter items do carrinho
      const cart = getCart();

      setStats({
        cupons: cuponsData?.length || 0,
        eventos: eventosData?.length || 0,
        pedidos: pedidosData?.length || 0,
        carrinho: cart.items.length || 0,
        enderecos: enderecosData?.length || 0,
      });

      console.log('👤 Perfil - Final stats:', { 
        cupons: cuponsData?.length || 0, 
        eventos: eventosData?.length || 0,
        pedidos: pedidosData?.length || 0,
        carrinho: cart.items.length || 0,
        enderecos: enderecosData?.length || 0,
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 sm:p-6 border border-orange-200 dark:border-orange-700/50">
              <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 sm:mb-3" />
              <p className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.cupons}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Cupons
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 sm:p-6 border border-purple-200 dark:border-purple-700/50">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400 mb-2 sm:mb-3" />
              <p className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.eventos}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Eventos
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6 border border-blue-200 dark:border-blue-700/50">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 mb-2 sm:mb-3" />
              <p className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.pedidos}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Pedidos
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 sm:p-6 border border-green-200 dark:border-green-700/50">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 mb-2 sm:mb-3" />
              <p className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.carrinho}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Carrinho
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 sm:p-6 border border-pink-200 dark:border-pink-700/50">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 dark:text-pink-400 mb-2 sm:mb-3" />
              <p className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.enderecos}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereços
              </p>
            </div>
          </div>
        </div>

        {/* Admin Panel Link (só para admins) */}
        {isAdmin && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-1">
            <Link
              href="/admin"
              className="flex items-center gap-4 rounded-[calc(1.5rem-4px)] bg-white dark:bg-gray-800 p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-1">
                  🛠️ Painel Administrativo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie eventos, usuários e cupons
                </p>
              </div>
              <div className="text-2xl">→</div>
            </Link>
          </div>
        )}

        {/* Seção Delivery */}
        <div className="mb-6">
          <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Delivery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/delivery"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-primary/50"
            >
              <ShoppingBag className="h-10 w-10 text-primary mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Fazer Pedido
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Veja nossos produtos
              </p>
            </Link>

            <Link
              href="/perfil/pedidos"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-blue-500/50"
            >
              <Package className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Meus Pedidos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.pedidos} pedidos realizados
              </p>
            </Link>

            <Link
              href="/delivery/cart"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-green-500/50"
            >
              <ShoppingCart className="h-10 w-10 text-green-600 dark:text-green-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Carrinho
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.carrinho} {stats.carrinho === 1 ? 'item' : 'itens'}
              </p>
            </Link>

            <Link
              href="/perfil/enderecos"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-pink-500/50"
            >
              <MapPin className="h-10 w-10 text-pink-600 dark:text-pink-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Endereços
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.enderecos} {stats.enderecos === 1 ? 'endereço' : 'endereços'} salvos
              </p>
            </Link>
          </div>
        </div>

        {/* Seção Eventos */}
        <div className="mb-6">
          <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Eventos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/perfil/cupons"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-primary/50"
            >
              <Ticket className="h-10 w-10 text-primary mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Meus Cupons
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.cupons} cupons disponíveis
              </p>
            </Link>

            <Link
              href="/perfil/eventos"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-purple-500/50"
            >
              <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Meus Eventos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.eventos} eventos confirmados
              </p>
            </Link>

            <Link
              href="/perfil/amigos"
              className="group rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-blue-500/50"
            >
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                Amigos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Em breve: convide amigos!
              </p>
            </Link>
          </div>
        </div>

        {/* Seção Conta */}
        <div>
          <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            Conta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>
  );
}
