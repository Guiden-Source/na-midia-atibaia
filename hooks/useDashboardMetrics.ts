import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Types
export interface DailySales {
    date: string;
    orders: number;
    revenue: number;
}

export interface TopProduct {
    id: string;
    name: string;
    sales: number;
    revenue: number;
}

export interface TodayStats {
    orders: number;
    revenue: number;
    avgTicket: number;
    couponsUsed: number;
}

export interface HealthStatus {
    status: 'healthy' | 'warning' | 'error';
    database: boolean;
    pendingOrders: number;
    issues: string[];
}

/**
 * Hook: Vendas dos últimos 7 dias
 */
export function useWeeklySales() {
    const [data, setData] = useState<DailySales[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeeklySales() {
            const supabase = createClient();

            // Últimos 7 dias
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data: orders, error } = await supabase
                .from('delivery_orders')
                .select('created_at, total')
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: true });

            if (error || !orders) {
                setLoading(false);
                return;
            }

            // Agrupar por dia
            const salesByDay: Record<string, { orders: number; revenue: number }> = {};

            orders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('pt-BR');
                if (!salesByDay[date]) {
                    salesByDay[date] = { orders: 0, revenue: 0 };
                }
                salesByDay[date].orders++;
                salesByDay[date].revenue += order.total;
            });

            const chartData = Object.entries(salesByDay).map(([date, stats]) => ({
                date,
                orders: stats.orders,
                revenue: stats.revenue,
            }));

            setData(chartData);
            setLoading(false);
        }

        fetchWeeklySales();
    }, []);

    return { data, loading };
}

/**
 * Hook: Top 5 produtos mais vendidos
 */
export function useTopProducts() {
    const [data, setData] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTopProducts() {
            const supabase = createClient();

            const { data: products, error } = await supabase
                .from('delivery_products')
                .select('id, name, order_count')
                .order('order_count', { ascending: false })
                .limit(5);

            if (error || !products) {
                setLoading(false);
                return;
            }

            // Calcular receita aproximada (order_count * price médio)
            const topProducts = products.map(p => ({
                id: p.id,
                name: p.name,
                sales: p.order_count || 0,
                revenue: 0, // TODO: calcular receita real do histórico
            }));

            setData(topProducts);
            setLoading(false);
        }

        fetchTopProducts();
    }, []);

    return { data, loading };
}

/**
 * Hook: Estatísticas de hoje
 */
export function useTodayStats() {
    const [data, setData] = useState<TodayStats>({
        orders: 0,
        revenue: 0,
        avgTicket: 0,
        couponsUsed: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodayStats() {
            const supabase = createClient();

            // Calcular Range do Dia (Local Time -> UTC)
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            // Pedidos de hoje (considerando timezone local)
            const { data: orders, error } = await supabase
                .from('delivery_orders')
                .select('total, coupon_code, created_at')
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error || !orders) {
                setLoading(false);
                return;
            }

            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
            const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const couponsUsed = orders.filter(o => o.coupon_code).length;

            setData({
                orders: totalOrders,
                revenue: totalRevenue,
                avgTicket,
                couponsUsed,
            });
            setLoading(false);
        }

        fetchTodayStats();
    }, []);

    return { data, loading };
}

/**
 * Hook: Status de saúde do sistema
 */
export function useHealthStatus() {
    const [data, setData] = useState<HealthStatus>({
        status: 'healthy',
        database: true,
        pendingOrders: 0,
        issues: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkHealth() {
            const supabase = createClient();
            const issues: string[] = [];

            // Check database connection
            const { error: dbError } = await supabase
                .from('delivery_products')
                .select('id')
                .limit(1);

            const databaseOk = !dbError;
            if (dbError) issues.push('Database connection failed');

            // Check pending orders
            const { data: pendingOrders } = await supabase
                .from('delivery_orders')
                .select('id')
                .eq('status', 'pending');

            const pendingCount = pendingOrders?.length || 0;
            if (pendingCount > 5) issues.push(`${pendingCount} pedidos pendentes`);

            // Determine overall status
            let status: 'healthy' | 'warning' | 'error' = 'healthy';
            if (!databaseOk) status = 'error';
            else if (issues.length > 0) status = 'warning';

            setData({
                status,
                database: databaseOk,
                pendingOrders: pendingCount,
                issues,
            });
            setLoading(false);
        }

        checkHealth();

        // Re-check every 5 minutes
        const interval = setInterval(checkHealth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading };
}
