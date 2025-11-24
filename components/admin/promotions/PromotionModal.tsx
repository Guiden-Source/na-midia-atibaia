import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Promotion, DiscountType, PromotionCategory } from "@/lib/types";

interface PromotionModalProps {
    promotion: Promotion | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function PromotionModal({
    promotion,
    onClose,
    onSuccess,
}: PromotionModalProps) {
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
