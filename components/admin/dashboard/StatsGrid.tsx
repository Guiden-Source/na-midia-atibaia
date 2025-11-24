import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { DashboardStats } from '@/hooks/useAdminStats';

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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      trend: `${stats.todayOrders} hoje`,
      trendUp: true,
    },
    {
      title: 'Receita',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
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
  );
}
