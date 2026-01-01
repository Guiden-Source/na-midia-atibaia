import { createClient as createBrowserClient } from '@/lib/supabase/client';

// Types
export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    duration?: number;
    timestamp: string;
}

export interface HealthReport {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    checks: HealthCheck[];
    summary: {
        total: number;
        passed: number;
        warned: number;
        failed: number;
    };
    timestamp: string;
}

/**
 * Client-side health check (runs in browser only)
 */
export async function runHealthCheck(): Promise<HealthReport> {
    const start = Date.now();
    const checks: HealthCheck[] = [];

    try {
        const supabase = createBrowserClient();

        // Check 1: Database Connection
        try {
            const dbStart = Date.now();
            const { error: dbError } = await supabase
                .from('delivery_products')
                .select('id')
                .limit(1);

            const dbDuration = Date.now() - dbStart;

            if (dbError) {
                checks.push({
                    name: 'Database Connection',
                    status: 'fail',
                    message: `Failed: ${dbError.message}`,
                    duration: dbDuration,
                    timestamp: new Date().toISOString(),
                });
            } else if (dbDuration > 1000) {
                checks.push({
                    name: 'Database Connection',
                    status: 'warn',
                    message: `Slow response: ${dbDuration}ms`,
                    duration: dbDuration,
                    timestamp: new Date().toISOString(),
                });
            } else {
                checks.push({
                    name: 'Database Connection',
                    status: 'pass',
                    message: `Connected (${dbDuration}ms)`,
                    duration: dbDuration,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            checks.push({
                name: 'Database Connection',
                status: 'fail',
                message: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
            });
        }

        // Check 2: Products Table
        try {
            const prodStart = Date.now();
            const { error: prodError } = await supabase
                .from('delivery_products')
                .select('id')
                .limit(1);

            const prodDuration = Date.now() - prodStart;

            checks.push({
                name: 'Products Table',
                status: prodError ? 'fail' : 'pass',
                message: prodError ? `Query failed: ${prodError.message}` : 'Table accessible',
                duration: prodDuration,
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            checks.push({
                name: 'Products Table',
                status: 'fail',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }

        // Check 3: Orders Table
        try {
            const ordStart = Date.now();
            const { error: ordError } = await supabase
                .from('delivery_orders')
                .select('id')
                .limit(1);

            const ordDuration = Date.now() - ordStart;

            checks.push({
                name: 'Orders Table',
                status: ordError ? 'fail' : 'pass',
                message: ordError ? `Query failed: ${ordError.message}` : 'Table accessible',
                duration: ordDuration,
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            checks.push({
                name: 'Orders Table',
                status: 'fail',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }

        // Check 4: Coupons Table
        try {
            const cupStart = Date.now();
            const { error: cupError } = await supabase
                .from('delivery_coupons_progressive')
                .select('id')
                .limit(1);

            const cupDuration = Date.now() - cupStart;

            checks.push({
                name: 'Coupons Table',
                status: cupError ? 'fail' : 'pass',
                message: cupError ? `Query failed: ${cupError.message}` : 'Table accessible',
                duration: cupDuration,
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            checks.push({
                name: 'Coupons Table',
                status: 'fail',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }

        // Check 5: Pending Orders
        try {
            const pendStart = Date.now();
            const { data: pendingOrders, error: pendError } = await supabase
                .from('delivery_orders')
                .select('id')
                .eq('status', 'pending');

            const pendDuration = Date.now() - pendStart;
            const count = pendingOrders?.length || 0;

            if (pendError) {
                checks.push({
                    name: 'Pending Orders',
                    status: 'fail',
                    message: `Query failed: ${pendError.message}`,
                    duration: pendDuration,
                    timestamp: new Date().toISOString(),
                });
            } else if (count > 10) {
                checks.push({
                    name: 'Pending Orders',
                    status: 'warn',
                    message: `High number: ${count}`,
                    duration: pendDuration,
                    timestamp: new Date().toISOString(),
                });
            } else {
                checks.push({
                    name: 'Pending Orders',
                    status: 'pass',
                    message: `${count} pending`,
                    duration: pendDuration,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            checks.push({
                name: 'Pending Orders',
                status: 'fail',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }

        // Check 6: Authentication
        try {
            const authStart = Date.now();
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            const authDuration = Date.now() - authStart;

            if (authError) {
                checks.push({
                    name: 'Authentication',
                    status: 'fail',
                    message: `Auth failed: ${authError.message}`,
                    duration: authDuration,
                    timestamp: new Date().toISOString(),
                });
            } else if (!user) {
                checks.push({
                    name: 'Authentication',
                    status: 'warn',
                    message: 'No user logged in',
                    duration: authDuration,
                    timestamp: new Date().toISOString(),
                });
            } else {
                checks.push({
                    name: 'Authentication',
                    status: 'pass',
                    message: `User: ${user.email}`,
                    duration: authDuration,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            checks.push({
                name: 'Authentication',
                status: 'fail',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }

    } catch (error: any) {
        // If supabase client fails to create
        return {
            overall: 'unhealthy',
            checks: [{
                name: 'System',
                status: 'fail',
                message: `Failed to initialize: ${error.message}`,
                timestamp: new Date().toISOString(),
            }],
            summary: { total: 1, passed: 0, warned: 0, failed: 1 },
            timestamp: new Date().toISOString(),
        };
    }

    const summary = {
        total: checks.length,
        passed: checks.filter(c => c.status === 'pass').length,
        warned: checks.filter(c => c.status === 'warn').length,
        failed: checks.filter(c => c.status === 'fail').length,
    };

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (summary.failed > 0) {
        overall = 'unhealthy';
    } else if (summary.warned > 0) {
        overall = 'degraded';
    } else {
        overall = 'healthy';
    }

    return {
        overall,
        checks,
        summary,
        timestamp: new Date().toISOString(),
    };
}
