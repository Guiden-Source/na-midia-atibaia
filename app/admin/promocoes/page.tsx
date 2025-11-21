"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Tag } from "lucide-react";
import toast from "react-hot-toast";

type Promotion = {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    discount_percentage?: number;
    active: boolean;
    created_at: string;
};

export default function AdminPromotionsPage() {
    const supabase = createClient();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

    const fetchPromotions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("promotions")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching promotions:", error);
            toast.error("Erro ao carregar promoções");
        } else {
            setPromotions(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta promoção?")) return;

        const { error } = await supabase.from("promotions").delete().eq("id", id);

        if (error) {
            toast.error("Erro ao excluir promoção");
            console.error(error);
        } else {
            toast.success("Promoção excluída com sucesso!");
            fetchPromotions();
        }
    };

    const handleToggleActive = async (promotion: Promotion) => {
        const { error } = await supabase
            .from("promotions")
            .update({ active: !promotion.active })
            .eq("id", promotion.id);

        if (error) {
            toast.error("Erro ao atualizar status");
            console.error(error);
        } else {
            toast.success(`Promoção ${!promotion.active ? "ativada" : "desativada"}!`);
            fetchPromotions();
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <AdminHeader
                title="Gerenciar Promoções"
                description="Crie e gerencie promoções e ofertas especiais"
            />

            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                        Promoções Cadastradas
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {promotions.length} promoção(ões) no total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingPromotion(null);
                        setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={20} />
                    Nova Promoção
                </button>
            </div>

            {/* Promotions List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : promotions.length === 0 ? (
                <LiquidGlass className="p-12 text-center">
                    <Tag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Nenhuma promoção cadastrada
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Comece criando sua primeira promoção
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
                    >
                        <Plus size={20} />
                        Criar Primeira Promoção
                    </button>
                </LiquidGlass>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {promotions.map((promotion, index) => (
                        <motion.div
                            key={promotion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <LiquidGlass className="p-6 hover:scale-[1.01] transition-transform">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {promotion.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {promotion.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(promotion)}
                                        className={`ml-4 px-3 py-1 rounded-full text-xs font-bold transition-colors ${promotion.active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                            }`}
                                    >
                                        {promotion.active ? "Ativa" : "Inativa"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(promotion.start_date).toLocaleDateString("pt-BR")}
                                    </div>
                                    <span>até</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(promotion.end_date).toLocaleDateString("pt-BR")}
                                    </div>
                                </div>

                                {promotion.discount_percentage && (
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 font-bold">
                                        <Tag size={16} />
                                        {promotion.discount_percentage}% OFF
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingPromotion(promotion);
                                            setShowModal(true);
                                        }}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(promotion.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-red-700 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
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

            {/* Modal */}
            {showModal && (
                <PromotionModal
                    promotion={editingPromotion}
                    onClose={() => {
                        setShowModal(false);
                        setEditingPromotion(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingPromotion(null);
                        fetchPromotions();
                    }}
                />
            )}
        </div>
    );
}

// Modal Component
function PromotionModal({
    promotion,
    onClose,
    onSuccess,
}: {
    promotion: Promotion | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: promotion?.title || "",
        description: promotion?.description || "",
        start_date: promotion?.start_date?.split("T")[0] || "",
        end_date: promotion?.end_date?.split("T")[0] || "",
        discount_percentage: promotion?.discount_percentage || 0,
        active: promotion?.active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (promotion) {
                // Update
                const { error } = await supabase
                    .from("promotions")
                    .update(formData)
                    .eq("id", promotion.id);

                if (error) throw error;
                toast.success("Promoção atualizada com sucesso!");
            } else {
                // Create
                const { error } = await supabase.from("promotions").insert([formData]);

                if (error) throw error;
                toast.success("Promoção criada com sucesso!");
            }

            onSuccess();
        } catch (error: any) {
            console.error("Error saving promotion:", error);
            toast.error(error.message || "Erro ao salvar promoção");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <LiquidGlass className="p-6 max-h-[90vh] overflow-y-auto">
                    <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {promotion ? "Editar Promoção" : "Nova Promoção"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                placeholder="Ex: Black Friday - 50% OFF"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Descrição *
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none min-h-24"
                                placeholder="Descreva os detalhes da promoção..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Data Início *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Data Fim *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Desconto (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discount_percentage}
                                onChange={(e) =>
                                    setFormData({ ...formData, discount_percentage: Number(e.target.value) })
                                }
                                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-900 dark:text-white">
                                Promoção ativa
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 px-6 py-3 font-baloo2 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {saving ? "Salvando..." : promotion ? "Atualizar" : "Criar Promoção"}
                            </button>
                        </div>
                    </form>
                </LiquidGlass>
            </motion.div>
        </div>
    );
}
