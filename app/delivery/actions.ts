'use server';

import { createClient } from '@supabase/supabase-js';
import { OrderStatus } from '@/lib/delivery/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getOrderStatus(orderId: string): Promise<OrderStatus | null> {
    try {
        const { data, error } = await supabase
            .from('delivery_orders')
            .select('status')
            .eq('id', orderId)
            .single();

        if (error) {
            console.error('Error fetching order status:', error);
            return null;
        }

        return data?.status as OrderStatus;
    } catch (error) {
        console.error('Error in getOrderStatus:', error);
        return null;
    }
}
