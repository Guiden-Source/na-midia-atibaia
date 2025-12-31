import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { AdminStats } from '@/hooks/useAdminStats';
import { StatsCard } from '@/components/admin/StatsCard';

interface StatsGridProps {
  stats: AdminStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsData = [
    {
      title: 'Produtos',
      value: stats.activeProducts,
      subtitle: `ativos agora`,
      icon: Package,
      color: 'blue' as const,
      trend: `Total cadastrados`,
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
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Pedidos concluídos',
      icon: DollarSign,
      color: 'purple' as const,
      trend: 'Total acumulado',
      trendUp: true,
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${stats.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Por pedido',
      icon: TrendingUp,
      color: 'orange' as const,
      trend: 'Média geral',
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

