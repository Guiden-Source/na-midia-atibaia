'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  activeProducts: number;
  totalRevenue: number;
  todayOrders: number;
  averageTicket: number;
}

export interface OrderData {
  id: string;
  order_number: string;
  user_name: string;
  total: number;
  status: string;
  created_at: string;
}

export function useAdminStats() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    activeProducts: 0,
    totalRevenue: 0,
    todayOrders: 0,
    averageTicket: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Total de pedidos
      const { count: totalOrders } = await supabase
        .from('delivery_orders')
        .select('*', { count: 'exact', head: true });

      // Pedidos pendentes (pending + confirmed)
      const { count: pendingOrders } = await supabase
        .from('delivery_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed']);

      // Produtos ativos
      const { count: activeProducts } = await supabase
        .from('delivery_products')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      // Receita total (apenas pedidos completed)
      const { data: completedOrders } = await supabase
        .from('delivery_orders')
        .select('total')
        .eq('status', 'completed');

      const totalRevenue = completedOrders?.reduce(
        (sum, order) => sum + Number(order.total),
        0
      ) || 0;

      // Pedidos de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayOrders } = await supabase
        .from('delivery_orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Ticket médio
      const averageTicket = completedOrders && completedOrders.length > 0
        ? totalRevenue / completedOrders.length
        : 0;

      // Últimos 3 pedidos
      const { data: recent } = await supabase
        .from('delivery_orders')
        .select('id, order_number, user_name, total, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        activeProducts: activeProducts || 0,
        totalRevenue,
        todayOrders: todayOrders || 0,
        averageTicket,
      });

      setRecentOrders(recent || []);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, recentOrders, loading };
}
