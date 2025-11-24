import { createClient } from '@supabase/supabase-js';
import { DeliveryOrder } from '../lib/delivery/types';

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const TOTAL_ORDERS = 50;
const CONCURRENCY = 5;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createMockOrder(i: number) {
    const order: Partial<DeliveryOrder> = {
        user_name: `Stress Test User ${i}`,
        user_phone: '11999999999',
        address_street: 'Rua Teste',
        address_number: `${i}`,
        address_condominium: 'Jeronimo de Camargo 1',
        payment_method: 'pix',
        payment_status: 'pending',
        subtotal: 100,
        delivery_fee: 0,
        total: 100,
        status: 'pending',
        created_at: new Date().toISOString(),
        order_number: `#STRESS-${i}`,
        whatsapp_sent: false
    };

    const { error } = await supabase.from('delivery_orders').insert(order);
    if (error) {
        console.error(`❌ Order ${i} failed:`, error.message);
        return false;
    }
    console.log(`✅ Order ${i} created`);
    return true;
}

async function runStressTest() {
    console.log(`🚀 Starting Stress Test: ${TOTAL_ORDERS} orders, concurrency ${CONCURRENCY}`);

    let completed = 0;
    let success = 0;

    // Batch processing
    for (let i = 0; i < TOTAL_ORDERS; i += CONCURRENCY) {
        const batch = [];
        for (let j = 0; j < CONCURRENCY && (i + j) < TOTAL_ORDERS; j++) {
            batch.push(createMockOrder(i + j));
        }

        const results = await Promise.all(batch);
        success += results.filter(r => r).length;
        completed += results.length;
        console.log(`📊 Progress: ${completed}/${TOTAL_ORDERS}`);
    }

    console.log(`\n🏁 Test Finished! Success: ${success}/${TOTAL_ORDERS}`);
}

runStressTest();
