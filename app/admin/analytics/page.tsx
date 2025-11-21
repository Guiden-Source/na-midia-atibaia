'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Ticket, BarChart3, Calendar, Target, RefreshCw, Download } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
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

  const exportToCSV = () => {
    if (!popularity.length) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const headers = ['Posição', 'Evento', 'Confirmações', 'Cupons Gerados', 'Cupons Usados', 'Taxa de Conversão'];
    const rows = popularity.map((event, index) => [
      index + 1,
      event.event_name,
      event.confirmations,
      event.coupons_generated,
      event.coupons_used,
      `${event.conversion_rate.toFixed(1)}%`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Dados exportados com sucesso!');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Analytics & Métricas"
        description="Acompanhe o desempenho da plataforma em tempo real"
      />

      {/* Filtros e Ações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LiquidGlass className="p-4" intensity={0.2}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'today' as Period, label: 'Hoje', emoji: '📅' },
                { value: 'week' as Period, label: 'Semana', emoji: '📊' },
                { value: 'month' as Period, label: 'Mês', emoji: '📈' },
                { value: 'all' as Period, label: 'Tudo', emoji: '🌐' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-2 rounded-xl font-baloo2 font-bold transition-all ${period === p.value
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                disabled={loading || !popularity.length}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-baloo2 font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-baloo2 font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
            </div>
          </div>
        </LiquidGlass>
      </motion.div>

      {/* Métricas Principais */}
      {loading && !overview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LiquidGlass key={i} className="h-32 animate-pulse" />
          ))}
        </div>
      ) : overview ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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
        </motion.div>
      ) : null}

      {/* Gráfico de Crescimento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChartContainer title="📈 Crescimento ao Longo do Tempo">
          {loading ? (
            <ChartSkeleton height={350} />
          ) : (
            <GrowthLineChart data={formatGrowthData(growth)} height={350} />
          )}
        </ChartContainer>
      </motion.div>

      {/* Eventos Mais Populares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartContainer title="🏆 Top 10 Eventos Mais Populares">
          {loading ? (
            <ChartSkeleton height={400} />
          ) : (
            <EventsBarChart data={popularity.slice(0, 10)} height={400} />
          )}
        </ChartContainer>
      </motion.div>

      {/* Tabela Detalhada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LiquidGlass className="p-6" intensity={0.3}>
          <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📋 Detalhes por Evento
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
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Evento
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Confirmações
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Cupons Gerados
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Cupons Usados
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Conversão
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {popularity.map((event, index) => (
                    <tr
                      key={event.event_id}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.event_name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-bold">
                          <Users className="w-4 h-4" />
                          {event.confirmations}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {event.coupons_generated}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold">
                          <Ticket className="w-4 h-4" />
                          {event.coupons_used}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${event.conversion_rate >= 50
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
                      <td colSpan={5} className="text-center py-12">
                        <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          Nenhum evento encontrado
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </LiquidGlass>
      </motion.div>

      {/* Insights e Recomendações */}
      {overview && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <LiquidGlass className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" intensity={0.4}>
            <h3 className="font-baloo2 text-xl font-bold text-green-900 dark:text-green-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Pontos Positivos
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              {overview.avgConfirmationsPerEvent >= 10 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Ótima média de confirmações por evento!</span>
                </li>
              )}
              {overview.couponUsageRate >= 40 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Alta taxa de utilização de cupons!</span>
                </li>
              )}
              {overview.totalEvents >= 5 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Boa quantidade de eventos ativos!</span>
                </li>
              )}
              {!overview.avgConfirmationsPerEvent && !overview.couponUsageRate && !overview.totalEvents && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span>Continue criando eventos para gerar insights!</span>
                </li>
              )}
            </ul>
          </LiquidGlass>

          <LiquidGlass className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" intensity={0.4}>
            <h3 className="font-baloo2 text-xl font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Recomendações
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              {overview.couponUsageRate < 30 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">•</span>
                  <span>Divulgue mais os cupons de desconto</span>
                </li>
              )}
              {overview.avgConfirmationsPerEvent < 5 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">•</span>
                  <span>Promova mais os eventos nas redes sociais</span>
                </li>
              )}
              {overview.totalEvents < 3 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">•</span>
                  <span>Crie mais eventos para aumentar engajamento</span>
                </li>
              )}
              {overview.couponUsageRate >= 30 && overview.avgConfirmationsPerEvent >= 5 && (
                <li className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <span>Continue com o ótimo trabalho!</span>
                </li>
              )}
            </ul>
          </LiquidGlass>
        </motion.div>
      )}
    </div>
  );
}
