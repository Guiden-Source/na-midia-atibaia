"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Tag, MapPin, Gift, Percent, DollarSign, Award } from "lucide-react";
import toast from "react-hot-toast";
import type { Promotion } from "@/lib/types";
import { PromotionModal } from "@/components/admin/promotions/PromotionModal";

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
            setPromotions(data as Promotion[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta promoção?")) return;

        try {
            const { error, data } = await supabase
                .from("promotions")
                .delete()
                .eq("id", id)
                .select();

            if (error) {
                console.error("Delete error:", error);
                toast.error(`Erro ao excluir: ${error.message}`);
                return;
            }

            console.log("Deleted promotion:", data);
            toast.success("Promoção excluída com sucesso!");
            fetchPromotions();
        } catch (err: any) {
            console.error("Unexpected error:", err);
            toast.error(`Erro inesperado: ${err.message}`);
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

    const handleToggleFeatured = async (promotion: Promotion) => {
        const { error } = await supabase
            .from("promotions")
            .update({ featured: !promotion.featured })
            .eq("id", promotion.id);

        if (error) {
            toast.error("Erro ao atualizar destaque");
            console.error(error);
        } else {
            toast.success(`Promoção ${!promotion.featured ? "destacada" : "removida do destaque"}!`);
            fetchPromotions();
        }
    };

    const getDiscountBadge = (promotion: Promotion) => {
        if (promotion.discount_type === 'percentage' && promotion.discount_value) {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white">
                    <Percent className="h-3.5 w-3.5" />
                    {promotion.discount_value}% OFF
                </div>
            );
        }
        if (promotion.discount_type === 'fixed' && promotion.discount_value) {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
                    <DollarSign className="h-3.5 w-3.5" />
                    R$ {promotion.discount_value} OFF
                </div>
            );
        }
        if (promotion.discount_type === 'freebie') {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-purple-500 px-3 py-1.5 text-xs font-bold text-white">
                    <Gift className="h-3.5 w-3.5" />
                    GRÁTIS
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-bold text-white">
                <Award className="h-3.5 w-3.5" />
                ESPECIAL
            </div>
        );
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
                        {promotions.length} promoção(ões) no total • {promotions.filter(p => p.active).length} ativa(s) • {promotions.filter(p => p.featured).length} em destaque
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
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {promotion.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {promotion.description}
                                        </p>
                                    </div>
                                    <div className="ml-4 flex flex-col gap-2">
                                        <button
                                            onClick={() => handleToggleActive(promotion)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${promotion.active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                                }`}
                                        >
                                            {promotion.active ? "Ativa" : "Inativa"}
                                        </button>
                                        <button
                                            onClick={() => handleToggleFeatured(promotion)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${promotion.featured
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500"
                                                }`}
                                        >
                                            {promotion.featured ? "⭐ Destaque" : "Destacar"}
                                        </button>
                                    </div>
                                </div>

                                {/* Discount Badge */}
                                <div className="mb-4">
                                    {getDiscountBadge(promotion)}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    {promotion.valid_until && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            Válido até {new Date(promotion.valid_until).toLocaleDateString("pt-BR")}
                                        </div>
                                    )}
                                    {promotion.venue_name && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {promotion.venue_name}
                                        </div>
                                    )}
                                    {promotion.code && (
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} />
                                            Código: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">{promotion.code}</code>
                                        </div>
                                    )}
                                    {promotion.max_uses && (
                                        <div className="flex items-center gap-2">
                                            <Gift size={16} />
                                            {promotion.current_uses} / {promotion.max_uses} resgates
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
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

