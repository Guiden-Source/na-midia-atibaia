'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useUser } from '@/lib/auth/hooks';
import { supabase } from '@/lib/supabase';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { ALLOWED_CONDOMINIUMS } from '@/lib/delivery/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp: '',
        condominium: '',
        block: '',
        apartment: '',
    });

    // Carregar dados
    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/delivery');
            return;
        }

        async function loadProfile() {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFormData({
                        full_name: data.full_name || user.user_metadata?.full_name || '',
                        whatsapp: data.whatsapp || '',
                        condominium: data.address_condominium || '',
                        block: data.address_block || '',
                        apartment: data.address_apartment || '',
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Erro ao carregar perfil');
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            loadProfile();
        }
    }, [user, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    full_name: formData.full_name,
                    whatsapp: formData.whatsapp,
                    address_condominium: formData.condominium,
                    address_block: formData.block,
                    address_apartment: formData.apartment,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Erro ao salvar alterações');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-24">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/delivery"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-bold transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Voltar ao cardápio</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
                                Meu Perfil
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Gerencie seus dados de entrega
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados Pessoais */}
                    <LiquidGlass className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-orange-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                                Dados Pessoais
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>
                    </LiquidGlass>

                    {/* Endereço Removido por simplificação UX - O endereço é gerido no Checkout */}

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
