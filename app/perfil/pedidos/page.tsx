import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import { ORDER_STATUS_MAP, OrderStatus } from '@/lib/delivery/types';

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
    .eq('user_phone', user.user_metadata.phone || user.email)
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: orders } = await query;

  // Contar por status
  const { count: allCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_phone', user.user_metadata.phone || user.email);

  const { count: activeCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_phone', user.user_metadata.phone || user.email)
    .in('status', ['pending', 'confirmed', 'preparing', 'delivering']);

  const { count: completedCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_phone', user.user_metadata.phone || user.email)
    .eq('status', 'completed');

  const { count: cancelledCount } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_phone', user.user_metadata.phone || user.email)
    .eq('status', 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar ao perfil</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe o histórico completo de seus pedidos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtrar por Status
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/perfil/pedidos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !statusFilter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos ({allCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=pending,confirmed,preparing,delivering"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter && ['pending', 'confirmed', 'preparing', 'delivering'].includes(statusFilter)
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ativos ({activeCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=completed"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Entregues ({completedCount || 0})
            </Link>
            <Link
              href="/perfil/pedidos?status=cancelled"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cancelados ({cancelledCount || 0})
            </Link>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {!orders || orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-md">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não fez nenhum pedido.
            </p>
            <Link
              href="/delivery"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Fazer Primeiro Pedido
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = ORDER_STATUS_MAP[order.status as OrderStatus];
              const itemCount = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

              return (
                <Link
                  key={order.id}
                  href={`/delivery/pedidos/${order.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Pedido {order.order_number}
                        </h3>
                        <div className={`${statusInfo.bgColor} px-3 py-1 rounded-full flex items-center gap-1`}>
                          <span>{statusInfo.icon}</span>
                          <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          📅 {new Date(order.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p>📦 {itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
                        <p>📍 {order.address_condominium}</p>
                        {order.payment_method === 'pix' && <p>💳 PIX</p>}
                        {order.payment_method === 'dinheiro' && <p>💵 Dinheiro</p>}
                        {order.payment_method === 'cartao' && <p>💳 Cartão</p>}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {formatPrice(order.total)}
                      </p>
                      <span className="inline-block text-blue-600 dark:text-blue-400 font-medium">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
