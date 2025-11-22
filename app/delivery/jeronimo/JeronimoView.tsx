"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryProduct } from '@/lib/delivery/types';
import { AddressValidator } from '@/components/delivery/AddressValidator';
import { ProductList } from '@/components/delivery/ProductList';
import { DeliveryHeader } from '@/components/delivery/DeliveryHeader';
import { motion } from 'framer-motion';
import { Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useUser } from '@/lib/auth/hooks';
import { createClient } from '@/lib/supabase/client';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import toast from 'react-hot-toast';

interface JeronimoViewProps {
    initialProducts: DeliveryProduct[];
}

export function JeronimoView({ initialProducts }: JeronimoViewProps) {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const [step, setStep] = useState<'address' | 'login' | 'products'>('address');
    const [validatedAddress, setValidatedAddress] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Check if user already validated address and is logged in
        const savedAddress = localStorage.getItem('jeronimo_address');
        const savedBlock = localStorage.getItem('jeronimo_block');
        const savedApt = localStorage.getItem('jeronimo_apartment');

        if (user && savedAddress && savedBlock && savedApt) {
            setValidatedAddress(savedAddress);
            setStep('products');
        } else if (savedAddress && savedBlock && savedApt && !user) {
            setValidatedAddress(savedAddress);
            setStep('login');
        }
    }, [user]);

    const handleAddressValidation = (address: string, block: string, apartment: string) => {
        localStorage.setItem('jeronimo_address', address);
        localStorage.setItem('jeronimo_block', block);
        localStorage.setItem('jeronimo_apartment', apartment);
        setValidatedAddress(address);

        if (user) {
            setStep('products');
        } else {
            setStep('login');
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/delivery/jeronimo`,
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Erro ao fazer login. Tente novamente.');
            setIsLoggingIn(false);
        }
    };

    // Address Validation Screen
    if (step === 'address') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-400/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-400/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm mb-4">
                            🚀 Exclusivo para Moradores
                        </span>
                        <h1 className="text-4xl md:text-6xl font-baloo2 font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Delivery em <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">30 minutos</span><br />
                            no Jerônimo de Camargo
                        </h1>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-gray-600 dark:text-gray-300 mb-8">
                            <div className="flex items-center gap-2">
                                <Clock className="text-orange-500" />
                                <span className="font-medium">Entrega Rápida</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-orange-500" />
                                <span className="font-medium">Frete Grátis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-orange-500" />
                                <span className="font-medium">Garantia de Qualidade</span>
                            </div>
                        </div>
                    </motion.div>

                    <AddressValidator onValidated={handleAddressValidation} />
                </div>
            </div>
        );
    }

    // Login Screen
    if (step === 'login') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <LiquidGlass className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">✅</span>
                        </div>

                        <h2 className="text-3xl font-baloo2 font-bold text-gray-900 dark:text-white mb-2">
                            Endereço Confirmado!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {validatedAddress}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                            Agora faça login para continuar
                        </p>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoggingIn}
                            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-4 rounded-xl font-bold text-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoggingIn ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    Redirecionando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continuar com Google
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
                        </p>
                    </LiquidGlass>
                </motion.div>
            </div>
        );
    }

    // Products Screen (Authenticated)
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-[150px] md:pt-[120px]">
            <DeliveryHeader />

            <div className="container mx-auto px-4 py-6 space-y-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-orange-100">
                            <MapPin size={18} />
                            <span className="font-medium">{validatedAddress}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-baloo2 font-bold mb-4">
                            Bem-vindo, {user?.user_metadata?.full_name || 'Vizinho'}! 👋
                        </h2>
                        <p className="text-lg text-orange-50 max-w-2xl">
                            Selecionamos os melhores pratos com entrega expressa para o seu bloco.
                            Aproveite o <strong>Frete Grátis</strong> em todos os pedidos hoje!
                        </p>
                    </div>
                </motion.div>

                {/* Quick Filters */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['🍔 Lanches', '🍕 Pizzas', '🥗 Saudável', '🍰 Doces', '🥤 Bebidas'].map((cat, i) => (
                        <button
                            key={i}
                            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-orange-500 hover:text-orange-500 transition-colors shadow-sm"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
                            Destaques no Condomínio 🔥
                        </h3>
                    </div>
                    <ProductList products={initialProducts} emptyMessage="Carregando delícias..." />
                </div>
            </div>
        </main>
    );
}
