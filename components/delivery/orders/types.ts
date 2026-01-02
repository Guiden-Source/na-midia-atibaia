import { Clock, CheckCircle, Truck, ChefHat, AlertCircle } from 'lucide-react';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export type Order = {
    id: string;
    order_number: string;
    user_name: string;
    user_phone: string;
    total: number;
    status: OrderStatus;
    payment_method: string;
    created_at: string;
    address_street: string;
    address_number: string;
    address_complement?: string;
    address_condominium: string;
    address_block?: string;
    address_apartment?: string;
    notes?: string;
    change_for?: number;
    items: any[]; // JSONB
    scheduled_at?: string; // ← NOVO
};

export const STATUS_CONFIG = {
    pending: {
        label: 'Recebido',
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    preparing: {
        label: 'Em Preparo',
        icon: ChefHat,
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        borderColor: 'border-orange-200 dark:border-orange-800',
    },
    delivering: {
        label: 'Em Entrega',
        icon: Truck,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
    },
    completed: {
        label: 'Entregue',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-800',
    },
};
