'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createManualCoupon, type ManualCouponData } from '@/lib/delivery/manual-coupons';

interface CouponFormProps {
    adminEmail: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function CouponForm({ adminEmail, onClose, onSuccess }: CouponFormProps) {
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        targetType: 'all' as 'all' | 'specific',
        userEmail: '',
        expiresAt: '',
        minOrderValue: '0',
        maxUses: '1',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const couponData: ManualCouponData = {
                code: formData.code.trim() || undefined, // Gera automaticamente se vazio
                discountPercentage: parseInt(formData.discountPercentage),
                userEmail: formData.targetType === 'specific' ? formData.userEmail : undefined,
                expiresAt: new Date(formData.expiresAt),
                minOrderValue: parseFloat(formData.minOrderValue),
                maxUses: parseInt(formData.maxUses),
                createdByAdminEmail: adminEmail,
            };

            const result = await createManualCoupon(couponData);

            if (result.success) {
                toast.success('Cupom criado com sucesso!');
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || 'Erro ao criar cupom');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro ao criar cupom');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Data mínima: hoje
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🎫 Gerar Cupom Novo
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="text-gray-500" size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Código do Cupom
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                            placeholder="Ex: NATAL10 (deixe vazio para auto-gerar)"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Deixe vazio para gerar automaticamente
                        </p>
                    </div>

                    {/* Desconto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Desconto (%) *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="100"
                            value={formData.discountPercentage}
                            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="10"
                        />
                    </div>

                    {/* Para quem? */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Para quem? *
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="targetType"
                                    value="all"
                                    checked={formData.targetType === 'all'}
                                    onChange={(e) => setFormData({ ...formData, targetType: 'all', userEmail: '' })}
                                    className="w-5 h-5 text-orange-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Todos os usuários (cupom global)
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="targetType"
                                    value="specific"
                                    checked={formData.targetType === 'specific'}
                                    onChange={(e) => setFormData({ ...formData, targetType: 'specific' })}
                                    className="w-5 h-5 text-orange-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Usuário específico
                                </span>
                            </label>

                            {formData.targetType === 'specific' && (
                                <input
                                    type="email"
                                    required
                                    value={formData.userEmail}
                                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="email@exemplo.com"
                                />
                            )}
                        </div>
                    </div>

                    {/* Valores e Restrições */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor Mínimo Pedido (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.minOrderValue}
                                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Máximo de Usos
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxUses}
                                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    {/* Validade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Válido até *
                        </label>
                        <input
                            type="date"
                            required
                            min={today}
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Check size={20} />
                                    Criar Cupom
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
