import { getOrderStats } from '@/lib/delivery/queries';
import { OrdersManager } from '@/components/delivery/OrdersManager';
import { formatPrice } from '@/lib/delivery/cart';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Admin - Pedidos Delivery - Na Mídia',
  description: 'Gerenciar pedidos de delivery',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const stats = await getOrderStats();

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
    <div className="p-4 sm:p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <AdminHeader
        title="Gerenciar Pedidos"
        description="Gerencie todos os pedidos de delivery em tempo real"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-shrink-0">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <LiquidGlass key={stat.label} className="p-4 group hover:scale-[1.02] transition-transform" intensity={0.3}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-1.5 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon size={16} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <p className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white truncate">
                {stat.value}
              </p>
            </LiquidGlass>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <OrdersManager />
      </div>
    </div>
  );
}
