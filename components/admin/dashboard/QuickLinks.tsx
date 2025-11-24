import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ShoppingCart, Calendar, ChevronRight } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { DashboardStats } from '@/hooks/useAdminStats';

interface QuickLinksProps {
  stats: DashboardStats;
}

export function QuickLinks({ stats }: QuickLinksProps) {
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
      description: `${stats.pendingOrders} pendentes`,
    },
    {
      title: 'Eventos',
      href: '#',
      icon: Calendar,
      color: 'purple',
      description: `${stats.totalEvents} eventos`,
      disabled: true,
    },
  ];

  return (
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
  );
}
