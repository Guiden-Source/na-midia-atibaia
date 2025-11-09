"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WeeklyData {
  week: string;
  couponsGenerated: number;
  couponsUsed: number;
  usersCreated: number;
}

interface StatsChartsProps {
  weeklyData: WeeklyData[];
}

export function StatsCharts({ weeklyData }: StatsChartsProps) {
  if (weeklyData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum dado disponível para exibir gráficos
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gráfico de Cupons */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-6">
          📊 Cupons por Semana
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="week" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
              }}
            />
            <Legend />
            <Bar 
              dataKey="couponsGenerated" 
              fill="#f97316" 
              name="Cupons Gerados"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="couponsUsed" 
              fill="#10b981" 
              name="Cupons Usados"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Usuários */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-6">
          👥 Novos Usuários por Semana
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="week" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="usersCreated" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Novos Usuários"
              dot={{ fill: '#3b82f6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo Numérico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total Cupons Gerados</p>
          <p className="text-4xl font-bold">
            {weeklyData.reduce((sum, week) => sum + week.couponsGenerated, 0)}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total Cupons Usados</p>
          <p className="text-4xl font-bold">
            {weeklyData.reduce((sum, week) => sum + week.couponsUsed, 0)}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total Novos Usuários</p>
          <p className="text-4xl font-bold">
            {weeklyData.reduce((sum, week) => sum + week.usersCreated, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
