import { NextResponse } from 'next/server';
import { runHealthCheck } from '@/lib/health-check';

export async function GET() {
    try {
        const report = await runHealthCheck();

        // HTTP status based on health
        const status = report.overall === 'healthy' ? 200 :
            report.overall === 'degraded' ? 200 :
                503; // Service Unavailable if unhealthy

        return NextResponse.json(report, { status });
    } catch (error: any) {
        return NextResponse.json(
            {
                overall: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
