import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayOrders: number;
  totalCoupons: number;
  usedCoupons: number;
  totalEvents: number;
  totalUsers: number;
}

export interface RecentOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_number: string;
  user_name: string;
}

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    totalCoupons: 0,
    usedCoupons: 0,
    totalEvents: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [
        { data: products },
        { data: ordersData },
        { data: events },
        { data: coupons }
      ] = await Promise.all([
        supabase.from('delivery_products').select('id, is_active'),
        supabase.from('delivery_orders').select('id, total, status, created_at, order_number, user_name').order('created_at', { ascending: false }),
        supabase.from('events').select('id'),
        supabase.from('coupons').select('id, used_at'),
      ]);

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter((p: any) => p.is_active).length || 0;

      const totalOrders = ordersData?.length || 0;
      const pendingOrders = ordersData?.filter((o: any) => o.status === 'pending').length || 0;

      const totalRevenue = ordersData
        ?.filter((o: any) => o.status === 'completed')
        .reduce((sum: number, o: any) => sum + parseFloat(o.total.toString()), 0) || 0;

      const todayOrders = ordersData?.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }).length || 0;

      const totalCoupons = coupons?.length || 0;
      const usedCoupons = coupons?.filter((c: any) => c.used_at).length || 0;

      const { count: totalUsers } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1
      });

      setStats({
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        todayOrders,
        totalCoupons,
        usedCoupons,
        totalEvents: events?.length || 0,
        totalUsers: totalUsers || 0,
      });

      setRecentOrders((ordersData as RecentOrder[]) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { stats, recentOrders, loading };
}
