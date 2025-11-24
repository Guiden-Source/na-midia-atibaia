"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Ticket, Copy, Check } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import toast from "react-hot-toast";

type Coupon = {
    id: string;
    code: string;
    event_id?: string;
    user_email?: string;
    used_at?: string;
    created_at: string;
    event?: {
        name: string;
    };
};

export default function AdminCouponsPage() {
    const supabase = createClient();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "used" | "unused">("all");

    const fetchCoupons = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("coupons")
            .select(`
        *,
        event:events(name)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Erro ao carregar cupons");
        } else {
            setCoupons(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

        const { error } = await supabase.from("coupons").delete().eq("id", id);

        if (error) {
            toast.error("Erro ao excluir cupom");
            console.error(error);
        } else {
            toast.success("Cupom excluído com sucesso!");
            fetchCoupons();
        }
    };

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Código copiado!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredCoupons = coupons.filter((coupon) => {
        if (filter === "used") return coupon.used_at;
        if (filter === "unused") return !coupon.used_at;
        return true;
    });

    const stats = {
        total: coupons.length,
        used: coupons.filter((c) => c.used_at).length,
        unused: coupons.filter((c) => !c.used_at).length,
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <AdminHeader
                title="Gerenciar Cupons"
                description="Visualize e gerencie todos os cupons de desconto"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    title="Total"
                    value={stats.total}
                    icon={Ticket}
                    color="blue"
                />
                <StatsCard
                    title="Usados"
                    value={stats.used}
                    icon={Check}
                    color="green"
                />
                <StatsCard
                    title="Disponíveis"
                    value={stats.unused}
                    icon={Ticket}
                    color="orange"
                />
            </div>

            {/* Filters */}
            <LiquidGlass className="p-2 flex gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 px-4 py-2 rounded-lg font-baloo2 font-bold transition-all ${filter === "all"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300"
                        }`}
                >
                    Todos ({stats.total})
                </button>
                <button
                    onClick={() => setFilter("used")}
                    className={`flex-1 px-4 py-2 rounded-lg font-baloo2 font-bold transition-all ${filter === "used"
                        ? "bg-green-600 text-white shadow-lg"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300"
                        }`}
                >
                    Usados ({stats.used})
                </button>
                <button
                    onClick={() => setFilter("unused")}
                    className={`flex-1 px-4 py-2 rounded-lg font-baloo2 font-bold transition-all ${filter === "unused"
                        ? "bg-orange-600 text-white shadow-lg"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300"
                        }`}
                >
                    Disponíveis ({stats.unused})
                </button>
            </LiquidGlass>

            {/* Coupons List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredCoupons.length === 0 ? (
                <LiquidGlass className="p-12 text-center">
                    <Ticket className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Nenhum cupom encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filter === "all"
                            ? "Cupons são gerados automaticamente quando usuários confirmam presença em eventos"
                            : filter === "used"
                                ? "Nenhum cupom foi usado ainda"
                                : "Todos os cupons foram utilizados"}
                    </p>
                </LiquidGlass>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCoupons.map((coupon, index) => (
                        <motion.div
                            key={coupon.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <LiquidGlass className="p-5 hover:scale-[1.01] transition-transform">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="h-5 w-5 text-primary" />
                                        <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                            {coupon.code}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(coupon.code, coupon.id)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        title="Copiar código"
                                    >
                                        {copiedId === coupon.id ? (
                                            <Check size={16} className="text-green-600" />
                                        ) : (
                                            <Copy size={16} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                {coupon.event && (
                                    <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Evento:</span> {coupon.event.name}
                                    </div>
                                )}

                                {coupon.user_email && (
                                    <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Usuário:</span> {coupon.user_email}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar size={14} />
                                    Criado em {new Date(coupon.created_at).toLocaleDateString("pt-BR")}
                                </div>

                                {coupon.used_at ? (
                                    <div className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-bold text-center">
                                        ✓ Usado em {new Date(coupon.used_at).toLocaleDateString("pt-BR")}
                                    </div>
                                ) : (
                                    <div className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-sm font-bold text-center">
                                        Disponível
                                    </div>
                                )}

                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-red-700 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>
                                </div>
                            </LiquidGlass>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
