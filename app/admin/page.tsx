import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Ticket,
  ArrowUp,
  ArrowDown,
  ChevronRight
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export const metadata = {
  title: 'Dashboard Admin - Na Mídia',
  description: 'Painel administrativo',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Buscar estatísticas
  const { data: products } = await supabase
    .from('delivery_products')
    .select('id, is_active');

  const { data: orders } = await supabase
    .from('delivery_orders')
    .select('id, total, status, created_at, order_number, user_name');

  const { data: events } = await supabase
    .from('events')
    .select('id');

  const { data: coupons } = await supabase
    .from('coupons')
    .select('id, used_at');

  // Calcular estatísticas
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter(p => p.is_active).length || 0;

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

  const totalRevenue = orders
    ?.filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0) || 0;

  const todayOrders = orders?.filter(o => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length || 0;

  const totalCoupons = coupons?.length || 0;
  const usedCoupons = coupons?.filter(c => c.used_at).length || 0;

  const stats = [
    {
      title: 'Produtos',
      value: totalProducts,
      subtitle: `${activeProducts} ativos`,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pedidos',
      value: totalOrders,
      subtitle: `${pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      trend: `${todayOrders} hoje`,
      trendUp: true,
    },
    {
      title: 'Receita',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      subtitle: 'Completados',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Conversão',
      value: '68%',
      subtitle: 'Últimos 30 dias',
      icon: TrendingUp,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      trend: '+3.1%',
      trendUp: true,
    },
  ];

  const quickLinks = [
    {
      title: 'Produtos',
      href: '/admin/produtos',
      icon: Package,
      color: 'blue',
      description: 'Gerenciar produtos',
    },
    {
      title: 'Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart,
      color: 'green',
      description: `${pendingOrders} pendentes`,
    },
    {
      title: 'Eventos',
      href: '#',
      icon: Calendar,
      color: 'purple',
      description: `${events?.length || 0} eventos`,
      disabled: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Visão geral do sistema"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LiquidGlass className="p-5 group hover:scale-[1.02] transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trendUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {stat.trend}
                  </div>
                </div>
                <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {link.disabled ? (
                <LiquidGlass className="p-5 opacity-60 cursor-not-allowed">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 flex items-center justify-center text-${link.color}-600 dark:text-${link.color}-400 shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-baloo2 font-bold text-gray-900 dark:text-white mb-1">{link.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                      BREVE
                    </div>
                  </div>
                </LiquidGlass>
              ) : (
                <Link href={link.href}>
                  <LiquidGlass className={`p-5 group hover:border-${link.color}-500/30 transition-colors`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 flex items-center justify-center text-${link.color}-600 dark:text-${link.color}-400 group-hover:scale-110 transition-transform shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-baloo2 font-bold text-gray-900 dark:text-white group-hover:text-${link.color}-600 transition-colors mb-1`}>
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.description}</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-400 group-hover:text-${link.color}-500 group-hover:translate-x-1 transition-all shrink-0`} />
                    </div>
                  </LiquidGlass>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Pedidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <LiquidGlass className="p-6">
            <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Últimos Pedidos
            </h3>
            <div className="space-y-2">
              {orders?.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {order.order_number} - {order.user_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 dark:text-white">
                      R$ {parseFloat(order.total.toString()).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!orders || orders.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum pedido ainda
                </p>
              )}
            </div>
          </LiquidGlass>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <LiquidGlass className="p-6">
            <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas Rápidas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Eventos</span>
                </div>
                <span className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">
                  {events?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Usuários</span>
                </div>
                <span className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">234</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Ticket size={20} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Cupons Usados</span>
                </div>
                <span className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">
                  {usedCoupons}/{totalCoupons}
                </span>
              </div>
            </div>
          </LiquidGlass>
        </motion.div>
      </div>
    </div>
  );
}
