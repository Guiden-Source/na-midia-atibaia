'use client';

import { ShoppingCart, DollarSign, TrendingUp, Ticket } from 'lucide-react';
import { useTodayStats } from '@/hooks/useDashboardMetrics';

export function QuickStats() {
    const { data, loading } = useTodayStats();

    const stats = [
        {
            label: 'Pedidos Hoje',
            value: data.orders,
            icon: ShoppingCart,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: 'Receita Hoje',
            value: `R$ ${data.revenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            label: 'Ticket Médio',
            value: `R$ ${data.avgTicket.toFixed(2)}`,
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
        },
        {
            label: 'Cupons Usados',
            value: data.couponsUsed,
            icon: Ticket,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <Icon className={stat.color} size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
