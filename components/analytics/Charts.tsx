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

// Card de Métrica
export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  color = 'orange'
}: { 
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'orange' | 'pink' | 'green' | 'blue' | 'purple';
}) {
  const colorClasses = {
    orange: 'from-orange-500 to-pink-500',
    pink: 'from-pink-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
      
      {trend && (
        <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${
          trend.value >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-gray-500 dark:text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}

// Grid de Métricas
export function MetricsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
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
