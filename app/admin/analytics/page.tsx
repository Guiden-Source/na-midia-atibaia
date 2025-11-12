'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Ticket, BarChart3, Calendar, Target, RefreshCw } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'react-hot-toast';
import {
  MetricsGrid,
  MetricCard,
  ChartContainer,
  GrowthLineChart,
  EventsBarChart,
  ChartSkeleton,
} from '@/components/analytics/Charts';
import {
  getAnalyticsOverview,
  getEventsPopularity,
  getGrowthData,
  type AnalyticsOverview,
  type EventPopularity,
  type GrowthData,
} from '@/app/actions';

type Period = 'today' | 'week' | 'month' | 'all';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [popularity, setPopularity] = useState<EventPopularity[]>([]);
  const [growth, setGrowth] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Carregar overview
      const overviewResult = await getAnalyticsOverview(period);
      if (overviewResult.success) {
        setOverview(overviewResult.data);
      }

      // Carregar popularidade
      const popularityResult = await getEventsPopularity(10);
      if (popularityResult.success) {
        setPopularity(popularityResult.data);
      }

      // Carregar crescimento (últimos 7, 30 ou 90 dias)
      const days = period === 'today' ? 7 : period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const growthResult = await getGrowthData(days);
      if (growthResult.success) {
        setGrowth(growthResult.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const formatGrowthData = (data: GrowthData[]) => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }));
  };

  return (
    <>
      <AdminHeader 
        title="Analytics & Métricas"
        description="Acompanhe o desempenho da plataforma em tempo real"
      />
      
      <div className="p-6">
        {/* Filtros de Período e Botão Atualizar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'today' as Period, label: 'Hoje' },
              { value: 'week' as Period, label: 'Última Semana' },
              { value: 'month' as Period, label: 'Último Mês' },
              { value: 'all' as Period, label: 'Tudo' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  period === p.value
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* Métricas Principais */}
        {loading && !overview ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : overview ? (
          <MetricsGrid>
            <MetricCard
              title="Total de Eventos"
              value={overview.totalEvents}
              subtitle="Eventos criados"
              icon={<Calendar className="w-6 h-6" />}
              color="orange"
            />
            <MetricCard
              title="Confirmações"
              value={overview.totalConfirmations}
              subtitle={`${overview.avgConfirmationsPerEvent} por evento`}
              icon={<Users className="w-6 h-6" />}
              color="pink"
            />
            <MetricCard
              title="Cupons Gerados"
              value={overview.totalCoupons}
              subtitle={`${overview.couponsUsed} usados`}
              icon={<Ticket className="w-6 h-6" />}
              color="green"
            />
            <MetricCard
              title="Taxa de Uso"
              value={`${overview.couponUsageRate}%`}
              subtitle="Cupons utilizados"
              icon={<Target className="w-6 h-6" />}
              color="blue"
            />
          </MetricsGrid>
        ) : null}

        {/* Gráfico de Crescimento */}
        <div className="mt-8">
          <ChartContainer title="Crescimento ao Longo do Tempo">
            {loading ? (
              <ChartSkeleton height={350} />
            ) : (
              <GrowthLineChart data={formatGrowthData(growth)} height={350} />
            )}
          </ChartContainer>
        </div>

        {/* Eventos Mais Populares */}
        <div className="mt-8">
          <ChartContainer title="Top 10 Eventos Mais Populares">
            {loading ? (
              <ChartSkeleton height={400} />
            ) : (
              <EventsBarChart data={popularity.slice(0, 10)} height={400} />
            )}
          </ChartContainer>
        </div>

        {/* Tabela Detalhada */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Detalhes por Evento
          </h3>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Evento
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Confirmações
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Cupons Gerados
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Cupons Usados
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Taxa de Conversão
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {popularity.map((event, index) => (
                    <tr 
                      key={event.event_id}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            #{index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.event_name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-medium">
                          <Users className="w-4 h-4" />
                          {event.confirmations}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {event.coupons_generated}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                          <Ticket className="w-4 h-4" />
                          {event.coupons_used}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          event.conversion_rate >= 50
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : event.conversion_rate >= 25
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {event.conversion_rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {popularity.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Nenhum evento encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insights e Recomendações */}
        {overview && !loading && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Pontos Positivos
              </h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200 text-sm">
                {overview.avgConfirmationsPerEvent >= 10 && (
                  <li>✓ Ótima média de confirmações por evento!</li>
                )}
                {overview.couponUsageRate >= 40 && (
                  <li>✓ Alta taxa de utilização de cupons!</li>
                )}
                {overview.totalEvents >= 5 && (
                  <li>✓ Boa quantidade de eventos ativos!</li>
                )}
                {!overview.avgConfirmationsPerEvent && !overview.couponUsageRate && !overview.totalEvents && (
                  <li>Continue criando eventos para gerar insights!</li>
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recomendações
              </h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                {overview.couponUsageRate < 30 && (
                  <li>• Divulgue mais os cupons de desconto</li>
                )}
                {overview.avgConfirmationsPerEvent < 5 && (
                  <li>• Promova mais os eventos nas redes sociais</li>
                )}
                {overview.totalEvents < 3 && (
                  <li>• Crie mais eventos para aumentar engajamento</li>
                )}
                {overview.couponUsageRate >= 30 && overview.avgConfirmationsPerEvent >= 5 && (
                  <li>• Continue com o ótimo trabalho! 🎉</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
