"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Tag, MapPin, Instagram, Phone, Gift, Percent, DollarSign, Award } from "lucide-react";
import toast from "react-hot-toast";
import type { Promotion, DiscountType, PromotionCategory } from "@/lib/types";

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
        discount_type: promotion?.discount_type || "percentage" as DiscountType,
        discount_value: promotion?.discount_value || null,
        code: promotion?.code || "",
        valid_from: promotion?.valid_from?.split("T")[0] || new Date().toISOString().split("T")[0],
        valid_until: promotion?.valid_until?.split("T")[0] || "",
        terms: promotion?.terms || "",
        category: promotion?.category || "general" as PromotionCategory,
        image_url: promotion?.image_url || "",
        venue_name: promotion?.venue_name || "",
        venue_instagram: promotion?.venue_instagram || "",
        venue_phone: promotion?.venue_phone || "",
        featured: promotion?.featured ?? false,
        active: promotion?.active ?? true,
        max_uses: promotion?.max_uses || null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const dataToSave = {
                ...formData,
                discount_value: formData.discount_value || null,
                max_uses: formData.max_uses || null,
            };

            if (promotion) {
                // Update
                const { error } = await supabase
                    .from("promotions")
                    .update(dataToSave)
                    .eq("id", promotion.id);

                if (error) throw error;
                toast.success("Promoção atualizada com sucesso!");
            } else {
                // Create
                const { error } = await supabase.from("promotions").insert([dataToSave]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <LiquidGlass className="p-6 max-h-[90vh] overflow-y-auto">
                    <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {promotion ? "Editar Promoção" : "Nova Promoção"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Informações Básicas</h3>

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
                                    placeholder="Ex: 50% OFF na Happy Hour"
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
                        </div>

                        {/* Discount Info */}
                        <div className="space-y-4">
                            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Desconto</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Tipo de Desconto *
                                    </label>
                                    <select
                                        required
                                        value={formData.discount_type}
                                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as DiscountType })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                    >
                                        <option value="percentage">Percentual (%)</option>
                                        <option value="fixed">Valor Fixo (R$)</option>
                                        <option value="freebie">Brinde/Cortesia</option>
                                        <option value="special">Oferta Especial</option>
                                    </select>
                                </div>

                                {(formData.discount_type === 'percentage' || formData.discount_type === 'fixed') && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                            Valor {formData.discount_type === 'percentage' ? '(%)' : '(R$)'}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.discount_value || ''}
                                            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value ? Number(e.target.value) : null })}
                                            className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Código do Cupom
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none font-mono"
                                        placeholder="PROMO2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as PromotionCategory })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                    >
                                        <option value="general">Geral</option>
                                        <option value="food">Comida</option>
                                        <option value="drinks">Bebidas</option>
                                        <option value="delivery">Delivery</option>
                                        <option value="events">Eventos</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Validity */}
                        <div className="space-y-4">
                            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Validade</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Válido de
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.valid_from}
                                        onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Válido até
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Limite de Usos
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.max_uses || ''}
                                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                    placeholder="Deixe vazio para ilimitado"
                                />
                            </div>
                        </div>

                        {/* Venue Info */}
                        <div className="space-y-4">
                            <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Estabelecimento (Opcional)</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.venue_name}
                                        onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                        placeholder="Bar do Centro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Instagram
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.venue_instagram}
                                        onChange={(e) => setFormData({ ...formData, venue_instagram: e.target.value })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                        placeholder="@bardocentro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.venue_phone}
                                        onChange={(e) => setFormData({ ...formData, venue_phone: e.target.value })}
                                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Settings */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Termos e Condições
                                </label>
                                <textarea
                                    value={formData.terms}
                                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none min-h-20"
                                    placeholder="Ex: Válido apenas de segunda a sexta. Não cumulativo com outras promoções."
                                />
                            </div>

                            <div className="flex items-center gap-6">
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

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                    />
                                    <label htmlFor="featured" className="text-sm font-medium text-gray-900 dark:text-white">
                                        Destacar na homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
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
