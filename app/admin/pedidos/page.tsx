import { getAllOrders, getOrderStats } from '@/lib/delivery/queries';
import { OrderList } from '@/components/delivery/OrderList';
import { formatPrice } from '@/lib/delivery/cart';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import Link from 'next/link';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Admin - Pedidos Delivery - Na Mídia',
  description: 'Gerenciar pedidos de delivery',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: { status?: string };
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const statusFilter = searchParams.status;

  const [orders, stats] = await Promise.all([
    getAllOrders(statusFilter),
    getOrderStats(),
  ]);

  const statsData = [
    {
      label: 'Total',
      value: stats.totalOrders,
      icon: Package,
      color: 'blue',
    },
    {
      label: 'Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Em Andamento',
      value: stats.activeOrders,
      icon: TrendingUp,
      color: 'orange',
    },
    {
      label: 'Hoje',
      value: stats.todayOrders,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Faturamento',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'green',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Gerenciar Pedidos"
        description="Gerencie todos os pedidos de delivery em tempo real"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <LiquidGlass key={stat.label} className="p-5 group hover:scale-[1.02] transition-transform" intensity={0.3}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon size={18} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <p className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </LiquidGlass>
          );
        })}
      </div>

      {/* Filters */}
      <LiquidGlass className="p-2 flex flex-wrap gap-2" intensity={0.2}>
        <Link
          href="/admin/pedidos"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${!statusFilter
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          Todos ({stats.totalOrders})
        </Link>
        <Link
          href="/admin/pedidos?status=pending"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'pending'
              ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          ⏳ Pendentes ({stats.pendingOrders})
        </Link>
        <Link
          href="/admin/pedidos?status=confirmed"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'confirmed'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          ✅ Confirmados
        </Link>
        <Link
          href="/admin/pedidos?status=preparing"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'preparing'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          📦 Preparando
        </Link>
        <Link
          href="/admin/pedidos?status=delivering"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'delivering'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          🚚 Em Entrega
        </Link>
        <Link
          href="/admin/pedidos?status=completed"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'completed'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          🎉 Entregues
        </Link>
        <Link
          href="/admin/pedidos?status=cancelled"
          className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'cancelled'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
            }`}
        >
          ❌ Cancelados
        </Link>
      </LiquidGlass>

      {/* Order List */}
      <OrderList orders={orders} />
    </div>
  );
}
