import { LucideIcon } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'pink';
    trend?: string;
    trendUp?: boolean;
    description?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'blue',
    trend,
    trendUp,
    description,
    className = '',
}: StatsCardProps) {
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
        red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
        yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
    };

    const colors = colorMap[color];

    return (
        <LiquidGlass className={`p-4 md:p-5 group hover:scale-[1.02] transition-transform ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={colors.text} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="font-baloo2 text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
            </p>
            {description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {description}
                </p>
            )}
        </LiquidGlass>
    );
}
