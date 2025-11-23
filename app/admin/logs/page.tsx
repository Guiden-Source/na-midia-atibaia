import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Activity, Search } from 'lucide-react';

export const metadata = {
    title: 'Logs de Atividade - Admin',
};

// Mock logs for now
const logs = [
    { id: 1, user: 'Admin', action: 'Atualizou produto', target: 'X-Bacon', timestamp: 'Agora' },
    { id: 2, user: 'Sistema', action: 'Novo pedido recebido', target: '#1234', timestamp: '5 min atrás' },
    { id: 3, user: 'Admin', action: 'Alterou status', target: 'Pedido #1230 -> Entregue', timestamp: '1 hora atrás' },
    { id: 4, user: 'Admin', action: 'Login', target: 'Painel Admin', timestamp: '2 horas atrás' },
];

export default function LogsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
                    Logs de Atividade
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar logs..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <LiquidGlass className="overflow-hidden" intensity={0.2}>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                        <tr>
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Ação</th>
                            <th className="px-6 py-4">Alvo</th>
                            <th className="px-6 py-4">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                                        {log.user[0]}
                                    </div>
                                    {log.user}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                        <Activity size={12} />
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                    {log.target}
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    {log.timestamp}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </LiquidGlass>
        </div>
    );
}
