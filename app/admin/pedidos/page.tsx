'use client';

import { useEffect, useState } from 'react';
import { getOrderStats } from '@/lib/delivery/queries';
import { OrdersManager } from '@/components/delivery/OrdersManager';
import { formatPrice } from '@/lib/delivery/cart';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { supabase } from '@/lib/supabase';

export default function AdminOrdersPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();

    // Subscribe to realtime updates for orders to refresh stats
    const channel = supabase
      .channel('admin-orders-stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'delivery_orders' },
        () => {
          console.log('Order changed, refreshing stats...');
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    const data = await getOrderStats();
    setStats(data);
  };



  return (
    <div className="p-4 sm:p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <AdminHeader
        title="Gerenciar Pedidos"
        description="Gerencie todos os pedidos de delivery em tempo real"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-shrink-0">
        <StatsCard
          title="Total"
          value={stats.totalOrders}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Pendentes"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Em Andamento"
          value={stats.activeOrders}
          icon={TrendingUp}
          color="orange"
        />
        <StatsCard
          title="Hoje"
          value={stats.todayOrders}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Faturamento"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <OrdersManager />
      </div>
    </div>
  );
}
