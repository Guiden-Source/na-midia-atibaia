'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Save, ShieldCheck } from 'lucide-react';
import { useUser } from '@/lib/auth/hooks';
import { createClient } from '@/lib/supabase/client';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import toast from 'react-hot-toast';

export default function ProfileDataPage() {
    const supabase = createClient();
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp: '',
    });

    // Carregar dados
    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/login?redirect=/perfil/dados');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success('Perfil atualizado com sucesso!');
            router.push('/perfil');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Erro ao salvar alterações');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Background Elements - Consistent with other profile pages */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10 max-w-2xl">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/perfil"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary font-medium transition-colors mb-6 group"
                    >
                        <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-baloo2">Voltar ao perfil</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
                                Meus Dados
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Atualize suas informações pessoais
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <LiquidGlass className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck className="text-orange-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                                Dados Cadastrais
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-0 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-0 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white outline-none transition-all"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>
                    </LiquidGlass>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
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
