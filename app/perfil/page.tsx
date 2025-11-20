"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Ticket, Calendar, Users, Settings, LogOut,
  ShoppingBag, Package, MapPin, ShoppingCart,
  ChevronRight, Star, Heart, Bell
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getCart } from "@/lib/delivery/cart";
import { isUserAdmin } from "@/lib/auth/admins";
import { LiquidGlass } from "@/components/ui/liquid-glass";

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
      setIsAdmin(isUserAdmin(user));

      // Buscar estatísticas usando count para otimizar performance
      const [cuponsCount, eventosCount, pedidosCount, enderecosCount] = await Promise.all([
        // Cupons disponíveis (não usados)
        supabase
          .from("coupons")
          .select("*", { count: "exact", head: true })
          .eq("user_email", user.email || "")
          .is("used_at", null),

        // Eventos confirmados
        supabase
          .from("confirmations")
          .select("*", { count: "exact", head: true })
          .eq("user_email", user.email || ""),

        // Pedidos delivery
        supabase
          .from("delivery_orders")
          .select("*", { count: "exact", head: true })
          .eq("user_email", user.email || ""),

        // Endereços salvos
        supabase
          .from("delivery_addresses")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      // Obter items do carrinho
      const cart = getCart();

      setStats({
        cupons: cuponsCount.count || 0,
        eventos: eventosCount.count || 0,
        pedidos: pedidosCount.count || 0,
        carrinho: cart.items.length || 0,
        enderecos: enderecosCount.count || 0,
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Profile Header */}
          <motion.div variants={item}>
            <LiquidGlass className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary to-orange-600 p-1">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Olá, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante'}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {user?.email}
                </p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" /> Membro
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {stats.eventos} Eventos
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Ticket, label: "Cupons", value: stats.cupons, color: "orange" },
              { icon: Calendar, label: "Eventos", value: stats.eventos, color: "purple" },
              { icon: Package, label: "Pedidos", value: stats.pedidos, color: "blue" },
              { icon: ShoppingCart, label: "Carrinho", value: stats.carrinho, color: "green" },
              { icon: MapPin, label: "Endereços", value: stats.enderecos, color: "pink" },
            ].map((stat, index) => (
              <LiquidGlass
                key={index}
                className="p-4 flex flex-col items-center justify-center text-center group cursor-pointer"
                intensity={0.3}
              >
                <div className={`mb-3 p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </LiquidGlass>
            ))}
          </motion.div>

          {/* Admin Panel Link (só para admins) */}
          {isAdmin && (
            <motion.div variants={item}>
              <Link href="/admin" className="block">
                <LiquidGlass className="p-6 flex items-center gap-6 group hover:border-purple-500/50 transition-colors bg-gradient-to-r from-orange-500/10 to-purple-600/10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Settings className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Painel Administrativo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Gerencie eventos, usuários e cupons da plataforma
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </LiquidGlass>
              </Link>
            </motion.div>
          )}

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Delivery Section */}
            <motion.div variants={item} className="space-y-4">
              <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                Delivery
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/delivery" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-orange-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Fazer Novo Pedido</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Explore nosso cardápio completo</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>

                <Link href="/perfil/pedidos" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-blue-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Meus Pedidos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Acompanhe seus pedidos em andamento</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>

                <Link href="/delivery/cart" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-green-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Carrinho</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.carrinho} {stats.carrinho === 1 ? 'item' : 'itens'} no carrinho
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>

                <Link href="/perfil/enderecos" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-pink-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">Endereços Salvos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie seus locais de entrega</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>
              </div>
            </motion.div>

            {/* Eventos Section */}
            <motion.div variants={item} className="space-y-4">
              <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Calendar className="h-5 w-5" />
                </span>
                Eventos & Cupons
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/perfil/cupons" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-purple-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">Meus Cupons</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Visualize seus ingressos e descontos</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>

                <Link href="/perfil/eventos" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-indigo-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">Eventos Confirmados</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Histórico de eventos que você participou</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </LiquidGlass>
                </Link>

                <Link href="/perfil/amigos" className="block">
                  <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-green-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Amigos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Conecte-se com outros usuários</p>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500">EM BREVE</div>
                  </LiquidGlass>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
