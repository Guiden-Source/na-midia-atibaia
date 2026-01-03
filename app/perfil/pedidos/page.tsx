import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Filter, Calendar, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import { ORDER_STATUS_MAP, OrderStatus } from '@/lib/delivery/types';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { OrderCard } from '@/components/delivery/OrderCard';
import { OrdersRealtimeProvider } from '@/components/delivery/OrdersRealtimeProvider';
import * as motion from 'framer-motion/client';

export const metadata = {
  title: 'Meus Pedidos - Na Mídia',
  description: 'Histórico completo de pedidos',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: { status?: string };
}

export default async function PedidosPage({ searchParams }: PageProps) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login?redirect=/perfil/pedidos');
  }

  const user = session.user;
  const statusFilter = searchParams.status as OrderStatus | undefined;

  // Buscar pedidos do usuário
  let query = supabase
    .from('delivery_orders')
    .select(`
      *,
      items:delivery_order_items(*)
    `)
    .or(`user_id.eq.${user.id},user_phone.eq.${user.user_metadata.phone || user.email}`)
    .order('created_at', { ascending: false });

  // Filtrar por status
  if (statusFilter) {
    if (statusFilter === 'active') {
      // "Ativos" = pending, confirmed, preparing, delivering
      query = query.in('status', ['pending', 'confirmed', 'preparing', 'delivering']);
    } else {
      query = query.eq('status', statusFilter);
    }
  }

  const { data: orders } = await query;

  // Contar por status
  const { count: allCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${user.id},user_phone.eq.${user.user_metadata.phone || user.email}`);

  const { count: activeCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${user.id},user_phone.eq.${user.user_metadata.phone || user.email}`)
    .in('status', ['pending', 'confirmed', 'preparing', 'delivering']);

  const { count: completedCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${user.id},user_phone.eq.${user.user_metadata.phone || user.email}`)
    .eq('status', 'completed');

  const { count: cancelledCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${user.id},user_phone.eq.${user.user_metadata.phone || user.email}`)
    .eq('status', 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary font-medium transition-colors mb-6 group"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="font-baloo2">Voltar ao perfil</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Package size={32} />
            </div>
            <div>
              <h1 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Meus Pedidos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Histórico completo de suas compras
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <LiquidGlass className="p-4 mb-8" intensity={0.2}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/perfil/pedidos"
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-baloo2 font-bold text-center whitespace-nowrap transition-all ${!statusFilter
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
            >
              Todos ({allCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=active"
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-baloo2 font-bold text-center whitespace-nowrap transition-all ${statusFilter === 'active'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-[1.02]'
                : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
            >
              Ativos ({activeCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=completed"
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-baloo2 font-bold text-center whitespace-nowrap transition-all ${statusFilter === 'completed'
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]'
                : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
            >
              Entregues ({completedCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=cancelled"
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-baloo2 font-bold text-center whitespace-nowrap transition-all ${statusFilter === 'cancelled'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.02]'
                : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
            >
              Cancelados ({cancelledCount || 0})
            </Link>
          </div>
        </LiquidGlass>

        {/* Lista de Pedidos */}
        {!orders || orders.length === 0 ? (
          <LiquidGlass className="p-12 text-center flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Package size={48} className="text-gray-400" />
            </div>
            <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              Você ainda não fez nenhum pedido com este status. Que tal explorar nosso cardápio?
            </p>
            <Link
              href="/delivery"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-baloo2 font-bold text-lg shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
            >
              Fazer Primeiro Pedido
            </Link>
          </LiquidGlass>
        ) : (
          <OrdersRealtimeProvider
            initialOrders={orders}
            userId={user.id}
            userPhone={user.user_metadata?.phone}
          />
        )}
      </div>
    </div>
  );
}
