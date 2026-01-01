"use client";

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { runHealthCheck, type HealthReport, type HealthCheck } from '@/lib/health-check';

export default function HealthPage() {
    const [report, setReport] = useState<HealthReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastCheck, setLastCheck] = useState<Date | null>(null);

    const runCheck = async () => {
        setLoading(true);
        try {
            const data = await runHealthCheck();
            setReport(data);
            setLastCheck(new Date());
        } catch (error) {
            console.error('Health check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runCheck();
        // Auto refresh every 30 seconds
        const interval = setInterval(runCheck, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status: HealthCheck['status']) => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'warn':
                return <AlertCircle className="text-yellow-500" size={20} />;
            case 'fail':
                return <XCircle className="text-red-500" size={20} />;
        }
    };

    const getStatusBadge = (status: HealthCheck['status']) => {
        switch (status) {
            case 'pass':
                return <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">PASS</span>;
            case 'warn':
                return <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">WARN</span>;
            case 'fail':
                return <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">FAIL</span>;
        }
    };

    const getOverallStatus = () => {
        if (!report) return { label: 'Unknown', color: 'gray', bg: 'bg-gray-100' };

        switch (report.overall) {
            case 'healthy':
                return {
                    label: '🟢 HEALTHY',
                    color: 'text-green-600',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800'
                };
            case 'degraded':
                return {
                    label: '🟡 DEGRADED',
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-200 dark:border-yellow-800'
                };
            case 'unhealthy':
                return {
                    label: '🔴 UNHEALTHY',
                    color: 'text-red-600',
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800'
                };
        }
    };

    const status = getOverallStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AdminHeader
                title="System Health"
                description="Monitoramento completo do sistema"
            />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Overall Status Card */}
                <LiquidGlass className={`p-6 border-2 ${status.bg} ${status.border}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-3xl font-bold ${status.color}`}>
                                {status.label}
                            </h2>
                            {report && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {report.summary.passed}/{report.summary.total} checks passed
                                    {report.summary.warned > 0 && ` • ${report.summary.warned} warnings`}
                                    {report.summary.failed > 0 && ` • ${report.summary.failed} failures`}
                                </p>
                            )}
                            {lastCheck && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <Clock size={12} />
                                    Last check: {lastCheck.toLocaleTimeString('pt-BR')}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={runCheck}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Checking...' : 'Run Check'}
                        </button>
                    </div>
                </LiquidGlass>

                {/* Checks Grid */}
                {report && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.checks.map((check, i) => (
                            <LiquidGlass key={i} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(check.status)}
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {check.name}
                                        </h3>
                                    </div>
                                    {getStatusBadge(check.status)}
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {check.message}
                                </p>

                                {check.duration !== undefined && (
                                    <p className="text-xs text-gray-400">
                                        Response time: {check.duration}ms
                                    </p>
                                )}
                            </LiquidGlass>
                        ))}
                    </div>
                )}

                {/* Auto-refresh notice */}
                <div className="text-center text-sm text-gray-500">
                    🔄 Auto-refresh every 30 seconds
                </div>
            </div>
        </div>
    );
}
