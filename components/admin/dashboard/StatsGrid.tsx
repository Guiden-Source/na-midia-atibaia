import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/hooks/useAdminStats';
import { StatsCard } from '@/components/admin/StatsCard';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsData = [
    {
      title: 'Produtos',
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} ativos`,
      icon: Package,
      color: 'blue' as const,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: 'green' as const,
      trend: `${stats.todayOrders} hoje`,
      trendUp: true,
    },
    {
      title: 'Receita',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      subtitle: 'Completados',
      icon: DollarSign,
      color: 'purple' as const,
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Conversão',
      value: '68%',
      subtitle: 'Últimos 30 dias',
      icon: TrendingUp,
      color: 'orange' as const,
      trend: '+3.1%',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            trendUp={stat.trendUp}
            description={stat.subtitle}
          />
        </motion.div>
      ))}
    </div>
  );
}

