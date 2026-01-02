'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/auth/hooks';
import { supabase } from '@/lib/supabase';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { MapPin, Phone, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ALLOWED_CONDOMINIUMS } from '@/lib/delivery/types';

interface CompleteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CompleteProfileModal({ isOpen, onClose, onSuccess }: CompleteProfileModalProps) {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        whatsapp: '',
        condominium: '',
        block: '',
        apartment: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    whatsapp: formData.whatsapp,
                    address_condominium: formData.condominium,
                    address_block: formData.block,
                    address_apartment: formData.apartment,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Perfil atualizado com sucesso!');

            // Notificar outros componentes que o perfil mudou
            window.dispatchEvent(new Event('profile-updated'));

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Erro ao salvar dados. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg"
                >
                    <LiquidGlass className="p-0 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-500 to-orange-600">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-white font-baloo2 mb-1">
                                        Complete seu Cadastro
                                    </h2>
                                    <p className="text-orange-100 text-sm">
                                        Para agilizar seus pedidos, precisamos de algumas informações.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white dark:bg-gray-900">
                            {/* WhatsApp */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <Phone size={16} className="text-orange-500" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="(11) 99999-9999"
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                />
                            </div>

                            {/* Endereço */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <MapPin size={16} className="text-orange-500" />
                                    Endereço de Entrega
                                </label>

                                <div>
                                    <select
                                        name="condominium"
                                        value={formData.condominium}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                    >
                                        <option value="">Selecione o condomínio</option>
                                        {ALLOWED_CONDOMINIUMS.map((cond) => (
                                            <option key={cond} value={cond}>
                                                {cond}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="block"
                                        value={formData.block}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Torre/Bloco"
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Apartamento"
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Pular
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Salvar Dados
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </LiquidGlass>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
