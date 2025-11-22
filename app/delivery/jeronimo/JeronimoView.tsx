"use client";

import { useState, useEffect } from 'react';
import { DeliveryProduct } from '@/lib/delivery/types';
import { AddressValidator } from '@/components/delivery/AddressValidator';
import { ProductList } from '@/components/delivery/ProductList';
import { DeliveryHeader } from '@/components/delivery/DeliveryHeader';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star, ShieldCheck } from 'lucide-react';

interface JeronimoViewProps {
    initialProducts: DeliveryProduct[];
}

export function JeronimoView({ initialProducts }: JeronimoViewProps) {
    const [isValidated, setIsValidated] = useState(false);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const savedAddress = localStorage.getItem('jeronimo_address');
        if (savedAddress) {
            setUserAddress(savedAddress);
            setIsValidated(true);
        }
    }, []);

    const handleValidation = (address: string) => {
        localStorage.setItem('jeronimo_address', address);
        setUserAddress(address);
        setIsValidated(true);
    };

    if (!isValidated) {
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

                    <AddressValidator onValidated={handleValidation} />
                </div>
            </div>
        );
    }

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
                            <span className="font-medium">{userAddress}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-baloo2 font-bold mb-4">
                            Bem-vindo, Vizinho! 👋
                        </h2>
                        <p className="text-lg text-orange-50 max-w-2xl">
                            Selecionamos os melhores pratos com entrega expressa para o seu bloco.
                            Aproveite o <strong>Frete Grátis</strong> em todos os pedidos hoje!
                        </p>
                    </div>
                </motion.div>

                {/* Quick Filters (Mock) */}
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
