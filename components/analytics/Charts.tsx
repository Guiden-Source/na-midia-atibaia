'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Cores do tema
const COLORS = {
  primary: '#f97316', // orange-500
  secondary: '#ec4899', // pink-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // amber-500
  info: '#3b82f6', // blue-500
  purple: '#a855f7', // purple-500
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.info,
  COLORS.purple,
  COLORS.warning,
];

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-700 dark:text-gray-300" style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Gráfico de Linha (Crescimento ao longo do tempo)
export function GrowthLineChart({ data, height = 300 }: { data: any[], height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
        />
        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="events"
          name="Eventos"
          stroke={COLORS.primary}
          strokeWidth={2}
          dot={{ fill: COLORS.primary }}
        />
        <Line
          type="monotone"
          dataKey="confirmations"
          name="Confirmações"
          stroke={COLORS.secondary}
          strokeWidth={2}
          dot={{ fill: COLORS.secondary }}
        />
        <Line
          type="monotone"
          dataKey="coupons"
          name="Cupons"
          stroke={COLORS.success}
          strokeWidth={2}
          dot={{ fill: COLORS.success }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Gráfico de Barras (Popularidade de eventos)
export function EventsBarChart({ data, height = 300 }: { data: any[], height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="event_name"
          stroke="#6b7280"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="confirmations"
          name="Confirmações"
          fill={COLORS.primary}
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="coupons_used"
          name="Cupons Usados"
          fill={COLORS.success}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Gráfico de Pizza (Distribuição)
export function DistributionPieChart({ data, height = 300 }: { data: any[], height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}



// Container de Gráfico
export function ChartContainer({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// Loading Skeleton para gráficos
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}
