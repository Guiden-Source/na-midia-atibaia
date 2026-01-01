import { createClient } from '@/lib/supabase/client';

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
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('delivery_products')
            .select('id')
            .limit(1);

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Database Connection',
                status: 'fail',
                message: `Failed to connect: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        if (duration > 1000) {
            return {
                name: 'Database Connection',
                status: 'warn',
                message: `Slow response: ${duration}ms`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Database Connection',
            status: 'pass',
            message: `Connected successfully (${duration}ms)`,
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Database Connection',
            status: 'fail',
            message: error.message || 'Unknown error',
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check products table
 */
async function checkProducts(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_products')
            .select('id, is_active')
            .limit(1);

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Products Table',
                status: 'fail',
                message: `Query failed: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Products Table',
            status: 'pass',
            message: 'Table accessible',
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Products Table',
            status: 'fail',
            message: error.message,
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check orders table
 */
async function checkOrders(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_orders')
            .select('id, status')
            .limit(1);

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Orders Table',
                status: 'fail',
                message: `Query failed: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Orders Table',
            status: 'pass',
            message: 'Table accessible',
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Orders Table',
            status: 'fail',
            message: error.message,
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check coupons table
 */
async function checkCoupons(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_coupons_progressive')
            .select('id, is_active')
            .limit(1);

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Coupons Table',
                status: 'fail',
                message: `Query failed: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Coupons Table',
            status: 'pass',
            message: 'Table accessible',
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Coupons Table',
            status: 'fail',
            message: error.message,
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check for pending orders (warning if >5)
 */
async function checkPendingOrders(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_orders')
            .select('id')
            .eq('status', 'pending');

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Pending Orders',
                status: 'fail',
                message: `Query failed: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        const count = data?.length || 0;

        if (count > 10) {
            return {
                name: 'Pending Orders',
                status: 'warn',
                message: `High number of pending orders: ${count}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Pending Orders',
            status: 'pass',
            message: `${count} pending orders`,
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Pending Orders',
            status: 'fail',
            message: error.message,
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Check authentication
 */
async function checkAuth(): Promise<HealthCheck> {
    const start = Date.now();
    try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        const duration = Date.now() - start;

        if (error) {
            return {
                name: 'Authentication',
                status: 'fail',
                message: `Auth check failed: ${error.message}`,
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        if (!user) {
            return {
                name: 'Authentication',
                status: 'warn',
                message: 'No user logged in',
                duration,
                timestamp: new Date().toISOString(),
            };
        }

        return {
            name: 'Authentication',
            status: 'pass',
            message: `User: ${user.email}`,
            duration,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            name: 'Authentication',
            status: 'fail',
            message: error.message,
            duration: Date.now() - start,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Main health check function
 */
export async function runHealthCheck(): Promise<HealthReport> {
    const checks = await Promise.all([
        checkDatabase(),
        checkProducts(),
        checkOrders(),
        checkCoupons(),
        checkPendingOrders(),
        checkAuth(),
    ]);

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
