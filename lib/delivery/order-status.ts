import { Clock, CheckCircle, Package, Truck, Check, X } from 'lucide-react';

export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderStatusConfig {
    color: string;
    bgColor: string;
    textColor: string;
    label: string;
    icon: any;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
    received: {
        color: 'orange',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-700 dark:text-orange-400',
        label: 'Recebido',
        icon: Clock,
    },
    confirmed: {
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        label: 'Confirmado',
        icon: CheckCircle,
    },
    preparing: {
        color: 'purple',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        textColor: 'text-purple-700 dark:text-purple-400',
        label: 'Preparando',
        icon: Package,
    },
    delivering: {
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        label: 'Saiu p/ Entrega',
        icon: Truck,
    },
    delivered: {
        color: 'emerald',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        label: 'Entregue',
        icon: Check,
    },
    cancelled: {
        color: 'red',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-400',
        label: 'Cancelado',
        icon: X,
    },
};

export function getOrderStatusConfig(status: string): OrderStatusConfig {
    const normalizedStatus = status.toLowerCase() as OrderStatus;
    return ORDER_STATUS_CONFIG[normalizedStatus] || ORDER_STATUS_CONFIG.received;
}
