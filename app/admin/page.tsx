import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Users,
  Ticket,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

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
      title: 'Total de Produtos',
      value: totalProducts,
      subtitle: `${activeProducts} ativos`,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pedidos',
      value: totalOrders,
      subtitle: `${pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      trend: `${todayOrders} hoje`,
      trendUp: true,
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      subtitle: 'Pedidos completados',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Taxa de Conversão',
      value: '68%',
      subtitle: 'Últimos 30 dias',
      icon: TrendingUp,
      color: 'from-orange-500 to-pink-500',
      trend: '+3.1%',
      trendUp: true,
    },
  ];

  const quickStats = [
    {
      title: 'Eventos',
      value: events?.length || 0,
      icon: Calendar,
    },
    {
      title: 'Usuários',
      value: '234',
      icon: Users,
    },
    {
      title: 'Cupons Usados',
      value: `${usedCoupons}/${totalCoupons}`,
      icon: Ticket,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminHeader 
        title="Dashboard" 
        description="Visão geral do sistema"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="font-medium">{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Pedidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Últimos Pedidos
          </h3>
          <div className="space-y-3">
            {orders?.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.order_number} - {order.user_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    R$ {parseFloat(order.total.toString()).toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
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
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/produtos"
              className="block p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all"
            >
              <p className="font-medium text-blue-900 dark:text-blue-300">
                Gerenciar Produtos
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Adicionar, editar ou remover produtos
              </p>
            </Link>
            <Link
              href="/admin/pedidos"
              className="block p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 hover:shadow-md transition-all"
            >
              <p className="font-medium text-green-900 dark:text-green-300">
                Ver Pedidos
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {pendingOrders} pedidos aguardando confirmação
              </p>
            </Link>
            <div className="block p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 opacity-50">
              <p className="font-medium text-purple-900 dark:text-purple-300">
                Gerenciar Eventos
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Em breve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
