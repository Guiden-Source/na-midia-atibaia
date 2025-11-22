import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Filter, Calendar, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import { ORDER_STATUS_MAP, OrderStatus } from '@/lib/delivery/types';
import { LiquidGlass } from '@/components/ui/liquid-glass';
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

  if (statusFilter) {
    query = query.eq('status', statusFilter);
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
        <LiquidGlass className="p-2 mb-8 flex flex-wrap gap-2" intensity={0.2}>
          <Link
            href="/perfil/pedidos"
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${!statusFilter
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
              }`}
          >
            Todos ({allCount || 0})
          </Link>
          <Link
            href="/perfil/pedidos?status=pending,confirmed,preparing,delivering"
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter && ['pending', 'confirmed', 'preparing', 'delivering'].includes(statusFilter)
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
              }`}
          >
            Ativos ({activeCount || 0})
          </Link>
          <Link
            href="/perfil/pedidos?status=completed"
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'completed'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
              }`}
          >
            Entregues ({completedCount || 0})
          </Link>
          <Link
            href="/perfil/pedidos?status=cancelled"
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-baloo2 font-bold text-center transition-all ${statusFilter === 'cancelled'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.02]'
              : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'
              }`}
          >
            Cancelados ({cancelledCount || 0})
          </Link>
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
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusInfo = ORDER_STATUS_MAP[order.status as OrderStatus];
              const itemCount = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/delivery/pedidos/${order.id}`}>
                    <LiquidGlass
                      className="p-6 group hover:border-blue-500/30 transition-colors"
                      intensity={0.4}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Status Icon */}
                        <div className={`h-16 w-16 rounded-2xl ${statusInfo.bgColor} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                          {statusInfo.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white">
                              Pedido #{order.order_number}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.bgColor} ${statusInfo.color} bg-opacity-20`}>
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package size={14} />
                              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <MapPin size={14} />
                              <span className="truncate">{order.address_street}, {order.address_number}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} />
                              <span className="capitalize">{order.payment_method}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pl-0 md:pl-6 md:border-l border-gray-200 dark:border-gray-700/50">
                          <div className="text-left md:text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total</p>
                            <p className="font-baloo2 text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Ver detalhes
                          </div>
                        </div>
                      </div>
                    </LiquidGlass>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
