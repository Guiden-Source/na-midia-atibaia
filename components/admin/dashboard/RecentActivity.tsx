import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Calendar, Users, Ticket } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { DashboardStats, RecentOrder } from '@/hooks/useAdminStats';

interface RecentActivityProps {
  orders: RecentOrder[];
  stats: DashboardStats;
}

export function RecentActivity({ orders, stats }: RecentActivityProps) {
  return (
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
            {orders.slice(0, 5).map((order) => (
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
            {orders.length === 0 && (
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
                {stats.totalEvents}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Usuários</span>
              </div>
              <span className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Ticket size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Cupons Usados</span>
              </div>
              <span className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">
                {stats.usedCoupons}/{stats.totalCoupons}
              </span>
            </div>
          </div>
        </LiquidGlass>
      </motion.div>
    </div>
  );
}
