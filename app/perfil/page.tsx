"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ChevronRight } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getCart } from "@/lib/delivery/cart";
import { isUserAdmin } from "@/lib/auth/admins";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileQuickLinks } from "@/components/profile/ProfileQuickLinks";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    cupons: 0,
    pedidos: 0,
    carrinho: 0,
    enderecos: 0,
  });
  const [lastOrder, setLastOrder] = useState<any>(null);

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

      // Buscar estatísticas e último pedido
      const [cuponsCount, pedidosCount, enderecosCount, lastOrderRes] = await Promise.all([
        supabase.from("coupons").select("*", { count: "exact", head: true }).eq("user_email", user.email || "").is("used_at", null),
        supabase.from("delivery_orders").select("*", { count: "exact", head: true }).eq("user_email", user.email || ""),
        supabase.from("delivery_addresses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("delivery_orders").select("*").eq("user_email", user.email || "").order("created_at", { ascending: false }).limit(1).single(),
      ]);

      const cart = getCart();

      setStats({
        cupons: cuponsCount.count || 0,
        pedidos: pedidosCount.count || 0,
        carrinho: cart.items.length || 0,
        enderecos: enderecosCount.count || 0,
      });

      if (lastOrderRes.data) {
        setLastOrder(lastOrderRes.data);
      }

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
          {/* Profile Header */}
          <ProfileHeader user={user} onLogout={handleLogout} />

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

          {/* Último Pedido Card */}
          {lastOrder && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2 px-1">
                Último Pedido
              </h2>
              <Link href="/perfil/pedidos">
                <LiquidGlass className="p-6 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${lastOrder.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          lastOrder.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                        {lastOrder.status === 'pending' ? 'Recebido' :
                          lastOrder.status === 'preparing' ? 'Preparando' :
                            lastOrder.status === 'delivering' ? 'A Caminho' :
                              lastOrder.status === 'completed' ? 'Entregue' :
                                lastOrder.status === 'cancelled' ? 'Cancelado' : lastOrder.status}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lastOrder.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      #{lastOrder.order_number}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastOrder.total)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lastOrder.delivery_method === 'delivery' ? 'Entrega' : 'Retirada'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </LiquidGlass>
              </Link>
            </div>
          )}

          {/* Quick Links Grid */}
          <ProfileQuickLinks stats={stats} />
        </motion.div>
      </div>
    </div>
  );
}

