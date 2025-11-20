"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Ticket, Calendar, Users, Settings, LogOut,
  ShoppingBag, Package, MapPin, ShoppingCart, ChevronRight
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
      setIsAdmin(isUserAdmin(user));

      // Buscar estatísticas
      const [cuponsCount, eventosCount, pedidosCount, enderecosCount] = await Promise.all([
        supabase.from("coupons").select("*", { count: "exact", head: true }).eq("user_email", user.email || "").is("used_at", null),
        supabase.from("confirmations").select("*", { count: "exact", head: true }).eq("user_email", user.email || ""),
        supabase.from("delivery_orders").select("*", { count: "exact", head: true }).eq("user_email", user.email || ""),
        supabase.from("delivery_addresses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const quickLinks = [
    { icon: ShoppingBag, label: "Novo Pedido", href: "/delivery", color: "orange", desc: "Faça um novo pedido" },
    { icon: Package, label: "Pedidos", href: "/perfil/pedidos", color: "blue", desc: `${stats.pedidos} pedidos` },
    { icon: ShoppingCart, label: "Carrinho", href: "/delivery/cart", color: "green", desc: `${stats.carrinho} itens` },
    { icon: MapPin, label: "Endereços", href: "/perfil/enderecos", color: "pink", desc: `${stats.enderecos} salvos` },
    { icon: Ticket, label: "Cupons", href: "/perfil/cupons", color: "purple", desc: `${stats.cupons} disponíveis` },
    { icon: Calendar, label: "Eventos", href: "/perfil/eventos", color: "indigo", desc: `${stats.eventos} confirmados` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header - Simplified */}
          <LiquidGlass className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-full bg-gradient-to-br from-primary to-orange-600 p-1">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left min-w-0">
                <h1 className="font-baloo2 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Olá, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante'}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4 truncate">{user?.email}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2 shrink-0"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </LiquidGlass>

          {/* Admin Panel (only for admins) */}
          {isAdmin && (
            <Link href="/admin">
              <LiquidGlass className="p-6 flex items-center gap-4 hover:border-purple-500/50 transition-colors bg-gradient-to-r from-orange-500/5 to-purple-600/5 group">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Settings className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Painel Administrativo
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie a plataforma</p>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </LiquidGlass>
            </Link>
          )}

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={link.href}>
                  <LiquidGlass className={`p-5 group hover:border-${link.color}-500/30 transition-colors h-full`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 flex items-center justify-center text-${link.color}-600 dark:text-${link.color}-400 group-hover:scale-110 transition-transform shrink-0`}>
                        <link.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-baloo2 font-bold text-gray-900 dark:text-white group-hover:text-${link.color}-600 transition-colors mb-1`}>
                          {link.label}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.desc}</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-400 group-hover:text-${link.color}-500 group-hover:translate-x-1 transition-all shrink-0`} />
                    </div>
                  </LiquidGlass>
                </Link>
              </motion.div>
            ))}

            {/* Amigos - Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LiquidGlass className="p-5 opacity-60 cursor-not-allowed h-full">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-baloo2 font-bold text-gray-900 dark:text-white mb-1">Amigos</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Em breve</p>
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                    BREVE
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
